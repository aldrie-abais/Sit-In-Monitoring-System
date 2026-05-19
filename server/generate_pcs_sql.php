<?php
$labsToSeed = [1, 2, 3, 4, 5, 6];
$pcCount = 45;

$sql = "\n-- PCs Seed Data\nINSERT INTO `pcs` (`lab_id`, `pc_number`, `row_position`, `col_position`, `status`) VALUES\n";
$values = [];

foreach ($labsToSeed as $labId) {
    for ($i = 1; $i <= $pcCount; $i++) {
        $col = ceil($i / 8);
        $row = (($i - 1) % 8) + 1;
        $values[] = "($labId, $i, $row, $col, 'Available')";
    }
}

$sql .= implode(",\n", $values) . ";\n";
file_put_contents('migration.sql', $sql, FILE_APPEND);
echo "Appended PCs to migration.sql\n";
?>
