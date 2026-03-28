<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';

try {
    // Resets everyone with the role 'Student' back to 30
    $stmt = $pdo->prepare("UPDATE users SET remaining_sessions = 30 WHERE role = 'Student'");
    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'All student sessions reset to 30!']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>