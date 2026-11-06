import { motion } from "framer-motion";
import { Edit, Search, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import EditConseilModal from "./EditConseilModal";

const ConseilsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conseils, setConseils] = useState([]);
  const [editingConseil, setEditingConseil] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConseils();
  }, []);

  const fetchConseils = async () => {
    try {
      const response = await fetch(
        "http://localhost/ADMIN_DASHBOARD_backend/get_conseils.php"
      );
      const data = await response.json();
      setConseils(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleAddNew = () => {
    setEditingConseil({
      question: "",
      contenu: "",
      image_path: "",
      date_publication: "",
    });
    setIsAddMode(true);
  };

  
const handleSave = async (updatedConseil) => {
  try {
    const response = await fetch(
      isAddMode
        ? "http://localhost/ADMIN_DASHBOARD_backend/add_conseil.php"
        : "http://localhost/ADMIN_DASHBOARD_backend/update_conseil.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConseil),
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchConseils(); // recharger les données
      setEditingConseil(null);
    } else {
      alert("Erreur: " + data.message);
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
};















  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce conseil ?")) {
      try {
        const response = await fetch(
          `http://localhost/ADMIN_DASHBOARD_backend/delete_conseil.php?id=${id}`
        );
        const data = await response.json();

        if (data.success) {
          fetchConseils();
        } else {
        
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const filteredConseils = conseils.filter(
    (c) =>
      c.question.toLowerCase().includes(searchTerm) ||
      c.contenu.toLowerCase().includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

   return (
    <div className="space-y-6">
      {/* Modal d'édition/ajout */}
      {editingConseil && (
        <EditConseilModal
          conseil={editingConseil}
          onSave={handleSave}
          onClose={() => setEditingConseil(null)}
          isAddMode={isAddMode}
        />
      )}

      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <Plus className="mr-2 h-5 w-5" />
          Ajouter
        </button>
      </div>

      {/* Tableau des conseils */}
      <motion.div
        className="shadow-lg overflow-hidden border border-gray-700 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {["Question", "Contenu", "Image", "Date", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredConseils.map((conseil) => (
              <tr key={conseil.id} className="hover:bg-gray-750 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 max-w-xs truncate">
                  {conseil.question}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                  {conseil.contenu}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {conseil.image_path && (
                    <img
                      src={`/${conseil.image_path}`}
                      alt="Conseil"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {conseil.date_publication}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => {
                      setEditingConseil(conseil);
                      setIsAddMode(false);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    <Edit className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(conseil.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ConseilsTable;