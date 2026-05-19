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
    // If feedback is provided, save it to the most recent sit_in_history entry for this student
    if (isset($data->feedback) && !empty(trim($data->feedback))) {
        $stmt = $pdo->prepare("UPDATE sit_in_history SET feedback = :feedback WHERE user_id = :id ORDER BY history_id DESC LIMIT 1");
        $stmt->execute([
            'feedback' => trim($data->feedback),
            'id' => $data->user_id
        ]);
    }

    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>