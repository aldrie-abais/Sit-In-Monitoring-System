<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(['status' => 'error', 'message' => 'User ID is missing.']);
    exit;
}

try {
    // Logout no longer mutates student session state. Admin manually ends sessions.
    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>