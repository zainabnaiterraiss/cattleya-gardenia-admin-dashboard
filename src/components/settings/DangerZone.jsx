import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const DangerZone = () => {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		const confirmed = window.confirm("Are you sure you want to delete your account?");
		if (!confirmed) return;

		setIsDeleting(true);

		try {
			const response = await fetch("http://localhost/ADMIN_DASHBOARD_backend/delete_client.php", {
				method: "DELETE",
				credentials: "include", 
			});

			const data = await response.json();

			if (data.success) {
				alert("Your account has been deleted successfully.");
				window.location.href = "http://localhost/pfe_test23/pfe_fin/pages/conexion.php";
			} else {
				alert("Error: " + data.error);
			}
		} catch (error) {
			console.error("Deletion error:", error);
			alert("An error occurred while deleting your account.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<motion.div
			className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8 max-w-xl mx-auto mt-10'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='flex items-center mb-4'>
				<Trash2 className='text-red-400 mr-3' size={24} />
				<h2 className='text-xl font-semibold text-gray-100'>Zone Dangereuse</h2>
			</div>
			<p className='text-gray-300 mb-4'>
				Supprimez définitivement votre compte et tout son contenu. Cette action est irréversible.
			</p>
			<button
				onClick={handleDelete}
				className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50'
				disabled={isDeleting}
			>
				{isDeleting ? "Deleting..." : "Supprimer le compte"}
			</button>
		</motion.div>
	);
};

export default DangerZone;
