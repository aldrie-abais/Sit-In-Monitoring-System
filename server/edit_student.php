<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->user_last_name)) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields are missing.']);
    exit;
}

try {
    $sql = "UPDATE users SET
            user_first_name = :first_name,
            user_middle_name = :middle_name,
            user_last_name = :last_name,
            user_course_level = :course_level,
            user_course_name = :course_name,
            user_email = :email,
            user_address = :address,
            remaining_sessions = :remaining_sessions";

    if (!empty($data->user_password)) {
        $sql .= ", user_password = :password";
    }

    $sql .= " WHERE user_id = :user_id AND role = 'Student'";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':first_name', $data->user_first_name ?? '');
    $stmt->bindValue(':middle_name', $data->user_middle_name ?? '');
    $stmt->bindValue(':last_name', $data->user_last_name ?? '');
    $stmt->bindValue(':course_level', $data->user_course_level ?? '');
    $stmt->bindValue(':course_name', $data->user_course_name ?? '');
    $stmt->bindValue(':email', $data->user_email ?? '');
    $stmt->bindValue(':address', $data->user_address ?? '');
    $stmt->bindValue(':remaining_sessions', $data->remaining_sessions ?? 30);
    $stmt->bindValue(':user_id', $data->user_id);

    if (!empty($data->user_password)) {
        $stmt->bindValue(':password', password_hash($data->user_password, PASSWORD_DEFAULT));
    }

    $stmt->execute();

    $fetchStmt = $pdo->prepare("SELECT user_id, user_first_name, user_middle_name, user_last_name, user_course_level, user_course_name, user_email, user_address, remaining_sessions, user_is_active FROM users WHERE user_id = :user_id AND role = 'Student'");
    $fetchStmt->execute(['user_id' => $data->user_id]);
    $updatedStudent = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'message' => 'Student updated successfully!', 'student' => $updatedStudent]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>