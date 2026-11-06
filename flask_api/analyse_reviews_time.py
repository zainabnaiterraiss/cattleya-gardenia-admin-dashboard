# analyse_reviews_time.py
from flask import Blueprint, jsonify
import mysql.connector
import pandas as pd

analyse_reviews_time_bp = Blueprint('analyse_reviews_time', __name__)

@analyse_reviews_time_bp.route('/analyse_reviews_time', methods=['GET'])
def analyse_reviews_time():
    # Connexion à la base de données MySQL
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="fleurs_cattleya"
    )

    # Récupération des avis avec date
    query = "SELECT message, date_avis FROM avis"
    df = pd.read_sql(query, conn)
    conn.close()

    # Détection du sentiment
    def detect_sentiment(text):
        text = text.lower()
        positive_keywords = ['excellent', 'super', 'bien', 'merci', 'adoré', 'parfait', 'rapide', 'génial']
        negative_keywords = ['mauvais', 'horrible', 'nul', 'retard', 'déçu', 'problème', 'lent', 'jamais']

        if any(word in text for word in positive_keywords):
            return 'positif'
        elif any(word in text for word in negative_keywords):
            return 'négatif'
        else:
            return 'neutre'

    df['sentiment'] = df['message'].apply(detect_sentiment)
    df['date_avis'] = pd.to_datetime(df['date_avis'])

    # Grouper par date et sentiment
    sentiment_by_date = df.groupby([df['date_avis'].dt.date, 'sentiment']).size().unstack(fill_value=0).reset_index()

    # Réorganiser les données
    result = []
    for _, row in sentiment_by_date.iterrows():
        result.append({
            "date": str(row['date_avis']),
            "sentiments": {
                "positif": int(row.get("positif", 0)),
                "négatif": int(row.get("négatif", 0)),
                "neutre": int(row.get("neutre", 0))
            }
        })

    return jsonify(result)
