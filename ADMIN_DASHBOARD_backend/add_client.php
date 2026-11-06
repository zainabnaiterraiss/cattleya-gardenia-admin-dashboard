<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Répondre immédiatement aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



$data = json_decode(file_get_contents("php://input"));

// Validation des données
if (empty($data->nom_Client) || empty($data->email_Client)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("INSERT INTO client (nom_Client, prenom_Client, email_Client, telephone_Client, adresse_Client, password, role) 
                           VALUES (:nom, :prenom, :email, :tel, :adresse, :password, :role)");
    
    // Hash du mot de passe (à adapter selon votre sécurité)
    $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
    
    $stmt->bindParam(':nom', $data->nom_Client);
    $stmt->bindParam(':prenom', $data->prenom_Client);
    $stmt->bindParam(':email', $data->email_Client);
    $stmt->bindParam(':tel', $data->telephone_Client);
    $stmt->bindParam(':adresse', $data->adresse_Client);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':role', $data->role);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Client ajouté"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur d'insertion"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de base de données",
        "error" => $e->getMessage()
    ]);
}
?>