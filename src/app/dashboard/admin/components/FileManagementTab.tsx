'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  Video, 
  X, 
  Check, 
  AlertCircle,
  Plus,
  BookOpen,
  Play,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  User,
  Tag,
  Save,
  RefreshCw
} from 'lucide-react';

const FileManagementTab = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
  
  // Fichiers existants (simulation)
  const [existingFiles] = useState([
    {
      id: 1,
      name: 'La Révolution française.pdf',
      type: 'PDF',
      subject: 'Histoire',
      level: 'Terminale',
      size: '2.4 MB',
      uploadDate: '2025-01-15',
      views: 234,
      status: 'Publié'
    },
    {
      id: 2,
      name: 'Les climats européens.mp4',
      type: 'Vidéo',
      subject: 'Géographie',
      level: 'Terminale',
      size: '45.7 MB',
      uploadDate: '2025-01-14',
      views: 187,
      status: 'Publié'
    },
    {
      id: 3,
      name: 'Cours EMC - Démocratie.txt',
      type: 'Texte',
      subject: 'EMC',
      level: 'Terminale',
      size: '156 KB',
      uploadDate: '2025-01-13',
      views: 142,
      status: 'Brouillon'
    }
  ]);

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

  const filteredFiles = [...existingFiles, ...uploadedFiles].filter(file => {
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
              <option value="Tous">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Tous">Tous les types</option>
              <option value="PDF">PDF</option>
              <option value="Vidéo">Vidéo</option>
              <option value="Texte">Texte</option>
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
                        <button className="p-2 text-red-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
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
                      <option key={subject} value={subject}>{subject}</option>
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
                      <option key={level} value={level}>{level}</option>
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

export default FileManagementTab;