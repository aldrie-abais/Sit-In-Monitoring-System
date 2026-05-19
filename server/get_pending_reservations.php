<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    $sql = "SELECT 
                r.id, 
                CONCAT(u.user_first_name, ' ', u.user_last_name) AS studentName, 
                CONCAT('Lab - ', r.lab) AS labName, 
                r.reservation_date AS date, 
                r.reservation_time AS time, 
                GROUP_CONCAT(p.pc_number) AS pc_numbers
            FROM reservations r
            JOIN users u ON r.user_id = u.user_id
            LEFT JOIN reservation_pcs rp ON r.id = rp.reservation_id
            LEFT JOIN pcs p ON rp.pc_id = p.id
            WHERE r.status = 'Pending'
            GROUP BY r.id
            ORDER BY r.reservation_date ASC, r.reservation_time ASC";
            
    $stmt = $pdo->query($sql);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert pc_numbers from comma separated string to array
    foreach ($reservations as &$res) {
        if ($res['pc_numbers']) {
            $res['pcs'] = explode(',', $res['pc_numbers']);
        } else {
            $res['pcs'] = [];
        }
        unset($res['pc_numbers']);
    }

    echo json_encode(['status' => 'success', 'data' => $reservations]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
