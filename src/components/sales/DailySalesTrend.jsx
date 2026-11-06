import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const DailySalesTrend = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching data...");
                const response = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_ventes_quotidiennes.php');
                console.log("Response received:", response);

                if (response.data && Array.isArray(response.data)) {
                    // Convertir les valeurs 'sales' en nombres, si nécessaire
                    const validData = response.data.map(item => ({
                        name: item.name,
                        sales: parseFloat(item.sales) || 0, // Conversion en nombre
                    }));

                    setData(validData);
                    console.log("Data set:", validData);
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

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>
                {loading ? "Chargement..." : "Daily Sales Trend"}
            </h2>

            <div style={{ width: "100%", height: 300 }}>
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Chargement des données...
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                            <XAxis dataKey='name' stroke='#9CA3AF' />
                            <YAxis stroke='#9CA3AF' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                                    borderColor: "#4B5563",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                            />
                            <Bar dataKey='sales' fill='#10B981' />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default DailySalesTrend;
