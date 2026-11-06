<?php
header("Access-Control-Allow-Origin: *"); // Autorise toutes les origines
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

$id = $_POST['idAvis'];
$query = "DELETE FROM avis WHERE idAvis = '$id'";
mysqli_query($conn, $query);

echo json_encode(["success" => true]);
$conn->close();
?>
