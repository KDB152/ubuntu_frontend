'use client';

import React, { useState, useEffect } from 'react';
import { updateStudentProfile } from '@/lib/api';
import { settingsAPI, studentsAPI, authAPI } from '../../../lib/api';
import SecuritySettings from '@/components/SecuritySettings';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Plus
} from 'lucide-react';

interface StudentProfile {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    avatar?: string;
    bio?: string;
  };
  academic: {
    studentId: string;
    class: string;
    level: string;
    school: string;
    startDate: string;
    subjects: string[];
    favoriteSubjects: string[];
    academicGoals: string[];
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      quizReminders: boolean;
      resultsNotifications: boolean;
      messageNotifications: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private';
      showProgress: boolean;
      showAchievements: boolean;
      allowMessages: boolean;
    };
    learning: {
      studyReminders: boolean;
      difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard';
      timePreference: 'morning' | 'afternoon' | 'evening' | 'flexible';
      sessionDuration: number; // en minutes
    };
  };
  stats: {
    level: number;
    xp: number;
    totalQuizzes: number;
    averageScore: number;
    timeSpent: number; // en minutes
    streak: number;
    badges: string[];
    achievements: string[];
    rank: number;
    totalStudents: number;
  };
  security: {
    lastLogin: string;
    loginHistory: {
      date: string;
      device: string;
      location: string;
    }[];
    twoFactorEnabled: boolean;
    connectedApps: {
      name: string;
      permissions: string[];
      lastUsed: string;
    }[];
  };
}

const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      bio: ''
    },
    academic: {
      studentId: '',
      class: '',
      level: '',
      school: '',
      startDate: '',
      subjects: [],
      favoriteSubjects: [],
      academicGoals: []
    },
    preferences: {
      language: 'fr',
      timezone: 'Europe/Paris',
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        sms: false,
        quizReminders: true,
        resultsNotifications: true,
        messageNotifications: true
      },
      privacy: {
        profileVisibility: 'friends',
        showProgress: true,
        showAchievements: true,
        allowMessages: true
      },
      learning: {
        studyReminders: true,
        difficultyPreference: 'adaptive',
        timePreference: 'evening',
        sessionDuration: 30
      }
    },
    stats: {
      level: 12,
      xp: 2450,
      totalQuizzes: 14,
      averageScore: 86,
      timeSpent: 420,
      streak: 7,
      badges: ['Révolutionnaire', 'Explorateur urbain', 'Géographe', 'Historien en herbe'],
      achievements: ['Premier quiz terminé', '10 quiz terminés', 'Score parfait', 'Série de 5 victoires'],
      rank: 3,
      totalStudents: 28
    },
    security: {
      lastLogin: '2024-12-20T14:30:00',
      loginHistory: [
        { date: '2024-12-20T14:30:00', device: 'Chrome sur Windows', location: 'Lyon, France' },
        { date: '2024-12-19T16:45:00', device: 'Safari sur iPhone', location: 'Lyon, France' },
        { date: '2024-12-18T09:15:00', device: 'Chrome sur Windows', location: 'Lyon, France' }
      ],
      twoFactorEnabled: false,
      connectedApps: []
    }
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'preferences' | 'security' | 'stats'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get current user ID from localStorage or context
      const userData = localStorage.getItem('userDetails');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
        
        // Charger les préférences depuis localStorage si elles existent
        const savedPreferences = localStorage.getItem('userPreferences');
        const userPreferences = savedPreferences ? JSON.parse(savedPreferences) : null;
        
        // Utiliser les données locales en attendant l'implémentation des API
        const updatedProfile = {
          ...profile,
          personal: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: '',
            dateOfBirth: '',
            address: {
              street: '',
              city: '',
              postalCode: '',
              country: 'France'
            },
            bio: ''
          },
          academic: {
            studentId: user.id?.toString() || '',
            class: '4ème A',
            level: 'Collège',
            school: 'Collège Jean Moulin',
            startDate: new Date().toISOString(),
            subjects: ['Histoire', 'Géographie', 'Mathématiques', 'Français'],
            favoriteSubjects: ['Histoire', 'Géographie'],
            academicGoals: ['Améliorer mes scores en quiz', 'Terminer tous les modules']
          },
          preferences: {
            language: userPreferences?.language || 'fr',
            timezone: userPreferences?.timezone || 'Europe/Paris',
            theme: (userPreferences?.theme as 'light' | 'dark' | 'auto') || 'dark',
            notifications: userPreferences?.notifications || {
              email: true,
              push: true,
              sms: false,
              quizReminders: true,
              resultsNotifications: true,
              messageNotifications: true
            },
            privacy: userPreferences?.privacy || {
              profileVisibility: 'friends' as const,
              showProgress: true,
              showAchievements: true,
              allowMessages: true
            },
            learning: userPreferences?.learning || {
              studyReminders: true,
              difficultyPreference: 'adaptive' as const,
              timePreference: 'evening' as const,
              sessionDuration: 30
            }
          },
          stats: {
            level: 12,
            xp: 2450,
            totalQuizzes: 14,
            averageScore: 86,
            timeSpent: 420,
            streak: 7,
            badges: ['Révolutionnaire', 'Explorateur urbain', 'Géographe', 'Historien en herbe'],
            achievements: ['Premier quiz terminé', '10 quiz terminés', 'Score parfait', 'Série de 5 victoires'],
            rank: 3,
            totalStudents: 28
          }
        };
        
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, utiliser des données par défaut
      const defaultProfile = {
        ...profile,
        personal: {
          firstName: 'Étudiant',
          lastName: 'Exemple',
          email: 'etudiant@exemple.com',
          phone: '',
          dateOfBirth: '',
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: 'France'
          },
          bio: ''
        }
      };
      setProfile(defaultProfile);
      setEditedProfile(defaultProfile);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Sauvegarder les données dans localStorage en attendant l'implémentation des API
      const userData = localStorage.getItem('userDetails');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          firstName: editedProfile.personal.firstName,
          lastName: editedProfile.personal.lastName,
          email: editedProfile.personal.email
        };
        localStorage.setItem('userDetails', JSON.stringify(updatedUser));
      }
      
      // Sauvegarder les préférences dans localStorage
      const preferences = {
        language: editedProfile.preferences.language,
        timezone: editedProfile.preferences.timezone,
        theme: editedProfile.preferences.theme,
        notifications: editedProfile.preferences.notifications,
        privacy: editedProfile.preferences.privacy,
        learning: editedProfile.preferences.learning
      };
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
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



  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  const renderPersonalTab = () => (
    <div className="space-y-6">
      {/* Photo de profil */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Photo de profil</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold text-xl">
              {editedProfile.personal.firstName} {editedProfile.personal.lastName}
            </h4>
            <p className="text-blue-300">{editedProfile.academic.class} - {editedProfile.academic.school}</p>
            <p className="text-blue-400 text-sm">Niveau {editedProfile.stats.level} • {editedProfile.stats.xp} XP</p>
          </div>
        </div>
      </div>

      {/* Informations de base */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Informations de base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-200 text-sm mb-2">Prénom</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.personal.firstName}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal, firstName: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Nom</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.personal.lastName}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal, lastName: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.lastName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.personal.email}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal, email: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Téléphone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.personal.phone || ''}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal, phone: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.phone || 'Non renseigné'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Date de naissance</label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.personal.dateOfBirth}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal, dateOfBirth: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">
                {new Date(profile.personal.dateOfBirth).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Biographie */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">À propos de moi</h3>
        {isEditing ? (
          <textarea
            value={editedProfile.personal.bio || ''}
            onChange={(e) => setEditedProfile(prev => ({
              ...prev,
              personal: { ...prev.personal, bio: e.target.value }
            }))}
            placeholder="Parlez-nous de vous..."
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 resize-none"
          />
        ) : (
          <p className="text-blue-100">{profile.personal.bio || 'Aucune biographie renseignée'}</p>
        )}
      </div>

      {/* Adresse */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-blue-200 text-sm mb-2">Rue</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.personal.address.street}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    address: { ...prev.personal.address, street: e.target.value }
                  }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.address.street}</p>
            )}
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Ville</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.personal.address.city}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    address: { ...prev.personal.address, city: e.target.value }
                  }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.address.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Code postal</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.personal.address.postalCode}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    address: { ...prev.personal.address, postalCode: e.target.value }
                  }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-white">{profile.personal.address.postalCode}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );





  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Paramètres de sécurité */}
      <SecuritySettings 
        userId={userId || 0}
        currentEmail={profile.personal.email}
      />

      {/* Authentification à deux facteurs */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Authentification à deux facteurs</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200">
              {profile.security.twoFactorEnabled ? 'Activée' : 'Désactivée'}
            </p>
            <p className="text-blue-300 text-sm">
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </p>
          </div>
          <button className={`px-4 py-2 rounded-lg transition-all ${
            profile.security.twoFactorEnabled
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}>
            {profile.security.twoFactorEnabled ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>

      {/* Historique de connexion */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Historique de connexion</h3>
        <div className="space-y-3">
          {profile.security.loginHistory.map((login, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white text-sm">{login.device}</p>
                <p className="text-blue-300 text-xs">{login.location}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-sm">
                  {new Date(login.date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-blue-300 text-xs">
                  {new Date(login.date).toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );



  return (
    <div className="space-y-6">
             {/* En-tête */}
       <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-white text-2xl font-bold mb-2">Mon Profil</h1>
             <p className="text-blue-200">Gérez vos informations personnelles et préférences</p>
             <p className="text-blue-300 text-sm mt-1">💾 Les données sont sauvegardées localement</p>
           </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-400'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div>
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>


    </div>
  );
};

export default ProfileTab;

