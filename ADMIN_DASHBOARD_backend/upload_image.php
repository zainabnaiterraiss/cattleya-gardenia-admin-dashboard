<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

// Gérer la requête OPTIONS pour le prévol
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration
$uploadDir = '../public/uploads/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Vérification du dossier d'upload
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        echo json_encode([
            'success' => false,
            'message' => 'Impossible de créer le dossier d\'upload'
        ]);
        exit;
    }
}

// Vérification du fichier
if (empty($_FILES['image'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Aucun fichier reçu'
    ]);
    exit;
}

$file = $_FILES['image'];

// Validation
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode([
        'success' => false,
        'message' => 'Type de fichier non autorisé'
    ]);
    exit;
}

if ($file['size'] > $maxFileSize) {
    echo json_encode([
        'success' => false,
        'message' => 'Le fichier est trop volumineux (max 5MB)'
    ]);
    exit;
}

// Génération d'un nom de fichier unique
$fileName = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9\.\-_]/', '', $file['name']);
$targetPath = $uploadDir . $fileName;

// Déplacement du fichier
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        'success' => true,
        'fileName' => '/' . $fileName,
        'filePath' => $targetPath
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'upload du fichier'
    ]);
}
?>