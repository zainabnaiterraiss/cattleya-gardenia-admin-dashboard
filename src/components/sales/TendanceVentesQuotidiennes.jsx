import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const TendanceVentesMensuelles = () => {
    const [donneesVentes, setDonneesVentes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                const reponse = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_ventes_mensuelles.php');
                
                // Validation des données
                if (reponse.data && Array.isArray(reponse.data)) {
                    const donneesValides = reponse.data
                        .filter(item => item.mois && typeof item.ventes === 'number')
                        .map(item => ({
                            mois: item.mois,
                            ventes: parseFloat(item.ventes) || 0
                        }));
                    
                    // S'assurer d'avoir tous les mois
                    const moisComplets = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
                    const donneesCompletees = moisComplets.map(mois => {
                        const trouve = donneesValides.find(d => d.mois === mois);
                        return trouve || { mois, ventes: 0 };
                    });

                    setDonneesVentes(donneesCompletees);
                }
            } catch (erreur) {
                console.error("Erreur de chargement:", erreur);
                // Données de secours
                setDonneesVentes(
                    ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
                        .map(mois => ({ mois, ventes: 0 }))
                );
            } finally {
                setChargement(false);
            }
        };

        chargerDonnees();
    }, []);

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
                {chargement ? "Chargement..." : "Ventes par Mois"}
            </h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={donneesVentes}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis 
                            dataKey="mois" 
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            stroke="#9CA3AF"
                            label={{ 
                                value: 'Montant (€)', 
                                angle: -90, 
                                position: 'insideLeft',
                                fill: '#9CA3AF'
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.9)",
                                borderColor: "#4B5563",
                                borderRadius: "0.5rem"
                            }}
                            formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, "Ventes"]}
                            labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Bar
                            dataKey="ventes"
                            name="Ventes"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default TendanceVentesMensuelles;