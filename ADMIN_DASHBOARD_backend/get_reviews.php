<?php
header("Access-Control-Allow-Origin: *"); // Autorise toutes les origines
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fleurs_cattleya";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Échec connexion: " . $conn->connect_error]));
}

$sql = "SELECT avis.idAvis, avis.message, client.nom_Client ,date_avis, avis_etat FROM avis
JOIN client ON avis.idClient = client.idClient;";

$result = $conn->query($sql);
$reviews = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            "id" => (int)$row["idAvis"],
            "name" => $row["nom_Client"],
            "date" => $row["date_avis"],
            "message" => $row["message"],
            "status" => $row["avis_etat"] === "Publie" ? "Publiée" : "En attente"
        ];
    }
}

echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
