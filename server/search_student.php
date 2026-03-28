<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Search ID is empty.']);
    exit;
}

try {
    // Look for the student. We also make sure we don't accidentally pull an Admin!
    $stmt = $pdo->prepare("SELECT user_id, user_first_name, user_last_name, remaining_sessions, user_is_active FROM users WHERE user_id = :id AND role = 'Student'");
    $stmt->execute(['id' => $data->user_id]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($student) {
        if ($student['user_is_active'] == 1) {
            echo json_encode(['status' => 'error', 'message' => 'This student is already in an active sit-in session.']);
        } else {
            echo json_encode(['status' => 'success', 'student' => $student]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Student ID not found.']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>