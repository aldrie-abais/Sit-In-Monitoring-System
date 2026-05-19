<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

try {
    $pdo->beginTransaction();

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

    // 3. If pc_ids is provided, create Approved reservation and link PCs
    if (isset($data->pc_ids) && is_array($data->pc_ids) && count($data->pc_ids) > 0) {
        $cleanLab = str_replace('Lab - ', '', $data->lab);
        
        $resStmt = $pdo->prepare("INSERT INTO reservations (user_id, lab, purpose, reservation_date, reservation_time, status) VALUES (:user_id, :lab, :purpose, CURRENT_DATE(), CURRENT_TIME(), 'Approved')");
        $resStmt->execute([
            'user_id' => $data->user_id,
            'lab' => $cleanLab,
            'purpose' => $data->purpose
        ]);
        
        $reservation_id = $pdo->lastInsertId();

        $linkStmt = $pdo->prepare("INSERT INTO reservation_pcs (reservation_id, pc_id) VALUES (:res_id, :pc_id)");
        $pcStatusStmt = $pdo->prepare("UPDATE pcs SET status = 'Occupied' WHERE id = :pc_id");

        foreach ($data->pc_ids as $pc_id) {
            $linkStmt->execute(['res_id' => $reservation_id, 'pc_id' => $pc_id]);
            $pcStatusStmt->execute(['pc_id' => $pc_id]);
        }
    }

    // 4. Create notification for session started
    $notificationMsg = "You have started a lab session in {$data->lab} for {$data->purpose}.";
    $stmt3 = $pdo->prepare("INSERT INTO notifications (user_id, type, message, is_read) VALUES (:user_id, 'session_started', :message, 0)");
    $stmt3->execute([
        'user_id' => $data->user_id,
        'message' => $notificationMsg
    ]);

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Student is now sitting in!']);
} catch(PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>