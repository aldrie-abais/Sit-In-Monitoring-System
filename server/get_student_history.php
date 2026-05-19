<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

try {
    $sql = "SELECT 
                h.*,
                (
                    SELECT GROUP_CONCAT(p.pc_number ORDER BY p.pc_number ASC SEPARATOR ', ')
                    FROM reservations r
                    JOIN reservation_pcs rp ON r.id = rp.reservation_id
                    JOIN pcs p ON rp.pc_id = p.id
                    WHERE r.user_id = h.user_id 
                      AND r.lab = h.lab 
                      AND r.status = 'Approved'
                      AND r.reservation_date = DATE(h.time_in)
                ) AS pc_list
            FROM sit_in_history h
            WHERE h.user_id = :id
            ORDER BY h.time_in DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $data->user_id]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($history as &$record) {
        // 1. Calculate and format duration
        if (!empty($record['time_in']) && !empty($record['time_out'])) {
            $start = new DateTime($record['time_in']);
            $end = new DateTime($record['time_out']);
            $diff = $start->diff($end);
            
            $parts = [];
            if ($diff->h > 0) {
                $parts[] = $diff->h . ' hr' . ($diff->h > 1 ? 's' : '');
            }
            if ($diff->i > 0) {
                $parts[] = $diff->i . ' min' . ($diff->i > 1 ? 's' : '');
            }
            
            if (empty($parts)) {
                // If it's less than a minute, show mins or just seconds
                $parts[] = $diff->s . ' sec' . ($diff->s > 1 ? 's' : '');
            }
            
            $record['duration'] = implode(' ', $parts);
        } else {
            $record['duration'] = ($record['status'] === 'Active') ? 'Ongoing' : '—';
        }

        // 2. Format PC numbers (e.g. "PC 12, PC 14")
        if (!empty($record['pc_list'])) {
            $pcs = explode(', ', $record['pc_list']);
            $formatted_pcs = array_map(function($pc) {
                return "PC " . $pc;
            }, $pcs);
            $record['pc_numbers'] = implode(', ', $formatted_pcs);
        } else {
            $record['pc_numbers'] = '—';
        }
        
        unset($record['pc_list']);
    }

    echo json_encode(['status' => 'success', 'history' => $history]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>