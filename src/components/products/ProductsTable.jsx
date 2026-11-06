import { motion } from "framer-motion";
import {Plus, Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import AddProductModal from "./AddProductModal";


const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/get_products.php")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Erreur lors du chargement des produits :", error));

      fetch("http://localhost/ADMIN_DASHBOARD_backend/get_categories.php")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur catégories:", err));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
  };

  const handleSaveEdit = (updatedProduct) => {
    const updatedList = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedList);
    setEditingProduct(null);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch('http://localhost/ADMIN_DASHBOARD_backend/delete_product.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deletingProduct.id }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const updatedList = products.filter((p) => p.id !== deletingProduct.id);
        setProducts(updatedList);
      } else {
        console.error('Erreur lors de la suppression:', data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setDeletingProduct(null);
    }
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [categories, setCategories] = useState([]);
  
  

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
  <div className="flex gap-4 items-center">
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
        value={searchTerm}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
    <button
      onClick={() => setIsAddModalOpen(true)}
    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow"
    >
      <Plus size={18} />
      Ajouter
    </button>
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Name", "Category", "Price", "Image", "Stock", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  ${parseFloat(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <img
                    src={`/${product.image}`}
                    alt="Produit"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveEdit}
          onClose={() => setEditingProduct(null)}
        />
      )}
      {deletingProduct && (
        <DeleteConfirmModal
          productName={deletingProduct.name}
          onDelete={confirmDelete}
          onClose={() => setDeletingProduct(null)}
        />
      )}

{isAddModalOpen && (
  <AddProductModal
    onClose={() => setIsAddModalOpen(false)}
    onAdd={(newProduct) => setProducts([newProduct, ...products])}
  />
)}



      
    </motion.div>
  );
};

export default ProductsTable;
