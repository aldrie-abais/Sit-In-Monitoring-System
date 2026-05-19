<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    $sql = "SELECT 
                h.history_id,
                h.user_id,
                h.purpose,
                h.lab,
                h.time_in,
                h.time_out,
                h.feedback,
                h.admin_feedback,
                u.user_first_name,
                u.user_middle_name,
                u.user_last_name,
                u.user_course_name,
                u.user_course_level
            FROM sit_in_history h
            JOIN users u ON h.user_id = u.user_id
            WHERE h.feedback IS NOT NULL 
              AND TRIM(h.feedback) != '' 
              AND h.feedback != 'No feedback provided.'
            ORDER BY h.time_out DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $testimonials]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
