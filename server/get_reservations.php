<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, lab, purpose, reservation_date AS date, reservation_time AS time, status FROM reservations WHERE user_id = :user_id ORDER BY reservation_date DESC, reservation_time DESC");
    $stmt->execute(['user_id' => $data->user_id]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($reservations as &$res) {
        // Fetch PC numbers instead of pc_ids so frontend can display them easily
        $pcStmt = $pdo->prepare("SELECT p.pc_number FROM reservation_pcs rp JOIN pcs p ON rp.pc_id = p.id WHERE rp.reservation_id = :res_id ORDER BY p.pc_number ASC");
        $pcStmt->execute(['res_id' => $res['id']]);
        $res['pc_numbers'] = $pcStmt->fetchAll(PDO::FETCH_COLUMN);
    }

    echo json_encode(['status' => 'success', 'reservations' => $reservations]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
