<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (empty($data->content)) {
    echo json_encode(['status' => 'error', 'message' => 'Announcement cannot be empty.']);
    exit;
}

try {
    $admin_name = isset($data->admin_name) ? $data->admin_name : 'CCS Admin';

    $stmt = $pdo->prepare("INSERT INTO announcements (admin_name, content) VALUES (:admin_name, :content)");
    $stmt->execute([
        'admin_name' => $admin_name,
        'content' => $data->content
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Announcement posted successfully!']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>