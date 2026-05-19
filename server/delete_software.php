<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) && !isset($data->software_id)) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Missing required parameter: id or software_id'
    ]);
    exit;
}

$id = isset($data->id) ? intval($data->id) : intval($data->software_id);

try {
    // 1. Explicitly delete referencing rows from lab_softwares pivot table first to ensure strict safety
    $delPivot = $pdo->prepare("DELETE FROM lab_softwares WHERE software_id = :id");
    $delPivot->execute(['id' => $id]);

    // 2. Delete the software record itself
    $delSoftware = $pdo->prepare("DELETE FROM softwares WHERE id = :id");
    $delSoftware->execute(['id' => $id]);

    echo json_encode([
        'status' => 'success',
        'success' => true,
        'message' => 'Software and all related deployments successfully deleted.'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
