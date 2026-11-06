<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');


$serveur = "localhost";
$utilisateur = "root";
$motdepasse = "";
$basededonnees = "fleurs_cattleya";

// Seuil minimum de dépense pour être considéré comme fidèle (en dollars)
$seuil_fidelite = 10;

$connexion = new mysqli($serveur, $utilisateur, $motdepasse, $basededonnees);

if ($connexion->connect_error) {
    die(json_encode([
        'clients_totaux' => 0,
        'clients_fideles' => 0
    ]));
}

// Requête pour le nombre total de clients
$requete_totale = "SELECT COUNT(*) AS total FROM client";
$resultat_total = $connexion->query($requete_totale);
$clients_totaux = $resultat_total->fetch_assoc()['total'] ?? 0;

// Requête pour les clients fidèles (ayant dépensé plus que le seuil)
$requete_fideles = "SELECT COUNT(DISTINCT c.idClient) AS fideles
                   FROM client c
                   JOIN commande co ON c.idClient = co.idClient
                   GROUP BY c.idClient
                   HAVING SUM(co.montant) > ?";

$declaration = $connexion->prepare($requete_fideles);
$declaration->bind_param("d", $seuil_fidelite);
$declaration->execute();
$resultat_fideles = $declaration->get_result();
$clients_fideles = $resultat_fideles->fetch_assoc()['fideles'] ?? 0;

$connexion->close();

echo json_encode([
    'clients_totaux' => (int)$clients_totaux,
    'clients_fideles' => (int)$clients_fideles
]);
?>