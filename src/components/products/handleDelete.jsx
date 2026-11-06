import { motion } from "framer-motion";

const DeleteConfirmModal = ({ productName, productId, onDelete, onClose }) => {
  const handleDelete = () => {
    // Appel à l'API pour supprimer le produit
    fetch(`http://localhost/ADMIN_DASHBOARD_backend/delete_product.php?id=${productId}`, {
      method: 'GET', // Utilisez GET car l'ID est passé dans l'URL
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du produit');
        }
        return response.json(); // Retourne une réponse JSON
      })
      .then((data) => {
        if (data.success) {
          onDelete(); // Met à jour l'état après la suppression
          onClose();  // Ferme le modal
        } else {
          throw new Error(data.message || 'Échec de la suppression du produit');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression :', error);
        alert(`Erreur lors de la suppression : ${error.message}`);
      });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">
          Confirmer la suppression
        </h3>
        <p className="text-gray-300 mb-6">
          Es-tu sûr de vouloir supprimer <strong>{productName}</strong> ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete} // Suppression du produit
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Supprimer
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeleteConfirmModal;
