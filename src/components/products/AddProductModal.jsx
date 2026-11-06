import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModalWrapper from "./ModalWrapper";

const AddProductModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: null 
    });

    const [previewImage, setPreviewImage] = useState('');
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

    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, image: file }));

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
    
        // Validation côté client
        if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
            alert("Tous les champs doivent être remplis !");
            setIsUploading(false);
            return;
        }
    
        if (!formData.image) {
            alert("Veuillez sélectionner une image !");
            setIsUploading(false);
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("stock", formData.stock);
        formDataToSend.append("image", formData.image); 
    
        
        console.log("FormData envoyé:");
        for (let pair of formDataToSend.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    
        try {
            const response = await fetch('http://localhost/ADMIN_DASHBOARD_backend/addproduit.php', {
                method: 'POST',
                body: formDataToSend
            });
    
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                if (result.success) {
                    onAdd({ ...formData, idProduit: result.idProduit });
                    onClose();
                } else {
                    alert("Erreur backend : " + result.message);
                    console.error("Erreur backend:", result.message);
                }
            } else {
                const text = await response.text();
                alert("Réponse invalide du serveur:\n" + text);
                console.error("Réponse brute:", text);
            }
        } catch (error) {
            alert("Erreur lors de la communication avec le serveur");
            console.error("Erreur réseau ou serveur:", error);
        } finally {
            setIsUploading(false);
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
                    <h2 className="text-lg font-semibold mb-4">Ajouter un Produit</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                                required
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
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded"
                                required
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
                                required
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
                                required
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
                        {previewImage && (
                            <div className="mt-2">
                                <img src={previewImage} alt="Preview" className="w-full h-40 object-contain rounded" />
                            </div>
                        )}
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
                                className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
                                disabled={isUploading}
                            >
                                {isUploading ? "Ajout..." : "Ajouter"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </ModalWrapper>
    );
};

export default AddProductModal;
