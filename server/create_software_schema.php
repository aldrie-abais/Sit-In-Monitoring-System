<?php
require 'db.php';

try {
    // 1. Create softwares table
    $pdo->exec("CREATE TABLE IF NOT EXISTS softwares (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NULL,
        icon VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. Create lab_softwares pivot table
    $pdo->exec("CREATE TABLE IF NOT EXISTS lab_softwares (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lab_id INT NOT NULL,
        software_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE,
        FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
        UNIQUE KEY unique_lab_software (lab_id, software_id)
    )");

    echo "Tables 'softwares' and 'lab_softwares' verified/created successfully.\n";

    // 3. Seed softwares data
    $softwares = [
        [
            'name' => 'Cisco Packet Tracer',
            'description' => 'A powerful network simulation tool that allows students to experiment with network behavior and build complex network models.',
            'icon' => 'Cisco'
        ],
        [
            'name' => 'Visual Studio Code',
            'description' => 'A lightweight and highly customizable source code editor supporting a vast ecosystem of programming languages and compiler extensions.',
            'icon' => 'VSCode'
        ],
        [
            'name' => 'Visual Studio',
            'description' => 'A comprehensive, enterprise-level Integrated Development Environment (IDE) optimized for complex C#, C++, and .NET applications.',
            'icon' => 'VisualStudio'
        ],
        [
            'name' => 'JGrasp',
            'description' => 'A specialized, lightweight IDE built to dynamically generate automatic software visualizations for Java, Python, and C++ languages.',
            'icon' => 'JGrasp'
        ],
        [
            'name' => 'IntelliJ IDEA Community',
            'description' => 'A premium, modern IDE tailored for Java and Kotlin developers, complete with high-efficiency automation and advanced refactoring tools.',
            'icon' => 'IntelliJ'
        ],
        [
            'name' => 'Microsoft Office',
            'description' => 'The industry-standard productivity suite, including Word, Excel, and PowerPoint, providing core document editing and spreadsheet tools.',
            'icon' => 'Office'
        ]
    ];

    $insertSoft = $pdo->prepare("INSERT INTO softwares (name, description, icon) VALUES (:name, :description, :icon) ON DUPLICATE KEY UPDATE description = VALUES(description), icon = VALUES(icon)");
    foreach ($softwares as $sw) {
        $insertSoft->execute($sw);
    }
    echo "Softwares seeded successfully.\n";

    // 4. Seed lab_softwares assignments pivot data
    $assignments = [
        'Cisco Packet Tracer' => ['Lab - 524', 'Lab - 526', 'Lab - 530'],
        'Visual Studio Code' => ['Lab - 524', 'Lab - 526', 'Lab - 528', 'Lab - 530', 'Lab - 542', 'Lab - 544'],
        'Visual Studio' => ['Lab - 528', 'Lab - 542'],
        'JGrasp' => ['Lab - 524', 'Lab - 526'],
        'IntelliJ IDEA Community' => ['Lab - 530', 'Lab - 544'],
        'Microsoft Office' => ['Lab - 524', 'Lab - 526', 'Lab - 528', 'Lab - 530', 'Lab - 542', 'Lab - 544']
    ];

    $getSoftId = $pdo->prepare("SELECT id FROM softwares WHERE name = :name");
    $getLabId = $pdo->prepare("SELECT id FROM labs WHERE name = :name");
    $insertPivot = $pdo->prepare("INSERT IGNORE INTO lab_softwares (lab_id, software_id) VALUES (:lab_id, :software_id)");

    foreach ($assignments as $swName => $labs) {
        $getSoftId->execute(['name' => $swName]);
        $swId = $getSoftId->fetchColumn();

        if ($swId) {
            foreach ($labs as $labName) {
                $getLabId->execute(['name' => $labName]);
                $labId = $getLabId->fetchColumn();

                if ($labId) {
                    $insertPivot->execute(['lab_id' => $labId, 'software_id' => $swId]);
                }
            }
        }
    }
    echo "Lab-software assignments seeded successfully.\n";

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
?>
