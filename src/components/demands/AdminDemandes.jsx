import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les demandes depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await axios.get('/api/traiter_demandes');
        const data = response.data;

        // Vérifie que 'demandes' est un tableau
        if (Array.isArray(data.demandes)) {
          setDemandes(data.demandes);
        } else {
          console.warn("La clé 'demandes' n'est pas un tableau :", data);
          setDemandes([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes", error);
        setDemandes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  // Fonction pour lancer un autre traitement


  return (
    <div className="admin-demandes">
      <h2>Demandes d'aménagement</h2>

      {loading ? (
        <p>Chargement des demandes...</p>
      ) : demandes.length === 0 ? (
        <p>Aucune demande à afficher.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom Client</th>
              <th>Ville</th>
              <th>Type de Service</th>
              <th>État</th>
              <th>Température</th>
              <th>Météo</th>
              <th>Pluie</th>
              <th>Faisable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande.id}>
                <td>{demande.id}</td>
                <td>{demande.nom_client || 'N/A'}</td>
                <td>{demande.ville || 'N/A'}</td>
                <td>{demande.type_service || 'N/A'}</td>
                <td>{demande.etat_demande || 'N/A'}</td>
                <td>{demande.temperature !== null ? `${demande.temperature}°C` : 'N/A'}</td>
                <td>{demande.condition_meteo || 'N/A'}</td>
                <td>{demande.pluie !== null ? demande.pluie : 'N/A'}</td>
                <td>{demande.faisable ? 'Oui' : 'Non'}</td>
                <td>
                  {demande.etat_demande === 'non traité' && (
                    <button onClick={() => handleLancerTraitement(demande.id)}>
                      Lancer le traitement
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDemandes;
