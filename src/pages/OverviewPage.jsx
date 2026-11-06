import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import TopProductsChart from "../components/overview/TopProductsChart";

const OverviewPage = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        newUsers: 0,
        totalProducts: 0,
        conversionRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_stats.php');
                setStats({
                    totalSales: response.data.total_sales,
                    totalProducts: response.data.total_products
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Tableau de bord' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1 }}
                >
                    <StatCard 
                        name='Total Sales' 
                        icon={Zap} 
                        value={loading ? '...' : `$${stats.totalSales.toLocaleString()}`} 
                        color='#6366F1' 
                    />
                    <StatCard 
                        name='Total Products' 
                        icon={ShoppingBag} 
                        value={loading ? '...' : stats.totalProducts.toLocaleString()} 
                        color='#EC4899' 
                    />
                </motion.div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SalesOverviewChart />
                    <CategoryDistributionChart />
                    <TopProductsChart />
                </div>
            </main>
        </div>
    );
};

export default OverviewPage;