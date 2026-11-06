import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

const OrdersPage = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: "0",
    pendingOrders: "0",
    completedOrders: "0",
    totalRevenue: "$0",
  });

  // Effectuer une requête pour récupérer les statistiques des commandes
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await axios.get("http://localhost/ADMIN_DASHBOARD_backend/get_daily_orders3.php");
        const data = response.data;

        // Formater les résultats
        setOrderStats({
          totalOrders: data.totalOrders.toLocaleString(),
          pendingOrders: data.pendingOrders.toLocaleString(),
          completedOrders: data.completedOrders.toLocaleString(),
          totalRevenue: `$${data.totalRevenue.toFixed(2)}`,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques des commandes", error);
      }
    };

    fetchOrderStats();
  }, []); // L'effet se déclenche une seule fois au montage du composant

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"Commandes"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Commandes totales' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
          {/* <StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' /> */}
          <StatCard
            name='Commandes terminées'
            icon={CheckCircle}
            value={orderStats.completedOrders}
            color='#10B981'
          />
          <StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
