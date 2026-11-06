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
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "
    SELECT 
        MONTH(date_achat) AS mois,
        SUM(montant) AS revenu
    FROM commande
    GROUP BY mois
    ORDER BY mois
";

$result = $conn->query($sql);

$mois_abbr = [1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug', 9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'];

$data = [];

while ($row = $result->fetch_assoc()) {
    $mois = (int)$row["mois"];
    $data[] = [
        "month" => $mois_abbr[$mois],
        "revenue" => (float)$row["revenu"],
        "target" => round($row["revenu"] * 0.95, 2)  // Exemple de cible
    ];
}

echo json_encode($data);
$conn->close();
?>
