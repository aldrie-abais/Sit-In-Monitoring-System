<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    // Fetches only users who are Students AND currently active (logged in / sitting in)
    $stmt = $pdo->prepare("SELECT user_id, user_first_name, user_middle_name, user_last_name, user_course_level, user_course_name, remaining_sessions FROM users WHERE role = 'Student' AND user_is_active = 1");
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'students' => $students]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>