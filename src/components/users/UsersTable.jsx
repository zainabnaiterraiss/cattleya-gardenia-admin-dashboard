import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search , Plus} from "lucide-react";

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/get_clients.php")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setUsers(data.data || []); // Assure que c'est toujours un tableau
        } else {
          console.error("API error:", data.message);
          setUsers([]); // Définit un tableau vide en cas d'erreur
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching clients:", error);
        setUsers([]); // Définit un tableau vide en cas d'erreur
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };



  // En haut de votre composant avec les autres états
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [newClient, setNewClient] = useState({
  nom_Client: '',
  prenom_Client: '',
  email_Client: '',
  telephone_Client: '',
  adresse_Client: '',
  password: '',
  role: 'client'
});

// Fonction pour gérer l'ajout
const handleAddClient = async () => {
  try {
    const response = await fetch('http://localhost/ADMIN_DASHBOARD_backend/add_client.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient)
    });

    if (!response.ok) {
      throw new Error(error.message || 'Erreur réseau');
    }

    const result = await response.json();
    
    if (result.success) {
      const updatedResponse = await fetch('http://localhost/ADMIN_DASHBOARD_backend/get_clients.php');
      const updatedData = await updatedResponse.json();
    
      if (updatedData.success) {
        setUsers(updatedData.data || []);
      } else {
        setUsers([]);
      }
    
      setIsAddModalOpen(false);
      setNewClient({
        nom_Client: '',
        prenom_Client: '',
        email_Client: '',
        telephone_Client: '',
        adresse_Client: '',
        password: '',
        role: 'client'
      });
    
      
    } else {
      alert(result.message || 'Erreur lors de l\'ajout');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'ajout du client');
  }
};

const filteredUsers = Array.isArray(users) 
? users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.nom_Client?.toLowerCase() || '').includes(searchTermLower) ||
      (user.prenom_Client?.toLowerCase() || '').includes(searchTermLower) ||
      (user.email_Client?.toLowerCase() || '').includes(searchTermLower)
    );
  })
: []; // Retourne un tableau vide si users n'est pas un tableau

  const handleSave = (updatedUser) => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/updateClient.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.idClient === updatedUser.idClient ? updatedUser : user))
          );
          setEditingUser(null);
        }
      })
      .catch(error => console.error("Error updating client:", error));
  };

  const getRoleLabel = (role) => {
    const roles = {
      'client': 'Client',
      'admin': 'Administrateur',
      'specialiste': 'Spécialiste'
    };
    return roles[role] || role;
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost/ADMIN_DASHBOARD_backend/delete_client.php?id=${userId}`);
      
      // Vérifiez si la réponse est OK (statut 200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Erreur serveur: ${response.status} ${response.statusText}`
        );
      }
  
      const data = await response.json();
      
      if (data.success) {
        // Mise à jour de l'état local
        setUsers(prevUsers => prevUsers.filter(user => user.idClient !== userId));
        setDeletingUser(null);
        
      } else {
        throw new Error(data.message || "Échec de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
     
    }
  };

 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Modal Edit */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            className="bg-gray-800 rounded-xl p-6 shadow-lg w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Modifier Client</h2>
            <div className="space-y-4">
              <input
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Nom"
                value={editingUser.nom_Client}
                onChange={(e) => setEditingUser({ ...editingUser, nom_Client: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Prénom"
                value={editingUser.prenom_Client}
                onChange={(e) => setEditingUser({ ...editingUser, prenom_Client: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Email"
                value={editingUser.email_Client}
                onChange={(e) => setEditingUser({ ...editingUser, email_Client: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Téléphone"
                value={editingUser.telephone_Client}
                onChange={(e) => setEditingUser({ ...editingUser, telephone_Client: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-700 text-white rounded"
                placeholder="Adresse"
                value={editingUser.adresse_Client}
                onChange={(e) => setEditingUser({ ...editingUser, adresse_Client: e.target.value })}
              />
              <select
                className="w-full p-2 bg-gray-700 text-white rounded"
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
                <option value="specialiste">Spécialiste</option>
              </select>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                  onClick={() => setEditingUser(null)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  onClick={() => handleSave(editingUser)}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Modal d'ajout */}
{isAddModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <motion.div
      className="bg-gray-800 rounded-xl p-6 shadow-lg w-96"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Ajouter un nouveau client</h2>
      
      <div className="space-y-4">
        <input
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nom"
          value={newClient.nom_Client || ''}
          onChange={(e) => setNewClient({...newClient, nom_Client: e.target.value})}
        />
        
        <input
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Prénom"
          value={newClient.prenom_Client || ''}
          onChange={(e) => setNewClient({...newClient, prenom_Client: e.target.value})}
        />
        
        <input
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          type="email"
          value={newClient.email_Client || ''}
          onChange={(e) => setNewClient({...newClient, email_Client: e.target.value})}
        />
        
        <input
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Téléphone"
          type="tel"
          value={newClient.telephone_Client || ''}
          onChange={(e) => setNewClient({...newClient, telephone_Client: e.target.value})}
        />
        
        <input
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Adresse"
          value={newClient.adresse_Client || ''}
          onChange={(e) => setNewClient({...newClient, adresse_Client: e.target.value})}
        />
        
        <input
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mot de passe"
          type="password"
          value={newClient.password || ''}
          onChange={(e) => setNewClient({...newClient, password: e.target.value})}
        />
        
        <select
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newClient.role || 'client'}
          onChange={(e) => setNewClient({...newClient, role: e.target.value})}
        >
          <option value="client">Client</option>
          <option value="admin">Administrateur</option>
          <option value="specialiste">Spécialiste</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          onClick={() => setIsAddModalOpen(false)}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
          onClick={handleAddClient}
        >
          Ajouter
        </button>
      </div>
    </motion.div>
  </div>
)}

      {/* Modal Delete */}
      {deletingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            className="bg-gray-800 rounded-xl p-6 shadow-lg w-80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Supprimer Client</h2>
            <p className="text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer {deletingUser.nom_Client} {deletingUser.prenom_Client}?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => setDeletingUser(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                onClick={() => handleDelete(deletingUser.idClient)}
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Table */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
       <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-semibold text-gray-100">Clients</h2>
  
  <div className="flex items-center gap-4">
    <div className="relative">
      <input
        type="text"
        placeholder="Rechercher clients..."
        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
    
    <button
      onClick={() => setIsAddModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow transition-colors duration-200"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.idClient}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.idClient}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">{user.nom_Client}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.prenom_Client}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email_Client}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.telephone_Client}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "admin" ? "bg-purple-800 text-purple-100" :
                      user.role === "specialiste" ? "bg-yellow-800 text-yellow-100" :
                      "bg-blue-800 text-blue-100"
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => setEditingUser({ ...user })}
                    >
                      Modifier
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => setDeletingUser(user)}
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
    </>
  );
};

export default UsersTable;