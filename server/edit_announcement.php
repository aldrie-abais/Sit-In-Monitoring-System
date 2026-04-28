<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || empty($data->content)) {
    echo json_encode(['status' => 'error', 'message' => 'Announcement ID and content are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE announcements SET content = :content, date_posted = NOW() WHERE id = :id");
    $stmt->execute([
        'content' => $data->content,
        'id' => $data->id
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Announcement updated successfully!']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>