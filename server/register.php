<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// 1. CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// 2. Include database connection
require_once 'db.php';

// 3. Get the raw JSON data sent by React
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

try {
    // 4. Prepare the SQL INSERT statement 
    // Notice the exact column names matching your schema
    $sql = "INSERT INTO users (
        user_id, 
        user_first_name, 
        user_last_name, 
        user_middle_name, 
        user_course_level, 
        user_course_name, 
        user_email, 
        user_address, 
        user_password
    ) VALUES (
        :user_id, 
        :first_name, 
        :last_name, 
        :middle_name, 
        :course_level, 
        :course_name, 
        :email, 
        :address, 
        :password
    )";

    $stmt = $pdo->prepare($sql);

    // 5. Execute the query with the data from React
    $stmt->execute([
        ':user_id' => $data['idNumber'],
        ':first_name' => $data['firstName'],
        ':last_name' => $data['lastName'],
        ':middle_name' => $data['middleName'],
        ':course_level' => $data['courseLevel'],
        ':course_name' => $data['course'],
        ':email' => $data['email'],
        ':address' => $data['address'],
        ':password' => $data['password'] // Remember: Change to password_hash() if you increase column length later!
    ]);

    // 6. Send success response back to React
    echo json_encode(["status" => "success", "message" => "User successfully registered"]);

} catch (PDOException $e) {
    // Check if the error is a duplicate ID (Primary Key collision)
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => "error", "message" => "ID Number or Email already exists."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
}
?>