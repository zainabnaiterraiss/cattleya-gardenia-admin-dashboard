import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import ProductsTable from "../components/products/ProductsTable";

const ProductsPage = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        topSelling: 0,
        lowStock: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_products_stats.php');
                setStats({
                    totalProducts: response.data.total_products,
                    // topSelling: response.data.top_selling,
                    lowStock: response.data.low_stock,
                    totalRevenue: response.data.total_revenue
                });
            } catch (error) {
                console.error("Error fetching product stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Produits' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard 
                        name='Total des Produits' 
                        icon={Package} 
                        value={loading ? '...' : stats.totalProducts.toLocaleString()} 
                        color='#6366F1' 
                    />
                    {/* <StatCard 
                        name='Top Selling' 
                        icon={TrendingUp} 
                        value={loading ? '...' : stats.topSelling.toLocaleString()} 
                        color='#10B981' 
                    /> */}
                    <StatCard 
                        name='Stock Faible' 
                        icon={AlertTriangle} 
                        value={loading ? '...' : stats.lowStock.toLocaleString()} 
                        color='#F59E0B' 
                    />
                    <StatCard 
                        name='Revenu Total' 
                        icon={DollarSign} 
                        value={loading ? '...' : formatCurrency(stats.totalRevenue)} 
                        color='#EF4444' 
                    />
                </motion.div>

                <ProductsTable />

                {/* CHARTS */}
                <div className='grid grid-col-1 lg:grid-cols-1 gap-8'>
                    <CategoryDistributionChart />
                </div>
            </main>
        </div>
    );
};

export default ProductsPage;