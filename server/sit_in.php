<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

try {
    // 1. Set user as active
    $stmt1 = $pdo->prepare("UPDATE users SET user_is_active = 1 WHERE user_id = :id");
    $stmt1->execute(['id' => $data->user_id]);

    // 2. Create the 'Active' history record
    $stmt2 = $pdo->prepare("INSERT INTO sit_in_history (user_id, purpose, lab) VALUES (:id, :purpose, :lab)");
    $stmt2->execute([
        'id' => $data->user_id,
        'purpose' => $data->purpose,
        'lab' => $data->lab
    ]);

    // 3. Create notification for session started
    $notificationMsg = "You have started a lab session in {$data->lab} for {$data->purpose}.";
    $stmt3 = $pdo->prepare("INSERT INTO notifications (user_id, type, message, is_read) VALUES (:user_id, 'session_started', :message, 0)");
    $stmt3->execute([
        'user_id' => $data->user_id,
        'message' => $notificationMsg
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Student is now sitting in!']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>