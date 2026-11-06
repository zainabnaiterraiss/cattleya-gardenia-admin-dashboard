import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";
import axios from "axios";

const iconMap = {
	Revenue: DollarSign,
	Users: Users,
	Orders: ShoppingBag,
	"Page Views": Eye,
};

const OverviewCards = () => {
	const [overviewData, setOverviewData] = useState([]);

	useEffect(() => {
		// Appel à l'API PHP
		axios.get("http://localhost/ADMIN_DASHBOARD_backend/OverviewCards.php")
			.then((res) => {
				const formatted = [
					{ name: "Revenue", value: res.data.totalRevenue, change: 12.5, icon: iconMap["Revenue"] },
					{ name: "Users", value: res.data.totalUsers, change: 8.3, icon: iconMap["Users"] },
					{ name: "Orders", value: res.data.totalOrders, change: -3.2, icon: iconMap["Orders"] },
					{ name: "Page Views", value: res.data.totalAvis, change: 15.7, icon: iconMap["Page Views"] },
				];
				setOverviewData(formatted);
			})
			.catch((err) => {
				console.error("Erreur de chargement des statistiques:", err);
			});
	}, []);

	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
			{overviewData.map((item, index) => (
				<motion.div
					key={item.name}
					className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-sm font-medium text-gray-400'>{item.name}</h3>
							<p className='mt-1 text-xl font-semibold text-gray-100'>{Number(item.value).toLocaleString()}</p>
						</div>
						<div className={`p-3 rounded-full bg-opacity-20 bg-green-500" `}>
							<item.icon className={`size-6 text-green-500`}/>
						</div>
					</div>
					<div className={`mt-4 flex items-center text-green-500"`}>

						<span className='ml-1 text-sm font-medium'></span>
						
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default OverviewCards;
