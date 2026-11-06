<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion à la base de données
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'fleurs_cattleya';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion : ' . $conn->connect_error]);
    exit;
}

// Lecture du corps de la requête JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérification des données requises
if (
    isset($data['id']) &&
    isset($data['question']) &&
    isset($data['contenu']) &&
    isset($data['image_path']) &&
    isset($data['date_publication'])
) {
    $id = $conn->real_escape_string($data['id']);
    $question = $conn->real_escape_string($data['question']);
    $contenu = $conn->real_escape_string($data['contenu']);
    $image_path = $conn->real_escape_string($data['image_path']);
    $date_publication = $conn->real_escape_string($data['date_publication']);

    $sql = "UPDATE permaculture SET 
                question = '$question',
                contenu = '$contenu',
                image_path = '$image_path',
                date_publication = '$date_publication'
            WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'message' => 'Conseil mis à jour avec succès.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour : ' . $conn->error]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Données incomplètes.']);
}

$conn->close();
