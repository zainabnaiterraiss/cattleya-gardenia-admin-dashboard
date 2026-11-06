import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const SatisfactionOverTimeChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/satisfaction_over_time");
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error("Erreur de récupération:", err);
        setError("Impossible de charger les données");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Chargement en cours...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-semibold text-center mb-4">
        Évolution de la Satisfaction (Avis Positifs par Mois)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="mois"
            tick={{ fill: "#555" }}
            tickMargin={10}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#555" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          />
          <Line
            type="monotone"
            dataKey="positifs"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SatisfactionOverTimeChart;
