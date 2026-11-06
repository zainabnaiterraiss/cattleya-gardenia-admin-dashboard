import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const ChannelPerformance = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDemands, setTotalDemands] = useState(0);

  useEffect(() => {
    axios.get("http://localhost/ADMIN_DASHBOARD_backend/service_demand_analysis.php")
      .then(response => {
        const total = response.data.reduce((sum, item) => sum + item.count, 0);
        setTotalDemands(total);
        setServiceData(response.data);
      })
      .catch(error => {
        console.error("Erreur:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Répartition des Demandes de Service</h2>
      
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement des données...</div>
      ) : (
        <>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="service"
                  label={({ service, percentage }) => `${service}: ${percentage}%`}
                  labelLine={false}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} demandes`,
                    `${props.payload.percentage}% des demandes totales`
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.9)",
                    borderColor: "#4B5563",
                    borderRadius: "0.5rem"
                  }}
                  itemStyle={{ color: "#E5E7EB" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {serviceData.map((service, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-300">{service.service}:</span>
                <span className="ml-1 text-gray-100">
                  {service.count} ({service.percentage}%)
                </span>
              </div>
            ))}
          </div> */}
          
          <div className="mt-4 text-sm text-gray-400">
            <p>Total: {totalDemands} services demandés (tous types confondus)</p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChannelPerformance;