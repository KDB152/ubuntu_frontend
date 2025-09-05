'use client';

import React, { useState, useEffect } from 'react';
import { updateUserProfile, changePassword } from '@/lib/api';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Shield,
  Save,
  Edit,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdminProfile {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      systemAlerts: boolean;
      userReports: boolean;
    };
  };
  security: {
    lastLogin: string;
    twoFactorEnabled: boolean;
    loginHistory: {
      date: string;
      device: string;
      location: string;
    }[];
  };
}

const AdminProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'admin'
    },
    preferences: {
      language: 'fr',
      timezone: 'Europe/Paris',
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        systemAlerts: true,
        userReports: true
      }
    },
    security: {
      lastLogin: '',
      twoFactorEnabled: false,
      loginHistory: []
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Charger les données de l'utilisateur admin
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const userData = localStorage.getItem('userDetails');
      if (userData) {
        const user = JSON.parse(userData);
        
        // Charger les préférences depuis localStorage si elles existent
        const savedPreferences = localStorage.getItem('adminPreferences');
        const userPreferences = savedPreferences ? JSON.parse(savedPreferences) : null;
        
        const updatedProfile = {
          ...profile,
          personal: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: '',
            role: user.role || 'admin'
          },
          preferences: {
            language: userPreferences?.language || 'fr',
            timezone: userPreferences?.timezone || 'Europe/Paris',
            theme: (userPreferences?.theme as 'light' | 'dark' | 'auto') || 'dark',
            notifications: userPreferences?.notifications || {
              email: true,
              push: true,
              systemAlerts: true,
              userReports: true
            }
          },
          security: {
            lastLogin: new Date().toISOString(),
            twoFactorEnabled: false,
            loginHistory: [
              {
                date: new Date().toISOString(),
                device: 'Chrome sur Windows',
                location: 'France'
              }
            ]
          }
        };
        
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Récupérer l'ID de l'utilisateur depuis localStorage
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      const userId = userDetails.id;
      
      if (!userId) {
        throw new Error('ID de l\'utilisateur non trouvé');
      }
      
      // Sauvegarder les données dans localStorage en attendant l'implémentation des API
      const updatedUser = {
        ...userDetails,
        firstName: editedProfile.personal.firstName,
        lastName: editedProfile.personal.lastName,
        email: editedProfile.personal.email
      };
      localStorage.setItem('userDetails', JSON.stringify(updatedUser));
      
      // Sauvegarder les préférences dans localStorage
      const preferences = {
        language: editedProfile.preferences.language,
        timezone: editedProfile.preferences.timezone,
        theme: editedProfile.preferences.theme,
        notifications: editedProfile.preferences.notifications
      };
      localStorage.setItem('adminPreferences', JSON.stringify(preferences));
      
      // Mettre à jour les données locales
      setProfile(editedProfile);
      
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.new.length < 8) {
      alert('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (passwordData.current === passwordData.new) {
      alert('Le nouveau mot de passe doit être différent de l\'actuel');
      return;
    }

    try {
      // Appel à l'API de changement de mot de passe
      await changePassword(passwordData.current, passwordData.new);
      
      alert('Mot de passe modifié avec succès !');
      setShowPasswordModal(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      if (errorMessage.includes('Mot de passe actuel incorrect')) {
        alert('Mot de passe actuel incorrect');
      } else if (errorMessage.includes('différent de l\'actuel')) {
        alert('Le nouveau mot de passe doit être différent de l\'actuel');
      } else if (errorMessage.includes('Token d\'authentification manquant')) {
        alert('Session expirée, veuillez vous reconnecter');
      } else {
        alert('Erreur lors du changement de mot de passe: ' + errorMessage);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
                   <div>
             <h1 className="text-base font-bold text-white">Mon Profil</h1>
             <p className="text-blue-200">Gérez vos informations personnelles et préférences</p>
             <p className="text-blue-300 text-sm mt-1">💾 Les données sont sauvegardées localement</p>
           </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-base font-bold text-white mb-3 flex items-center">
          <User className="w-5 h-5 text-blue-300 mr-2" />
          Informations personnelles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={isEditing ? editedProfile.personal.firstName : profile.personal.firstName}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                personal: { ...editedProfile.personal, firstName: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              value={isEditing ? editedProfile.personal.lastName : profile.personal.lastName}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                personal: { ...editedProfile.personal, lastName: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={isEditing ? editedProfile.personal.email : profile.personal.email}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                personal: { ...editedProfile.personal, email: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={isEditing ? editedProfile.personal.phone : profile.personal.phone}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                personal: { ...editedProfile.personal, phone: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Rôle
            </label>
            <input
              type="text"
              value={profile.personal.role}
              disabled
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-base font-bold text-white mb-3 flex items-center">
          <Settings className="w-5 h-5 text-blue-300 mr-2" />
          Préférences
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Langue
            </label>
            <select
              value={isEditing ? editedProfile.preferences.language : profile.preferences.language}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                preferences: { ...editedProfile.preferences, language: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              Fuseau horaire
            </label>
            <select
              value={isEditing ? editedProfile.preferences.timezone : profile.preferences.timezone}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                preferences: { ...editedProfile.preferences, timezone: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            >
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3">
          <h3 className="text-base font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-3">
            {Object.entries(profile.preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-blue-200">
                  {key === 'email' && 'Notifications par email'}
                  {key === 'push' && 'Notifications push'}
                  {key === 'systemAlerts' && 'Alertes système'}
                  {key === 'userReports' && 'Rapports utilisateurs'}
                </span>
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.notifications[key as keyof typeof editedProfile.preferences.notifications] : value}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    preferences: {
                      ...editedProfile.preferences,
                      notifications: {
                        ...editedProfile.preferences.notifications,
                        [key]: e.target.checked
                      }
                    }
                  })}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-base font-bold text-white mb-3 flex items-center">
          <Shield className="w-5 h-5 text-blue-300 mr-2" />
          Sécurité
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Changer le mot de passe</h3>
              <p className="text-blue-200 text-sm">Mettez à jour votre mot de passe pour plus de sécurité</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Authentification à deux facteurs</h3>
              <p className="text-blue-200 text-sm">Ajoutez une couche de sécurité supplémentaire</p>
            </div>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {profile.security.twoFactorEnabled ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-md">
            <h3 className="text-base font-bold text-white mb-4">Changer le mot de passe</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileTab;

