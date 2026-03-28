<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(['status' => 'error', 'message' => 'User ID is missing.']);
    exit;
}

try {
    // Strictly just changes them to offline/inactive. No sessions are deducted!
    $stmt = $pdo->prepare("UPDATE users SET user_is_active = 0 WHERE user_id = :id");
    $stmt->execute(['id' => $data->user_id]);

    echo json_encode(['status' => 'success', 'message' => 'Session ended successfully.']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>