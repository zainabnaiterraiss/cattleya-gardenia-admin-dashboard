<?php
header("Access-Control-Allow-Origin: *"); // <<< cette ligne règle le CORS
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ton_nom_de_base_de_donnees";

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Récupération des ventes
$sql = "SELECT date_achat, montant FROM commande";
$result = $conn->query($sql);

$sales = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $sales[] = $row;
    }
}

echo json_encode($sales);

$conn->close();
?>
