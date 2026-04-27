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
                               user_course_name, user_course_level, user_email, user_address, user_password, 
                               role, remaining_sessions, user_is_active) 
            VALUES (:id, :fname, :mname, :lname, :course, :level, :email, :address, :pass, 'Student', :remaining_sessions, 0)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $data->user_id,
        'fname' => $data->user_first_name,
        'mname' => $data->user_middle_name,
        'lname' => $data->user_last_name,
        'course' => $data->user_course_name,
        'level' => $data->user_course_level,
        'email' => $data->user_email ?? '',
        'address' => $data->user_address ?? '',
        'pass' => password_hash($data->user_password, PASSWORD_DEFAULT)
        ,
        'remaining_sessions' => $data->remaining_sessions ?? 30
    ]);

    // Create notification for admitted student
    $notificationMsg = "You have been admitted to the Sit-In Monitoring System by the administrator.";
    $sqlNotification = "INSERT INTO notifications (user_id, type, message, is_read) 
                        VALUES (:user_id, 'admitted', :message, 0)";
    $stmtNotif = $pdo->prepare($sqlNotification);
    $stmtNotif->execute([
        'user_id' => $data->user_id,
        'message' => $notificationMsg
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Student added successfully!']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'ID already exists or DB error.']);
}
?>