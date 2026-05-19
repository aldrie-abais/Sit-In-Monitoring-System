<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->lab_id) || !isset($data->is_available)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE labs SET is_available = :is_available WHERE id = :lab_id");
    $stmt->execute([
        'is_available' => $data->is_available,
        'lab_id' => $data->lab_id
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Lab status updated successfully']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
