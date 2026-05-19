<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

try {
    // 1. Deduct session and set inactive
    $stmt1 = $pdo->prepare("UPDATE users SET user_is_active = 0, remaining_sessions = GREATEST(remaining_sessions - 1, 0) WHERE user_id = :id AND role = 'Student'");
    $stmt1->execute(['id' => $data->user_id]);

    // 2. Get the new session balance
    $stmt2 = $pdo->prepare("SELECT remaining_sessions FROM users WHERE user_id = :id");
    $stmt2->execute(['id' => $data->user_id]);
    $newBalance = $stmt2->fetchColumn();

    // 3. Mark the active history record as Completed, add Time Out, Balance, and admin_feedback
    $admin_feedback = isset($data->feedback) && !empty(trim($data->feedback)) ? trim($data->feedback) : null;
    
    $stmt3 = $pdo->prepare("UPDATE sit_in_history SET time_out = NOW(), status = 'Completed', sessions_left = :balance, admin_feedback = :admin_feedback WHERE user_id = :id AND status = 'Active' ORDER BY history_id DESC LIMIT 1");
    $stmt3->execute([
        'balance' => $newBalance,
        'admin_feedback' => $admin_feedback,
        'id' => $data->user_id
    ]);

    // 4. Create notification for session ended
    $notificationMsg = "Your lab session has been ended.";
    $sqlNotification = "INSERT INTO notifications (user_id, type, message, is_read) 
                        VALUES (:user_id, 'session_ended', :message, 0)";
    $stmtNotif = $pdo->prepare($sqlNotification);
    $stmtNotif->execute([
        'user_id' => $data->user_id,
        'message' => $notificationMsg
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Session ended and feedback saved.']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>