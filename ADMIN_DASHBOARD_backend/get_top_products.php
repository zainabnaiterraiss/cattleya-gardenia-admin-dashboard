<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        ["name" => "Erreur DB", "value" => 0],
        ["name" => "Erreur DB", "value" => 0],
        ["name" => "Erreur DB", "value" => 0],
        ["name" => "Erreur DB", "value" => 0]
    ]);
    exit();
}

// Requête corrigée avec le bon nom de table 'contient'
$sql = "SELECT 
            p.nom_Produit AS product_name, 
            SUM(c.quantite) AS total_quantity
        FROM contient c
        JOIN produit p ON c.id_produit = p.idProduit
        GROUP BY c.id_produit
        ORDER BY total_quantity DESC
        LIMIT 4";

$result = $conn->query($sql);

$topProducts = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $topProducts[] = [
            "name" => $row['product_name'],
            "value" => (int)$row['total_quantity']
        ];
    }
}

// Compléter avec des valeurs par défaut
$defaultProducts = [
    ["name" => "Aucun produit", "value" => 0],
    ["name" => "Aucun produit", "value" => 0],
    ["name" => "Aucun produit", "value" => 0],
    ["name" => "Aucun produit", "value" => 0]
];

// Fusionner les résultats avec les valeurs par défaut
$finalProducts = array_replace($defaultProducts, $topProducts);

$conn->close();
echo json_encode(array_slice($finalProducts, 0, 4));
?>