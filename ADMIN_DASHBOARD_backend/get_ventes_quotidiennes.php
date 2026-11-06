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
    die(json_encode(['error' => 'Database connection failed']));
}

// Requête pour les ventes quotidiennes
$sql = "SELECT 
        DATE(commande.date_achat) AS jour, 
  SUM(commande.montant) AS total_ventes
FROM 
  commande 
WHERE 
  commande.date_achat BETWEEN '2025-05-01' AND '2025-05-07'  -- Plage de dates à ajuster
GROUP BY 
  jour
ORDER BY 
  jour ASC";

$result = $conn->query($sql);

if ($result) {
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
} else {
    echo json_encode(['error' => 'Erreur dans la requête SQL']);
}

$conn->close();
?>
