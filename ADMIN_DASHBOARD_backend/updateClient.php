<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"));

$sql = "UPDATE client SET 
        nom_Client = ?,
        prenom_Client = ?,
        email_Client = ?,
        telephone_Client = ?,
        adresse_Client = ?,
        role = ?
        WHERE idClient = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", 
    $data->nom_Client,
    $data->prenom_Client,
    $data->email_Client,
    $data->telephone_Client,
    $data->adresse_Client,
    $data->role,
    $data->idClient);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$stmt->close();
$conn->close();
?>