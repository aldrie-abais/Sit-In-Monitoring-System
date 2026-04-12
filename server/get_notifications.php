<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

// Get user_id from POST or GET
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $user_id = $data->user_id ?? null;
} else {
    $user_id = $_GET['user_id'] ?? null;
}

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'user_id is required']);
    exit;
}

try {
    // Fetch unread notifications for the student, ordered by newest first
    $stmt = $pdo->prepare("
        SELECT * FROM notifications 
        WHERE user_id = :user_id 
        ORDER BY created_at DESC 
        LIMIT 50
    ");
    $stmt->execute(['user_id' => $user_id]);
    $notifications = $stmt->fetchAll();

    // Count unread notifications
    $stmtCount = $pdo->prepare("
        SELECT COUNT(*) as unread_count FROM notifications 
        WHERE user_id = :user_id AND is_read = 0
    ");
    $stmtCount->execute(['user_id' => $user_id]);
    $unreadData = $stmtCount->fetch();

    echo json_encode([
        'status' => 'success',
        'notifications' => $notifications,
        'unread_count' => $unreadData['unread_count'] ?? 0
    ]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
