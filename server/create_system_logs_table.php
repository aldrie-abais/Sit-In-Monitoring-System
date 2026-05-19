<?php
require 'db.php';
try {
    $sql = "CREATE TABLE IF NOT EXISTS system_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_name VARCHAR(100),
        lab_name VARCHAR(50),
        pc_numbers VARCHAR(100),
        action VARCHAR(20),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    echo "Table system_logs created successfully.\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
