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

// Requête pour récupérer les ventes par mois
$sql = "SELECT MONTH(date_achat) AS month, SUM(montant) AS sales FROM commande GROUP BY month ORDER BY month";
$result = $conn->query($sql);

// Initialiser un tableau avec tous les mois (sales à 0 par défaut)
$allMonths = array_fill(1, 12, 0);
$monthNames = [
    1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 
    5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug',
    9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
];

// Remplir les données existantes
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $allMonths[$row['month']] = (float)$row['sales'];
    }
}

// Préparer le tableau final
$salesData = [];
foreach ($allMonths as $monthNum => $sales) {
    $salesData[] = [
        "name" => $monthNames[$monthNum],
        "sales" => $sales
    ];
}

// Fermer la connexion
$conn->close();

// Retourner les données
echo json_encode($salesData);
?>