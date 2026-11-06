import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ReviewsOverTimeChart = () => {
    const [sentimentData, setSentimentData] = useState([]);

    // Fonction pour récupérer les données des avis analysés depuis l'API Flask
    useEffect(() => {
        fetch("http://127.0.0.1:5000/analyse_reviews_time")
 // Remplace par ton URL d'API
            .then((response) => response.json())
            .then((data) => {
                // Transformer les données pour le graphique
                const chartData = data.map((entry) => ({
                    date: entry['date_avis'],
                    positif: entry['positif'] || 0,
                    negatif: entry['negatif'] || 0,
                    neutre: entry['neutre'] || 0,
                }));
                setSentimentData(chartData);
            })
            .catch((error) => console.error("Erreur de récupération des données temporelles:", error));
    }, []);

    return (
        <div className="w-full h-80 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Satisfaction des Avis au Fil du Temps</h2>
            {sentimentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="positif"
                            stroke="#10B981"
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="negatif"
                            stroke="#EF4444"
                        />
                        <Line
                            type="monotone"
                            dataKey="neutre"
                            stroke="#F59E0B"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>Chargement des données...</p>
            )}
        </div>
    );
};

export default ReviewsOverTimeChart;
