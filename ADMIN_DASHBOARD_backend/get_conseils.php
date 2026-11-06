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
    echo json_encode(['success' => false, 'message' => 'Connexion échouée: ' . $conn->connect_error]);
    exit();
}

$sql = "SELECT id, question, contenu, image_path, date_publication FROM permaculture ORDER BY date_publication DESC";
$result = $conn->query($sql);

if ($result) {
    $conseils = [];

    while ($row = $result->fetch_assoc()) {
        $conseils[] = $row;
    }

    echo json_encode($conseils);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de requête SQL : ' . $conn->error]);
}

$conn->close();
?>
