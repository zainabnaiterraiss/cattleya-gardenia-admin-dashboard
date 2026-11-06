import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const SalesByCategoryChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching data...");
                const response = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_sales_by_category.php');
                console.log("Response received:", response);

                if (response.data && Array.isArray(response.data)) {
                    // Convertir les valeurs 'value' en nombres
                    const validData = response.data.map(item => ({
                        name: item.name,
                        value: parseFloat(item.value) || 0 // Convertir en nombre, ou 0 si conversion échoue
                    }));

                    if (validData.length > 0) {
                        setData(validData);
                        console.log("Data set:", validData);
                    } else {
                        console.error("Invalid data format:", response.data);
                    }
                } else {
                    console.error("Invalid data format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                console.log("Loading complete");
            }
        };

        fetchData();
    }, []);

    // Définir les couleurs pour chaque segment du graphique
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>
                {loading ? "Chargement..." : "Ventes par Catégorie"}
            </h2>

            <div style={{ width: "100%", height: 300 }}>
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Chargement des données...
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx='50%'
                                cy='50%'
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='value'
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
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
                )}
            </div>
        </motion.div>
    );
};

export default SalesByCategoryChart;
