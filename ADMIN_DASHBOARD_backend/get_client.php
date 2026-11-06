<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$clientId = $_GET['id'] ?? null;

if (!$clientId) {
    die(json_encode(["error" => "Client ID is required"]));
}

$clientId = $conn->real_escape_string($clientId);

$sql = "SELECT idClient, nom_Client, prenom_Client, email_Client, telephone_Client, adresse_Client 
        FROM client 
        WHERE idClient = $clientId";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["error" => "Client not found"]);
}

$conn->close();
?>