<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->pc_id) || !isset($data->status)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

// Allowed statuses
$allowed_statuses = ['Available', 'Occupied', 'On-Maintenance'];
if (!in_array($data->status, $allowed_statuses)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid status']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE pcs SET status = :status WHERE id = :pc_id");
    $stmt->execute([
        'status' => $data->status,
        'pc_id' => $data->pc_id
    ]);

    echo json_encode(['status' => 'success', 'message' => 'PC status updated successfully']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
