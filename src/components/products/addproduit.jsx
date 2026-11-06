import { useState, useEffect } from "react";

const AddProduit = () => {
  const [formData, setFormData] = useState({
    nom_Produit: "",
    description: "",
    prix: "",
    image: null,
    idCategorie: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost/ADMIN_DASHBOARD_backend/get_categories.php")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

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
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    const response = await fetch("http://localhost/ADMIN_DASHBOARD_backend/addproduit.php", {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    alert(result.message);
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Ajouter un produit</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
        <input name="nom_Produit" placeholder="Nom du produit" onChange={handleChange} required className="w-full p-2 rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full p-2 rounded" />
        <input name="prix" type="number" placeholder="Prix" onChange={handleChange} required className="w-full p-2 rounded" />
        <input name="stock" type="number" placeholder="Stock" onChange={handleChange} required className="w-full p-2 rounded" />
        <select name="idCategorie" onChange={handleChange} required className="w-full p-2 rounded">
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.idCategorie} value={cat.idCategorie}>
              {cat.designation_Categorie}
            </option>
          ))}
        </select>
        <input name="image" type="file" accept="image/*" onChange={handleChange} required className="w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Ajouter</button>
      </form>
    </div>
  );
};

export default AddProduit;
