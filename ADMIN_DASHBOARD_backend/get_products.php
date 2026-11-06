<?php
// get_products.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Requête pour récupérer les produits avec leur catégorie et stock
$sql = "SELECT 
            p.idProduit AS id,
            p.nom_Produit AS name,
            p.description,
            p.image,
            p.prix AS price,
            p.stock, -- <== ajout du stock ici
            c.designation_Categorie AS category
        FROM produit p
        JOIN categorie c ON p.idCategorie = c.idCategorie";

$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);

$conn->close();
?>
