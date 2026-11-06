# traitement.py
import pandas as pd
import requests
from sqlalchemy import create_engine
from regles_services import verifier_adequation_service
from concurrent.futures import ThreadPoolExecutor, as_completed

def executer_traitement():
    engine = create_engine('mysql+mysqlconnector://root:@localhost/fleurs_cattleya')
    API_KEY = "c426a20395e69571b3912259cad7eb3d"
    BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

    def get_meteo(ville):
        try:
            params = {"q": ville, "appid": API_KEY, "units": "metric", "lang": "fr"}
            response = requests.get(BASE_URL, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                condition = data["weather"][0]["description"].lower()
                temp = data["main"]["temp"]
                pluie = data.get("rain", {}).get("1h", 0.0)
                vent = data.get("wind", {}).get("speed", 0.0) * 3.6
                if "pluie" in condition or pluie > 0:
                    meteo = "pluie"
                elif "orage" in condition or vent >= 30:
                    meteo = "vent"
                elif temp >= 35:
                    meteo = "canicule"
                else:
                    meteo = "sec"
                return ville, (meteo, temp, pluie, vent)
        except Exception as e:
            print(f"Erreur météo pour {ville} : {e}")
        return ville, (None, None, None, None)

    # Lire données
    df_demande = pd.read_sql("SELECT * FROM demande", engine)
    df_client = pd.read_sql("SELECT idClient, nom_Client, prenom_Client, email_Client, telephone_Client FROM client", engine)
    df = pd.merge(df_demande, df_client, on="idClient")

    # Appels parallèles
    villes = df["ville"].unique()
    meteo_par_ville = {}

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(get_meteo, ville): ville for ville in villes}
        for future in as_completed(futures):
            ville, data = future.result()
            meteo_par_ville[ville] = data

    # Traitement
    resultats = []
    for _, row in df.iterrows():
        ville = row["ville"]
        condition_meteo, temp, pluie, vent = meteo_par_ville.get(ville, (None, None, None, None))

        if condition_meteo is None:
            continue

        etat_sol = row["etat_espace"].lower()
        service = row["type_service"].lower()

        faisable, justification = verifier_adequation_service(condition_meteo, etat_sol, service, vent)

        resultats.append({
            "idDemande": row["idDemande"],
            "idClient": row["idClient"],
            "nom_Client": row["nom_Client"],
            "prenom_Client": row["prenom_Client"],
            "email_Client": row["email_Client"],
            "telephone_Client": row["telephone_Client"],
            "ville": ville,
            "type_service": row["type_service"],
            "type_espace": row["type_espace"],
            "etat_espace": row["etat_espace"],
            "condition_meteo": condition_meteo,
            "temperature": temp,
            "pluie": pluie,
            "vent": vent,
            "faisable_pred": "Oui" if faisable else "Non"
        })

    df_resultat = pd.DataFrame(resultats)
    df_resultat.to_csv("rapport_services_paysagers.csv", index=False, encoding="utf-8-sig")
    return "✅ Rapport généré avec succès"