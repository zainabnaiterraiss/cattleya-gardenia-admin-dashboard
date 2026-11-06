import { useState, useEffect } from "react";
import SettingSection from "./SettingSection";
import { Bell, Save } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import axios from "axios";
import { toast } from 'react-toastify';

const Notifications = ({ userId }) => {
    const [notifications, setNotifications] = useState({
        push: false,
        email: false,
        sms: false,
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Charger les préférences de notification depuis l'API
        const fetchNotificationSettings = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}/notifications`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des préférences:", error);
                toast.error("Impossible de charger les préférences de notification");
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationSettings();
    }, [userId]);

    const handleToggle = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await axios.put(`/api/users/${userId}/notifications`, notifications);
            toast.success("Préférences de notification mises à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            toast.error("Échec de la mise à jour des préférences");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <SettingSection icon={Bell} title={"Notifications"}>
                <div className="space-y-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                        <div className="h-12 bg-gray-700 rounded-md"></div>
                        <div className="h-12 bg-gray-700 rounded-md"></div>
                        <div className="h-12 bg-gray-700 rounded-md"></div>
                    </div>
                </div>
            </SettingSection>
        );
    }

    return (
        <SettingSection icon={Bell} title={"Notifications"}>
            <div className="space-y-4">
                <ToggleSwitch
                    label={"Notifications push"}
                    description="Recevoir des notifications dans votre navigateur"
                    isOn={notifications.push}
                    onToggle={() => handleToggle('push')}
                />
                
                <ToggleSwitch
                    label={"Notifications par email"}
                    description="Recevoir des notifications par email"
                    isOn={notifications.email}
                    onToggle={() => handleToggle('email')}
                />
                
                <ToggleSwitch
                    label={"Notifications SMS"}
                    description="Recevoir des notifications par SMS"
                    isOn={notifications.sms}
                    onToggle={() => handleToggle('sms')}
                />

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center px-4 py-2 rounded-md text-white font-medium ${
                            isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } transition-colors`}
                    >
                        {isSaving ? (
                            'Enregistrement...'
                        ) : (
                            <>
                                <Save className="mr-2" size={18} />
                                Enregistrer les modifications
                            </>
                        )}
                    </button>
                </div>
            </div>
        </SettingSection>
    );
};

export default Notifications;