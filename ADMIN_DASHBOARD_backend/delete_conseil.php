<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion à la base de données
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'fleurs_cattleya';

$conn = new mysqli($host, $user, $password, $database);

// Vérifier la connexion
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de connexion à la base de données: ' . $conn->connect_error
    ]);
    exit;
}

// Vérifier si l'ID est présent dans l'URL
if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Sécurisation simple

    $sql = "DELETE FROM permaculture WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success' => true,
            'message' => 'Conseil supprimé avec succès.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de la suppression: ' . $conn->error
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Paramètre ID manquant.'
    ]);
}

$conn->close();
?>
