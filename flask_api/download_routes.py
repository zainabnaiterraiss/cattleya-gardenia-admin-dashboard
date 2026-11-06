from flask import Blueprint, send_file
from flask_cors import cross_origin
import os

# Créer le Blueprint en premier
download_routes = Blueprint('download_routes', __name__)

# Ensuite seulement vous pouvez l'utiliser comme décorateur
@download_routes.route('/demandes', methods=['GET'])
@cross_origin(origin='http://localhost:5173')
def get_demandes():
    filepath = 'rapport_services_paysagers.csv'
    if os.path.exists(filepath):
        return send_file(
            filepath, 
            mimetype='text/csv', 
            as_attachment=True,
            headers={
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET'
            }
        )
    else:
        return "Le fichier n'existe pas.", 404