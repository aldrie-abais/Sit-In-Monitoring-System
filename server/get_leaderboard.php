<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    // Sum total session time per student from completed sit-in sessions only
    // Only expose safe fields: name, course, year, profile_picture — no email, address, or ID
    $sql = "SELECT 
                u.user_first_name,
                u.user_last_name,
                u.user_course_name,
                u.user_course_level,
                u.profile_picture,
                SUM(TIMESTAMPDIFF(SECOND, h.time_in, h.time_out)) AS total_seconds
            FROM sit_in_history h
            JOIN users u ON h.user_id = u.user_id
            WHERE h.time_out IS NOT NULL
            GROUP BY h.user_id
            ORDER BY total_seconds DESC
            LIMIT 5";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $leaderboard = [];
    foreach ($rows as $i => $row) {
        $total_seconds = (int)$row['total_seconds'];
        $hours   = intdiv($total_seconds, 3600);
        $minutes = intdiv($total_seconds % 3600, 60);

        $parts = [];
        if ($hours > 0)   $parts[] = $hours   . ' hr'  . ($hours   > 1 ? 's' : '');
        if ($minutes > 0) $parts[] = $minutes . ' min' . ($minutes > 1 ? 's' : '');
        if (empty($parts)) $parts[] = '< 1 min';

        $leaderboard[] = [
            'rank'            => $i + 1,
            'name'            => trim($row['user_first_name'] . ' ' . $row['user_last_name']),
            'course'          => $row['user_course_name'] ?? 'N/A',
            'year'            => $row['user_course_level'] ?? '',
            'profile_picture' => $row['profile_picture'] ?? null,
            'total_hours'     => implode(' ', $parts),
        ];
    }

    echo json_encode(['status' => 'success', 'data' => $leaderboard]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
