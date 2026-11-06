import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";

const SalesTrendChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/get_sales.php")
      .then((response) => {
        // Vérification du statut de la réponse
        if (!response.ok) {
          throw new Error("Erreur réseau");
        }
        return response.json();
      })
      .then((data) => {
        // Vérification du contenu des données
        console.log(data);  // Affiche les données pour vérification

        const monthlySales = {};

        data.forEach((sale) => {
          const month = new Date(sale.date_achat).toLocaleString('default', { month: 'short' });

          // Additionne le montant des ventes par mois
          monthlySales[month] = (monthlySales[month] || 0) + parseFloat(sale.montant);
        });

        // Formate les données pour le graphique
        const formattedSalesData = Object.keys(monthlySales).map((month) => ({
          month,
          sales: monthlySales[month],
        }));

        // Mise à jour de l'état avec les données formatées
        setSalesData(formattedSalesData);
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error("Erreur lors du chargement des ventes :", error);
      });
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Tendance des Commandes</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='month' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line type='monotone' dataKey='sales' stroke='#8B5CF6' strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesTrendChart;
