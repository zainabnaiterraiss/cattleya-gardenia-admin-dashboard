import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModalWrapper from "./ModalWrapper"; // ajuste le chemin si nécessaire

const EditProductModal = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({ 
        name: product.name || product.nom_Produit || "",
        description: product.description || "",
        price: product.price || product.prix || "",
        category: product.designation_Categorie || product.category || "",
        stock: product.stock || "",
        image: product.image || ""
    });

    const [previewImage, setPreviewImage] = useState(
        product.image ? (product.image.startsWith('http') || product.image.startsWith('/') 
            ? product.image 
            : `/${product.image}`) 
        : ''
    );
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost/ADMIN_DASHBOARD_backend/get_categories.php');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const response = await fetch('http://localhost/ADMIN_DASHBOARD_backend/upload_image.php', {
                method: 'POST',
                body: uploadData
            });
            const result = await response.json();
            if (result.success) {
                setFormData(prev => ({ ...prev, image: result.fileName }));
            }
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            id: product.idProduit || product.id
        };

        if (formData.name !== (product.name || product.nom_Produit)) payload.name = formData.name;
        if (formData.description !== product.description) payload.description = formData.description;
        if (formData.price !== (product.price || product.prix)) payload.price = formData.price;
        if (formData.category !== (product.designation_Categorie || product.category)) payload.category = formData.category;
        if (formData.stock !== product.stock) payload.stock = formData.stock;
        if (formData.image !== product.image) payload.image = formData.image;

        try {
            const response = await fetch('http://localhost/ADMIN_DASHBOARD_backend/update_product.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                onSave({ ...product, ...formData });
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    return (
        <ModalWrapper>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-96 max-h-screen overflow-y-auto"
                >
                    <h2 className="text-lg font-semibold mb-4">Modifier le Produit</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                            >
                                <option value="">Sélectionnez une catégorie</option>
                                {categories.map(cat => (
                                    <option key={cat.idCategorie} value={cat.designation_Categorie}>
                                        {cat.designation_Categorie}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Prix (€)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Stock</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 bg-gray-800 rounded"
                                disabled={isUploading}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 rounded"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
                                disabled={isUploading}
                            >
                                {isUploading ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </ModalWrapper>
    );
};

export default EditProductModal;
