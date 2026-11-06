<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'fleurs_cattleya';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Requête pour récupérer les statistiques
$query = "
    SELECT
        (SELECT COUNT(*) FROM avis) AS totalAvis,
        (SELECT COUNT(*) FROM client) AS totalUsers,
        (SELECT COUNT(*) FROM commande) AS totalOrders,
        (SELECT SUM(montant) FROM commande WHERE statut IN ('Delivered', 'Shipped')) AS totalRevenue
";
$result = $conn->query($query);

// Si la requête réussit, renvoyer les résultats
if ($result) {
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch data']);
}

$conn->close();
?>
