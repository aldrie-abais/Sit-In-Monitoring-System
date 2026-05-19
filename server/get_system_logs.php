<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    // Order by most recent first
    $stmt = $pdo->query("SELECT id, student_name as studentName, lab_name as labName, pc_numbers, action, timestamp FROM system_logs ORDER BY timestamp DESC");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format pc_numbers and timestamp for the frontend
    foreach ($logs as &$log) {
        $log['pcs'] = $log['pc_numbers'] ? explode(', ', $log['pc_numbers']) : [];
        unset($log['pc_numbers']);
        
        // Format timestamp nicely, e.g. "May 18, 2026 09:30 AM"
        $date = new DateTime($log['timestamp']);
        $log['timestamp'] = $date->format('M d, Y h:i A');
    }

    echo json_encode(['status' => 'success', 'data' => $logs]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
