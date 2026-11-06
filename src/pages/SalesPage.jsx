import React, { useState, useEffect } from "react";  // Importation de React, useState et useEffect
import axios from "axios";  // Assurez-vous d'avoir axios installé
import { motion } from "framer-motion";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart } from "lucide-react";
import Header from "../components/common/Header"; // Votre composant Header
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";

const SalesPage = () => {
  // Déclaration de l'état pour stocker les données des ventes
  const [salesData, setSalesData] = useState({
    totalRevenue: "$0.00",
    averageOrderValue: "$0.00",
    salesGrowth: "0%",
  });

  // Utilisation de useEffect pour récupérer les données au montage du composant
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_sales_data3.php');  // Assurez-vous que le chemin est correct
        setSalesData(response.data);  // Mise à jour de l'état avec les données reçues
      } catch (error) {
        console.error("Error fetching sales data:", error);  // Gestion des erreurs
      }
    };

    fetchSalesData();
  }, []);  // Le tableau vide [] garantit que l'effet s'exécute une seule fois au montage du composant

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title="Sales Dashboard" />  {/* Titre du tableau de bord */}

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Section des statistiques */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Carte de la statistique Total Revenue */}
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={salesData.totalRevenue}
            color="#6366F1"
          />
          {/* Carte de la statistique Average Order Value */}
          <StatCard
            name="Avg. Order Value"
            icon={ShoppingCart}
            value={salesData.averageOrderValue}
            color="#10B981"
          />
          {/* Carte de la statistique Sales Growth */}
          <StatCard
            name="Sales Growth"
            icon={CreditCard}
            value={`${salesData.salesGrowth}%`}
            color="#EF4444"
          />
        </motion.div>

        {/* Graphiques et autres composants */}
        <SalesOverviewChart />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <SalesByCategoryChart />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
