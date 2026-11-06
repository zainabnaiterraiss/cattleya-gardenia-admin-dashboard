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

// Requête pour obtenir la répartition des commandes par statut
$query = "SELECT statut, COUNT(*) AS count
          FROM commande
          WHERE statut IN ('Pending', 'Processing', 'Shipped', 'Delivered')
          GROUP BY statut";

$result = $conn->query($query);
$orderStatusData = [];

while ($row = $result->fetch_assoc()) {
    $orderStatusData[] = [
        'name' => $row['statut'],
        'value' => $row['count']
    ];
}

echo json_encode($orderStatusData);

$conn->close();
?>
