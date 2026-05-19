<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require 'db.php';

if (!isset($_POST['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User ID is missing.']);
    exit;
}

$user_id = $_POST['user_id'];

if (!isset($_FILES['profile_picture'])) {
    echo json_encode(['status' => 'error', 'message' => 'No image file uploaded.']);
    exit;
}

$file = $_FILES['profile_picture'];
$allowed_extensions = ['jpg', 'jpeg', 'png'];
$file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($file_extension, $allowed_extensions)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid file format. Only JPG, JPEG, and PNG are allowed.']);
    exit;
}

// Ensure the directory exists
$upload_dir = 'uploads/profile_pictures/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Generate a unique file name
$new_filename = $user_id . '_' . time() . '.' . $file_extension;
$destination = $upload_dir . $new_filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    try {
        // Save database record (relative path format)
        $stmt = $pdo->prepare("UPDATE users SET profile_picture = :profile_picture WHERE user_id = :user_id");
        $stmt->execute([
            'profile_picture' => $destination,
            'user_id' => $user_id
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Profile picture updated successfully.',
            'profile_picture' => $destination
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file.']);
}
?>
