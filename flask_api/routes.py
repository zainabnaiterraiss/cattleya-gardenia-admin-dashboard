from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text  # <-- Import SQLAlchemy pour la base de données

load_dotenv()

notifier_bp = Blueprint('notifier_bp', __name__)

# Configuration base de données
engine = create_engine('mysql+mysqlconnector://root:@localhost/fleurs_cattleya')

@notifier_bp.route('/notifier', methods=['POST', 'OPTIONS'])
def notifier():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        recipient = data.get('email')
        prenom = data.get('prenom')
        idDemande = data.get('idDemande')  # <- Récupération de l’ID

        if not recipient or not prenom or not idDemande:
            return jsonify({'error': 'Données manquantes'}), 400

        # Contenu de l’email
        message = f"""
Bonjour {prenom},

Votre demande a été traitée avec succès.
Notre équipe se connectera avec vous dans les plus brefs délais pour planifier l’intervention.

Merci de votre confiance.

Cordialement,
L'équipe Espaces Verts
"""
        msg = MIMEText(message)
        msg['Subject'] = 'Mise à jour de votre demande'
        msg['From'] = os.getenv('EMAIL_ADMIN')
        msg['To'] = recipient

        # Envoi de l’e-mail
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(os.getenv('EMAIL_ADMIN'), os.getenv('EMAIL_PASSWORD'))
            server.send_message(msg)

        # ✅ Mise à jour de l’état dans la base de données
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE demande SET etat = :etat WHERE idDemande = :id"),
                {"etat": "traitee", "id": idDemande}
            )
            conn.commit()

        return jsonify({'message': 'Email envoyé avec succès et état mis à jour'}), 200

    except Exception as e:
        print("Erreur serveur :", e)
        return jsonify({'error': str(e)}), 500
