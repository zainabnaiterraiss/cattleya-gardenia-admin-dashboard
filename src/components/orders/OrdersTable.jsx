import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X } from "lucide-react";
import axios from "axios";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost/ADMIN_DASHBOARD_backend/get_commandes.php")
            .then(response => {
                if (Array.isArray(response.data)) {
                    const formattedOrders = response.data.map(order => ({
                        id: order.idCommande,
                        date: order.date_achat,
                        designation: order.designation.replace(/<br>|<\/?[^>]+(>|$)/g, ", "),
                        montant: parseFloat(order.montant),
                        status: order.statut,
                        idClient: order.idClient
                    }));
                    setOrders(formattedOrders);
                    setFilteredOrders(formattedOrders);
                } else {
                    setError("Format de données invalide");
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                setError("Erreur de chargement des commandes");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = orders.filter(
            (order) =>
                order.id.toString().toLowerCase().includes(term) ||
                order.designation.toLowerCase().includes(term) ||
                order.idClient.toString().includes(term)
        );
        setFilteredOrders(filtered);
    };

  const getStatusStyle = (status) => {
    const statusMap = {
        'en attente': '!bg-yellow-100 !text-yellow-800',
        'livrée': '!bg-green-100 !text-green-800', 
        'expédiée': '!bg-blue-100 !text-blue-800',
        'en cours': '!bg-purple-100 !text-purple-800'
    };

    for (const [key, value] of Object.entries(statusMap)) {
        if (status.toLowerCase().includes(key)) return value;
    }
    
    return '!bg-gray-100 !text-gray-800';
};

    const fetchOrderProducts = (orderId) => {
        setProductsLoading(true);
        axios.get(`http://localhost/ADMIN_DASHBOARD_backend/get_order_products.php?id=${orderId}`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setOrderProducts(response.data);
                    setSelectedOrder(orderId);
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                setError("Erreur de chargement des produits");
            })
            .finally(() => {
                setProductsLoading(false);
            });
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setOrderProducts([]);
    };

    return (
        <>
            <motion.div
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-100'>Liste des Commandes</h2>
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Rechercher des commandes...'
                            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>ID Commande</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Client ID</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Produits</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Montant</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Statut</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Date</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>

                        <tbody className='divide divide-gray-700'>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                                        Chargement en cours...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-red-400">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                                        {searchTerm ? "Aucune commande correspondante" : "Aucune commande disponible"}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <motion.tr
                                        key={`order-${order.id}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                            {order.id}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-100'>
                                            {order.idClient}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-300'>
                                            {order.designation.length > 50 
                                                ? `${order.designation.substring(0, 50)}...` 
                                                : order.designation}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-100'>
                                            {order.montant.toFixed(2)} €
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            <button 
                                                className='text-indigo-400 hover:text-indigo-300 mr-2'
                                                onClick={() => fetchOrderProducts(order.id)}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal pour afficher les produits */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div 
                        className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                Produits de la commande #{selectedOrder}
                            </h3>
                            <button 
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {productsLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Chargement des produits...</p>
                            </div>
                        ) : orderProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Aucun produit trouvé pour cette commande</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orderProducts.map((product) => (
                                    <div key={`product-${product.id_produit}`} className="flex items-center p-3 bg-gray-700 rounded-lg">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-600 rounded-md overflow-hidden">
                                            {product.image && (
                                                <img 
                                                    src={`http://localhost/ADMIN_DASHBOARD_backend/${product.image}`} 
                                                    alt={product.nom_Produit}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h4 className="text-white font-medium">{product.nom_Produit}</h4>
                                            <div className="flex justify-between text-gray-300 text-sm mt-1">
                                                <span>Quantité: {product.quantite}</span>
                                                <span>Prix unitaire: {parseFloat(product.prix).toFixed(2)} €</span>
                                            </div>
                                            <div className="text-right text-white font-medium mt-1">
                                                Total: {(product.quantite * product.prix).toFixed(2)} €
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default OrdersTable;