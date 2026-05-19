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
    // Delete record
    $stmt = $pdo->prepare("DELETE FROM lab_softwares WHERE lab_id = :lab_id AND software_id = :software_id");
    $stmt->execute([
        'lab_id' => $data->lab_id,
        'software_id' => $data->software_id
    ]);

    echo json_encode([
        'status' => 'success',
        'success' => true,
        'message' => 'Software successfully removed from lab room'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
