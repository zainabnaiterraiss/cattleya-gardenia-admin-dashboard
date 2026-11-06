<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Paramètres de connexion
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

// Créer la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Total Revenue
$queryTotalRevenue = "SELECT SUM(montant) AS totalRevenue FROM commande WHERE statut IN ('Delivered', 'Shipped')";
$resultTotalRevenue = mysqli_query($conn, $queryTotalRevenue);
$rowTotalRevenue = mysqli_fetch_assoc($resultTotalRevenue);

// Average Order Value
$queryAverageOrderValue = "SELECT AVG(montant) AS averageOrderValue FROM commande WHERE statut IN ('Delivered', 'Shipped')";
$resultAverageOrderValue = mysqli_query($conn, $queryAverageOrderValue);
$rowAverageOrderValue = mysqli_fetch_assoc($resultAverageOrderValue);

// Sales Growth (current vs previous year)
$queryCurrentYearSales = "SELECT SUM(montant) AS currentYearSales
FROM commande
WHERE YEAR(date_achat) = YEAR(CURDATE()) AND statut IN ('Delivered', 'Shipped')";

$queryPreviousYearSales = "SELECT SUM(montant) AS previousYearSales
FROM commande
WHERE YEAR(date_achat) = YEAR(CURDATE()) - 1 AND statut IN ('Delivered', 'Shipped')";

$resultCurrentYearSales = mysqli_query($conn, $queryCurrentYearSales);
$resultPreviousYearSales = mysqli_query($conn, $queryPreviousYearSales);

$rowCurrentYearSales = mysqli_fetch_assoc($resultCurrentYearSales);
$rowPreviousYearSales = mysqli_fetch_assoc($resultPreviousYearSales);

// Gestion des ventes de l'année précédente
$currentYearSales = $rowCurrentYearSales['currentYearSales'] ?? 0;
$previousYearSales = $rowPreviousYearSales['previousYearSales'] ?? 0;

// Calcul de la croissance des ventes
$salesGrowth = 0;
if ($previousYearSales > 0) {
    $salesGrowth = (($currentYearSales - $previousYearSales) / $previousYearSales) * 100;
} elseif ($previousYearSales == 0 && $currentYearSales > 0) {
    $salesGrowth = 100; // Si l'année précédente n'a pas de ventes et l'année actuelle en a, on considère une croissance de 100%
}

// Assurez-vous que la croissance des ventes est toujours positive
$salesGrowth = abs($salesGrowth);

// Retourner les données sous forme JSON
$response = [
    'totalRevenue' => number_format($rowTotalRevenue['totalRevenue'], 2),
    'averageOrderValue' => number_format($rowAverageOrderValue['averageOrderValue'], 2),
    'salesGrowth' => number_format($salesGrowth, 2)
];

echo json_encode($response);
?>
