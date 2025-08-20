'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users,
  BookOpen,
  Award,
  MessageSquare,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Plus,
  BarChart3,
  FileText,
  Video,
  Calendar,
  Target,
  Globe,
  MapPin,
  Scroll,
  Menu,
  X,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Home,
  Shield,
  Activity,
  Zap,
  UserPlus,
  BookPlus,
  TrendingDown,
  Flame,
  Brain,
  Sparkles,
  Timer,
  Medal,
  Heart,
  ArrowRight,
  LogOut,
  AlertTriangle,
  File,
  Check,
  Save,
  RefreshCw,
  Play,
  User,
  Tag,
  LucideProps
} from 'lucide-react';

// Composant FileManagementTab intégré
const FileManagementTab = ({ uploadedFiles, setUploadedFiles }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubject, setCourseSubject] = useState('Histoire');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseLevel, setCourseLevel] = useState('Terminale');
  const [courseTags, setCourseTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Tous');
  const [filterType, setFilterType] = useState('Tous');

  const fileInputRef = useRef(null);

  // Types de fichiers acceptés
  const acceptedTypes = {
    'application/pdf': { label: 'PDF', icon: FileText, color: 'text-red-500 bg-red-100' },
    'text/plain': { label: 'TXT', icon: File, color: 'text-blue-500 bg-blue-100' },
    'video/mp4': { label: 'MP4', icon: Video, color: 'text-purple-500 bg-purple-100' },
    'video/avi': { label: 'AVI', icon: Video, color: 'text-purple-500 bg-purple-100' },
    'video/mov': { label: 'MOV', icon: Video, color: 'text-purple-500 bg-purple-100' }
  };

  const subjects = ['Histoire', 'Géographie', 'EMC'];
  const levels = ['Seconde', 'Première', 'Terminale'];

  // Gestion du drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      return Object.keys(acceptedTypes).includes(file.type) && file.size <= 100 * 1024 * 1024; // 100MB max
    });

    setCurrentFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setCurrentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const simulateUpload = async (file, index) => {
    const fileId = `${file.name}-${index}`;

    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { success: true, url: `uploads/${file.name}` };
  };

  const handleSubmit = async () => {
    if (!courseTitle.trim() || currentFiles.length === 0) {
      alert('Veuillez remplir le titre et ajouter au moins un fichier');
      return;
    }

    setIsUploading(true);

    try {
      // Simulation de l'upload
      const uploadPromises = currentFiles.map((file, index) => simulateUpload(file, index));
      await Promise.all(uploadPromises);

      // Ajouter aux fichiers uploadés
      const newFiles = currentFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: acceptedTypes[file.type]?.label || 'Inconnu',
        subject: courseSubject,
        level: courseLevel,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0,
        status: 'Publié',
        title: courseTitle,
        description: courseDescription,
        tags: courseTags.split(',').map(tag => tag.trim()).filter(Boolean)
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Reset du formulaire
      setCourseTitle('');
      setCourseDescription('');
      setCourseTags('');
      setCurrentFiles([]);
      setUploadProgress({});
      setShowUploadModal(false);

      alert('Fichiers uploadés avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type) => {
    const config = Object.values(acceptedTypes).find(t => t.label === type) || acceptedTypes['text/plain'];
    return config;
  };

  // Fonction pour supprimer un fichier
  const handleDeleteFile = (fileId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  const filteredFiles = [...uploadedFiles].filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'Tous' || file.subject === filterSubject;
    const matchesType = filterType === 'Tous' || file.type === filterType;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <BookOpen className="w-8 h-8 text-blue-300 mr-4" />
              Gestion des fichiers de cours
            </h1>
            <p className="text-blue-200 mt-2">Ajoutez et gérez vos contenus pédagogiques</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un cours</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un fichier..."
              className="pl-10 pr-4 py-3 w-full border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Tous" className="bg-slate-800 text-white">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject} className="bg-slate-800 text-white">{subject}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Tous" className="bg-slate-800 text-white">Tous les types</option>
              <option value="PDF" className="bg-slate-800 text-white">PDF</option>
              <option value="Vidéo" className="bg-slate-800 text-white">Vidéo</option>
              <option value="Texte" className="bg-slate-800 text-white">Texte</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des fichiers */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center">
            <File className="w-5 h-5 text-blue-300 mr-2" />
            Fichiers de cours ({filteredFiles.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Fichier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Matière</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Taille</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Vues</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredFiles.map((file, index) => {
                const iconConfig = getFileIcon(file.type);
                const IconComponent = iconConfig.icon;

                return (
                  <tr key={file.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconConfig.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          {file.title && <p className="text-xs text-blue-300">{file.title}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-200">{file.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-200">{file.subject}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-200">{file.size}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-200">{file.uploadDate}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-200">{file.views}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        file.status === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {file.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-red-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête de la modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Upload className="w-6 h-6 text-blue-300 mr-3" />
                Ajouter un nouveau cours
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations du cours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Titre du cours *</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Ex: La Révolution française"
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Matière</label>
                  <select
                    value={courseSubject}
                    onChange={(e) => setCourseSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject} className="bg-slate-800 text-white">{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Niveau</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    {levels.map(level => (
                      <option key={level} value={level} className="bg-slate-800 text-white">{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Tags (séparés par virgule)</label>
                  <input
                    type="text"
                    value={courseTags}
                    onChange={(e) => setCourseTags(e.target.value)}
                    placeholder="révolution, politique, société"
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Décrivez le contenu du cours..."
                  rows="3"
                  className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                />
              </div>

              {/* Zone de drag & drop */}
              <div>
                <label className="block text-sm font-semibold text-white mb-4">Fichiers du cours *</label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-white/30 hover:border-white/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.txt,.mp4,.avi,.mov"
                    onChange={(e) => handleFiles(Array.from(e.target.files))}
                    className="hidden"
                  />

                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white mb-2">
                        Glissez vos fichiers ici ou cliquez pour parcourir
                      </p>
                      <p className="text-blue-200 text-sm">
                        Formats acceptés: PDF, TXT, MP4, AVI, MOV (max 100MB)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      Choisir des fichiers
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des fichiers sélectionnés */}
              {currentFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Fichiers sélectionnés ({currentFiles.length})</h3>
                  <div className="space-y-3">
                    {currentFiles.map((file, index) => {
                      const fileType = acceptedTypes[file.type] || acceptedTypes['text/plain'];
                      const IconComponent = fileType.icon;
                      const progressKey = `${file.name}-${index}`;
                      const progress = uploadProgress[progressKey] || 0;

                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fileType.color}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white truncate">{file.name}</p>
                              <p className="text-xs text-blue-300">{formatFileSize(file.size)}</p>
                              {progress > 0 && progress < 100 && (
                                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          {!isUploading && (
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-300 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/20">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold backdrop-blur-sm disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUploading || !courseTitle.trim() || currentFiles.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Upload en cours...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Publier le cours</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Modal de Déconnexion
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Confirmation de déconnexion</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="mb-8">
          <p className="text-blue-200 text-lg mb-2">
            Voulez-vous vraiment vous déconnecter ?
          </p>
          <p className="text-blue-300 text-sm">
            Vous devrez vous reconnecter pour accéder au panel d'administration.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold backdrop-blur-sm"
          >
            Non, rester connecté
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Oui, se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // État pour la gestion des fichiers - CRITIQUE pour la fonctionnalité
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fonction de déconnexion
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Nettoyer les données de session
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('adminSession');
      sessionStorage.clear();
    } catch (error) {
      console.log('Nettoyage du storage:', error);
    }

    // Redirection vers la page de login
    window.location.href = '/login';
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const [adminName, setAdminName] = useState("Administrateur");
  const [adminEmail, setAdminEmail] = useState("admin@chronocarto.fr");

  // Données simulées pour l'admin avec plus de détails
  const adminData = {
    totalStudents: 156,
    totalParents: 98,
    totalCourses: 24,
    totalQuizzes: 45,
    activeUsers: 142,
    newRegistrations: 8,
    averageScore: 14.2,
    completionRate: 73,
    weeklyGrowth: 12,
    monthlyRevenue: 2450,
    systemUptime: 99.8,
    supportTickets: 12
  };

  const recentActivity = [
    {
      type: 'user',
      action: 'Nouvel étudiant inscrit',
      user: 'Pierre Martin',
      time: '2 min',
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100'
    },
    {
      type: 'content',
      action: 'Cours publié',
      user: 'Admin',
      details: 'La Révolution française',
      time: '15 min',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    {
      type: 'quiz',
      action: 'Quiz terminé',
      user: 'Marie Dubois',
      details: 'Score: 18/20',
      time: '32 min',
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    },
    {
      type: 'message',
      action: 'Nouveau message',
      user: 'Parent Dupont',
      time: '1h',
      icon: MessageSquare,
      color: 'text-orange-500',
      bg: 'bg-orange-100'
    },
    {
      type: 'suggestion',
      action: 'Nouvelle suggestion',
      user: 'Classe Terminale S',
      details: 'Plus de vidéos en géographie',
      time: '2h',
      icon: Target,
      color: 'text-pink-500',
      bg: 'bg-pink-100'
    }
  ];

  const topPerformers = [
    { name: 'Marie Dubois', class: 'Terminale S', score: 18.5, progress: 95, trend: '+2.1' },
    { name: 'Jean Moreau', class: 'Terminale ES', score: 17.8, progress: 92, trend: '+1.8' },
    { name: 'Sophie Laurent', class: 'Terminale L', score: 17.2, progress: 88, trend: '+1.5' },
    { name: 'Paul Durand', class: 'Terminale S', score: 16.9, progress: 85, trend: '+1.2' }
  ];

  const contentStats = [
    { subject: 'Histoire', courses: 8, videos: 12, quizzes: 15, engagement: 87, growth: '+5%' },
    { subject: 'Géographie', courses: 7, videos: 10, quizzes: 12, engagement: 82, growth: '+3%' },
    { subject: 'EMC', courses: 9, videos: 8, quizzes: 18, engagement: 79, growth: '+7%' }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, color: 'text-blue-500' },
    { id: 'users', label: 'Utilisateurs', icon: Users, color: 'text-emerald-500' },
    { id: 'content', label: 'Contenu', icon: BookOpen, color: 'text-purple-500' },
    { id: 'quizzes', label: 'Quiz', icon: Award, color: 'text-orange-500' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-pink-500' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-indigo-500' },
    { id: 'suggestions', label: 'Suggestions', icon: Target, color: 'text-yellow-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-red-500' },
    { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-500' }
  ];

  const subjectColors = {
    'Histoire': 'from-red-500 to-pink-600',
    'Géographie': 'from-emerald-500 to-blue-600',
    'EMC': 'from-purple-500 to-indigo-600'
  };

  const subjectIcons = {
    'Histoire': Scroll,
    'Géographie': Globe,
    'EMC': Shield
  };

  const weeklyStats = {
    monday: 85,
    tuesday: 92,
    wednesday: 78,
    thursday: 95,
    friday: 88,
    saturday: 76,
    sunday: 82
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return (
      <div className={`w-10 h-10 ${activity.bg} rounded-xl flex items-center justify-center`}>
        <IconComponent className={`w-5 h-5 ${activity.color}`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar moderne avec thème cohérent */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-800/95 to-blue-900/95 backdrop-blur-xl shadow-2xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>

        {/* Header du sidebar */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-8 w-10 h-10 bg-white rounded-full animate-bounce"></div>
          </div>

          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl">Admin Panel</span>
              <p className="text-blue-100 text-sm font-medium">Chrono-Carto</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profil admin moderne */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-800/50 to-blue-800/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/20">
              <span className="text-white font-bold text-lg">AD</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-lg">{adminName}</p>
              <p className="text-sm text-blue-200 font-medium">{adminEmail}</p>
              <p className="text-xs text-blue-300">Chrono-Carto</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">{adminData.systemUptime}%</span>
              </div>
              <span className="text-xs text-blue-300">uptime</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Utilisateurs actifs */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Utilisateurs actifs</span>
                <span className="text-sm font-bold text-white">{adminData.activeUsers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-300">Système opérationnel</span>
              </div>
            </div>

            {/* Croissance hebdomadaire */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Croissance</span>
                <span className="text-sm font-bold text-emerald-400">+{adminData.weeklyGrowth}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${adminData.weeklyGrowth * 5}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation moderne */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105 border border-white/20'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
              </div>
              <span className="font-semibold">{item.label}</span>
              {(item.id === 'messages' && notifications > 0) || (item.id === 'notifications' && adminData.supportTickets > 0) ? (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.id === 'messages' ? notifications : adminData.supportTickets}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Actions rapides modernes */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5" />
                <span className="font-bold">Actions rapides</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('content')}
                  className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un cours</span>
                </button>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Créer un quiz</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nouvel utilisateur</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Déconnexion avec modal */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-4 py-3 text-blue-200 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-0">
        {/* Header moderne */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-blue-200 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {getTimeOfDay()}, Administrateur !
                </h1>
                <p className="text-blue-200 text-sm font-medium">{formatDate(currentTime)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sélecteur de période */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                <option value="day" className="bg-slate-800 text-white">Aujourd'hui</option>
                <option value="week" className="bg-slate-800 text-white">Cette semaine</option>
                <option value="month" className="bg-slate-800 text-white">Ce mois</option>
                <option value="year" className="bg-slate-800 text-white">Cette année</option>
              </select>

              {/* Barre de recherche moderne */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-3 w-80 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profil rapide admin */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-white">Admin</p>
                  <p className="text-sm text-blue-200">Système</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl flex items-center justify-center border-2 border-white/20">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                {/* Bouton déconnexion dans le header */}
                <button
                  onClick={handleLogoutClick}
                  className="p-2 text-blue-200 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal avec fond cohérent */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Métriques principales modernes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-blue-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Étudiants</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.totalStudents}</p>
                      <p className="text-emerald-400 text-sm font-semibold flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{adminData.newRegistrations} cette semaine
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-emerald-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Parents connectés</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.totalParents}</p>
                      <p className="text-blue-200 text-sm font-semibold flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        {Math.round((adminData.totalParents/adminData.totalStudents)*100)}% de liaison
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-purple-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Contenu publié</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.totalCourses + uploadedFiles.length}</p>
                      <p className="text-purple-400 text-sm font-semibold flex items-center mt-1">
                        <Award className="w-4 h-4 mr-1" />
                        {adminData.totalQuizzes} quiz
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-amber-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Taux de réussite</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.completionRate}%</p>
                      <p className="text-emerald-400 text-sm font-semibold flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Moyenne: {adminData.averageScore}/20
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphique d'activité moderne */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Activity className="w-6 h-6 text-blue-300 mr-3" />
                    Activité système de la semaine
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-blue-200 font-medium">Utilisateurs actifs</span>
                  </div>
                </div>
                <div className="flex items-end justify-between space-x-3 h-40">
                  {Object.entries(weeklyStats).map(([day, value], index) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-lg transition-all duration-500 hover:shadow-lg relative group"
                        style={{ height: `${(value/100)*100}%`, minHeight: '8px' }}
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/20">
                          {value} utilisateurs
                        </div>
                      </div>
                      <span className="text-xs text-blue-200 mt-3 font-medium capitalize">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activité récente et Top performers - Layout moderne */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Activité récente modernisée */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Sparkles className="w-6 h-6 text-amber-400 mr-3" />
                      Activité récente
                    </h2>
                    <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                      Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="group p-4 border border-white/20 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center space-x-4">
                          {getActivityIcon(activity)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{activity.action}</p>
                            <p className="text-xs text-blue-200">
                              {activity.user}
                              {activity.details && ` • ${activity.details}`}
                            </p>
                          </div>
                          <span className="text-xs text-blue-300 font-medium">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top performers modernisé */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Medal className="w-6 h-6 text-yellow-400 mr-3" />
                      Meilleurs élèves
                    </h2>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-4">
                    {topPerformers.map((student, index) => (
                      <div key={index} className="group p-4 border border-white/20 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white group-hover:text-yellow-300 transition-colors">{student.name}</p>
                            <p className="text-xs text-blue-200">{student.class}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{student.score}/20</p>
                            <div className="flex items-center text-xs text-emerald-400 font-semibold">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {student.trend}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-blue-200 font-medium">Progression</span>
                            <span className="text-xs font-bold text-white">{student.progress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistiques par matière modernisées */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Brain className="w-6 h-6 text-purple-400 mr-3" />
                    Statistiques par matière
                  </h2>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-xs bg-white/10 text-blue-200 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                      Cours
                    </button>
                    <button className="px-4 py-2 text-xs bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
                      Engagement
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contentStats.map((subject, index) => {
                    const SubjectIcon = subjectIcons[subject.subject] || FileText;
                    return (
                      <div key={index} className="group p-6 border border-white/20 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">{subject.subject}</h3>
                          <div className={`w-12 h-12 bg-gradient-to-br ${subjectColors[subject.subject]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                            <SubjectIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-white/10 rounded-lg border border-white/20">
                              <p className="text-2xl font-bold text-white">{subject.courses}</p>
                              <p className="text-xs text-blue-200">Cours</p>
                            </div>
                            <div className="text-center p-3 bg-white/10 rounded-lg border border-white/20">
                              <p className="text-2xl font-bold text-white">{subject.videos}</p>
                              <p className="text-xs text-blue-200">Vidéos</p>
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-lg border border-white/20">
                            <p className="text-2xl font-bold text-white">{subject.quizzes}</p>
                            <p className="text-xs text-blue-200">Quiz disponibles</p>
                          </div>
                          <div className="pt-4 border-t border-white/20">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-blue-200 font-medium">Engagement</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-white">{subject.engagement}%</span>
                                <span className="text-xs text-emerald-400 font-semibold">{subject.growth}</span>
                              </div>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3">
                              <div
                                className={`bg-gradient-to-r ${subjectColors[subject.subject]} h-3 rounded-full transition-all duration-1000 shadow-sm relative`}
                                style={{ width: `${subject.engagement}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides modernes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button className="group p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                  <div className="flex flex-col items-center space-y-3 relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookPlus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Nouveau cours</span>
                    <span className="text-sm opacity-80">Créer du contenu</span>
                  </div>
                </button>

                <button className="group p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                  <div className="flex flex-col items-center space-y-3 relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Créer un quiz</span>
                    <span className="text-sm opacity-80">Évaluer les élèves</span>
                  </div>
                </button>

                <button className="group p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                  <div className="flex flex-col items-center space-y-3 relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Gérer utilisateurs</span>
                    <span className="text-sm opacity-80">Administration</span>
                  </div>
                </button>

                <button className="group p-6 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                  <div className="flex flex-col items-center space-y-3 relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Voir analytics</span>
                    <span className="text-sm opacity-80">Statistiques avancées</span>
                  </div>
                </button>
              </div>

              {/* Métriques supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Revenus mensuels</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{adminData.monthlyRevenue}€</p>
                  <p className="text-emerald-400 text-sm font-semibold">+12% ce mois</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Tickets support</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{adminData.supportTickets}</p>
                  <p className="text-orange-400 text-sm font-semibold">3 en attente</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Temps de fonctionnement</h3>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{adminData.systemUptime}%</p>
                  <p className="text-emerald-400 text-sm font-semibold">Excellent</p>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Contenu - Gestion des fichiers */}
          {activeTab === 'content' && (
            <FileManagementTab
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          )}


           {/* Autres onglets avec design cohérent */}
          {activeTab !== 'dashboard' && activeTab !== 'content' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                {sidebarItems.find(item => item.id === activeTab)?.icon && (
                  React.createElement(sidebarItems.find(item => item.id === activeTab).icon, {
                    className: "w-12 h-12 text-white"
                  })
                )}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Section {sidebarItems.find(item => item.id === activeTab)?.label}
              </h3>
              <p className="text-blue-200 mb-8 max-w-md mx-auto text-lg">
                Cette section sera bientôt disponible avec toutes les fonctionnalités administratives avancées.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Retour au tableau de bord
                </button>
                <button className="px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold backdrop-blur-sm">
                  En savoir plus
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de déconnexion */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default AdminDashboard;
