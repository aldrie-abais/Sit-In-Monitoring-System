<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    $stats = [
        'registered' => 0,
        'active' => 0,
        'courses' => []
    ];

    // 1. Get total registered students
    $stmt1 = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'Student'");
    $stats['registered'] = $stmt1->fetchColumn();

    // 2. Get currently active students
    $stmt2 = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'Student' AND user_is_active = 1");
    $stats['active'] = $stmt2->fetchColumn();

    // 3. Get breakdown of students by course for the pie chart
    $stmt3 = $pdo->query("SELECT user_course_name, COUNT(*) as count FROM users WHERE role = 'Student' GROUP BY user_course_name");
    $stats['courses'] = $stmt3->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $stats]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>