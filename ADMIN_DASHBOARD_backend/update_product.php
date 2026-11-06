<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");
$username = "root";
$password = "";
$database = "fleurs_cattleya";
$host = "localhost";

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->id)) {
        echo json_encode(["success" => false, "message" => "ID produit manquant"]);
        exit;
    }

    $updates = [];
    $params = [':id' => $data->id];

    if (isset($data->name)) {
        $updates[] = "nom_Produit = :name";
        $params[':name'] = $data->name;
    }

    if (isset($data->description)) {
        $updates[] = "description = :description";
        $params[':description'] = $data->description;
    }

    if (isset($data->price)) {
        $updates[] = "prix = :price";
        $params[':price'] = $data->price;
    }

    if (isset($data->category)) {
        $stmt = $conn->prepare("SELECT idCategorie FROM categorie WHERE designation_Categorie = :category");
        $stmt->execute([':category' => $data->category]);
        $category = $stmt->fetch();
        
        if ($category) {
            $updates[] = "idCategorie = :categoryId";
            $params[':categoryId'] = $category['idCategorie'];
        }
    }

    if (isset($data->stock)) {
        $updates[] = "stock = :stock";
        $params[':stock'] = $data->stock;
    }

    if (isset($data->image)) {
        $updates[] = "image = :image";
        $params[':image'] = $data->image;
    }

    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "Aucune modification détectée"]);
        exit;
    }

    $sql = "UPDATE produit SET " . implode(", ", $updates) . " WHERE idProduit = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(["success" => true, "message" => "Produit mis à jour"]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erreur: " . $e->getMessage()]);
}
?>