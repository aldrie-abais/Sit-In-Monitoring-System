<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    // Get the top 10 students by total sit-in hours from the history table.
    // We calculate hours from the duration column or from time_in/time_out difference.
    $stmt = $pdo->query("
        SELECT 
            u.user_id,
            CONCAT(u.user_first_name, ' ', u.user_last_name) AS name,
            COALESCE(SUM(
                TIMESTAMPDIFF(MINUTE, h.time_in, h.time_out)
            ), 0) / 60.0 AS total_hours
        FROM users u
        LEFT JOIN sit_in_history h ON u.user_id = h.user_id AND h.time_out IS NOT NULL
        WHERE u.role = 'Student'
        GROUP BY u.user_id, u.user_first_name, u.user_last_name
        HAVING total_hours > 0
        ORDER BY total_hours DESC
        LIMIT 10
    ");

    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate total hours across ALL students (not just top 10)
    $totalStmt = $pdo->query("
        SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, time_in, time_out)), 0) / 60.0 AS grand_total
        FROM sit_in_history
        WHERE time_out IS NOT NULL
    ");
    $grandTotal = (float) $totalStmt->fetchColumn();

    // Build the response with percentages
    $result = [];
    $top10Total = 0;

    foreach ($students as &$student) {
        $hours = round((float)$student['total_hours'], 2);
        $top10Total += $hours;
        $percentage = $grandTotal > 0 ? round(($hours / $grandTotal) * 100, 1) : 0;
        $result[] = [
            'name' => $student['name'],
            'total_hours' => $hours,
            'percentage' => $percentage
        ];
    }

    // Add "Others" entry if there are more students beyond the top 10
    $othersHours = round($grandTotal - $top10Total, 2);
    if ($othersHours > 0.01) {
        $result[] = [
            'name' => 'Others',
            'total_hours' => $othersHours,
            'percentage' => round(($othersHours / $grandTotal) * 100, 1)
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'students' => $result,
            'grand_total_hours' => round($grandTotal, 2)
        ]
    ]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
