'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download,
  Eye,
  Play,
  FileText,
  Video,
  File,
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  User,
  Tag,
  Heart,
  Bookmark,
  Share2,
  ChevronRight,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Shield,
  Scroll
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
  difficulty?: 'Facile' | 'Moyen' | 'Difficile';
  duration?: string;
  likes?: number;
  isBookmarked?: boolean;
  progress?: number;
}

interface StudentCoursesViewProps {
  userRole?: 'student' | 'admin';
}

const StudentCoursesView: React.FC<StudentCoursesViewProps> = ({ userRole = 'student' }) => {
  // États pour la gestion des cours
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Tous');
  const [filterType, setFilterType] = useState('Tous');
  const [filterDifficulty, setFilterDifficulty] = useState('Tous');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // États pour les interactions
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [downloadingCourses, setDownloadingCourses] = useState<string[]>([]);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Données simulées des cours disponibles
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'La Révolution française.pdf',
      title: 'La Révolution française - Cours complet',
      type: 'PDF',
      subject: 'Histoire',
      level: 'Terminale',
      size: '2.4 MB',
      uploadDate: '2025-01-15',
      views: 234,
      status: 'Publié',
      description: 'Cours détaillé sur la Révolution française de 1789 à 1799, incluant les causes, les événements majeurs et les conséquences.',
      tags: ['révolution', 'france', '1789', 'histoire'],
      fileName: 'revolution-francaise.pdf',
      fileUrl: '/uploads/revolution-francaise.pdf',
      difficulty: 'Moyen',
      duration: '45 min',
      likes: 89,
      isBookmarked: false,
      progress: 0
    },
    {
      id: '2',
      name: 'Les climats européens.mp4',
      title: 'Les climats européens - Vidéo explicative',
      type: 'Vidéo',
      subject: 'Géographie',
      level: 'Terminale',
      size: '45.7 MB',
      uploadDate: '2025-01-14',
      views: 187,
      status: 'Publié',
      description: 'Analyse détaillée des différents climats en Europe avec cartes interactives et exemples concrets.',
      tags: ['climat', 'europe', 'géographie', 'météorologie'],
      fileName: 'climats-europeens.mp4',
      fileUrl: '/uploads/climats-europeens.mp4',
      difficulty: 'Facile',
      duration: '32 min',
      likes: 67,
      isBookmarked: true,
      progress: 75
    },
    {
      id: '3',
      name: 'Cours EMC - Démocratie.txt',
      title: 'La démocratie moderne',
      type: 'Texte',
      subject: 'EMC',
      level: 'Terminale',
      size: '156 KB',
      uploadDate: '2025-01-13',
      views: 142,
      status: 'Publié',
      description: 'Introduction aux principes démocratiques, institutions et enjeux contemporains de la démocratie.',
      tags: ['démocratie', 'politique', 'citoyenneté', 'institutions'],
      fileName: 'democratie-moderne.txt',
      fileUrl: '/uploads/democratie-moderne.txt',
      difficulty: 'Difficile',
      duration: '25 min',
      likes: 45,
      isBookmarked: false,
      progress: 0
    },
    {
      id: '4',
      name: 'Guerre froide.pdf',
      title: 'La Guerre froide (1947-1991)',
      type: 'PDF',
      subject: 'Histoire',
      level: 'Terminale',
      size: '3.8 MB',
      uploadDate: '2025-01-12',
      views: 298,
      status: 'Publié',
      description: 'Étude complète de la Guerre froide, des origines à la chute du mur de Berlin.',
      tags: ['guerre froide', 'usa', 'urss', 'bipolarisation'],
      fileName: 'guerre-froide.pdf',
      fileUrl: '/uploads/guerre-froide.pdf',
      difficulty: 'Difficile',
      duration: '60 min',
      likes: 112,
      isBookmarked: true,
      progress: 30
    },
    {
      id: '5',
      name: 'Mondialisation.mp4',
      title: 'La mondialisation contemporaine',
      type: 'Vidéo',
      subject: 'Géographie',
      level: 'Terminale',
      size: '52.3 MB',
      uploadDate: '2025-01-11',
      views: 176,
      status: 'Publié',
      description: 'Analyse des processus de mondialisation économique, culturelle et politique.',
      tags: ['mondialisation', 'économie', 'culture', 'géopolitique'],
      fileName: 'mondialisation.mp4',
      fileUrl: '/uploads/mondialisation.mp4',
      difficulty: 'Moyen',
      duration: '38 min',
      likes: 78,
      isBookmarked: false,
      progress: 0
    }
  ];

  const subjects = ['Histoire', 'Géographie', 'EMC'];
  const difficulties = ['Facile', 'Moyen', 'Difficile'];

  // Icônes pour les matières
  const subjectIcons = {
    'Histoire': Scroll,
    'Géographie': Globe,
    'EMC': Shield
  };

  // Couleurs pour les matières
  const subjectColors = {
    'Histoire': 'from-red-500 to-pink-600',
    'Géographie': 'from-emerald-500 to-blue-600', 
    'EMC': 'from-purple-500 to-indigo-600'
  };

  // Types de fichiers acceptés
  const fileTypeIcons = {
    'PDF': FileText,
    'Vidéo': Video,
    'Texte': File,
    'MP4': Video,
    'TXT': File
  };

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Chargement des cours (simulation)
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filtrer seulement les cours publiés pour les étudiants
        const availableCourses = mockCourses.filter(course => course.status === 'Publié');
        setCourses(availableCourses);
        
        // Charger les favoris depuis le localStorage
        const savedBookmarks = localStorage.getItem('bookmarkedCourses');
        if (savedBookmarks) {
          setBookmarkedCourses(JSON.parse(savedBookmarks));
        }
      } catch (err) {
        setError('Erreur lors du chargement des cours');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filtrage et tri des cours
  useEffect(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSubject = filterSubject === 'Tous' || course.subject === filterSubject;
      const matchesType = filterType === 'Tous' || course.type === filterType;
      const matchesDifficulty = filterDifficulty === 'Tous' || course.difficulty === filterDifficulty;
      
      return matchesSearch && matchesSubject && matchesType && matchesDifficulty;
    });

    // Tri
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'liked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, filterSubject, filterType, filterDifficulty, sortBy]);

  // Fonction de téléchargement
  const handleDownload = async (course: Course) => {
    setDownloadingCourses(prev => [...prev, course.id]);
    
    try {
      // Simulation du téléchargement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer un lien de téléchargement simulé
      const link = document.createElement('a');
      link.href = course.fileUrl || '#';
      link.download = course.fileName || course.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Incrémenter les vues
      setCourses(prev => prev.map(c => 
        c.id === course.id ? { ...c, views: c.views + 1 } : c
      ));
      
      showNotification('success', `Téléchargement de "${course.title}" démarré`);
    } catch (error) {
      showNotification('error', 'Erreur lors du téléchargement');
    } finally {
      setDownloadingCourses(prev => prev.filter(id => id !== course.id));
    }
  };

  // Fonction pour ajouter/retirer des favoris
  const toggleBookmark = (courseId: string) => {
    const newBookmarks = bookmarkedCourses.includes(courseId)
      ? bookmarkedCourses.filter(id => id !== courseId)
      : [...bookmarkedCourses, courseId];
    
    setBookmarkedCourses(newBookmarks);
    localStorage.setItem('bookmarkedCourses', JSON.stringify(newBookmarks));
    
    const action = newBookmarks.includes(courseId) ? 'ajouté aux' : 'retiré des';
    showNotification('success', `Cours ${action} favoris`);
  };

  // Fonction pour liker un cours
  const toggleLike = (courseId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const currentLikes = course.likes || 0;
        return { ...course, likes: currentLikes + 1 };
      }
      return course;
    }));
    showNotification('success', 'Merci pour votre appréciation !');
  };

  // Fonction pour obtenir la couleur de difficulté
  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case 'Facile': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moyen': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Difficile': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-blue-200">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

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
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <BookOpen className="w-8 h-8 text-blue-300 mr-4" />
              Mes cours disponibles
            </h1>
            <p className="text-blue-200 mt-2">Découvrez et téléchargez vos contenus pédagogiques</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-blue-300">
              <span>Total: {filteredCourses.length} cours</span>
              <span>Favoris: {bookmarkedCourses.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              <span>{viewMode === 'grid' ? 'Liste' : 'Grille'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un cours..."
              className="pl-10 pr-4 py-3 w-full border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>
          <div className="flex items-center space-x-3 flex-wrap">
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
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Tous">Toutes les difficultés</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus vus</option>
              <option value="liked">Plus appréciés</option>
              <option value="alphabetical">Alphabétique</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des cours */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-12 border border-white/20 text-center">
          <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Aucun cours trouvé</h3>
          <p className="text-blue-200">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredCourses.map((course) => {
            const SubjectIcon = subjectIcons[course.subject as keyof typeof subjectIcons] || BookOpen;
            const FileIcon = fileTypeIcons[course.type as keyof typeof fileTypeIcons] || File;
            const isBookmarked = bookmarkedCourses.includes(course.id);
            const isDownloading = downloadingCourses.includes(course.id);

            if (viewMode === 'grid') {
              return (
                <div key={course.id} className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Header de la carte */}
                  <div className={`h-32 bg-gradient-to-br ${subjectColors[course.subject as keyof typeof subjectColors] || 'from-slate-400 to-slate-500'} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <SubjectIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white text-sm font-semibold">{course.subject}</span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <button
                        onClick={() => toggleBookmark(course.id)}
                        className={`p-2 rounded-lg transition-all ${
                          isBookmarked 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileIcon className="w-5 h-5 text-white" />
                          <span className="text-white text-sm font-medium">{course.type}</span>
                        </div>
                        {course.difficulty && (
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{course.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{course.likes}</span>
                        </div>
                        {course.duration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-blue-400">{course.size}</span>
                    </div>

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {course.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-white/10 text-blue-200 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {course.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-blue-200 text-xs rounded-full">
                            +{course.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Barre de progression si applicable */}
                    {course.progress !== undefined && course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
                          <span>Progression</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${subjectColors[course.subject as keyof typeof subjectColors] || 'from-slate-400 to-slate-500'} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(course)}
                        disabled={isDownloading}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>{isDownloading ? 'Téléchargement...' : 'Télécharger'}</span>
                      </button>
                      <button
                        onClick={() => toggleLike(course.id)}
                        className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              // Vue liste
              return (
                <div key={course.id} className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    {/* Icône et type */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${subjectColors[course.subject as keyof typeof subjectColors] || 'from-slate-400 to-slate-500'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <FileIcon className="w-8 h-8 text-white" />
                    </div>

                    {/* Informations principales */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {course.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          {course.difficulty && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(course.difficulty)}`}>
                              {course.difficulty}
                            </span>
                          )}
                          <button
                            onClick={() => toggleBookmark(course.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isBookmarked 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-xs text-blue-300">
                          <span className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{course.subject}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{course.views} vues</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{course.likes} likes</span>
                          </span>
                          {course.duration && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{course.duration}</span>
                            </span>
                          )}
                          <span>{course.size}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleLike(course.id)}
                            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(course)}
                            disabled={isDownloading}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span>{isDownloading ? 'Téléchargement...' : 'Télécharger'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Barre de progression si applicable */}
                      {course.progress !== undefined && course.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
                            <span>Progression</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${subjectColors[course.subject as keyof typeof subjectColors] || 'from-slate-400 to-slate-500'} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCoursesView;

