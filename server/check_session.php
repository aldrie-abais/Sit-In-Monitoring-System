<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(['status' => 'error', 'message' => 'No ID provided.']);
    exit;
}

try {
    // Now pulling BOTH active status and their session balance
    $stmt = $pdo->prepare("SELECT user_is_active, remaining_sessions FROM users WHERE user_id = :id");
    $stmt->execute(['id' => $data->user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            'status' => 'success', 
            'is_active' => $user['user_is_active'],
            'remaining_sessions' => $user['remaining_sessions']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>