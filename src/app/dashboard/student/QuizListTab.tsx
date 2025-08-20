'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  Trophy,
  Target,
  Zap,
  Award,
  Users,
  BarChart3,
  TrendingUp,
  Eye,
  Bookmark,
  Share2,
  Download,
  Heart,
  MessageCircle,
  ChevronRight,
  Plus,
  Shuffle,
  Timer,
  Brain,
  Globe,
  Map,
  History,
  Compass,
  Mountain,
  Waves,
  TreePine,
  Building,
  Flag,
  Crown,
  Sword,
  Shield,
  Scroll
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: 'history' | 'geography' | 'both';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // en minutes
  questions: number;
  points: number;
  attempts: number;
  bestScore?: number;
  averageScore: number;
  completionRate: number;
  tags: string[];
  createdAt: string;
  dueDate?: string;
  isCompleted: boolean;
  isAvailable: boolean;
  isNew: boolean;
  isFavorite: boolean;
  thumbnail?: string;
  author: string;
  category: string;
  prerequisites?: string[];
  rewards: {
    xp: number;
    badges?: string[];
  };
}

interface QuizListTabProps {
  onStartQuiz: (quizId: string) => void;
}

const QuizListTab: React.FC<QuizListTabProps> = ({ onStartQuiz }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Données simulées des quiz
    const mockQuizzes: Quiz[] = [
      {
        id: 'quiz-1',
        title: 'La Révolution française',
        description: 'Découvrez les événements marquants de la Révolution française de 1789 à 1799',
        subject: 'history',
        difficulty: 'medium',
        duration: 25,
        questions: 15,
        points: 150,
        attempts: 0,
        averageScore: 78,
        completionRate: 85,
        tags: ['révolution', '18ème siècle', 'france', 'politique'],
        createdAt: '2024-12-20T08:00:00',
        dueDate: '2024-12-25T23:59:59',
        isCompleted: false,
        isAvailable: true,
        isNew: true,
        isFavorite: false,
        author: 'Mme Martin',
        category: 'Histoire moderne',
        rewards: {
          xp: 150,
          badges: ['Révolutionnaire']
        }
      },
      {
        id: 'quiz-2',
        title: 'Les climats européens',
        description: 'Étudiez la diversité climatique de l\'Europe et ses caractéristiques',
        subject: 'geography',
        difficulty: 'easy',
        duration: 20,
        questions: 12,
        points: 120,
        attempts: 2,
        bestScore: 85,
        averageScore: 72,
        completionRate: 92,
        tags: ['climat', 'europe', 'météorologie', 'environnement'],
        createdAt: '2024-12-18T10:00:00',
        isCompleted: true,
        isAvailable: true,
        isNew: false,
        isFavorite: true,
        author: 'M. Dubois',
        category: 'Géographie physique',
        rewards: {
          xp: 120
        }
      },
      {
        id: 'quiz-3',
        title: 'L\'Empire de Napoléon',
        description: 'Explorez l\'expansion et la chute de l\'Empire napoléonien en Europe',
        subject: 'history',
        difficulty: 'hard',
        duration: 35,
        questions: 20,
        points: 200,
        attempts: 0,
        averageScore: 65,
        completionRate: 68,
        tags: ['napoléon', 'empire', '19ème siècle', 'guerre'],
        createdAt: '2024-12-19T14:00:00',
        dueDate: '2024-12-22T23:59:59',
        isCompleted: false,
        isAvailable: true,
        isNew: true,
        isFavorite: false,
        author: 'Mme Martin',
        category: 'Histoire moderne',
        prerequisites: ['La Révolution française'],
        rewards: {
          xp: 200,
          badges: ['Empereur', 'Stratège']
        }
      },
      {
        id: 'quiz-4',
        title: 'Les grandes villes mondiales',
        description: 'Testez vos connaissances sur les métropoles et leur géographie urbaine',
        subject: 'geography',
        difficulty: 'medium',
        duration: 30,
        questions: 18,
        points: 180,
        attempts: 1,
        bestScore: 92,
        averageScore: 81,
        completionRate: 89,
        tags: ['villes', 'urbanisation', 'population', 'monde'],
        createdAt: '2024-12-17T16:00:00',
        isCompleted: true,
        isAvailable: true,
        isNew: false,
        isFavorite: true,
        author: 'M. Dubois',
        category: 'Géographie humaine',
        rewards: {
          xp: 180,
          badges: ['Explorateur urbain']
        }
      },
      {
        id: 'quiz-5',
        title: 'Histoire et Géographie de la France',
        description: 'Quiz complet mêlant histoire et géographie françaises',
        subject: 'both',
        difficulty: 'hard',
        duration: 45,
        questions: 25,
        points: 250,
        attempts: 0,
        averageScore: 70,
        completionRate: 75,
        tags: ['france', 'histoire', 'géographie', 'synthèse'],
        createdAt: '2024-12-16T12:00:00',
        isCompleted: false,
        isAvailable: true,
        isNew: false,
        isFavorite: false,
        author: 'Équipe pédagogique',
        category: 'Quiz de synthèse',
        rewards: {
          xp: 250,
          badges: ['Expert France', 'Polyvalent']
        }
      },
      {
        id: 'quiz-6',
        title: 'La Première Guerre mondiale',
        description: 'Les causes, le déroulement et les conséquences de la Grande Guerre',
        subject: 'history',
        difficulty: 'medium',
        duration: 30,
        questions: 16,
        points: 160,
        attempts: 0,
        averageScore: 74,
        completionRate: 82,
        tags: ['guerre mondiale', '20ème siècle', 'conflit', 'europe'],
        createdAt: '2024-12-15T09:00:00',
        dueDate: '2024-12-30T23:59:59',
        isCompleted: false,
        isAvailable: false, // Pas encore disponible
        isNew: false,
        isFavorite: false,
        author: 'Mme Martin',
        category: 'Histoire contemporaine',
        prerequisites: ['L\'Empire de Napoléon'],
        rewards: {
          xp: 160,
          badges: ['Historien']
        }
      }
    ];

    setQuizzes(mockQuizzes);
    setFilteredQuizzes(mockQuizzes);
  }, []);

  useEffect(() => {
    let filtered = [...quizzes];

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtrage par matière
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(quiz => quiz.subject === selectedSubject);
    }

    // Filtrage par difficulté
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    // Filtrage par statut
    if (selectedStatus !== 'all') {
      switch (selectedStatus) {
        case 'available':
          filtered = filtered.filter(quiz => quiz.isAvailable && !quiz.isCompleted);
          break;
        case 'completed':
          filtered = filtered.filter(quiz => quiz.isCompleted);
          break;
        case 'new':
          filtered = filtered.filter(quiz => quiz.isNew);
          break;
        case 'favorites':
          filtered = filtered.filter(quiz => quiz.isFavorite);
          break;
      }
    }

    // Tri
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case 'points':
        filtered.sort((a, b) => b.points - a.points);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, searchQuery, selectedSubject, selectedDifficulty, selectedStatus, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'history': return History;
      case 'geography': return Globe;
      case 'both': return Brain;
      default: return BookOpen;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'history': return 'from-amber-500 to-orange-600';
      case 'geography': return 'from-green-500 to-emerald-600';
      case 'both': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const toggleFavorite = (quizId: string) => {
    setQuizzes(prev => prev.map(quiz =>
      quiz.id === quizId ? { ...quiz, isFavorite: !quiz.isFavorite } : quiz
    ));
  };

  const formatDueDate = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Échéance dépassée';
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Demain';
    return `${days} jours`;
  };

  const renderQuizCard = (quiz: Quiz) => {
    const SubjectIcon = getSubjectIcon(quiz.subject);
    
    return (
      <div
        key={quiz.id}
        className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden transition-all hover:scale-105 hover:bg-white/15 ${
          !quiz.isAvailable ? 'opacity-60' : ''
        }`}
      >
        {/* Header de la carte */}
        <div className={`bg-gradient-to-r ${getSubjectColor(quiz.subject)} p-4 relative`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <SubjectIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{quiz.title}</h3>
                <p className="text-white/80 text-sm">{quiz.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {quiz.isNew && (
                <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                  Nouveau
                </span>
              )}
              <button
                onClick={() => toggleFavorite(quiz.id)}
                className={`p-2 rounded-lg transition-all ${
                  quiz.isFavorite 
                    ? 'text-red-300 hover:text-red-200' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${quiz.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Badges de statut */}
          <div className="flex items-center space-x-2 mt-3">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty === 'easy' ? 'Facile' : quiz.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </span>
            {quiz.isCompleted && (
              <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Terminé
              </span>
            )}
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-4">
          <p className="text-blue-200 text-sm mb-4 line-clamp-2">{quiz.description}</p>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-300" />
              <span className="text-white text-sm">{quiz.duration} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-300" />
              <span className="text-white text-sm">{quiz.questions} questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-300" />
              <span className="text-white text-sm">{quiz.points} points</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-300" />
              <span className="text-white text-sm">{quiz.averageScore}% moy.</span>
            </div>
          </div>

          {/* Score personnel si terminé */}
          {quiz.isCompleted && quiz.bestScore && (
            <div className="bg-green-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-green-300 text-sm">Votre meilleur score</span>
                <span className="text-green-300 font-bold text-lg">{quiz.bestScore}%</span>
              </div>
              <div className="w-full bg-green-500/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all"
                  style={{ width: `${quiz.bestScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Échéance */}
          {quiz.dueDate && !quiz.isCompleted && (
            <div className="flex items-center space-x-2 mb-4 text-orange-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Échéance : {formatDueDate(quiz.dueDate)}</span>
            </div>
          )}

          {/* Prérequis */}
          {quiz.prerequisites && quiz.prerequisites.length > 0 && (
            <div className="mb-4">
              <p className="text-blue-300 text-xs mb-2">Prérequis :</p>
              <div className="flex flex-wrap gap-1">
                {quiz.prerequisites.map((prereq, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Récompenses */}
          <div className="mb-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">{quiz.rewards.xp} XP</span>
              </div>
              {quiz.rewards.badges && quiz.rewards.badges.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400">{quiz.rewards.badges.length} badge(s)</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {quiz.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-white/10 text-blue-200 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {quiz.tags.length > 3 && (
              <span className="text-blue-300 text-xs">+{quiz.tags.length - 3}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-blue-300 text-xs">
              Par {quiz.author}
            </div>
            <div className="flex items-center space-x-2">
              {quiz.isAvailable ? (
                <button
                  onClick={() => onStartQuiz(quiz.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    quiz.isCompleted
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{quiz.isCompleted ? 'Refaire' : 'Commencer'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Bientôt disponible</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizList = (quiz: Quiz) => {
    const SubjectIcon = getSubjectIcon(quiz.subject);
    
    return (
      <div
        key={quiz.id}
        className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 transition-all hover:bg-white/15 ${
          !quiz.isAvailable ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-12 h-12 bg-gradient-to-r ${getSubjectColor(quiz.subject)} rounded-xl flex items-center justify-center`}>
              <SubjectIcon className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-bold text-lg">{quiz.title}</h3>
                {quiz.isNew && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                    Nouveau
                  </span>
                )}
                {quiz.isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              <p className="text-blue-200 text-sm mb-2">{quiz.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded-full font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty === 'easy' ? 'Facile' : quiz.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                </span>
                <div className="flex items-center space-x-1 text-blue-300">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.duration} min</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-300">
                  <Target className="w-4 h-4" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-300">
                  <Star className="w-4 h-4" />
                  <span>{quiz.points} points</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {quiz.isCompleted && quiz.bestScore && (
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">{quiz.bestScore}%</div>
                <div className="text-green-300 text-xs">Meilleur score</div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(quiz.id)}
                className={`p-2 rounded-lg transition-all ${
                  quiz.isFavorite 
                    ? 'text-red-300 hover:text-red-200' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${quiz.isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              {quiz.isAvailable ? (
                <button
                  onClick={() => onStartQuiz(quiz.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    quiz.isCompleted
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{quiz.isCompleted ? 'Refaire' : 'Commencer'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Bientôt</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const availableQuizzes = filteredQuizzes.filter(q => q.isAvailable && !q.isCompleted);
  const completedQuizzes = filteredQuizzes.filter(q => q.isCompleted);
  const upcomingQuizzes = filteredQuizzes.filter(q => !q.isAvailable);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Mes Quiz</h1>
            <p className="text-blue-200">Découvrez et testez vos connaissances</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-white text-2xl font-bold">{availableQuizzes.length}</div>
              <div className="text-blue-300 text-sm">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">{completedQuizzes.length}</div>
              <div className="text-green-300 text-sm">Terminés</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 text-2xl font-bold">{upcomingQuizzes.length}</div>
              <div className="text-orange-300 text-sm">À venir</div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm">Progression générale</span>
            <span className="text-white font-semibold">
              {Math.round((completedQuizzes.length / quizzes.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${(completedQuizzes.length / quizzes.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Recherche */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un quiz..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtres et vue */}
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
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Matière</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Toutes les matières</option>
                  <option value="history">Histoire</option>
                  <option value="geography">Géographie</option>
                  <option value="both">Histoire-Géographie</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Difficulté</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Toutes les difficultés</option>
                  <option value="easy">Facile</option>
                  <option value="medium">Moyen</option>
                  <option value="hard">Difficile</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Statut</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="available">Disponibles</option>
                  <option value="completed">Terminés</option>
                  <option value="new">Nouveaux</option>
                  <option value="favorites">Favoris</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="newest">Plus récents</option>
                  <option value="alphabetical">Alphabétique</option>
                  <option value="difficulty">Difficulté</option>
                  <option value="duration">Durée</option>
                  <option value="points">Points</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white hover:from-green-600 hover:to-emerald-700 transition-all">
          <div className="flex items-center space-x-3">
            <Shuffle className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Quiz aléatoire</div>
              <div className="text-green-100 text-sm">Défi surprise</div>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl p-4 text-white hover:from-purple-600 hover:to-violet-700 transition-all">
          <div className="flex items-center space-x-3">
            <Timer className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Mode chrono</div>
              <div className="text-purple-100 text-sm">Contre la montre</div>
            </div>
          </div>
        </button>

        <button className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white hover:from-orange-600 hover:to-red-700 transition-all">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Défi du jour</div>
              <div className="text-orange-100 text-sm">Quiz spécial</div>
            </div>
          </div>
        </button>
      </div>

      {/* Liste des quiz */}
      <div className="space-y-6">
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Aucun quiz trouvé</h3>
            <p className="text-blue-200">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredQuizzes.map(quiz => 
              viewMode === 'grid' ? renderQuizCard(quiz) : renderQuizList(quiz)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListTab;

