<?php
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

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Récupérer les commandes par jour
$query = "SELECT DATE(date_achat) AS date, COUNT(*) AS orders
          FROM commande
          WHERE statut IN ('Delivered', 'Shipped')
          GROUP BY DATE(date_achat)
          ORDER BY DATE(date_achat)";

$result = $conn->query($query);
$dailyOrders = [];

while ($row = $result->fetch_assoc()) {
    $dailyOrders[] = [
        'date' => date("m/d", strtotime($row['date'])),
        'orders' => $row['orders']
    ];
}

echo json_encode($dailyOrders);

$conn->close();
?>
