import requests

url = 'http://127.0.0.1:5000/api/process'  # Assure-toi que c'est la bonne URL

# Ouvre le fichier PDF à envoyer (vérifie que le fichier existe à ce chemin)
files = {'files': open('C:/xampp/htdocs/pfe_fin/Demande_Service_N7.pdf', 'rb')}

# Effectue la requête POST vers ton API Flask
response = requests.post(url, files=files)

# Affiche la réponse brute (en texte) pour mieux comprendre ce qui se passe
print("Réponse brute:", response.text)

# Essaye de convertir la réponse en JSON si possible
try:
    print("Réponse JSON:", response.json())  # Affiche la réponse du serveur si elle est en JSON
except Exception as e:
    print("Erreur lors de la conversion en JSON:", str(e))

# N'oublie pas de fermer le fichier après l'avoir utilisé
files['files'].close()
