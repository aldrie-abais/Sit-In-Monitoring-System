<?php
$host = '127.0.0.1';
$port = '3306';
$db = 'sit_in_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";

try {
    $pdo = new PDO($dsn, $user, $pass);
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
} catch (\PDOException $e) {
    die("Database connection failed on 3306: " . $e->getMessage());
}
?>
