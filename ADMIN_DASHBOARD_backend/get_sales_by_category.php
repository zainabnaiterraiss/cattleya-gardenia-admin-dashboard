<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    // Envoie d'un message d'erreur en JSON si la connexion échoue
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Requête pour les ventes par catégorie
$sql = "SELECT 
        cat.designation_Categorie AS name,
        COALESCE(SUM(ct.Quantité * p.prix), 0) AS value
        FROM categorie cat
        LEFT JOIN produit p ON cat.idCategorie = p.idCategorie
        LEFT JOIN contient ct ON p.idProduit = ct.id_produit
        LEFT JOIN commande c ON ct.id_commande = c.idCommande
        GROUP BY cat.idCategorie, cat.designation_Categorie";

$result = $conn->query($sql);

// Vérification du résultat de la requête
if ($result) {
    // Récupération des résultats sous forme de tableau associatif
    $data = $result->fetch_all(MYSQLI_ASSOC);

    // Retourner les résultats au format JSON
    echo json_encode($data);
} else {
    // Envoie d'un message d'erreur en cas d'échec de la requête
    echo json_encode(['error' => 'Erreur dans la requête SQL']);
}

$conn->close();
?>
