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
        'total_sales' => 0,
        'total_products' => 0,
    ]));
}
$salesQuery = "SELECT SUM(montant) AS total FROM commande";
$salesResult = $conn->query($salesQuery);
$totalSales = $salesResult->fetch_assoc()['total'] ?? 0;
$productsQuery = "SELECT COUNT(*) AS total FROM produit";
$productsResult = $conn->query($productsQuery);
$totalProducts = $productsResult->fetch_assoc()['total'] ?? 0;
$conn->close();

echo json_encode([
    'total_sales' => $totalSales,
    'total_products' => $totalProducts,
]);
?>