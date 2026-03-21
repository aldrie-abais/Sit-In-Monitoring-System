<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// 1. You MUST include the database connection!
require_once 'db.php';

try {
    // 2. You query a TABLE, not the database name
    $stmt = $pdo->query("SELECT * FROM user");
    $rows = $stmt->fetchAll();
    
    echo json_encode([
        "status" => "success",
        "data" => $rows
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Query failed: " . $e->getMessage()
    ]);
}
?>