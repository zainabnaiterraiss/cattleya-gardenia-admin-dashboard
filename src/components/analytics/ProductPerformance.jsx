import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
import { motion } from "framer-motion";

const ProductPerformance = () => {
  const [data, setData] = useState([]);
  const [growthRate, setGrowthRate] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/revenue_analysis.php")
      .then(res => res.json())
      .then(json => {
        setData(json.monthly_data);
        
        // Calcul des indicateurs
        if (json.monthly_data.length >= 2) {
          const lastMonth = json.monthly_data[json.monthly_data.length - 1].revenue;
          const prevMonth = json.monthly_data[json.monthly_data.length - 2].revenue;
          const growth = ((lastMonth - prevMonth) / prevMonth) * 100;
          setGrowthRate(growth);
        }
        
        setTotalRevenue(json.total_revenue || 0);
      })
      .catch(err => console.error("Erreur récupération données :", err));
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className='text-xl font-semibold text-gray-100'>Croissance des Revenus</h2>
        <div className="flex space-x-4">
          <div className="bg-gray-700 px-3 py-2 rounded-lg">
            <p className="text-sm text-gray-300">Total CA</p>
            <p className="text-lg font-bold text-green-400">{totalRevenue.toLocaleString()} €</p>
          </div>
          <div className="bg-gray-700 px-3 py-2 rounded-lg">
            <p className="text-sm text-gray-300">Évolution</p>
            <p className={`text-lg font-bold ${growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis 
              dataKey='month' 
              stroke='#9CA3AF' 
              tickFormatter={(value) => value.substring(0, 3)} 
            />
            <YAxis 
              stroke='#9CA3AF' 
              label={{ 
                value: 'Montant (€)', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#9CA3AF'
              }} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4B5563",
                borderRadius: "0.5rem"
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => [`${value} €`, 'Revenu']}
              labelFormatter={(label) => `Mois: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-gray-300">{value}</span>
              )}
            />
            <Bar 
              dataKey='revenue' 
              name="Revenu mensuel" 
              fill='#4F46E5' 
              radius={[4, 4, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Tendance" 
              stroke="#10B981" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>Dernière mise à jour: {new Date().toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};


export default ProductPerformance;
