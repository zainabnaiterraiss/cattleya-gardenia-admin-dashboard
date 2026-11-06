import { useState, useEffect } from "react";
import { motion } from "framer-motion";



const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/get_reviews.php") 
    .then((res) => res.text())  // Utilise .text() pour afficher la réponse brute
    .then((data) => {
      console.log("Données brutes reçues :", data);  // Affiche la réponse
      try {
        const jsonData = JSON.parse(data);  // Tente de parser le JSON manuellement
        setReviews(jsonData);
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
      }
    })
      .catch((err) => console.error("Erreur de chargement des avis:", err));
  }, []);

  const handlePublish = (id) => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/publish_review.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ idAvis: id }),
    }).then(() => {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, status: "Publiée" } : review
        )
      );
    });
  };

  const handleDelete = (id) => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/delete_review.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ idAvis: id }),
    }).then(() => {
      setReviews((prev) => prev.filter((review) => review.id !== id));
    });
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Avis Clients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                État
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {reviews.map((review) => (
              <motion.tr
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {review.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {review.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-md break-words">
                  {review.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      review.status === "Publiée"
                        ? "bg-green-800 text-green-100"
                        : "bg-yellow-800 text-yellow-100"
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 space-x-2">
                  {review.status !== "Publiée" && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                      onClick={() => handlePublish(review.id)}
                    >
                      Publier
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    onClick={() => handleDelete(review.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReviewsTable;
