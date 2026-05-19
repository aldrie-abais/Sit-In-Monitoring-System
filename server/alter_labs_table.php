<?php
require 'db.php';

try {
    $pdo->exec("ALTER TABLE labs ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT TRUE");
    echo "Column 'is_available' added successfully.\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
