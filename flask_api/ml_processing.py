import pandas as pd
from sqlalchemy import create_engine
from geopy.geocoders import Nominatim
import requests
import time
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
import matplotlib.pyplot as plt
from datetime import timedelta
import os

# 1. Connexion à la base de données
engine = create_engine('mysql+mysqlconnector://root:@localhost/fleurs_cattleya')

# 2. Lecture des données
print("Lecture des données...")
df_demande = pd.read_sql("SELECT * FROM demande", engine)
df_client = pd.read_sql("""
    SELECT idClient, nom_Client, prenom_Client, email_Client, telephone_Client, adresse_Client
    FROM client
""", engine)

print(f"Nombre de demandes initiales: {len(df_demande)}")
print(f"Nombre de clients: {len(df_client)}")

# 3. Fusion et nettoyage
df = pd.merge(df_demande, df_client, on="idClient", how="left")
essential_cols = ['ville', 'type_service', 'type_espace', 'etat_espace']
df = df.dropna(subset=essential_cols)

print(f"\nNombre de demandes valides après nettoyage: {len(df)}")

if len(df) < 5:
    print("\nATTENTION: Pas assez de données pour entraîner un modèle fiable!")
    exit()

# 4. Nettoyage des colonnes texte
for col in ['type_service', 'type_espace', 'etat_espace']:
    df[col] = df[col].astype(str).str.lower().str.strip()

# 5. Simulation météo (à remplacer par API si dispo)
df['condition_meteo'] = 'Clear'
df['temperature'] = 22
df['pluie'] = 0

# 6. Enrichissement faisabilité & date préférée
def enrichir_ligne(row):
    temp_fav = 15 <= row['temperature'] <= 30
    service_faisable = False

    if row['pluie'] > 0:
        service_faisable = False
    elif row['type_service'] == 'jardinage' and row['pluie'] == 0:
        service_faisable = True
    elif row['type_service'] == 'nettoyage extérieur' and row['condition_meteo'] == 'Clear':
        service_faisable = True

    date_base = pd.to_datetime(row['date_demande'])
    date_pref = date_base + timedelta(days=2 if service_faisable else 7)
    faisable = 1 if temp_fav and service_faisable else 0

    return pd.Series({
        'faisable': faisable,
        'date_preference': date_pref
    })

df[['faisable', 'date_preference']] = df.apply(enrichir_ligne, axis=1)

# 7. Encodage
df['temperature'] = pd.to_numeric(df['temperature'], errors='coerce')
df['pluie'] = pd.to_numeric(df['pluie'], errors='coerce')

label_cols = ['type_service', 'type_espace', 'etat_espace', 'condition_meteo']
for col in label_cols:
    df[col] = LabelEncoder().fit_transform(df[col])

# 8. Modèle
features = ['condition_meteo', 'temperature', 'pluie', 'type_service', 'type_espace', 'etat_espace']
X = df[features]
y = df['faisable']

if len(df) >= 10:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    print("\nPerformance sur le jeu de test:")
    print(classification_report(y_test, y_pred))
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
else:
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    scores = cross_val_score(model, X, y, cv=min(5, len(df)))
    print(f"\nValidation croisée Accuracy moyenne : {scores.mean():.2f}")
    model.fit(X, y)

# 9. Importance des features
importances = pd.Series(model.feature_importances_, index=features)
print("\nImportance des variables:")
print(importances.sort_values(ascending=False))

importances.sort_values().plot.barh()
plt.title("Importance des caractéristiques")
plt.tight_layout()
plt.show()

# 10. Prédiction
df['faisable_pred'] = model.predict(X)

# 11. Colonnes pour export
colonnes_finales = [
    'idDemande', 'idClient', 'nom_Client', 'prenom_Client', 'email_Client', 'telephone_Client',
    'ville', 'type_service', 'type_espace', 'etat_espace',
    'condition_meteo', 'temperature', 'pluie',
    'faisable_pred', 'date_preference'
]

df_final = df[[col for col in colonnes_finales if col in df.columns]].copy()

# Conversion de date_preference en format lisible
df_final['date_preference'] = pd.to_datetime(df_final['date_preference']).dt.strftime('%Y-%m-%d')

# 12. Sauvegarde CSV
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demandes_avec_predictions.csv")

try:
    df_final.to_csv(output_path, index=False)
    print(f"\n✅ Fichier CSV correctement généré : {output_path}")
except Exception as e:
    print(f"\n❌ Erreur lors de l’écriture du CSV : {e}")

    
from sklearn.metrics import roc_curve, auc, classification_report, accuracy_score
import matplotlib.pyplot as plt

# 1. Prédiction avec le modèle
y_pred = model.predict(X_test)  # Prédiction des classes
y_prob = model.predict_proba(X_test)  # Probabilités pour chaque classe

# Vérification de la forme des probabilités pour éviter l'erreur d'index
print("Shape of y_prob:", y_prob.shape)

# Si le modèle prédit bien 2 classes, y_prob doit avoir 2 colonnes
if y_prob.shape[1] == 2:  # Cas binaire
    # Prendre la probabilité de la classe positive (1)
    y_prob_positive = y_prob[:, 1]
else:
    # Si le modèle retourne une seule probabilité, utilisez la probabilité de la classe 0 ou 1
    y_prob_positive = y_prob[:, 0]  # Ici, ajustez en fonction du comportement de votre modèle

# 2. Calcul de la courbe ROC
fpr, tpr, thresholds = roc_curve(y_test, y_prob_positive)
roc_auc = auc(fpr, tpr)

# 3. Affichage de la courbe ROC
plt.figure()
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend(loc="lower right")
plt.show()

# 4. Affichage du rapport de classification
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 5. Affichage de l'accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
