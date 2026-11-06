<?php
// En-têtes HTTP pour permettre l'accès CORS et indiquer le format JSON
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

// Vérification de la connexion
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connexion échouée : ' . $conn->connect_error]);
    exit;
}

// Lecture des données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérification des champs requis
if (
    isset($data['question']) &&
    isset($data['contenu']) &&
    isset($data['image_path']) &&
    isset($data['date_publication'])
) {
    $question = $conn->real_escape_string($data['question']);
    $contenu = $conn->real_escape_string($data['contenu']);
    $image_path = $conn->real_escape_string($data['image_path']);
    $date_publication = $conn->real_escape_string($data['date_publication']);

    // Requête d'insertion
    $sql = "INSERT INTO permaculture (question, contenu, image_path, date_publication)
            VALUES ('$question', '$contenu', '$image_path', '$date_publication')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Conseil ajouté avec succès.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout : ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Données incomplètes.']);
}

$conn->close();
?>
