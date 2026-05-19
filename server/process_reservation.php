<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->reservation_id) || !isset($data->action) || !isset($data->student_name) || !isset($data->lab_name) || !isset($data->pc_numbers)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

if (!in_array($data->action, ['Approved', 'Denied'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Update reservation status
    // The student side uses "Disapproved" for rejected reservations as per Reservation.jsx code:
    // req.status === 'Disapproved'
    $status = $data->action === 'Denied' ? 'Disapproved' : 'Approved';
    
    $stmt = $pdo->prepare("UPDATE reservations SET status = :status WHERE id = :reservation_id");
    $stmt->execute([
        'status' => $status,
        'reservation_id' => $data->reservation_id
    ]);

    // 2. Insert into system_logs
    $logStmt = $pdo->prepare("INSERT INTO system_logs (student_name, lab_name, pc_numbers, action) VALUES (:student_name, :lab_name, :pc_numbers, :action)");
    
    $logStmt->execute([
        'student_name' => $data->student_name,
        'lab_name' => $data->lab_name,
        'pc_numbers' => is_array($data->pc_numbers) ? implode(', ', $data->pc_numbers) : $data->pc_numbers,
        'action' => $data->action // 'Approved' or 'Denied'
    ]);

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Reservation processed successfully']);
} catch(PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
