<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->user_last_name) || !isset($data->user_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields are missing.']);
    exit;
}

try {
    $sql = "INSERT INTO users (user_id, user_first_name, user_middle_name, user_last_name, 
                               user_course_name, user_course_level, user_password, 
                               role, remaining_sessions, user_is_active) 
            VALUES (:id, :fname, :mname, :lname, :course, :level, :pass, 'Student', 30, 0)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $data->user_id,
        'fname' => $data->user_first_name,
        'mname' => $data->user_middle_name,
        'lname' => $data->user_last_name,
        'course' => $data->user_course_name,
        'level' => $data->user_course_level,
        'pass' => password_hash($data->user_password, PASSWORD_DEFAULT)
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Student added successfully!']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'ID already exists or DB error.']);
}
?>