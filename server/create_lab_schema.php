<?php
require 'db.php';

try {
    // 0. Drop existing tables for a clean re-seed
    $pdo->exec("DROP TABLE IF EXISTS pcs");
    $pdo->exec("DROP TABLE IF EXISTS labs");

    // 1. Create labs table
    $pdo->exec("CREATE TABLE IF NOT EXISTS labs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        total_pcs INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. Create pcs table
    $pdo->exec("CREATE TABLE IF NOT EXISTS pcs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lab_id INT NOT NULL,
        pc_number INT NOT NULL,
        row_position INT NOT NULL,
        col_position INT NOT NULL,
        status ENUM('Available', 'Occupied', 'On-Maintenance') DEFAULT 'Available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE,
        UNIQUE (lab_id, pc_number)
    )");

    echo "Tables 'labs' and 'pcs' created successfully.\n";

    // 3. Seed Labs and PCs
    $labsToSeed = ["Lab - 524", "Lab - 526", "Lab - 528", "Lab - 530", "Lab - 542", "Lab - 544"];
    
    // Check if labs already exist to prevent duplicate seeding
    $stmt = $pdo->query("SELECT COUNT(*) FROM labs");
    if ($stmt->fetchColumn() == 0) {
        $insertLab = $pdo->prepare("INSERT INTO labs (name, total_pcs) VALUES (:name, :total_pcs)");
        $insertPC = $pdo->prepare("INSERT INTO pcs (lab_id, pc_number, row_position, col_position, status) VALUES (:lab_id, :pc_number, :row, :col, 'Available')");

        foreach ($labsToSeed as $labName) {
            $pcCount = rand(44, 46);
            $insertLab->execute(['name' => $labName, 'total_pcs' => $pcCount]);
            $labId = $pdo->lastInsertId();

            for ($i = 1; $i <= $pcCount; $i++) {
                // 8 rows per column vertically
                $col = ceil($i / 8);
                $row = (($i - 1) % 8) + 1;
                
                $insertPC->execute([
                    'lab_id' => $labId,
                    'pc_number' => $i,
                    'row' => $row,
                    'col' => $col
                ]);
            }
            echo "Seeded $labName with $pcCount PCs.\n";
        }
        echo "Database seeded successfully.\n";
    } else {
        echo "Data already exists. Skipping seed.\n";
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
