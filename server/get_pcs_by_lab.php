<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

$data = json_decode(file_get_contents("php://input"));
$lab_id = isset($_GET['lab_id']) ? $_GET['lab_id'] : ($data->lab_id ?? null);
$status = isset($_GET['status']) ? $_GET['status'] : ($data->status ?? null);

if (!$lab_id) {
    echo json_encode(['success' => false, 'message' => 'lab_id is required']);
    exit;
}

try {
    if ($status) {
        $stmt = $pdo->prepare("SELECT id, pc_number, row_position, col_position, status FROM pcs WHERE lab_id = :lab_id AND status = :status ORDER BY pc_number ASC");
        $stmt->execute(['lab_id' => $lab_id, 'status' => $status]);
    } else {
        $stmt = $pdo->prepare("SELECT id, pc_number, row_position, col_position, status FROM pcs WHERE lab_id = :lab_id ORDER BY pc_number ASC");
        $stmt->execute(['lab_id' => $lab_id]);
    }
    $pcs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $pcs]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
