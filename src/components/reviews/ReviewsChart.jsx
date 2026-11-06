import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ThumbsUp, ThumbsDown } from "lucide-react"; // Icônes modernes

const ReviewsChart = () => {
    const [sentimentData, setSentimentData] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/analyse_reviews")
            .then((response) => response.json())
            .then((data) => {
                const positive = (data.positif || 0) + (data.neutre || 0);
                const negative = data.négatif || 0;

                const chartData = [
                    { name: `Positif`, value: positive },
                    { name: `Négatif`, value: negative },
                ];
                setSentimentData(chartData);
            })
            .catch((error) => console.error("Erreur de récupération des sentiments:", error));
    }, []);

    const COLORS = ["#34D399", "#F87171"]; // Vert et rouge pastel

    return (
        <div className="w-full max-w-2xl mx-auto p-6  shadow-2xl text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            Analyse des Avis
            </h2>

            <div className="flex justify-around mb-4">
                {sentimentData.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
                        ${index === 0 ? "bg-emerald-600/30 text-emerald-300" : "bg-red-600/30 text-red-300"}`}
                    >
                        {index === 0 ? <ThumbsUp size={18} /> : <ThumbsDown size={18} />}
                        {item.name}: {item.value}%
                    </div>
                ))}
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={sentimentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={40}
                        label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        isAnimationActive={true}
                    >
                        {sentimentData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                style={{ transition: "all 0.3s ease-in-out" }}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReviewsChart;
