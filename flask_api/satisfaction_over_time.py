from flask import Blueprint, jsonify
import mysql.connector
import pandas as pd
from datetime import datetime

satisfaction_bp = Blueprint('satisfaction', __name__)

def create_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="fleurs_cattleya",
        connect_timeout=10
    )

@satisfaction_bp.route('/api/satisfaction_over_time', methods=['GET'])
def satisfaction_over_time():
    try:
        conn = create_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT message, date_avis FROM avis WHERE date_avis IS NOT NULL"
        cursor.execute(query)
        rows = cursor.fetchall()
        
        if not rows:
            return jsonify({"message": "Aucune donnée disponible"}), 404

        df = pd.DataFrame(rows)
        df['message'] = df['message'].fillna('').astype(str)
        df['date_avis'] = pd.to_datetime(df['date_avis'], errors='coerce')
        df = df.dropna(subset=['date_avis'])

        def detect_sentiment(text):
            text = text.lower()
            pos_words = ['excellent', 'super', 'bien', 'merci', 'adoré', 'parfait']
            neg_words = ['mauvais', 'horrible', 'nul', 'déçu', 'problème']
            pos_count = sum(word in text for word in pos_words)
            neg_count = sum(word in text for word in neg_words)
            if pos_count > neg_count: return 'positif'
            if neg_count > pos_count: return 'négatif'
            return 'neutre'

        df['sentiment'] = df['message'].apply(detect_sentiment)
        df['mois'] = df['date_avis'].dt.to_period('M').astype(str)

        result = (
            df[df['sentiment'] == 'positif']
            .groupby('mois')
            .size()
            .reset_index(name='positifs')
            .to_dict('records')
        )

        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "error": "Erreur interne du serveur",
            "details": str(e)
        }), 500

    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()
