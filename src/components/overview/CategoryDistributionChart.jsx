import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#F43F5E", "#0EA5E9"];

const CategoryDistributionChart = () => {
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Charger les produits
    fetch("http://localhost/ADMIN_DASHBOARD_backend/get_products.php")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        // Regrouper les produits par catégorie
        const categoryCount = {};
        data.forEach((product) => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });

        // Transformer en tableau pour le graphique
        const formattedData = Object.keys(categoryCount).map((category) => ({
          name: category,
          value: categoryCount[category],
        }));

        setCategoryData(formattedData);
      })
      .catch((error) => console.error("Erreur lors du chargement des produits :", error));
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Répartition par catégorie</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
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

export default CategoryDistributionChart;
