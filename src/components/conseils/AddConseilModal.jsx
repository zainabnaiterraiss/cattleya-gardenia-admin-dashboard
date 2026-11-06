import { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import axios from "axios";

const AddConseilModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    question: "",
    contenu: "",
    date_publication: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("question", formData.question);
      form.append("contenu", formData.contenu);
      form.append("date_publication", formData.date_publication);
      form.append("image", formData.image);

      const res = await axios.post("http://localhost/ADMIN_DASHBOARD_backend/add_conseil.php", form);
      onAdd(res.data); // Pour rafraîchir la liste si nécessaire
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'ajout du conseil :", err);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Ajouter un Conseil</h2>
        
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={formData.question}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <textarea
          name="contenu"
          placeholder="Contenu"
          value={formData.contenu}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="date"
          name="date_publication"
          value={formData.date_publication}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Ajouter
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddConseilModal;
