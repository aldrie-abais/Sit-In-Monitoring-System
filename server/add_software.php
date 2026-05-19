<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name) || empty(trim($data->name))) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Missing required field: name'
    ]);
    exit;
}

try {
    // Self-healing schema validation: ensure new columns exist in softwares table
    $columns = $pdo->query("DESCRIBE softwares")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('version', $columns)) {
        $pdo->exec("ALTER TABLE softwares ADD COLUMN version VARCHAR(50) NULL");
    }
    if (!in_array('license_type', $columns)) {
        $pdo->exec("ALTER TABLE softwares ADD COLUMN license_type VARCHAR(50) NULL");
    }
    if (!in_array('installation_date', $columns)) {
        $pdo->exec("ALTER TABLE softwares ADD COLUMN installation_date DATE NULL");
    }
    if (!in_array('deployment_notes', $columns)) {
        $pdo->exec("ALTER TABLE softwares ADD COLUMN deployment_notes TEXT NULL");
    }

    // Determine default icon or logo string
    $icon = 'Generic';
    $nameLower = strtolower($data->name);
    if (strpos($nameLower, 'cisco') !== false) {
        $icon = 'Cisco';
    } elseif (strpos($nameLower, 'code') !== false || strpos($nameLower, 'vscode') !== false) {
        $icon = 'VSCode';
    } elseif (strpos($nameLower, 'visual studio') !== false) {
        $icon = 'VisualStudio';
    } elseif (strpos($nameLower, 'jgrasp') !== false) {
        $icon = 'JGrasp';
    } elseif (strpos($nameLower, 'intellij') !== false) {
        $icon = 'IntelliJ';
    } elseif (strpos($nameLower, 'office') !== false || strpos($nameLower, 'microsoft') !== false) {
        $icon = 'Office';
    }

    $stmt = $pdo->prepare("INSERT INTO softwares (name, description, icon, version, license_type, installation_date, deployment_notes) 
                           VALUES (:name, :description, :icon, :version, :license_type, :installation_date, :deployment_notes)");
    
    $stmt->execute([
        'name' => trim($data->name),
        'description' => isset($data->description) ? trim($data->description) : null,
        'icon' => $icon,
        'version' => isset($data->version) ? trim($data->version) : null,
        'license_type' => isset($data->license_type) ? trim($data->license_type) : null,
        'installation_date' => isset($data->installation_date) && !empty($data->installation_date) ? $data->installation_date : null,
        'deployment_notes' => isset($data->deployment_notes) ? trim($data->deployment_notes) : null
    ]);

    $software_id = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'success' => true,
        'message' => 'Software added successfully',
        'software_id' => $software_id
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
