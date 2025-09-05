'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { getAuthToken, checkAuthAndRedirect } from '../../../utils/auth';
import { generateDownloadFileName, getDisplayFileType } from '@/lib/fileUtils';
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

// Types pour TypeScript - Interface pour les fichiers de la base de données
interface FileFromDB {
  id: number;
  title: string;
  description: string;
  fileName: string;
  storedName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: number;
  isPublic: boolean;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  targetClass: string;
  targetClasses: string[];
}

// Interface pour l'affichage dans l'interface
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
  targetClasses?: string[];
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
  const [courseClass, setCourseClass] = useState<string[]>(['Terminale groupe 1']);
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

  // Charger les fichiers existants au démarrage
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // Vérifier l'authentification
        const token = getAuthToken();
        
        if (!token) {
          showNotification('error', 'Token d\'authentification manquant. Veuillez vous reconnecter.');
          return;
        }
        
        // Charger les fichiers depuis la nouvelle API
        const response = await fetch(`${API_BASE}/files`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            showNotification('error', 'Session expirée. Veuillez vous reconnecter.');
            // Rediriger vers la page de connexion
            window.location.href = '/login';
            return;
          }
          throw new Error(`Erreur de connexion à l'API: ${response.status}`);
        }
        
        const filesFromDB: FileFromDB[] = await response.json();
        
        // Mapper les données de la base vers l'interface d'affichage
        // Filtrer seulement les fichiers actifs
        const activeFiles = (filesFromDB || []).filter(f => f.isActive === true);
        const mapped: Course[] = activeFiles.map((f: FileFromDB) => {
          // Déterminer le type d'affichage
          const displayType = getDisplayFileType(f.fileName, f.fileType);
          
          // Nettoyer et normaliser les classes cibles
          let cleanTargetClasses: string[] = [];
          
          // Essayer d'abord targetClasses (nouveau format)
          if (f.targetClasses) {
            try {
              // Si c'est déjà un tableau, l'utiliser directement
              if (Array.isArray(f.targetClasses)) {
                cleanTargetClasses = f.targetClasses.filter(cls => typeof cls === 'string');
              } else {
                // Si c'est une chaîne JSON, la parser
                const parsed = JSON.parse(f.targetClasses);
                if (Array.isArray(parsed)) {
                  cleanTargetClasses = parsed.filter(cls => typeof cls === 'string');
                } else {
                  cleanTargetClasses = [parsed];
                }
              }
            } catch (error) {
              console.warn(`Erreur parsing targetClasses pour fichier ${f.id}:`, error);
            }
          }
          
          // Fallback sur targetClass (ancien format)
          if (cleanTargetClasses.length === 0 && f.targetClass) {
            try {
              // Si c'est déjà une chaîne, l'utiliser directement
              if (typeof f.targetClass === 'string' && !f.targetClass.startsWith('[')) {
                cleanTargetClasses = [f.targetClass];
              } else {
                // Si c'est du JSON, le parser
                const parsed = JSON.parse(f.targetClass);
                if (Array.isArray(parsed)) {
                  cleanTargetClasses = parsed.filter(cls => typeof cls === 'string');
                } else {
                  cleanTargetClasses = [parsed];
                }
              }
            } catch (e) {
              cleanTargetClasses = [f.targetClass];
            }
          }
          
          // Déterminer la matière basée sur les classes cibles nettoyées
          let subject = 'Général';
          if (cleanTargetClasses.length > 0) {
            const firstClass = cleanTargetClasses[0];
            if (firstClass.includes('Histoire')) subject = 'Histoire';
            else if (firstClass.includes('Géographie')) subject = 'Géographie';
            else if (firstClass.includes('EMC')) subject = 'EMC';
          }
          
          // Déterminer le niveau basé sur les classes cibles nettoyées
          let level = 'Tous niveaux';
          if (cleanTargetClasses.length > 0) {
            const firstClass = cleanTargetClasses[0];
            if (firstClass.includes('Terminale')) level = 'Terminale';
            else if (firstClass.includes('1ère') || firstClass.includes('Première')) level = 'Première';
            else if (firstClass.includes('Seconde')) level = 'Seconde';
          }
          
          return {
            id: String(f.id),
            name: f.fileName,
            title: f.title,
            type: displayType,
            subject: subject,
            level: level,
            size: formatFileSize(f.fileSize),
            uploadDate: f.createdAt ? new Date(f.createdAt).toISOString().split('T')[0] : '',
            views: f.downloadCount || 0,
            status: f.isActive ? 'Publié' : 'Brouillon',
            description: f.description || '',
            tags: [],
            fileName: f.fileName,
            fileUrl: f.filePath,
            targetClasses: cleanTargetClasses
          };
        });
        setUploadedFiles(mapped);
        
        if (mapped.length > 0) {
          showNotification('success', `${mapped.length} fichier(s) chargé(s) avec succès`);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fichiers:', error);
        showNotification('error', `Erreur lors du chargement des fichiers: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };
    
    loadFiles();
  }, []);

  // Types de fichiers acceptés - tous les types maintenant acceptés
  const getFileTypeInfo = (fileType: string) => {
    const typeMap: { [key: string]: { label: string; icon: any; color: string } } = {
      'application/pdf': { label: 'PDF', icon: FileText, color: 'text-red-500 bg-red-100' },
      'text/plain': { label: 'TXT', icon: File, color: 'text-blue-500 bg-blue-100' },
      'video/mp4': { label: 'MP4', icon: Video, color: 'text-purple-500 bg-purple-100' },
      'video/avi': { label: 'AVI', icon: Video, color: 'text-purple-500 bg-purple-100' },
      'video/mov': { label: 'MOV', icon: Video, color: 'text-purple-500 bg-purple-100' },
      'image/jpeg': { label: 'JPG', icon: File, color: 'text-green-500 bg-green-100' },
      'image/png': { label: 'PNG', icon: File, color: 'text-green-500 bg-green-100' },
      'application/msword': { label: 'DOC', icon: FileText, color: 'text-blue-500 bg-blue-100' },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOCX', icon: FileText, color: 'text-blue-500 bg-blue-100' },
      'application/vnd.ms-excel': { label: 'XLS', icon: FileText, color: 'text-green-500 bg-green-100' },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'XLSX', icon: FileText, color: 'text-green-500 bg-green-100' },
      'application/vnd.ms-powerpoint': { label: 'PPT', icon: FileText, color: 'text-orange-500 bg-orange-100' },
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPTX', icon: FileText, color: 'text-orange-500 bg-orange-100' },
      'application/zip': { label: 'ZIP', icon: File, color: 'text-gray-500 bg-gray-100' },
      'application/x-rar-compressed': { label: 'RAR', icon: File, color: 'text-gray-500 bg-gray-100' },
      'application/x-msdownload': { label: 'EXE', icon: Settings, color: 'text-yellow-500 bg-yellow-100' },
      'application/octet-stream': { label: 'BIN', icon: File, color: 'text-gray-500 bg-gray-100' }
    };
    
    // Vérifier si c'est un fichier exécutable par extension
    if (fileType === 'application/octet-stream' || fileType === 'application/x-msdownload') {
      return typeMap['application/x-msdownload'];
    }
    
    return typeMap[fileType] || { 
      label: fileType.split('/')[1]?.toUpperCase() || 'FILE', 
      icon: File, 
      color: 'text-gray-500 bg-gray-100' 
    };
  };

  const subjects = ['Histoire', 'Géographie', 'EMC'];
  const levels = ['Seconde', 'Première', 'Terminale'];
  const classes = [
    'Terminale groupe 1',
    'Terminale groupe 2', 
    'Terminale groupe 3',
    'Terminale groupe 4',
    '1ère groupe 1',
    '1ère groupe 2',
    '1ère groupe 3'
  ];

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
      return file.size <= 100 * 1024 * 1024; // 100MB max - tous les types acceptés
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

  // Upload réel de fichier vers le serveur
  const uploadFile = async (fileUpload: FileUpload, index: number): Promise<{success: boolean, url?: string, error?: string}> => {
    const { file } = fileUpload;
    
    try {
      // Mise à jour du statut
      setCurrentFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading' as const } : f
      ));

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', courseTitle);
      formData.append('description', courseDescription);
      formData.append('targetClass', JSON.stringify(courseClass));

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      // Upload du fichier
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      
      // Succès
      setCurrentFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'success' as const } : f
      ));

      return { success: true, url: result.filePath };
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
    if (!courseTitle.trim()) {
      showNotification('error', 'Veuillez remplir le titre du cours');
      return;
    }
    
    if (currentFiles.length === 0) {
      showNotification('error', 'Veuillez ajouter au moins un fichier');
      return;
    }

    // Validation des fichiers
    const invalidFiles = currentFiles.filter(fileUpload => {
      const file = fileUpload.file;
      return file.size > 100 * 1024 * 1024; // 100MB max
    });
    
    if (invalidFiles.length > 0) {
      showNotification('error', `${invalidFiles.length} fichier(s) trop volumineux. Taille maximum autorisée : 100MB`);
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload des fichiers
      const uploadPromises = currentFiles.map((fileUpload, index) => uploadFile(fileUpload, index));
      const results = await Promise.all(uploadPromises);
      
      // Vérifier s'il y a des erreurs
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        showNotification('error', `Erreur lors de l'upload de ${errors.length} fichier(s)`);
        return;
      }
      
      // Créer côté backend puis rafraîchir la liste
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Vérifier l'authentification
      const token = getAuthToken();
      
      if (!token) {
        showNotification('error', 'Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }
      
      try {
        // Les fichiers ont déjà été créés lors de l'upload, pas besoin de les recréer
        console.log('✅ Fichiers uploadés avec succès');
        
        // Reload list
        const res = await fetch(`${API_BASE}/files`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Erreur lors du rechargement de la liste');
        }
        
        const json = await res.json();
        const mapped: Course[] = (json || []).map((f: any) => {
          // Parser les classes cibles
          let cleanTargetClasses: string[] = [];
          if (f.targetClasses && Array.isArray(f.targetClasses)) {
            cleanTargetClasses = f.targetClasses;
          } else if (f.targetClass) {
            try {
              const parsed = JSON.parse(f.targetClass);
              cleanTargetClasses = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
              cleanTargetClasses = [f.targetClass];
            }
          }
          
          return {
            id: String(f.id),
            name: f.fileName,
            title: f.title,
            type: f.fileType?.includes('pdf') ? 'PDF' : f.fileType?.includes('video') ? 'Vidéo' : 'Document',
            subject: courseSubject,
            level: courseLevel,
            size: formatFileSize(f.fileSize),
            uploadDate: f.createdAt?.slice(0,10) || '',
            views: f.downloadCount || 0,
            status: 'Publié',
            description: f.description,
            tags: [],
            fileName: f.fileName,
            fileUrl: f.filePath,
            targetClasses: cleanTargetClasses,
          };
        });
        setUploadedFiles(mapped);
      } catch (error) {
        console.error('Erreur lors de la création des cours:', error);
        throw error;
      }
      
      // Reset du formulaire
      setCourseTitle('');
      setCourseDescription('');
      setCourseTags('');
      setCourseClass(['Terminale groupe 1']);
      setCurrentFiles([]);
      setShowUploadModal(false);
      
      showNotification('success', `${currentFiles.length} cours ajouté(s) avec succès !`);
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
      const token = getAuthToken();
      
      console.log(`🗑️ Tentative de suppression du fichier ID: ${course.id}`);
      
      const response = await fetch(`${API_BASE}/files/${course.id}`, { 
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`📡 Réponse API: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur de connexion au serveur' }));
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Suppression réussie:', result);
      
      // Mettre à jour l'état local
      setUploadedFiles(prev => prev.filter(f => f.id !== course.id));
      
      showNotification('success', 'Fichier supprimé avec succès');
      setShowDeleteModal(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour modifier les classes cibles
  const handleUpdateTargetClasses = async (fileId: string, newTargetClasses: string[]) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetClass: newTargetClasses[0] || '',
          targetClasses: newTargetClasses
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification des classes cibles');
      }
      
      // Mettre à jour l'état local
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, targetClasses: newTargetClasses }
          : f
      ));
      
      showNotification('success', 'Classes cibles mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification des classes cibles:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors de la modification des classes cibles');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'édition
  const handleEdit = async (updatedCourse: Course) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/files/${updatedCourse.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: updatedCourse.title,
          description: updatedCourse.description,
          fileName: updatedCourse.name,
          targetClass: updatedCourse.targetClasses?.[0] || '',
          targetClasses: updatedCourse.targetClasses || []
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }
      
      setUploadedFiles(prev => prev.map(f => f.id === updatedCourse.id ? updatedCourse : f));
      
      showNotification('success', 'Cours modifié avec succès');
      setShowEditModal(false);
      setFileToEdit(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de téléchargement
  const handleDownload = async (course: Course) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Afficher un indicateur de chargement
      const loadingElement = document.createElement('div');
      loadingElement.innerHTML = 'Téléchargement en cours...';
      loadingElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1f2937;
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: system-ui;
      `;
      document.body.appendChild(loadingElement);
      
      const token = getAuthToken();
      console.log(`📥 Tentative de téléchargement du fichier ID: ${course.id}`);
      
      const response = await fetch(`${API_BASE}/files/${course.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`📡 Réponse téléchargement: ${response.status} ${response.statusText}`);
      
      // Supprimer l'indicateur de chargement
      document.body.removeChild(loadingElement);
      
      if (response.ok) {
        const blob = await response.blob();
        
        // Vérifier que le blob n'est pas vide
        if (blob.size === 0) {
          showNotification('error', 'Le fichier téléchargé est vide');
          return;
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Utiliser le nom de fichier original
        const originalFileName = course.fileName || course.name || 'document';
        
        // Générer un nom de fichier sécurisé avec la bonne extension
        const fileName = generateDownloadFileName(originalFileName, (course as any).fileType);
        
        a.download = fileName;
        
        // Ajouter des attributs pour forcer le téléchargement
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer après un délai
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 1000);
        
        console.log(`✅ Téléchargement réussi: ${fileName} (${blob.size} bytes)`);
        showNotification('success', `Téléchargement réussi: ${fileName}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erreur de téléchargement' }));
        console.error('❌ Erreur téléchargement:', errorData);
        showNotification('error', errorData.message || `Erreur lors du téléchargement (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur de connexion lors du téléchargement');
    }
  };

  // Fonction de changement de statut
  const toggleStatus = async (course: Course) => {
    const newStatus = course.status === 'Publié' ? 'Brouillon' : 'Publié';
    const updatedCourse = { ...course, status: newStatus as 'Publié' | 'Brouillon' };
    await handleEdit(updatedCourse);
  };

  const getFileIcon = (type: string, fileName?: string) => {
    // Utiliser la fonction utilitaire pour déterminer le type d'affichage
    const displayType = getDisplayFileType(fileName || '', type);
    
    // Mapper le type d'affichage vers le type MIME pour getFileTypeInfo
    let mimeType = type;
    if (displayType === 'EXE' || displayType === 'MSI') {
      mimeType = 'application/x-msdownload';
    }
    
    return getFileTypeInfo(mimeType);
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Classes cibles</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Taille</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Vues</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredFiles.map((file) => {
                const iconConfig = getFileIcon(file.type, file.fileName);
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
                      <div className="flex flex-wrap gap-1">
                        {file.targetClasses && file.targetClasses.length > 0 ? (
                          file.targetClasses.map((cls, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {cls}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Aucune classe</span>
                        )}
                      </div>
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
                  <label className="block text-sm font-semibold text-white mb-2">Classes cibles *</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-white/20 rounded-xl p-3 bg-white/10 backdrop-blur-md">
                    {classes.map(cls => (
                      <label key={cls} className="flex items-center space-x-2 text-white cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                        <input
                          type="checkbox"
                          checked={courseClass.includes(cls)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCourseClass(prev => [...prev, cls]);
                            } else {
                              setCourseClass(prev => prev.filter(c => c !== cls));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm">{cls}</span>
                      </label>
                    ))}
                  </div>
                  {courseClass.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-300">Classes sélectionnées : {courseClass.join(', ')}</p>
                    </div>
                  )}
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
                  ou cliquez pour sélectionner (Tous types de fichiers - max 100MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
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
                    const iconConfig = getFileTypeInfo(file.type);
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
            <label className="block text-sm font-semibold text-white mb-2">Classes cibles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-white/20 rounded-xl p-3 bg-white/5">
              {[
                'Terminale groupe 1',
                'Terminale groupe 2', 
                'Terminale groupe 3',
                'Terminale groupe 4',
                '1ère groupe 1',
                '1ère groupe 2',
                '1ère groupe 3'
              ].map(cls => (
                <label key={cls} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={editedCourse.targetClasses?.includes(cls) || false}
                    onChange={(e) => {
                      const currentClasses = editedCourse.targetClasses || [];
                      if (e.target.checked) {
                        setEditedCourse(prev => ({ 
                          ...prev, 
                          targetClasses: [...currentClasses, cls] 
                        }));
                      } else {
                        setEditedCourse(prev => ({ 
                          ...prev, 
                          targetClasses: currentClasses.filter(c => c !== cls) 
                        }));
                      }
                    }}
                    className="rounded border-white/20 text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-sm text-white">{cls}</span>
                </label>
              ))}
            </div>
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

