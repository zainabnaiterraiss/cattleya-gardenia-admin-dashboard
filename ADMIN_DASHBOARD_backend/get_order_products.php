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

$orderId = $_GET['id'] ?? null;

if (!$orderId) {
    die(json_encode(["error" => "Order ID is required"]));
}

$orderId = $conn->real_escape_string($orderId);

$sql = "SELECT produit.image, produit.nom_Produit, contient.Quantité, produit.prix
        FROM produit
        INNER JOIN contient ON contient.id_produit = produit.idProduit
        INNER JOIN commande ON contient.id_commande = commande.idCommande
        WHERE commande.idCommande = $orderId";

$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
?>