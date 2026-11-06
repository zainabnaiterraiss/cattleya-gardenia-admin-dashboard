def verifier_adequation_service(meteo, sol, service, vent=None):
    """
    Évalue l'adéquation entre le service demandé et les conditions météo/sol/vent.
    Le vent est optionnel, en km/h.
    """

    meteo = meteo.lower()
    sol = sol.lower()
    service = service.lower()
    vent = vent or 0  

    VENT_FORT = 30  # km/h

    # Plantation
    if service == "plantation":
        if sol == "détrempé":
            return (False, " Plantation non recommandée : sol détrempé.")
        elif sol == "sec":
            return (False, " Plantation déconseillée : sol trop sec.")
        elif meteo == "pluie":
            return (False, "Plantation difficile sous la pluie.")
        elif vent >= VENT_FORT:
            return (False, f" Plantation risquée : vent fort ({vent:.1f} km/h).")
        else:
            return (True, "Plantation possible.")

    # Traitement
    elif "traitement" in service:
        if meteo in ["pluie", "vent"] or vent >= VENT_FORT:
            return (False, f" Traitement inefficace ou risqué par vent/pluie ({vent:.1f} km/h).")
        elif sol == "détrempé":
            return (False, " Sol saturé, traitement inefficace.")
        else:
            return (True, "Traitement possible.")

    # Entretien
    elif "entretien" in service:
        if meteo == "canicule":
            return (False, " Entretien déconseillé par forte chaleur.")
        elif sol == "détrempé":
            return (False, " Sol trop mouillé pour entretien.")
        elif vent >= VENT_FORT:
            return (False, f" Entretien difficile par vent fort ({vent:.1f} km/h).")
        else:
            return (True, "Entretien possible.")

    # Arrosage
    elif "arrosage" in service:
        if sol == "détrempé" or meteo == "pluie":
            return (False, " Arrosage inutile.")
        else:
            return (True, "Arrosage recommandé.")

    # Aménagement paysager
    elif "aménagement" in service:
        if sol == "détrempé":
            return (False, " Sol détrempé, travaux d'aménagement déconseillés.")
        elif meteo == "pluie":
            return (False, " Travaux difficiles sous la pluie.")
        elif vent >= VENT_FORT:
            return (False, f" Aménagement risqué par vent fort ({vent:.1f} km/h).")
        else:
            return (True, "Aménagement possible.")

    else:
        return (False, "Service inconnu.")
