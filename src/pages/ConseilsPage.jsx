import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Calendar, MessageCircle } from "lucide-react";
import ConseilsTable from "../components/conseils/ConseilsTable";
import Header from "../components/common/Header";

const ConseilsPage = () => {
  const [stats, setStats] = useState({
    totalConseils: 0,
    conseilsValides: 0,
    conseilsMois: 0,
    totalCommentaires: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost/ADMIN_DASHBOARD_backend/get_conseil_stats.php"
        );
        const data = await response.json();
        setStats({
          totalConseils: data.total || 0,
         
          conseilsMois: data.mois || 0,
       
        });
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Conseils" />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cartes de statistiques */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            icon={BookOpen}
            title="Total des Conseils"
            value={stats.totalConseils}
            color="indigo"
          />
          {/* <StatCard
            icon={CheckCircle}
            title="Conseils Validés"
            value={stats.conseilsValides}
            color="green"
          /> */}
          <StatCard
            icon={Calendar}
            title="Ce Mois-ci"
            value={stats.conseilsMois}
            color="yellow"
          />
          {/* <StatCard
            icon={MessageCircle}
            title="Commentaires"
            value={stats.totalCommentaires}
            color="red"
          /> */}
        </motion.div>

        {/* Tableau des conseils */}
        <ConseilsTable />
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
  style={{
    boxShadow:
      "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px",
    transform: "none"
  }}
      whileHover={{ y: -5 }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-full ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-semibold text-white">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConseilsPage;