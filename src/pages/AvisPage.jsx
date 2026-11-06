import { MessageCircle, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import ReviewsTable from "../components/reviews/ReviewsTable"; // <-- Crée ce composant
import ReviewsChart from "../components/reviews/ReviewsChart";
import SatisfactionOverTimeChart from "../components/reviews/SatisfactionOverTimeChart";
// import SentimentLineChart from "../components/reviews/SentimentLineChart.jsx";
// import ReviewsOverTimeChart from "../components/reviews/ReviewsOverTimeChart";

const reviewStats = {
    totalReviews: 1345,
    publishedReviews: 980,
    pendingReviews: 250,
    rejectedReviews: 115,
};

const AvisPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Avis Clients' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Avis' icon={MessageCircle} value={reviewStats.totalReviews} color='#6366F1' />
                    <StatCard name='Avis Publiés' icon={ThumbsUp} value={reviewStats.publishedReviews} color='#10B981' />
                    {/* <StatCard name='En Attente' icon={CheckCircle} value={reviewStats.pendingReviews} color='#F59E0B' />
                    <StatCard name='Rejetés' icon={ThumbsDown} value={reviewStats.rejectedReviews} color='#EF4444' /> */}
                </motion.div>

                {/* TABLEAU DES AVIS */}
                <ReviewsTable />

                {/* CHARTS - OPTIONNEL */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                    <ReviewsChart /> 
                    <SatisfactionOverTimeChart />
                    {/* <SentimentLineChart />  */}

                    {/* <ReviewsOverTimeChart />  */}
                </div>
            </main>
        </div>
    );
};

export default AvisPage;
