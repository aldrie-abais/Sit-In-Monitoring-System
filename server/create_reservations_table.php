<?php
require 'db.php';
try {
    $sql = "CREATE TABLE IF NOT EXISTS reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        lab VARCHAR(50),
        purpose VARCHAR(100),
        reservation_date DATE,
        reservation_time TIME,
        status VARCHAR(20) DEFAULT 'Pending'
    )";
    $pdo->exec($sql);
    echo "Table reservations created successfully.";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
