from flask import Blueprint, jsonify
import mysql.connector
import pandas as pd

analyse_reviews_bp = Blueprint('analyse_reviews', __name__)

@analyse_reviews_bp.route('/analyse_reviews', methods=['GET'])
def analyse_reviews():
    # Connexion à MySQL
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="fleurs_cattleya"
    )
    query = "SELECT message FROM avis"
    df = pd.read_sql(query, conn)
    conn.close()

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

    # Compter le nombre de chaque type
    total = len(df)
    sentiment_counts = df['sentiment'].value_counts().to_dict()

    # Convertir en pourcentage
    result = {
        'positif': round(sentiment_counts.get('positif', 0) / total * 100, 2),
        'négatif': round(sentiment_counts.get('négatif', 0) / total * 100, 2),
        'neutre': round(sentiment_counts.get('neutre', 0) / total * 100, 2)
    }

    return jsonify(result)
