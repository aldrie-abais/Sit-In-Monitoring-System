<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(['status' => 'error', 'message' => 'User ID is missing.']);
    exit;
}

try {
    // 1. Prepare the base update query
    $sql = "UPDATE users SET 
            user_first_name = :first_name,
            user_last_name = :last_name,
            user_middle_name = :middle_name,
            user_course_level = :course_level,
            user_course_name = :course_name,
            user_email = :email,
            user_address = :address";
    
    // 2. Only update the password if they actually typed a new one
    if (!empty($data->password)) {
        $sql .= ", user_password = :password";
    }
    
    $sql .= " WHERE user_id = :user_id";
    $stmt = $pdo->prepare($sql);

    // 3. Bind the data
    $stmt->bindParam(':first_name', $data->firstName);
    $stmt->bindParam(':last_name', $data->lastName);
    $stmt->bindParam(':middle_name', $data->middleName);
    $stmt->bindParam(':course_level', $data->courseLevel);
    $stmt->bindParam(':course_name', $data->course);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':address', $data->address);
    $stmt->bindParam(':user_id', $data->user_id);
    
    if (!empty($data->password)) {
        $stmt->bindParam(':password', $data->password);
    }

    $stmt->execute();

    // 4. Fetch the newly updated row to send back to React
    $fetchStmt = $pdo->prepare("SELECT * FROM users WHERE user_id = :user_id");
    $fetchStmt->bindParam(':user_id', $data->user_id);
    $fetchStmt->execute();
    $updatedUser = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'user' => $updatedUser]);

} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>