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

// Requête avec CTE pour garantir l'affichage de tous les jours
$sql = "
    WITH RECURSIVE dates AS (
        SELECT CURDATE() - INTERVAL 13 DAY AS date_jour
        UNION ALL
        SELECT date_jour + INTERVAL 1 DAY
        FROM dates
        WHERE date_jour + INTERVAL 1 DAY <= CURDATE()
    )
    SELECT 
        d.date_jour AS date,
        DATE_FORMAT(d.date_jour, '%a') AS day_short,
        DAYNAME(d.date_jour) AS day_full,
        COALESCE(SUM(ct.quantite * p.prix), 0) AS sales
    FROM dates d
    LEFT JOIN commande c ON DATE(c.date_achat) = d.date_jour
    LEFT JOIN contient ct ON c.idCommande = ct.id_commande
    LEFT JOIN produit p ON ct.id_produit = p.idProduit
    GROUP BY d.date_jour
    ORDER BY d.date_jour
";

$result = $conn->query($sql);

$dayTranslations = [
    'Mon' => 'Lun', 'Tue' => 'Mar', 'Wed' => 'Mer',
    'Thu' => 'Jeu', 'Fri' => 'Ven', 'Sat' => 'Sam', 'Sun' => 'Dim'
];

$salesData = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dayShortFr = $dayTranslations[$row['day_short']] ?? $row['day_short'];

        $salesData[] = [
            'name' => $dayShortFr,
            'sales' => (float)$row['sales'],
            'fullDate' => $row['date']
        ];
    }
}

$conn->close();

echo json_encode($salesData);
?>
