'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  Image,
  Download,
  Eye,
  Star,
  Heart,
  Share2,
  Search,
  Filter,
  Grid,
  List,
  Folder,
  FolderOpen,
  File,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Edit,
  Trash2,
  Copy,
  Move,
  Archive,
  Tag,
  Clock,
  Calendar,
  User,
  Users,
  Globe,
  Link,
  ExternalLink,
  Bookmark,
  Flag,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  Lightbulb,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Zap,
  Flame,
  Sparkles,
  Brain,
  History,
  Map,
  Compass,
  Mountain,
  Waves,
  TreePine,
  Flower,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Umbrella,
  Thermometer,
  Wind,
  Snowflake,
  Rainbow,
  Camera,
  Mic,
  Headphones,
  Speaker,
  Music,
  Radio,
  Tv,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Keyboard,
  Mouse,
  Printer,
  Scanner,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive,
  SdCard,
  Battery,
  Power,
  Settings,
  Tool,
  Wrench,
  Hammer,
  Screwdriver,
  Ruler,
  Scissors,
  Paperclip,
  Pin,
  Pushpin,
  Magnet,
  Key,
  Lock,
  Unlock,
  Shield,
  Security,
  Safe,
  Vault,
  Bank,
  CreditCard,
  Wallet,
  Coins,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Pulse,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  Angry,
  Surprised,
  Confused,
  Sleepy,
  Cool,
  Wink,
  Kiss,
  Tongue,
  Sunglasses,
  Nerd,
  Monocle,
  Thinking,
  Shushing,
  Lying,
  Cowboy,
  Partying,
  Disguised,
  Robot,
  Ghost,
  Alien,
  Devil,
  Angel,
  Skull,
  Poop,
  Clown,
  Ogre,
  Goblin,
  Zombie
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'interactive';
  category: 'course' | 'exercise' | 'reference' | 'multimedia' | 'tool';
  subject: 'history' | 'geography' | 'both' | 'general';
  level: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  thumbnail?: string;
  fileSize?: number;
  duration?: number; // en secondes pour les vidéos/audios
  author: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  rating: number;
  ratingsCount: number;
  downloads: number;
  views: number;
  isFavorite: boolean;
  isBookmarked: boolean;
  isDownloaded: boolean;
  language: string;
  difficulty: number; // 1-5
  prerequisites?: string[];
  relatedResources?: string[];
  format?: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
}

interface ResourceFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children: string[];
  resources: string[];
  color: string;
  icon: string;
  isExpanded: boolean;
  createdAt: string;
  isEditable: boolean;
}

const ResourcesTab: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Données simulées des ressources
    const mockResources: Resource[] = [
      {
        id: 'res-1',
        title: 'La Révolution française - Cours complet',
        description: 'Cours détaillé sur la Révolution française de 1789 à 1799, incluant les causes, les événements majeurs et les conséquences.',
        type: 'document',
        category: 'course',
        subject: 'history',
        level: 'intermediate',
        url: '/resources/revolution-francaise.pdf',
        thumbnail: '/thumbnails/revolution-francaise.jpg',
        fileSize: 2500000, // 2.5 MB
        author: 'Mme Martin',
        createdAt: '2024-12-15T10:00:00',
        tags: ['révolution', 'france', '18ème siècle', 'politique', 'société'],
        rating: 4.8,
        ratingsCount: 156,
        downloads: 1240,
        views: 3450,
        isFavorite: true,
        isBookmarked: true,
        isDownloaded: false,
        language: 'fr',
        difficulty: 3,
        format: 'PDF',
        prerequisites: ['Histoire de France - Ancien Régime']
      },
      {
        id: 'res-2',
        title: 'Les climats européens - Vidéo explicative',
        description: 'Vidéo interactive expliquant les différents types de climats en Europe avec des cartes animées.',
        type: 'video',
        category: 'multimedia',
        subject: 'geography',
        level: 'beginner',
        url: '/resources/climats-europeens.mp4',
        thumbnail: '/thumbnails/climats-europeens.jpg',
        fileSize: 125000000, // 125 MB
        duration: 1200, // 20 minutes
        author: 'M. Dubois',
        createdAt: '2024-12-18T14:30:00',
        tags: ['climat', 'europe', 'météorologie', 'géographie physique'],
        rating: 4.6,
        ratingsCount: 89,
        downloads: 567,
        views: 2100,
        isFavorite: false,
        isBookmarked: true,
        isDownloaded: true,
        language: 'fr',
        difficulty: 2,
        format: 'MP4',
        quality: 'high'
      },
      {
        id: 'res-3',
        title: 'Atlas interactif de l\'Europe',
        description: 'Atlas numérique interactif permettant d\'explorer les pays, capitales et reliefs européens.',
        type: 'interactive',
        category: 'tool',
        subject: 'geography',
        level: 'intermediate',
        url: 'https://atlas-europe-interactif.com',
        thumbnail: '/thumbnails/atlas-europe.jpg',
        author: 'Équipe pédagogique',
        createdAt: '2024-12-10T09:15:00',
        tags: ['atlas', 'europe', 'interactif', 'cartographie', 'pays'],
        rating: 4.9,
        ratingsCount: 234,
        downloads: 0, // Pas de téléchargement pour les liens
        views: 5670,
        isFavorite: true,
        isBookmarked: false,
        isDownloaded: false,
        language: 'fr',
        difficulty: 2,
        format: 'Web'
      },
      {
        id: 'res-4',
        title: 'Exercices - Empire napoléonien',
        description: 'Série d\'exercices et de questions sur l\'Empire de Napoléon avec corrections détaillées.',
        type: 'document',
        category: 'exercise',
        subject: 'history',
        level: 'advanced',
        url: '/resources/exercices-napoleon.pdf',
        thumbnail: '/thumbnails/exercices-napoleon.jpg',
        fileSize: 1800000, // 1.8 MB
        author: 'Mme Martin',
        createdAt: '2024-12-20T11:45:00',
        tags: ['napoléon', 'empire', 'exercices', 'évaluation'],
        rating: 4.4,
        ratingsCount: 67,
        downloads: 890,
        views: 1560,
        isFavorite: false,
        isBookmarked: false,
        isDownloaded: false,
        language: 'fr',
        difficulty: 4,
        format: 'PDF',
        prerequisites: ['La Révolution française']
      },
      {
        id: 'res-5',
        title: 'Podcast - Histoire de France',
        description: 'Série de podcasts sur l\'histoire de France, épisode sur la Révolution française.',
        type: 'audio',
        category: 'multimedia',
        subject: 'history',
        level: 'intermediate',
        url: '/resources/podcast-histoire-france-ep5.mp3',
        thumbnail: '/thumbnails/podcast-histoire.jpg',
        fileSize: 45000000, // 45 MB
        duration: 2700, // 45 minutes
        author: 'Radio Histoire',
        createdAt: '2024-12-12T16:20:00',
        tags: ['podcast', 'audio', 'histoire', 'france', 'révolution'],
        rating: 4.7,
        ratingsCount: 123,
        downloads: 456,
        views: 1890,
        isFavorite: true,
        isBookmarked: true,
        isDownloaded: true,
        language: 'fr',
        difficulty: 3,
        format: 'MP3',
        quality: 'high'
      },
      {
        id: 'res-6',
        title: 'Cartes historiques - Révolution',
        description: 'Collection de cartes historiques montrant l\'évolution de la France pendant la Révolution.',
        type: 'image',
        category: 'reference',
        subject: 'history',
        level: 'intermediate',
        url: '/resources/cartes-revolution/',
        thumbnail: '/thumbnails/cartes-revolution.jpg',
        fileSize: 15000000, // 15 MB (collection)
        author: 'Archives nationales',
        createdAt: '2024-12-08T13:10:00',
        tags: ['cartes', 'révolution', 'france', 'géographie historique'],
        rating: 4.5,
        ratingsCount: 78,
        downloads: 234,
        views: 987,
        isFavorite: false,
        isBookmarked: true,
        isDownloaded: false,
        language: 'fr',
        difficulty: 3,
        format: 'JPG/PNG'
      },
      {
        id: 'res-7',
        title: 'Quiz interactif - Capitales européennes',
        description: 'Quiz interactif pour apprendre et tester ses connaissances sur les capitales européennes.',
        type: 'interactive',
        category: 'exercise',
        subject: 'geography',
        level: 'beginner',
        url: 'https://quiz-capitales-europe.com',
        thumbnail: '/thumbnails/quiz-capitales.jpg',
        author: 'EduGeo',
        createdAt: '2024-12-14T08:30:00',
        tags: ['quiz', 'capitales', 'europe', 'interactif', 'géographie'],
        rating: 4.3,
        ratingsCount: 145,
        downloads: 0,
        views: 2340,
        isFavorite: false,
        isBookmarked: false,
        isDownloaded: false,
        language: 'fr',
        difficulty: 1,
        format: 'Web'
      },
      {
        id: 'res-8',
        title: 'Documentaire - Napoléon Bonaparte',
        description: 'Documentaire complet sur la vie et l\'œuvre de Napoléon Bonaparte.',
        type: 'video',
        category: 'multimedia',
        subject: 'history',
        level: 'advanced',
        url: '/resources/documentaire-napoleon.mp4',
        thumbnail: '/thumbnails/documentaire-napoleon.jpg',
        fileSize: 850000000, // 850 MB
        duration: 5400, // 90 minutes
        author: 'France Télévisions',
        createdAt: '2024-12-05T20:00:00',
        tags: ['documentaire', 'napoléon', 'biographie', 'histoire'],
        rating: 4.9,
        ratingsCount: 312,
        downloads: 1567,
        views: 8900,
        isFavorite: true,
        isBookmarked: true,
        isDownloaded: false,
        language: 'fr',
        difficulty: 4,
        format: 'MP4',
        quality: 'ultra'
      }
    ];

    const mockFolders: ResourceFolder[] = [
      {
        id: 'folder-1',
        name: 'Histoire',
        description: 'Ressources d\'histoire',
        children: ['folder-2', 'folder-3'],
        resources: [],
        color: 'from-amber-500 to-orange-600',
        icon: 'history',
        isExpanded: true,
        createdAt: '2024-12-01T00:00:00',
        isEditable: false
      },
      {
        id: 'folder-2',
        name: 'Révolution française',
        description: 'Ressources sur la Révolution française',
        parentId: 'folder-1',
        children: [],
        resources: ['res-1', 'res-5', 'res-6'],
        color: 'from-red-500 to-pink-600',
        icon: 'flag',
        isExpanded: false,
        createdAt: '2024-12-01T00:00:00',
        isEditable: false
      },
      {
        id: 'folder-3',
        name: 'Empire napoléonien',
        description: 'Ressources sur l\'Empire de Napoléon',
        parentId: 'folder-1',
        children: [],
        resources: ['res-4', 'res-8'],
        color: 'from-purple-500 to-violet-600',
        icon: 'crown',
        isExpanded: false,
        createdAt: '2024-12-01T00:00:00',
        isEditable: false
      },
      {
        id: 'folder-4',
        name: 'Géographie',
        description: 'Ressources de géographie',
        children: ['folder-5'],
        resources: [],
        color: 'from-green-500 to-emerald-600',
        icon: 'globe',
        isExpanded: true,
        createdAt: '2024-12-01T00:00:00',
        isEditable: false
      },
      {
        id: 'folder-5',
        name: 'Europe',
        description: 'Ressources sur l\'Europe',
        parentId: 'folder-4',
        children: [],
        resources: ['res-2', 'res-3', 'res-7'],
        color: 'from-blue-500 to-indigo-600',
        icon: 'map',
        isExpanded: false,
        createdAt: '2024-12-01T00:00:00',
        isEditable: false
      },
      {
        id: 'folder-6',
        name: 'Mes favoris',
        description: 'Ressources favorites',
        children: [],
        resources: ['res-1', 'res-3', 'res-5', 'res-8'],
        color: 'from-yellow-500 to-orange-600',
        icon: 'star',
        isExpanded: false,
        createdAt: '2024-12-01T00:00:00',
        isEditable: true
      },
      {
        id: 'folder-7',
        name: 'Téléchargés',
        description: 'Ressources téléchargées',
        children: [],
        resources: ['res-2', 'res-5'],
        color: 'from-gray-500 to-slate-600',
        icon: 'download',
        isExpanded: false,
        createdAt: '2024-12-01T00:00:00',
        isEditable: false
      }
    ];

    setResources(mockResources);
    setFolders(mockFolders);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'image': return Image;
      case 'link': return Link;
      case 'interactive': return Target;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'from-blue-500 to-indigo-600';
      case 'video': return 'from-red-500 to-pink-600';
      case 'audio': return 'from-green-500 to-emerald-600';
      case 'image': return 'from-purple-500 to-violet-600';
      case 'link': return 'from-orange-500 to-red-600';
      case 'interactive': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getFolderIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      history: History,
      flag: Flag,
      crown: Crown,
      globe: Globe,
      map: Map,
      star: Star,
      download: Download,
      folder: Folder
    };
    return icons[iconName] || Folder;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const toggleFavorite = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId 
        ? { ...resource, isFavorite: !resource.isFavorite }
        : resource
    ));
  };

  const toggleBookmark = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked }
        : resource
    ));
  };

  const getFilteredResources = () => {
    let filtered = [...resources];

    // Filtrage par dossier
    if (selectedFolder && selectedFolder !== 'all') {
      const folder = folders.find(f => f.id === selectedFolder);
      if (folder) {
        filtered = filtered.filter(resource => folder.resources.includes(resource.id));
      }
    }

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filtrage par matière
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Filtrage par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Tri
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'size':
        filtered.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));
        break;
    }

    return filtered;
  };

  const renderFolderTree = (folderId?: string, level: number = 0) => {
    const folderList = folders.filter(folder => folder.parentId === folderId);
    
    return folderList.map(folder => {
      const IconComponent = getFolderIcon(folder.icon);
      const hasChildren = folders.some(f => f.parentId === folder.id);
      
      return (
        <div key={folder.id}>
          <div
            onClick={() => {
              if (hasChildren) {
                setFolders(prev => prev.map(f =>
                  f.id === folder.id ? { ...f, isExpanded: !f.isExpanded } : f
                ));
              }
              setSelectedFolder(folder.id);
            }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              selectedFolder === folder.id
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
            style={{ paddingLeft: `${12 + level * 20}px` }}
          >
            {hasChildren && (
              <button className="p-0.5">
                {folder.isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            <div className={`w-5 h-5 bg-gradient-to-br ${folder.color} rounded flex items-center justify-center`}>
              <IconComponent className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm truncate">{folder.name}</span>
            <span className="text-xs text-blue-400 ml-auto">
              {folder.resources.length}
            </span>
          </div>
          
          {folder.isExpanded && hasChildren && (
            <div>
              {renderFolderTree(folder.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderResourceCard = (resource: Resource) => {
    const TypeIcon = getTypeIcon(resource.type);
    
    return (
      <div
        key={resource.id}
        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden transition-all hover:scale-105 hover:bg-white/15 cursor-pointer"
        onClick={() => {
          setSelectedResource(resource);
          setShowResourceModal(true);
        }}
      >
        {/* Thumbnail */}
        <div className={`h-32 bg-gradient-to-br ${getTypeColor(resource.type)} relative`}>
          {resource.thumbnail ? (
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon className="w-12 h-12 text-white" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex space-x-1">
            {resource.isFavorite && (
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
            {resource.isDownloaded && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Download className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {/* Durée pour les vidéos/audios */}
          {resource.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(resource.duration)}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-semibold text-sm line-clamp-2 flex-1">
              {resource.title}
            </h3>
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(resource.id);
                }}
                className={`p-1 rounded transition-all ${
                  resource.isFavorite 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${resource.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(resource.id);
                }}
                className={`p-1 rounded transition-all ${
                  resource.isBookmarked 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <p className="text-blue-200 text-xs mb-3 line-clamp-2">
            {resource.description}
          </p>
          
          {/* Métadonnées */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-300">{resource.author}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-yellow-400">{resource.rating}</span>
                <span className="text-blue-400">({resource.ratingsCount})</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400">{resource.format}</span>
              {resource.fileSize && (
                <span className="text-blue-400">{formatFileSize(resource.fileSize)}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400">{resource.views} vues</span>
              <span className="text-blue-400">{resource.downloads} téléchargements</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-white/10 text-blue-300 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-blue-400 text-xs">+{resource.tags.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResourceList = (resource: Resource) => {
    const TypeIcon = getTypeIcon(resource.type);
    
    return (
      <div
        key={resource.id}
        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 transition-all hover:bg-white/15 cursor-pointer"
        onClick={() => {
          setSelectedResource(resource);
          setShowResourceModal(true);
        }}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(resource.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <TypeIcon className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-semibold text-lg truncate flex-1">
                {resource.title}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm">{resource.rating}</span>
                </div>
                {resource.isFavorite && (
                  <Heart className="w-4 h-4 text-red-400 fill-current" />
                )}
                {resource.isDownloaded && (
                  <Download className="w-4 h-4 text-green-400" />
                )}
              </div>
            </div>
            
            <p className="text-blue-200 text-sm mb-3 line-clamp-2">
              {resource.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-blue-300">
              <span>{resource.author}</span>
              <span>{resource.format}</span>
              {resource.fileSize && <span>{formatFileSize(resource.fileSize)}</span>}
              {resource.duration && <span>{formatDuration(resource.duration)}</span>}
              <span>{resource.views} vues</span>
              <span>{resource.downloads} téléchargements</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(resource.id);
              }}
              className={`p-2 rounded-lg transition-all ${
                resource.isFavorite 
                  ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-500/20' 
                  : 'text-white/60 hover:text-white bg-white/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${resource.isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Logique de téléchargement
              }}
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/30 transition-all"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Logique de partage
              }}
              className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredResources = getFilteredResources();

  return (
    <div className="h-full flex">
      {/* Sidebar gauche - Dossiers */}
      <div className="w-80 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Ressources</h2>
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
        </div>

        {/* Dossiers */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {/* Tous les éléments */}
            <div
              onClick={() => setSelectedFolder('all')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                selectedFolder === 'all'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Folder className="w-5 h-5" />
              <span className="text-sm">Toutes les ressources</span>
              <span className="text-xs text-blue-400 ml-auto">{resources.length}</span>
            </div>
            
            {/* Arbre des dossiers */}
            {renderFolderTree()}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header avec filtres */}
        <div className="p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white text-2xl font-bold mb-2">
                {selectedFolder === 'all' 
                  ? 'Toutes les ressources' 
                  : folders.find(f => f.id === selectedFolder)?.name || 'Ressources'}
              </h1>
              <p className="text-blue-200">{filteredResources.length} ressource(s) trouvée(s)</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres détaillés */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/20">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Toutes</option>
                  <option value="course">Cours</option>
                  <option value="exercise">Exercices</option>
                  <option value="reference">Référence</option>
                  <option value="multimedia">Multimédia</option>
                  <option value="tool">Outils</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Matière</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Toutes</option>
                  <option value="history">Histoire</option>
                  <option value="geography">Géographie</option>
                  <option value="both">Histoire-Géographie</option>
                  <option value="general">Général</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Tous</option>
                  <option value="document">Documents</option>
                  <option value="video">Vidéos</option>
                  <option value="audio">Audio</option>
                  <option value="image">Images</option>
                  <option value="interactive">Interactif</option>
                  <option value="link">Liens</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="rating">Mieux notés</option>
                  <option value="title">Alphabétique</option>
                  <option value="size">Taille</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Liste des ressources */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredResources.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">Aucune ressource trouvée</h3>
                <p className="text-blue-200">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredResources.map(resource => 
                viewMode === 'grid' ? renderResourceCard(resource) : renderResourceList(resource)
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détail de ressource */}
      {showResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Détails de la ressource</h2>
              <button
                onClick={() => setShowResourceModal(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Aperçu */}
              <div className="lg:col-span-2">
                <div className={`h-64 bg-gradient-to-br ${getTypeColor(selectedResource.type)} rounded-xl flex items-center justify-center mb-4`}>
                  {selectedResource.thumbnail ? (
                    <img
                      src={selectedResource.thumbnail}
                      alt={selectedResource.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    React.createElement(getTypeIcon(selectedResource.type), { className: "w-24 h-24 text-white" })
                  )}
                </div>
                
                <h3 className="text-white text-2xl font-bold mb-4">{selectedResource.title}</h3>
                <p className="text-blue-200 text-lg mb-6">{selectedResource.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedResource.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all">
                    <Eye className="w-5 h-5" />
                    <span>Ouvrir</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-all">
                    <Download className="w-5 h-5" />
                    <span>Télécharger</span>
                  </button>
                  
                  <button
                    onClick={() => toggleFavorite(selectedResource.id)}
                    className={`p-3 rounded-lg transition-all ${
                      selectedResource.isFavorite 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${selectedResource.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-3 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Informations */}
              <div className="space-y-6">
                {/* Métadonnées */}
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Auteur</span>
                      <span className="text-white">{selectedResource.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Type</span>
                      <span className="text-white">{selectedResource.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Format</span>
                      <span className="text-white">{selectedResource.format}</span>
                    </div>
                    {selectedResource.fileSize && (
                      <div className="flex justify-between">
                        <span className="text-blue-200">Taille</span>
                        <span className="text-white">{formatFileSize(selectedResource.fileSize)}</span>
                      </div>
                    )}
                    {selectedResource.duration && (
                      <div className="flex justify-between">
                        <span className="text-blue-200">Durée</span>
                        <span className="text-white">{formatDuration(selectedResource.duration)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-blue-200">Langue</span>
                      <span className="text-white">{selectedResource.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Niveau</span>
                      <span className="text-white">{selectedResource.level}</span>
                    </div>
                  </div>
                </div>
                
                {/* Évaluation */}
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Évaluation</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(selectedResource.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">{selectedResource.rating}</span>
                  </div>
                  <p className="text-blue-200 text-sm">{selectedResource.ratingsCount} évaluations</p>
                </div>
                
                {/* Statistiques */}
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Statistiques</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Vues</span>
                      <span className="text-white">{selectedResource.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Téléchargements</span>
                      <span className="text-white">{selectedResource.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Ajouté le</span>
                      <span className="text-white">
                        {new Date(selectedResource.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Prérequis */}
                {selectedResource.prerequisites && selectedResource.prerequisites.length > 0 && (
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">Prérequis</h4>
                    <ul className="space-y-1">
                      {selectedResource.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-blue-200 text-sm flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;

