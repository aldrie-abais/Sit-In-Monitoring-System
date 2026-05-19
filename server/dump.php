<?php
require 'db.php';
$stmt = $pdo->query("SELECT * FROM sit_in_history LIMIT 5");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
