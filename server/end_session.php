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
    // 1. Set the user to inactive (0)
    // 2. Subtract 1 from remaining_sessions (but stop at 0)
    $sql = "UPDATE users 
            SET user_is_active = 0, 
                remaining_sessions = GREATEST(remaining_sessions - 1, 0) 
            WHERE user_id = :id AND role = 'Student'";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $data->user_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Session ended and 1 credit deducted.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Student not found or already inactive.']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>