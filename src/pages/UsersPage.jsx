import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ajouté axios
import { UserCheck, UserPlus, UsersIcon, UserX, Crown } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

const UsersPage = () => {
    const [stats, setStats] = useState({
        utilisateursTotaux: 0,
        fideles: 0
    });

    const [chargement, setChargement] = useState(true);
    useEffect(() => {
        const recupererStats = async () => {
            try {
                const reponse = await axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_user_stats.php');
                setStats({
                    utilisateursTotaux: reponse.data.clients_totaux,
                    fideles: reponse.data.clients_fideles
                });
            } catch (erreur) {
                console.error("Erreur de récupération:", erreur);
            } finally {
                setChargement(false);
            }
        };

        recupererStats();
    }, []);  // [] indique que l'effet s'exécute uniquement au chargement initial

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Users' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Utilisateurs Totaux'
                        icon={UsersIcon}  // Vérifie que l'icône correspond
                        value={chargement ? '...' : stats.utilisateursTotaux.toLocaleString()}
                        color='#6366F1'
                    />
                    <StatCard
                        name='Clients Fidèles'
                        icon={Crown}
                        value={chargement ? '...' : stats.fideles.toLocaleString()}
                        description="Ayant dépensé plus de $500"
                        color='#8B5CF6'
                    />
                </motion.div>

                <UsersTable />

                {/* USER CHARTS */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                    {/* <UserGrowthChart />
                    <UserActivityHeatmap />
                    <UserDemographicsChart /> */}
                </div>
            </main>
        </div>
    );
};
export default UsersPage;
