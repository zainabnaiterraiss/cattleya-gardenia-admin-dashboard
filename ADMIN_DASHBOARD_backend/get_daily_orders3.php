<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion à la base de données
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'fleurs_cattleya'; // <-- Remplace par ton vrai nom de base

$conn = new mysqli($host, $user, $password, $database);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit();
}

// Fonction pour exécuter une requête et retourner une valeur
function getSingleValue($conn, $query, $key = 'count') {
    $result = $conn->query($query);
    if ($result && $row = $result->fetch_assoc()) {
        return $row[$key] ?? 0;
    }
    return 0;
}

// Requêtes SQL
$pendingOrders = getSingleValue($conn, "SELECT COUNT(*) AS count FROM commande WHERE statut = 'Pending'");
$completedOrders = getSingleValue($conn, "SELECT COUNT(*) AS count FROM commande WHERE statut = 'Completed'");
$totalOrders = getSingleValue($conn, "SELECT COUNT(*) AS count FROM commande");
$totalRevenue = getSingleValue($conn, "SELECT SUM(montant) AS total FROM commande WHERE statut IN ('Delivered', 'Shipped')", 'total');

// Réponse JSON
echo json_encode([
    "totalOrders" => (int)$totalOrders,
    "pendingOrders" => (int)$pendingOrders,
    "completedOrders" => (int)$completedOrders,
    "totalRevenue" => (float)$totalRevenue
]);

$conn->close();
?>
