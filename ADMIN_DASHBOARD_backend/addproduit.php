<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Connexion à la base de données
$host = "localhost";
$database = "fleurs_cattleya";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupération des données du formulaire
    $nom = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';
    $prix = $_POST['price'] ?? '';
    $stock = $_POST['stock'] ?? '';
    $categorie = $_POST['category'] ?? '';

    // Vérifier que tous les champs sont remplis
    if (empty($nom) || empty($description) || empty($prix) || empty($stock) || empty($categorie)) {
        echo json_encode(["success" => false, "message" => "Tous les champs sont requis."]);
        exit;
    }

    // Récupérer l'ID de la catégorie à partir de sa désignation
    $stmt = $conn->prepare("SELECT idCategorie FROM categorie WHERE designation_Categorie = :cat");
    $stmt->execute([':cat' => $categorie]);
    $cat = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cat) {
        echo json_encode(["success" => false, "message" => "Catégorie introuvable"]);
        exit;
    }

    $idCategorie = $cat['idCategorie'];

    // ====> Gestion de l'image
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        // Nettoyer le nom de la catégorie pour l'utiliser comme dossier
        $cleanCategory = preg_replace('/[^a-zA-Z0-9_-]/', '_', $categorie);
        $uploadDir = "image/$cleanCategory/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $filename;

        // Vérifier si le fichier existe déjà
        if (!file_exists($targetPath)) {
            if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                echo json_encode(["success" => false, "message" => "Échec du téléchargement de l'image."]);
                exit;
            }
        }

        $image = $targetPath;
    } else {
        echo json_encode(["success" => false, "message" => "Image non envoyée ou invalide."]);
        exit;
    }

    // Insérer le produit
    $stmt = $conn->prepare("INSERT INTO produit (nom_Produit, prix, description, stock, image, idCategorie)
                            VALUES (:nom, :prix, :description, :stock, :image, :idCategorie)");
    $stmt->execute([
        ':nom' => $nom,
        ':prix' => $prix,
        ':description' => $description,
        ':stock' => $stock,
        ':image' => $image,
        ':idCategorie' => $idCategorie
    ]);

    $idProduit = $conn->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Produit ajouté avec succès",
        "idProduit" => $idProduit
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'ajout du produit : " . $e->getMessage()
    ]);
}
?>
