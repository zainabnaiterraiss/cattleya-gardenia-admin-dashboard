<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$username = "root";
$password = "";
$database = "fleurs_cattleya";
$host = "localhost";

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    // Désactiver temporairement les contraintes de clé étrangère
    $conn->exec("SET FOREIGN_KEY_CHECKS=0");

    // Supprimer d'abord les enregistrements liés (exemple avec une table commandes)
    // $stmt = $conn->prepare("DELETE FROM commandes WHERE idProduit = :id");
    // $stmt->bindParam(':id', $id);
    // $stmt->execute();

    // Puis supprimer le produit
    $stmt = $conn->prepare("DELETE FROM produit WHERE idProduit = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    // Réactiver les contraintes
    $conn->exec("SET FOREIGN_KEY_CHECKS=1");
   
error_reporting(E_ALL);

    echo json_encode(["success" => true, "message" => "Produit supprimé avec succès"]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erreur lors de la suppression: " . $e->getMessage()]);
}
?>