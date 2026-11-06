// import { useState, useEffect } from "react";
// import { User, Save, X } from "lucide-react";
// import SettingSection from "./SettingSection";
// import axios from "axios";
// import profil from './profil.png';

// const Profile = () => {
//     const [profile, setProfile] = useState({
//         idClient: '',
//         nom_Client: '',
//         prenom_Client: '',
//         email_Client: '',
//         telephone_Client: '',
//         adresse_Client: ''
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Récupérer les données du client (remplacez 1 par l'ID du client actuel)
//         fetchClientProfile(1);
//     }, []);

//     const fetchClientProfile = (clientId) => {
//         setLoading(true);
//         axios.get(`http://localhost/ADMIN_DASHBOARD_backend/get_client.php?id=${clientId}`)
//             .then(response => {
//                 if (response.data) {
//                     setProfile(response.data);
//                 }
//             })
//             .catch(error => {
//                 console.error("Erreur:", error);
//                 setError("Erreur de chargement du profil");
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfile(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSave = () => {
//         setLoading(true);
//         axios.post('http://localhost/ADMIN_DASHBOARD_backend/update_client.php', profile)
//             .then(response => {
//                 if (response.data.success) {
//                     setIsEditing(false);
//                     // Recharger les données si nécessaire
//                     fetchClientProfile(profile.idClient);
//                 } else {
//                     setError(response.data.message || "Erreur lors de la mise à jour");
//                 }
//             })
//             .catch(error => {
//                 console.error("Erreur:", error);
//                 setError("Erreur lors de la mise à jour du profil");
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     return (
//         <SettingSection icon={User} title={"Profil Client"}>
//             {loading && !profile.idClient ? (
//                 <div className="text-center py-8">
//                     <p className="text-gray-400">Chargement du profil...</p>
//                 </div>
//             ) : error ? (
//                 <div className="text-center py-8">
//                     <p className="text-red-400">{error}</p>
//                 </div>
//             ) : (
//                 <>
//                     <div className='flex flex-col sm:flex-row items-center mb-6'>
//                         <img
//                             src={profil}
//                             alt="Profile"
//                             className="rounded-full w-20 h-20 object-cover mr-4"
//                         />
//                         <div>
//                             <h3 className='text-lg font-semibold text-gray-100'>
//                                 {profile.prenom_Client} {profile.nom_Client}
//                             </h3>
//                             <p className='text-gray-400'>{profile.email_Client}</p>
//                         </div>
//                     </div>

//                     {isEditing ? (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
//                                     <input
//                                         type="text"
//                                         name="nom_Client"
//                                         value={profile.nom_Client}
//                                         onChange={handleInputChange}
//                                         className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
//                                     <input
//                                         type="text"
//                                         name="prenom_Client"
//                                         value={profile.prenom_Client}
//                                         onChange={handleInputChange}
//                                         className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
//                                 <input
//                                     type="email"
//                                     name="email_Client"
//                                     value={profile.email_Client}
//                                     onChange={handleInputChange}
//                                     className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
//                                 <input
//                                     type="tel"
//                                     name="telephone_Client"
//                                     value={profile.telephone_Client}
//                                     onChange={handleInputChange}
//                                     className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-300 mb-1">Adresse</label>
//                                 <textarea
//                                     name="adresse_Client"
//                                     value={profile.adresse_Client}
//                                     onChange={handleInputChange}
//                                     rows={3}
//                                     className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             <div className="flex space-x-3 pt-2">
//                                 <button
//                                     onClick={handleSave}
//                                     disabled={loading}
//                                     className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center"
//                                 >
//                                     {loading ? (
//                                         "Enregistrement..."
//                                     ) : (
//                                         <>
//                                             <Save size={18} className="mr-2" />
//                                             Enregistrer
//                                         </>
//                                     )}
//                                 </button>
//                                 <button
//                                     onClick={() => setIsEditing(false)}
//                                     className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center"
//                                 >
//                                     <X size={18} className="mr-2" />
//                                     Annuler
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <p className="text-sm text-gray-400">Nom</p>
//                                     <p className="text-white">{profile.nom_Client}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-400">Prénom</p>
//                                     <p className="text-white">{profile.prenom_Client}</p>
//                                 </div>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-400">Email</p>
//                                 <p className="text-white">{profile.email_Client}</p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-400">Téléphone</p>
//                                 <p className="text-white">{profile.telephone_Client || "Non renseigné"}</p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-gray-400">Adresse</p>
//                                 <p className="text-white whitespace-pre-line">
//                                     {profile.adresse_Client || "Non renseignée"}
//                                 </p>
//                             </div>

//                             <button
//                                 onClick={() => setIsEditing(true)}
//                                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
//                             >
//                                 Modifier le profil
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </SettingSection>
//     );
// };

// export default Profile;
import { useState, useEffect } from "react";
import { User, Save, X } from "lucide-react";
import SettingSection from "./SettingSection";
import axios from "axios";
import profil from './profil.png';

const Profile = () => {
    const [profile, setProfile] = useState({
        idClient: '',
        nom_Client: '',
        prenom_Client: '',
        email_Client: '',
        telephone_Client: '',
        adresse_Client: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientProfile();
    }, []);

    const fetchClientProfile = () => {
        setLoading(true);
        axios.get('http://localhost/ADMIN_DASHBOARD_backend/get_client.php', {
            withCredentials: true
        })
            .then(response => {
                if (response.data && !response.data.error) {
                    setProfile(response.data);
                } else {
                    setError(response.data.error || "Erreur inconnue");
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                setError("Erreur de chargement du profil");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setLoading(true);
        axios.post('http://localhost/ADMIN_DASHBOARD_backend/update_client.php', profile, {
            withCredentials: true
        })
            .then(response => {
                if (response.data.success) {
                    setIsEditing(false);
                    fetchClientProfile();
                } else {
                    setError(response.data.message || "Erreur lors de la mise à jour");
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                setError("Erreur lors de la mise à jour du profil");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <SettingSection icon={User} title={"Profil Client"}>
            {loading && !profile.idClient ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">Chargement du profil...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-400">{error}</p>
                </div>
            ) : (
                <>
                    <div className='flex flex-col sm:flex-row items-center mb-6'>
                        <img
                            src={profil}
                            alt="Profile"
                            className="rounded-full w-20 h-20 object-cover mr-4"
                        />
                        <div>
                            <h3 className='text-lg font-semibold text-gray-100'>
                                {profile.prenom_Client} {profile.nom_Client}
                            </h3>
                            <p className='text-gray-400'>{profile.email_Client}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                                    <input
                                        type="text"
                                        name="nom_Client"
                                        value={profile.nom_Client}
                                        onChange={handleInputChange}
                                        className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                                    <input
                                        type="text"
                                        name="prenom_Client"
                                        value={profile.prenom_Client}
                                        onChange={handleInputChange}
                                        className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email_Client"
                                    value={profile.email_Client}
                                    onChange={handleInputChange}
                                    className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    name="telephone_Client"
                                    value={profile.telephone_Client}
                                    onChange={handleInputChange}
                                    className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Adresse</label>
                                <textarea
                                    name="adresse_Client"
                                    value={profile.adresse_Client}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full"
                                />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    {loading ? "Enregistrement..." : <>
                                        <Save size={18} className="mr-2" />
                                        Enregistrer
                                    </>}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <X size={18} className="mr-2" />
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Nom</p>
                                    <p className="text-white">{profile.nom_Client}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Prénom</p>
                                    <p className="text-white">{profile.prenom_Client}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white">{profile.email_Client}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Téléphone</p>
                                <p className="text-white">{profile.telephone_Client || "Non renseigné"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Adresse</p>
                                <p className="text-white whitespace-pre-line">{profile.adresse_Client || "Non renseignée"}</p>
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4"
                            >
                                Modifier le profil
                            </button>
                        </div>
                    )}
                </>
            )}
        </SettingSection>
    );
};

export default Profile;
