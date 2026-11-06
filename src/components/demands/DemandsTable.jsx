import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import {
  User, Phone, Mail, MapPin, TreePine,
  Sun, Cloud, CloudRain, CloudLightning, CloudSnow,
  Send
} from 'lucide-react';

const getMeteoIcon = (condition) => {
  const icons = {
    "ensoleillé": <Sun className="text-yellow-400" />,
    "nuageux": <Cloud className="text-gray-300" />,
    "pluvieux": <CloudRain className="text-blue-400" />,
    "orageux": <CloudLightning className="text-purple-500" />,
    "neigeux": <CloudSnow className="text-blue-200" />
  };
  return icons[condition?.toLowerCase()] || <Sun className="text-gray-400" />;
};

const DemandsTable = () => {
  const [demands, setDemands] = useState([]);
  const [filterVille, setFilterVille] = useState('');
  const [filterService, setFilterService] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/demandes')
      .then(response => {
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filtered = results.data.filter(item => item.idDemande);
            setDemands(filtered);
          },
        });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  }, []);







    const fetchDemandes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/demandes');
      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const filtered = results.data.filter(item => item.idDemande);
          setDemands(filtered);
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };





const envoyerEmail = async (email, prenom, idDemande) => {
  try {
    await axios.post('http://localhost:5000/notifier', { email, prenom, idDemande });
    alert(`Email envoyé à ${prenom}`);
    fetchDemandes(); // <--- recharge les données après mise à jour
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    alert("Erreur lors de l'envoi de l'email.");
  }
};


const handleRelancer = async () => {
  setLoading(true);
  setMessage(null);
  try {
    const response = await axios.post('http://localhost:5000/relancer-traitement');
    setMessage(response.data.message);

    // 🔁 Recharger les données CSV après traitement
    const csvResponse = await axios.get('http://localhost:5000/demandes');
    Papa.parse(csvResponse.data, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const filtered = results.data.filter(item => item.idDemande);
        setDemands(filtered);
      },
    });

  } catch (error) {
    setMessage(error.response?.data?.message || "Erreur inconnue");
  } finally {
    setLoading(false);
  }
};



  const filteredDemands = demands
    .filter(d => (filterVille ? d.ville === filterVille : true))
    .filter(d => (filterService ? d.type_service === filterService : true));












  return (
   

      <div className="bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl p-6 shadow-xl text-white">
      <h2 className="text-xl font-semibold mb-4 text-white">Liste des demandes</h2>

      {/* Message d’état */}
      {message && (
        <div className={`mb-4 px-4 py-2 rounded text-sm font-medium 
          ${message.includes("Erreur") || message.includes("❌") 
            ? "bg-red-500 text-white" 
            : "bg-green-600 text-white"}`}>
          {message}
        </div>
      )}

      {/* Bouton + Filtres */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <button
          onClick={handleRelancer}
          disabled={loading}
          className={`px-4 py-2 rounded text-sm text-white transition 
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
        >
          🔄 {loading ? "Traitement..." : "Relancer le traitement"}
        </button>

        {/* Filtres */}
        <div className="flex gap-4">
          <select
            value={filterVille}
            onChange={(e) => setFilterVille(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Filtrer par ville --</option>
            {[...new Set(demands.map((d) => d.ville))].map((ville) => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Filtrer par service --</option>
            {[...new Set(demands.map((d) => d.type_service))].map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          {(filterVille || filterService) && (
            <button
              onClick={() => {
                setFilterVille('');
                setFilterService('');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>






      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {['Client', 'Contact', 'Localisation', 'Service', 'Espace', 'Météo', 'Faisabilité', 'Action'].map(header => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredDemands.length > 0 ? (
              filteredDemands.map((demand) => (
                <tr key={demand.idDemande} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-full">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-100">
                          {demand.prenom_Client} {demand.nom_Client}
                        </div>
                        <div className="text-sm text-gray-400">{demand.email_Client}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-400" />
                      {demand.telephone_Client}
                    </div>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2 text-blue-400" />
                      {demand.email_Client}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                      {demand.ville}

                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200 font-medium">
                    {demand.type_service}
                    
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
  <div className="flex items-center">
    <TreePine className="h-4 w-4 mr-2 text-green-500" />
    <span>{demand.type_espace}</span>
  </div>
  <div className="text-xs text-gray-400 mt-1">
    vent: {parseFloat(demand.vent).toFixed(1)} Km/h
  </div>
</td>


                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex items-center space-x-2">
                      {getMeteoIcon(demand.condition_meteo)}
                      <div>
                        <div className="text-sm text-gray-100">
                          {demand.condition_meteo}
                        </div>
                        <div className="text-xs text-gray-400">
                          {parseFloat(demand.temperature).toFixed(1)}°C, pluie: {parseFloat(demand.pluie).toFixed(1)} mm
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-4 font-medium rounded-full
                      ${demand.faisable_pred.toLowerCase() === "oui" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      Prédiction: {demand.faisable_pred}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    <button
                      onClick={() => envoyerEmail(demand.email_Client, demand.prenom_Client,demand.idDemande)}
                      className="flex items-center px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-400 text-xs"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Notifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-400">
                  Aucune demande disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandsTable;
