import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import axios from "axios"; // Assure-toi que axios est installé

const SalesOverviewChart = () => {
    // State pour stocker les données des ventes
    const [salesData, setSalesData] = useState([]);

    // Fonction pour récupérer les données depuis l'API PHP
    const fetchSalesData = async () => {
        try {
            const response = await axios.get("http://localhost/ADMIN_DASHBOARD_backend/get_sales_data.php");
            setSalesData(response.data); // Met à jour l'état avec les données récupérées
        } catch (error) {
            console.error("Erreur lors de la récupération des données", error);
        }
    };

    // Appel de la fonction pour récupérer les données au chargement du composant
    useEffect(() => {
        fetchSalesData();
    }, []);

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Analyse des Ventes</h2>

            <div className="h-80">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey={"name"} stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#6366F1"
                            strokeWidth={3}
                            dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default SalesOverviewChart;
