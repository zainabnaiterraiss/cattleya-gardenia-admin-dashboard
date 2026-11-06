<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");  // Allow the frontend's origin
header("Access-Control-Allow-Credentials: true");              // Allow credentials (cookies, headers)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");    // Allow methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers


// Simulation pour le test (à retirer en production)
$_SESSION['email_Client'] = 'zainabnaiterraiss@gmail.com';
phpinfo();
// Vérifie que l’email admin est défini
if (!isset($_SESSION['email_Client'])) {
    echo json_encode(["error" => "Admin non connecté"]);
    exit;
}

$admin_email = $_SESSION['email_Client'];

// Connexion à la boîte mail via IMAP
$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';
$username = $admin_email;
$password = 'mot_de_passe_admin'; // ⚠️ Protéger ce mot de passe !

$inbox = @imap_open($hostname, $username, $password);

if (!$inbox) {
    echo json_encode(["error" => "Impossible de se connecter à la boîte mail"]);
    exit;
}

// Récupération des emails non lus
$emails = imap_search($inbox, 'UNSEEN');

imap_close($inbox);

$response = [
    "email" => $admin_email,
    "has_new_email" => !empty($emails)
];

echo json_encode($response);
