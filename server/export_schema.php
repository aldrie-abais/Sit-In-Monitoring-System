<?php
require 'db.php';
$tables = ['users', 'announcements', 'notifications', 'labs', 'pcs', 'reservations', 'reservation_pcs', 'sit_in_history', 'softwares', 'lab_softwares', 'system_logs'];

foreach ($tables as $table) {
    try {
        $stmt = $pdo->query("SHOW CREATE TABLE $table");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo $row['Create Table'] . ";\n\n";
    } catch (Exception $e) {
        echo "-- Table $table not found or error\n\n";
    }
}
?>
