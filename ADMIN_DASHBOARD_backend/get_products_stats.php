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
    die(json_encode([
        'total_products' => 0,
        'top_selling' => 0,
        'low_stock' => 0,
        'total_revenue' => 0
    ]));
}

// 1. Nombre total de produits
$totalProductsQuery = "SELECT COUNT(*) AS total FROM produit";
$totalProductsResult = $conn->query($totalProductsQuery);
$totalProducts = $totalProductsResult->fetch_assoc()['total'] ?? 0;

// 2. Produit le plus vendu (quantité totale)
// $topSellingQuery = "SELECT SUM(c.Quantité) AS total 
//                    FROM contient c
//                    JOIN produit p ON c.id_produit = p.idProduit
//                    GROUP BY c.id_produit
//                    ORDER BY total DESC
//                    LIMIT 1";
// $topSellingResult = $conn->query($topSellingQuery);
// $topSelling = $topSellingResult->fetch_assoc()['total'] ?? 0;

// 3. Produits en faible stock (moins de 5 unités)
$lowStockQuery = "SELECT COUNT(*) AS total FROM produit WHERE stock < 5";
$lowStockResult = $conn->query($lowStockQuery);
$lowStock = $lowStockResult->fetch_assoc()['total'] ?? 0;

// 4. Revenu total (depuis la table commande)
$revenueQuery = "SELECT SUM(montant) AS total FROM commande";
$revenueResult = $conn->query($revenueQuery);
$totalRevenue = $revenueResult->fetch_assoc()['total'] ?? 0;

$conn->close();

echo json_encode([
    'total_products' => (int)$totalProducts,
    // 'top_selling' => (int)$topSelling,
    'low_stock' => (int)$lowStock,
    'total_revenue' => (float)$totalRevenue
]);
?>