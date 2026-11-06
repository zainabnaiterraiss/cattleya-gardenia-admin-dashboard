<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['idClient'])) {
    die(json_encode(["error" => "Invalid data"]));
}

$id = $conn->real_escape_string($data['idClient']);
$nom = $conn->real_escape_string($data['nom_Client'] ?? '');
$prenom = $conn->real_escape_string($data['prenom_Client'] ?? '');
$email = $conn->real_escape_string($data['email_Client'] ?? '');
$telephone = $conn->real_escape_string($data['telephone_Client'] ?? '');
$adresse = $conn->real_escape_string($data['adresse_Client'] ?? '');

$sql = "UPDATE client SET 
        nom_Client = '$nom',
        prenom_Client = '$prenom',
        email_Client = '$email',
        telephone_Client = '$telephone',
        adresse_Client = '$adresse'
        WHERE idClient = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Update failed: " . $conn->error]);
}

$conn->close();
?>