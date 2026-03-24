<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idNumber']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Please provide ID and Password"]);
    exit();
}

try {
    // Search for the user by ID
    $stmt = $pdo->prepare("SELECT * FROM users WHERE user_id = :id");
    $stmt->execute([':id' => $data['idNumber']]);
    $user = $stmt->fetch();

    if ($user) {
        // Since we aren't hashing yet, we do a direct string comparison
        // NOTE: In production, use password_verify($data['password'], $user['user_password'])
        if ($data['password'] === $user['user_password']) {
            
            // Remove sensitive password before sending user data back to React
            unset($user['user_password']);

            // 1. Set the user to active
            $updateStmt = $pdo->prepare("UPDATE users SET user_is_active = 1 WHERE user_id = :id");
            $updateStmt->execute(['id' => $user['user_id']]);

            // 2. Fetch the fresh user data so React knows they are active
            $user['user_is_active'] = 1;

            // 3. Send the success response            
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => $user
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>