<?php
// Pour afficher les erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers pour le JSON et le CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifie la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Requête SQL
$sql = "
SELECT
  cat.designation_Categorie AS category,
  COUNT(c.idCommande) AS sales,
  SUM(c.montant) AS revenue,
  SUM(c.montant) - SUM(p.prix) AS profit
FROM commande c
JOIN produit p ON c.designation = p.nom_Produit
JOIN categorie cat ON p.idCategorie = cat.idCategorie
GROUP BY cat.idCategorie, cat.designation_Categorie
ORDER BY sales DESC
";

$result = $conn->query($sql);

// Préparation des données
$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "category" => $row["category"],
            "sales" => (int)$row["sales"],
            "revenue" => (float)$row["revenue"],
            "profit" => (float)$row["profit"],
        ];
    }
    echo json_encode($data);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur SQL: " . $conn->error]);
}

$conn->close();
