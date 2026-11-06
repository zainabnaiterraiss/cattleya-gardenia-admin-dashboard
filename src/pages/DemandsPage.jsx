import { FileText, Calendar, MapPin, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
// import AdminDemandes from "../components/demands/AdminDemandes";
import DemandsTable from "../components/demands/DemandsTable";
// import UploadDemandsPage from "../components/demands/UploadDemandsPage";
// import DemandTypeChart from "../components/demands/DemandTypeChart";

const demandStats = {
  totalDemands: 1245,
  completedDemands: 970,
  urgentDemands: 87,
  avgResponseTime: "2.3j",
};

const DemandsPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Demandes' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS CARDS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Demandes Totales'
            icon={FileText}
            value={demandStats.totalDemands.toLocaleString()}
            color='#6366F1'
          />
          <StatCard 
            name='Complétées' 
            icon={CheckCircle} 
            value={demandStats.completedDemands} 
            color='#10B981' 
          />
          {/* <StatCard
            name='Urgentes'
            icon={Clock}
            value={demandStats.urgentDemands}
            color='#EF4444'
          />
          <StatCard 
            name='Temps Moyen' 
            icon={Calendar} 
            value={demandStats.avgResponseTime} 
            color='#F59E0B' 
          /> */}
        </motion.div>

        {/* TABLEAU + GRAPHIQUES */}
        {/* < AdminDemandes/> */}
        <DemandsTable />
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          {/* <DemandTypeChart /> */}
        </div>
      </main>
    </div>
  );
};

export default DemandsPage;