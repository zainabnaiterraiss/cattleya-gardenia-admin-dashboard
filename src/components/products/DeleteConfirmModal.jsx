import { motion } from "framer-motion";

const DeleteConfirmModal = ({ productName, onDelete, onClose }) => {
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
						onClick={onDelete}
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
