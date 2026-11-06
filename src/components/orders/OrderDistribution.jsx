import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const OrderDistribution = () => {
  // État pour stocker les données de répartition des commandes
  const [orderStatusData, setOrderStatusData] = useState([]);

  // Effectuer une requête pour récupérer les données
  useEffect(() => {
	const fetchData = async () => {
	  try {
		const response = await axios.get("http://localhost/ADMIN_DASHBOARD_backend/get_daily_orders2.php");
		
		// Conversion des valeurs en nombres
		const updatedData = response.data.map(item => ({
		  name: item.name,
		  value: parseInt(item.value, 10)  // Conversion en nombre entier
		}));
		
		setOrderStatusData(updatedData);
	  } catch (error) {
		console.error("Erreur lors de la récupération des données", error);
	  }
	};
  
	fetchData();
  }, []);
   // L'effet se déclenche uniquement au premier rendu du composant

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Répartition du statut des commandes</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderDistribution;
