<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->software_id) || !isset($data->lab_id)) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Missing required fields: software_id and lab_id'
    ]);
    exit;
}

try {
    // Check if the software and lab exist first
    $checkSoft = $pdo->prepare("SELECT COUNT(*) FROM softwares WHERE id = :id");
    $checkSoft->execute(['id' => $data->software_id]);
    if ($checkSoft->fetchColumn() == 0) {
        echo json_encode(['status' => 'error', 'success' => false, 'message' => 'Software not found']);
        exit;
    }

    $checkLab = $pdo->prepare("SELECT COUNT(*) FROM labs WHERE id = :id");
    $checkLab->execute(['id' => $data->lab_id]);
    if ($checkLab->fetchColumn() == 0) {
        echo json_encode(['status' => 'error', 'success' => false, 'message' => 'Lab not found']);
        exit;
    }

    // Insert record
    $stmt = $pdo->prepare("INSERT IGNORE INTO lab_softwares (lab_id, software_id) VALUES (:lab_id, :software_id)");
    $stmt->execute([
        'lab_id' => $data->lab_id,
        'software_id' => $data->software_id
    ]);

    echo json_encode([
        'status' => 'success',
        'success' => true,
        'message' => 'Software successfully assigned to lab room'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
