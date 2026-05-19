<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->lab) || !isset($data->purpose) || !isset($data->date) || !isset($data->time) || !isset($data->pc_ids)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO reservations (user_id, lab, purpose, reservation_date, reservation_time, status) VALUES (:user_id, :lab, :purpose, :res_date, :res_time, 'Pending')");
    $stmt->execute([
        'user_id' => $data->user_id,
        'lab' => $data->lab,
        'purpose' => $data->purpose,
        'res_date' => $data->date,
        'res_time' => $data->time
    ]);
    
    $reservation_id = $pdo->lastInsertId();

    if (is_array($data->pc_ids) && count($data->pc_ids) > 0) {
        $insertPc = $pdo->prepare("INSERT INTO reservation_pcs (reservation_id, pc_id) VALUES (:res_id, :pc_id)");
        foreach ($data->pc_ids as $pc_id) {
            $insertPc->execute(['res_id' => $reservation_id, 'pc_id' => $pc_id]);
        }
    }

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Reservation created successfully']);
} catch(PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
