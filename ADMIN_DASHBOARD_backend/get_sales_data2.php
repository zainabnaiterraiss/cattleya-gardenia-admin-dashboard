<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Autoriser les requêtes OPTIONS pour CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed']));
}

// Requête optimisée avec jointure pour calculer le montant total
$sql = "SELECT 
        MONTH(c.date_achat) AS month, 
        SUM(ct.Quantité * p.prix) AS sales 
        FROM commande c
        JOIN contient ct ON c.idCommande = ct.id_commande
        JOIN produit p ON ct.id_produit = p.idProduit
        GROUP BY MONTH(c.date_achat)
        ORDER BY month";

$result = $conn->query($sql);

$monthNames = [
    1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 
    5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug',
    9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
];

// Initialiser avec tous les mois
$salesData = [];
foreach ($monthNames as $num => $name) {
    $salesData[] = [
        "month" => $name,
        "sales" => 0
    ];
}

// Remplir avec les données réelles
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $monthIndex = $row['month'] - 1;
        if (isset($salesData[$monthIndex])) {
            $salesData[$monthIndex]['sales'] = (float)$row['sales'];
        }
    }
}

$conn->close();

echo json_encode($salesData);
?>