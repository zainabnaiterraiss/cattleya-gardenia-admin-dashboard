import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const SalesOverviewChart = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState("This Year");
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_sales_data.php');
                
                if (response.data && Array.isArray(response.data)) {
                    // Formater les données pour le graphique
                    const formattedData = response.data.map(item => ({
                        month: item.month,
                        sales: item.sales
                    }));
                    setSalesData(formattedData);
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
                // Données de démo en cas d'erreur
                setSalesData([
                    { month: "Jan", sales: 4000 },
                    { month: "Feb", sales: 3000 },
                    { month: "Mar", sales: 5000 },
                    { month: "Apr", sales: 4500 },
                    { month: "May", sales: 6000 },
                    { month: "Jun", sales: 5500 },
                    { month: "Jul", sales: 7000 },
                    { month: "Aug", sales: 6500 },
                    { month: "Sep", sales: 8000 },
                    { month: "Oct", sales: 7500 },
                    { month: "Nov", sales: 9000 },
                    { month: "Dec", sales: 8500 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    const filterDataByTimeRange = () => {
        switch(selectedTimeRange) {
            case "This Week":
                return salesData.slice(0, 1); // Exemple
            case "This Month":
                return salesData.slice(0, 1); // Exemple
            case "This Quarter":
                return salesData.slice(0, 3); // Exemple
            default:
                return salesData; // Toutes les données
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>
                    {loading ? "Chargement..." : "Aperçu des Ventes"}
                </h2>

                <select
                    className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                    <option value="This Week">Cette Semaine</option>
                    <option value="This Month">Ce Mois</option>
                    <option value="This Quarter">Ce Trimestre</option>
                    <option value="This Year">Cette Année</option>
                </select>
            </div>

            <div className='w-full h-80'>
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Chargement des données...
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <AreaChart data={filterDataByTimeRange()}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                            <XAxis 
                                dataKey='month' 
                                stroke='#9CA3AF'
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <YAxis 
                                stroke='#9CA3AF'
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: "rgba(31, 41, 55, 0.9)", 
                                    borderColor: "#4B5563",
                                    borderRadius: "0.5rem"
                                }}
                                formatter={(value) => [`${value} €`, "Ventes"]}
                                labelStyle={{ color: "#E5E7EB", fontWeight: "bold" }}
                            />
                            <Area 
                                type='monotone' 
                                dataKey='sales' 
                                stroke='#8B5CF6' 
                                fill='#8B5CF6' 
                                fillOpacity={0.3}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default SalesOverviewChart;