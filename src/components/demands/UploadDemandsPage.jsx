import { UploadCloud, FileText, X } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";

const UploadDemandsPage = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Gestion du drop de fichiers
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === "application/pdf"
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  // Suppression d'un fichier
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Soumission au backend
  const handleSubmit = async () => {
    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append("pdfs", file));
    
    try {
      const res = await fetch("/api/upload-demands", {
        method: "POST",
        body: formData
      });
      if (res.ok) alert("Fichiers envoyés avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Importer des Demandes' />

      <main className='max-w-3xl mx-auto py-6 px-4 lg:px-8'>
        {/* ZONE DE DROP */}
        <motion.div
          className={`border-2 border-dashed rounded-lg p-12 text-center mb-8 ${
            files.length > 0 ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          whileHover={{ scale: 1.01 }}
        >
          <div className='flex flex-col items-center justify-center space-y-4'>
            <UploadCloud className='h-12 w-12 text-gray-400' />
            <p className='text-lg font-medium text-gray-600'>
              Glissez-déposez vos PDF ici ou cliquez pour parcourir
            </p>
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className='hidden'
            />
            <label
              htmlFor="pdf-upload"
              className='px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition'
            >
              Sélectionner des fichiers
            </label>
            <p className='text-sm text-gray-500'>Format accepté: .pdf</p>
          </div>
        </motion.div>

        {/* LISTE DES FICHIERS */}
        {files.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Fichiers à importer ({files.length})</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                    <span>{file.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* BOUTON DE SOUMISSION */}
        {files.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className={`px-6 py-2 rounded-md text-white ${
                isUploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isUploading ? "Envoi en cours..." : "Importer les demandes"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadDemandsPage;