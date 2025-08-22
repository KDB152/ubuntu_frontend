'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  RefreshCw,
  Edit,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

// Types pour TypeScript
interface Course {
  id: string;
  name: string;
  title: string;
  type: string;
  subject: string;
  level: string;
  size: string;
  uploadDate: string;
  views: number;
  status: 'Publié' | 'Brouillon';
  description?: string;
  tags?: string[];
  fileName?: string;
  fileUrl?: string;
}

interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const FileManagementTabImproved = () => {
  // États existants
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Course[]>([]);
  const [currentFiles, setCurrentFiles] = useState<FileUpload[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubject, setCourseSubject] = useState('Histoire');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseLevel, setCourseLevel] = useState('Terminale');
  const [courseTags, setCourseTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Tous');
  const [filterType, setFilterType] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');

  // Nouveaux états pour les fonctionnalités améliorées
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Gestion du drag & drop améliorée
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      return Object.keys(acceptedTypes).includes(file.type) && file.size <= 100 * 1024 * 1024; // 100MB max
    });

    const newFileUploads: FileUpload[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    setCurrentFiles(prev => [...prev, ...newFileUploads]);
  };

  const removeFile = (index: number) => {
    setCurrentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Simulation d'upload améliorée avec gestion d'erreurs
  const simulateUpload = async (fileUpload: FileUpload, index: number): Promise<{success: boolean, url?: string, error?: string}> => {
    const { file } = fileUpload;
    
    try {
      // Simulation d'une vérification de fichier
      if (file.name.includes('error')) {
        throw new Error('Fichier corrompu détecté');
      }

      // Mise à jour du statut
      setCurrentFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading' as const } : f
      ));

      // Simulation du progrès d'upload
      for (let progress = 0; progress <= 100; progress += 10) {
        setCurrentFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, progress } : f
        ));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Succès
      setCurrentFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'success' as const } : f
      ));

      return { success: true, url: `uploads/${file.name}` };
    } catch (error) {
      // Erreur
      setCurrentFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error' as const, error: error instanceof Error ? error.message : 'Erreur inconnue' } : f
      ));
      
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  // Soumission améliorée avec gestion d'erreurs
  const handleSubmit = async () => {
    if (!courseTitle.trim() || currentFiles.length === 0) {
      showNotification('error', 'Veuillez remplir le titre et ajouter au moins un fichier');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload des fichiers
      const uploadPromises = currentFiles.map((fileUpload, index) => simulateUpload(fileUpload, index));
      const results = await Promise.all(uploadPromises);
      
      // Vérifier s'il y a des erreurs
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        showNotification('error', `Erreur lors de l'upload de ${errors.length} fichier(s)`);
        return;
      }
      
      // Créer côté backend puis rafraîchir la liste
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await Promise.all(currentFiles.map((fileUpload, index) => fetch(`${API_BASE}/content/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fileUpload.file.name,
          title: courseTitle,
          type: acceptedTypes[fileUpload.file.type as keyof typeof acceptedTypes]?.label || 'Inconnu',
          subject: courseSubject,
          level: courseLevel,
          size: formatFileSize(fileUpload.file.size),
          status: 'Publié',
          description: courseDescription,
          tags: courseTags.split(',').map(tag => tag.trim()).filter(Boolean),
          file_name: fileUpload.file.name,
          file_url: results[index].url
        })
      })));
      // Reload list
      try {
        const res = await fetch(`${API_BASE}/content/courses`);
        const json = await res.json();
        const mapped: Course[] = (json.items || []).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          title: c.title,
          type: c.type,
          subject: c.subject,
          level: c.level,
          size: c.size,
          uploadDate: c.upload_date?.slice(0,10) || '',
          views: c.views || 0,
          status: c.status,
          description: c.description,
          tags: c.tags || [],
          fileName: c.file_name,
          fileUrl: c.file_url,
        }));
        setUploadedFiles(mapped);
      } catch {}
      
      // Reset du formulaire
      setCourseTitle('');
      setCourseDescription('');
      setCourseTags('');
      setCurrentFiles([]);
      setShowUploadModal(false);
      
      showNotification('success', `${newCourses.length} cours ajouté(s) avec succès !`);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction de suppression
  const handleDelete = async (course: Course) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${API_BASE}/content/courses/${course.id}`, { method: 'DELETE' });
      setUploadedFiles(prev => prev.filter(f => f.id !== course.id));
      
      showNotification('success', 'Cours supprimé avec succès');
      setShowDeleteModal(false);
      setFileToDelete(null);
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'édition
  const handleEdit = async (updatedCourse: Course) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${API_BASE}/content/courses/${updatedCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedCourse.name,
          title: updatedCourse.title,
          subject: updatedCourse.subject,
          level: updatedCourse.level,
          description: updatedCourse.description,
          tags: updatedCourse.tags || [],
          status: updatedCourse.status,
        })
      });
      setUploadedFiles(prev => prev.map(f => f.id === updatedCourse.id ? updatedCourse : f));
      
      showNotification('success', 'Cours modifié avec succès');
      setShowEditModal(false);
      setFileToEdit(null);
    } catch (error) {
      showNotification('error', 'Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de téléchargement
  const handleDownload = async (course: Course) => {
    try {
      // Simulation d'un téléchargement
      const link = document.createElement('a');
      link.href = course.fileUrl || '#';
      link.download = course.fileName || course.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', 'Téléchargement démarré');
    } catch (error) {
      showNotification('error', 'Erreur lors du téléchargement');
    }
  };

  // Fonction de changement de statut
  const toggleStatus = async (course: Course) => {
    const newStatus = course.status === 'Publié' ? 'Brouillon' : 'Publié';
    const updatedCourse = { ...course, status: newStatus };
    await handleEdit(updatedCourse);
  };

  const getFileIcon = (type: string) => {
    const config = Object.values(acceptedTypes).find(t => t.label === type) || acceptedTypes['text/plain'];
    return config;
  };

  // Filtrage amélioré
  const filteredFiles = [...uploadedFiles].filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (file.title && file.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = filterSubject === 'Tous' || file.subject === filterSubject;
    const matchesType = filterType === 'Tous' || file.type === filterType;
    const matchesStatus = filterStatus === 'Tous' || file.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-xl border ${
          notification.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30 text-green-100' 
            : 'bg-red-500/20 border-red-500/30 text-red-100'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* En-tête amélioré */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Shield className="w-8 h-8 text-blue-300 mr-4" />
              Administration - Gestion des cours
            </h1>
            <p className="text-blue-200 mt-2">Gérez vos contenus pédagogiques : ajout, modification, suppression</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-blue-300">
              <span>Total: {filteredFiles.length} cours</span>
              <span>Publiés: {filteredFiles.filter(f => f.status === 'Publié').length}</span>
              <span>Brouillons: {filteredFiles.filter(f => f.status === 'Brouillon').length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un cours</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtres et recherche améliorés */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, titre ou matière..."
              className="pl-10 pr-4 py-3 w-full border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>
          <div className="flex items-center space-x-3">
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Publié">Publié</option>
              <option value="Brouillon">Brouillon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des fichiers améliorée */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center">
            <File className="w-5 h-5 text-blue-300 mr-2" />
            Cours disponibles ({filteredFiles.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Cours</th>
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
              {filteredFiles.map((file) => {
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
                          {file.description && (
                            <p className="text-xs text-blue-400 mt-1 max-w-xs truncate">{file.description}</p>
                          )}
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
                      <button
                        onClick={() => toggleStatus(file)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                          file.status === 'Publié' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {file.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDownload(file)}
                          className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setFileToEdit(file);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-green-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setFileToDelete(file);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Supprimer"
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
          
          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <File className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-200 text-lg">Aucun cours trouvé</p>
              <p className="text-blue-300 text-sm">Essayez de modifier vos filtres ou ajoutez un nouveau cours</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'upload amélioré */}
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
                  <label className="block text-sm font-semibold text-white mb-2">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={courseTags}
                    onChange={(e) => setCourseTags(e.target.value)}
                    placeholder="Ex: révolution, france, histoire"
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Description détaillée du cours..."
                  rows={3}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                />
              </div>

              {/* Zone de drop améliorée */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-400/10' 
                    : 'border-white/30 hover:border-white/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-blue-200 mb-4">
                  ou cliquez pour sélectionner (PDF, TXT, MP4, AVI, MOV - max 100MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.txt,.mp4,.avi,.mov"
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Sélectionner des fichiers
                </button>
              </div>

              {/* Liste des fichiers sélectionnés avec statut */}
              {currentFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Fichiers sélectionnés</h3>
                  {currentFiles.map((fileUpload, index) => {
                    const { file, progress, status, error } = fileUpload;
                    const iconConfig = acceptedTypes[file.type as keyof typeof acceptedTypes] || acceptedTypes['text/plain'];
                    const IconComponent = iconConfig.icon;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconConfig.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-blue-200">{formatFileSize(file.size)}</p>
                          
                          {status === 'uploading' && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
                                <span>Upload en cours...</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {status === 'success' && (
                            <div className="flex items-center space-x-1 mt-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-green-400">Upload réussi</span>
                            </div>
                          )}
                          
                          {status === 'error' && (
                            <div className="flex items-center space-x-1 mt-1">
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-xs text-red-400">{error || 'Erreur d\'upload'}</span>
                            </div>
                          )}
                        </div>
                        
                        {status === 'pending' && (
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        
                        {status === 'uploading' && (
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                  disabled={isUploading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || currentFiles.length === 0 || !courseTitle.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Confirmer la suppression</h3>
                  <p className="text-blue-200 text-sm">Cette action est irréversible</p>
                </div>
              </div>
              
              <p className="text-blue-200 mb-6">
                Êtes-vous sûr de vouloir supprimer le cours <strong className="text-white">"{fileToDelete.title || fileToDelete.name}"</strong> ?
              </p>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFileToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(fileToDelete)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && fileToEdit && (
        <EditCourseModal
          course={fileToEdit}
          onSave={handleEdit}
          onClose={() => {
            setShowEditModal(false);
            setFileToEdit(null);
          }}
          isLoading={isLoading}
          subjects={subjects}
          levels={levels}
        />
      )}
    </div>
  );
};

// Composant Modal d'édition séparé
interface EditCourseModalProps {
  course: Course;
  onSave: (course: Course) => void;
  onClose: () => void;
  isLoading: boolean;
  subjects: string[];
  levels: string[];
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ 
  course, 
  onSave, 
  onClose, 
  isLoading, 
  subjects, 
  levels 
}) => {
  const [editedCourse, setEditedCourse] = useState<Course>(course);

  const handleSave = () => {
    onSave(editedCourse);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Edit className="w-6 h-6 text-blue-300 mr-3" />
            Modifier le cours
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Nom du fichier</label>
              <input
                type="text"
                value={editedCourse.name}
                onChange={(e) => setEditedCourse(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Titre du cours</label>
              <input
                type="text"
                value={editedCourse.title}
                onChange={(e) => setEditedCourse(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Matière</label>
              <select
                value={editedCourse.subject}
                onChange={(e) => setEditedCourse(prev => ({ ...prev, subject: e.target.value }))}
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
                value={editedCourse.level}
                onChange={(e) => setEditedCourse(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Description</label>
            <textarea
              value={editedCourse.description || ''}
              onChange={(e) => setEditedCourse(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Tags (séparés par des virgules)</label>
            <input
              type="text"
              value={editedCourse.tags?.join(', ') || ''}
              onChange={(e) => setEditedCourse(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagementTabImproved;

