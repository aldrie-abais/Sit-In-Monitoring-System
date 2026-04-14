<?php
/**
 * This endpoint creates the notifications table if it doesn't exist.
 * Call this once to initialize the database schema.
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check if table already exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'notifications'");
    $tableExists = $stmt->rowCount() > 0;

    if (!$tableExists) {
        // Create notifications table
        $createTableSQL = "
            CREATE TABLE notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                type VARCHAR(50) NOT NULL COMMENT 'admitted, session_ended',
                message TEXT NOT NULL,
                is_read TINYINT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                INDEX (user_id),
                INDEX (is_read)
            )
        ";
        
        $pdo->exec($createTableSQL);
        echo json_encode(['status' => 'success', 'message' => 'notifications table created successfully']);
    } else {
        echo json_encode(['status' => 'success', 'message' => 'notifications table already exists']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
