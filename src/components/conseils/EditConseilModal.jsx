import { useState } from "react";
import { X } from "lucide-react";

const EditConseilModal = ({ conseil, onSave, onClose, isAddMode }) => {
  const [formData, setFormData] = useState({ ...conseil });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // On envoie juste les données au parent
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50">
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4 bg-gray-900 rounded-t-lg">
            <h3 className="text-lg font-medium text-gray-200">
              {isAddMode ? "Ajouter un conseil" : "Modifier le conseil"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question
              </label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contenu
              </label>
              <textarea
                name="contenu"
                rows={5}
                value={formData.contenu}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image (URL)
                </label>
                <input
                  type="text"
                  name="image_path"
                  value={formData.image_path}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de publication
                </label>
                <input
                  type="date"
                  name="date_publication"
                  value={formData.date_publication}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isAddMode ? "Ajouter" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditConseilModal;
