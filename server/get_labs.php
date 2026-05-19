<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    $stmt = $pdo->query("SELECT l.id, l.name, l.total_pcs, l.is_available, 
                                COUNT(CASE WHEN p.status = 'Available' THEN 1 END) AS available_pcs 
                         FROM labs l 
                         LEFT JOIN pcs p ON l.id = p.lab_id 
                         GROUP BY l.id");
    $labs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $labs]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
