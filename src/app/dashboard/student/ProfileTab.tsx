'use client';

import React, { useState, useEffect } from 'react';
import { updateStudentProfile, changePassword } from '@/lib/api';
import { settingsAPI, studentsAPI, authAPI } from '../../../lib/api';
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
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Settings,
  Award,
  Star,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Users,
  Heart,
  Zap,
  Brain,
  Lightbulb,
  Flag,
  Crown,
  Medal,
  Flame,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Music,
  Image,
  Video,
  File,
  Folder,
  Archive,
  Tag,
  Bookmark,
  Link,
  Hash,
  AtSign,
  MessageSquare,
  Send,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Home,
  School,
  GraduationCap,
  Book,
  Pencil,
  Calculator,
  Ruler,
  Compass,
  Map,
  History,
  Globe as GlobeIcon
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
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

  const handlePasswordChange = async () => {
    // Validation des champs
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
      
      // Succès
      alert('Mot de passe modifié avec succès !');
      setShowPasswordModal(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      // Gestion des erreurs
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

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'academic', label: 'Parcours académique', icon: GraduationCap },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'stats', label: 'Statistiques', icon: Trophy }
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

  const renderAcademicTab = () => (
    <div className="space-y-6">
      {/* Informations scolaires */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Informations scolaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-200 text-sm mb-2">Numéro étudiant</label>
            <p className="text-white font-mono">{profile.academic.studentId}</p>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Classe</label>
            <p className="text-white">{profile.academic.class}</p>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Niveau</label>
            <p className="text-white">{profile.academic.level}</p>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">École</label>
            <p className="text-white">{profile.academic.school}</p>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Date d'inscription</label>
            <p className="text-white">
              {new Date(profile.academic.startDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Matières */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Matières étudiées</h3>
        <div className="flex flex-wrap gap-2">
          {profile.academic.subjects.map((subject, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${
                profile.academic.favoriteSubjects.includes(subject)
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {subject}
              {profile.academic.favoriteSubjects.includes(subject) && (
                <Star className="w-3 h-3 ml-1 inline fill-current" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Objectifs académiques */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Objectifs académiques</h3>
        <div className="space-y-3">
          {profile.academic.academicGoals.map((goal, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-blue-100">{goal}</p>
            </div>
          ))}
        </div>
        {isEditing && (
          <button className="mt-4 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Ajouter un objectif</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Préférences générales */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Préférences générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-200 text-sm mb-2">Langue</label>
            <select
              value={editedProfile.preferences.language}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, language: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Fuseau horaire</label>
            <select
              value={editedProfile.preferences.timezone}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, timezone: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(profile.preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-blue-200">
                {key === 'email' ? 'Email' :
                 key === 'push' ? 'Notifications push' :
                 key === 'sms' ? 'SMS' :
                 key === 'quizReminders' ? 'Rappels de quiz' :
                 key === 'resultsNotifications' ? 'Notifications de résultats' :
                 key === 'messageNotifications' ? 'Notifications de messages' : key}
              </span>
              <button
                onClick={() => {
                  if (isEditing) {
                    setEditedProfile(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: {
                          ...prev.preferences.notifications,
                          [key]: !prev.preferences.notifications[key as keyof typeof prev.preferences.notifications]
                        }
                      }
                    }));
                  }
                }}
                disabled={!isEditing}
                className={`w-12 h-6 rounded-full transition-all ${
                  (isEditing ? editedProfile : profile).preferences.notifications[key as keyof typeof profile.preferences.notifications]
                    ? 'bg-blue-500' 
                    : 'bg-white/20'
                } ${!isEditing ? 'opacity-50' : ''}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                  (isEditing ? editedProfile : profile).preferences.notifications[key as keyof typeof profile.preferences.notifications]
                    ? 'translate-x-7' 
                    : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Préférences d'apprentissage */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Préférences d'apprentissage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-200 text-sm mb-2">Difficulté préférée</label>
            <select
              value={editedProfile.preferences.learning.difficultyPreference}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  learning: {
                    ...prev.preferences.learning,
                    difficultyPreference: e.target.value as any
                  }
                }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="adaptive">Adaptative</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Moment préféré</label>
            <select
              value={editedProfile.preferences.learning.timePreference}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  learning: {
                    ...prev.preferences.learning,
                    timePreference: e.target.value as any
                  }
                }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
              <option value="evening">Soir</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          
          <div>
            <label className="block text-blue-200 text-sm mb-2">Durée de session (minutes)</label>
            <input
              type="number"
              min="10"
              max="120"
              value={editedProfile.preferences.learning.sessionDuration}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  learning: {
                    ...prev.preferences.learning,
                    sessionDuration: parseInt(e.target.value)
                  }
                }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Mot de passe */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Mot de passe</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200">Dernière modification : il y a 2 mois</p>
            <p className="text-blue-300 text-sm">Utilisez un mot de passe fort pour protéger votre compte</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
          >
            Changer
          </button>
        </div>
      </div>

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

  const renderStatsTab = () => (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-white text-2xl font-bold">{profile.stats.level}</div>
          <div className="text-blue-300 text-sm">Niveau</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-white text-2xl font-bold">{profile.stats.xp}</div>
          <div className="text-blue-300 text-sm">XP Total</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-white text-2xl font-bold">{profile.stats.totalQuizzes}</div>
          <div className="text-blue-300 text-sm">Quiz terminés</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-white text-2xl font-bold">{profile.stats.averageScore}%</div>
          <div className="text-blue-300 text-sm">Score moyen</div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Badges obtenus</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile.stats.badges.map((badge, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white text-sm font-semibold">{badge}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classement */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">Classement</h3>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-white text-xl font-bold">#{profile.stats.rank}</div>
            <div className="text-blue-300 text-sm">sur {profile.stats.totalStudents}</div>
          </div>
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
        {activeTab === 'academic' && renderAcademicTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'stats' && renderStatsTab()}
      </div>

      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Changer le mot de passe</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Changer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;

