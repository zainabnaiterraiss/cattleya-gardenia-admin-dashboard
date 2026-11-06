import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981"];

const TopProductsChart = () => {
    const [topProducts, setTopProducts] = useState([
        { name: "Chargement...", value: 0 },
        { name: "Chargement...", value: 0 },
        { name: "Chargement...", value: 0 },
        { name: "Chargement...", value: 0 }
    ]);

    const fetchTopProducts = async () => {
        try {
            const response = await axios.get("http://localhost/ADMIN_DASHBOARD_backend/get_top_products.php");
            // Vérifier que la réponse est bien un tableau
            if (Array.isArray(response.data)) {
                setTopProducts(response.data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des produits", error);
            setTopProducts([
                { name: "Erreur", value: 0 },
                { name: "Erreur", value: 0 },
                { name: "Erreur", value: 0 },
                { name: "Erreur", value: 0 }
            ]);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, []);

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Top 4 des Produits</h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.9)",
                                borderColor: "#4B5563",
                                borderRadius: "0.5rem"
                            }}
                            formatter={(value) => [`${value} unités`, "Quantité"]}
                        />
                        <Bar dataKey="value" name="Quantité vendue">
                            {topProducts.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default TopProductsChart;