<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    $sql = "SELECT 
                s.id, 
                s.name, 
                s.description, 
                s.icon,
                GROUP_CONCAT(l.name ORDER BY l.name ASC SEPARATOR ', ') AS labs_list
            FROM softwares s
            LEFT JOIN lab_softwares ls ON s.id = ls.software_id
            LEFT JOIN labs l ON ls.lab_id = l.id
            GROUP BY s.id
            ORDER BY s.id ASC";
            
    $stmt = $pdo->query($sql);
    $softwares = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($softwares as &$sw) {
        if (!empty($sw['labs_list'])) {
            $sw['labs'] = explode(', ', $sw['labs_list']);
        } else {
            $sw['labs'] = [];
        }
        unset($sw['labs_list']);
    }

    echo json_encode([
        'status' => 'success',
        'success' => true,
        'data' => $softwares
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
