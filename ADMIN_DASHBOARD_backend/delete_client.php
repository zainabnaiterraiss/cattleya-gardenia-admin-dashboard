<?php
session_start(); // ضروري باش نستعمل $_SESSION

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification connexion
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (!isset($_SESSION['idClient'])) {
    die(json_encode(["error" => "Client is not logged in"]));
}

$clientId = $conn->real_escape_string($_SESSION['idClient']);

// Requête de suppression
$sql = "DELETE FROM client WHERE idClient = $clientId";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => "Client deleted successfully"]);
  
    session_destroy();
} else {
    echo json_encode(["error" => "Error deleting client: " . $conn->error]);
}

$conn->close();
?>
