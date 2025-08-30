'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Target,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  User,
  Eye,
  Download,
  Share2,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  BookOpen,
  History,
  Globe,
  Trophy,
  Medal,
  Crown,
  Zap,
  Brain,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  MoreHorizontal,
  RefreshCw,
  Settings,
  HelpCircle,
  ExternalLink,
  Link,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Mail,
  Phone,
  MapPin,
  Home,
  School,
  GraduationCap,
  UserCheck,
  Users,
  Shield,
  Lock,
  Key,
  CreditCard,
  Wallet,
  Coins,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  Receipt,
  Calculator,
  PiggyBank,
  Gauge,
  Speedometer,
  Timer,
  Stopwatch,
  Hourglass,
  AlarmClock,
  Watch,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Umbrella,
  Rainbow,
  Snowflake,
  Droplets,
  Waves,
  TreePine,
  Flower,
  Leaf,
  Seedling,
  Sprout,
  Cactus,
  PalmTree,
  Evergreen,
  Deciduous,
  Mushroom,
  Shell,
  Bug,
  Butterfly,
  Bird,
  Fish,
  Rabbit,
  Turtle,
  Snail,
  Ant,
  Bee,
  Spider,
  Worm,
  Microbe,
  Dna,
  Atom,
  Molecule,
  Magnet,
  Flashlight,
  Lightbulb,
  Candle,
  Fire,
  Sparkles,
  Fireworks,
  Confetti,
  Balloon,
  Gift,
  Party,
  Cake,
  IceCream,
  Coffee,
  Tea,
  Wine,
  Beer,
  Cocktail,
  Juice,
  Milk
} from 'lucide-react';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  class: string;
  level: string;
  school: string;
  teacher: string;
}

interface Parent {
  id: string;
  children: Child[];
}

interface QuizResult {
  id: string;
  childId: string;
  quizTitle: string;
  subject: 'history' | 'geography' | 'both';
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeSpent: number; // en minutes
  difficulty: 'easy' | 'medium' | 'hard';
  questionsTotal: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  rank: number;
  classAverage: number;
  teacherComment?: string;
  strengths: string[];
  weaknesses: string[];
  badges: string[];
  xpEarned: number;
  attempts: number;
  isImprovement: boolean;
  previousScore?: number;
}

interface QuizResultsTabProps {
  selectedChild?: Child;
  parent?: Parent;
  searchQuery?: string;
}

const QuizResultsTab: React.FC<QuizResultsTabProps> = ({
  selectedChild,
  parent,
  searchQuery
}) => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'trimester' | 'year'>('month');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'history' | 'geography'>('all');
  const [selectedChild_, setSelectedChild_] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'subject' | 'difficulty'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données de l'enfant sélectionné
  useEffect(() => {
    const loadChildData = async () => {
      if (!selectedChild?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/child/${selectedChild.id}/data`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données enfant');
        }
        
        const data = await response.json();
        setChildData(data);
        
        // Transformer les résultats de quiz
        const transformedResults: QuizResult[] = data.quizResults.map((qr: any) => ({
          id: qr.id,
          childId: data.id,
          quizTitle: qr.quizTitle,
          subject: qr.subject,
          score: qr.score,
          maxScore: qr.maxScore,
          percentage: qr.percentage,
          completedAt: qr.completedAt,
          timeSpent: qr.timeSpent,
          difficulty: qr.difficulty,
          questionsTotal: qr.questionsTotal,
          questionsCorrect: qr.questionsCorrect,
          questionsIncorrect: qr.questionsTotal - qr.questionsCorrect,
          rank: 1, // À calculer
          classAverage: 75, // À récupérer depuis la base
          teacherComment: 'Bon travail ! Continuez ainsi.',
          strengths: ['Compréhension', 'Mémorisation'],
          weaknesses: ['Analyse critique'],
          badges: ['Quiz Master'],
          xpEarned: qr.xpEarned,
          attempts: qr.attempts,
          isImprovement: true,
          previousScore: qr.percentage - 5
        }));
        
        setResults(transformedResults);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données enfant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChildData();
  }, [selectedChild?.id]);


  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'history': return History;
      case 'geography': return Globe;
      case 'both': return BookOpen;
      default: return FileText;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'history': return 'from-amber-500 to-orange-600';
      case 'geography': return 'from-green-500 to-emerald-600';
      case 'both': return 'from-blue-500 to-indigo-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-blue-500 to-indigo-600';
    if (score >= 50) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank <= 3) return 'text-blue-400';
    if (rank <= 5) return 'text-green-400';
    return 'text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getChildName = (childId: string) => {
    if (!parent) return '';
    const child = parent.children.find(c => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : '';
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.quizTitle.toLowerCase().includes(searchQuery?.toLowerCase() || '');
    const matchesSubject = selectedSubject === 'all' || result.subject === selectedSubject;
    const matchesChild = selectedChild_ === 'all' || result.childId === selectedChild_;
    
    return matchesSearch && matchesSubject && matchesChild;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      case 'score':
        return b.percentage - a.percentage;
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      default:
        return 0;
    }
  });

  const calculateStats = () => {
    if (filteredResults.length === 0) {
      return {
        averageScore: 0,
        totalQuizzes: 0,
        improvements: 0,
        totalXP: 0,
        totalBadges: 0,
        bestRank: 0
      };
    }

    const stats = filteredResults.reduce((acc, result) => {
      acc.averageScore += result.percentage;
      acc.totalQuizzes += 1;
      acc.improvements += result.isImprovement ? 1 : 0;
      acc.totalXP += result.xpEarned;
      acc.totalBadges += result.badges.length;
      acc.bestRank = Math.min(acc.bestRank || Infinity, result.rank);
      return acc;
    }, {
      averageScore: 0,
      totalQuizzes: 0,
      improvements: 0,
      totalXP: 0,
      totalBadges: 0,
      bestRank: Infinity
    });

    return {
      ...stats,
      averageScore: Math.round(stats.averageScore / stats.totalQuizzes),
      bestRank: stats.bestRank === Infinity ? 0 : stats.bestRank
    };
  };

  const stats = calculateStats();

  const renderResultCard = (result: QuizResult) => {
    const SubjectIcon = getSubjectIcon(result.subject);
    const childName = getChildName(result.childId);
    
    return (
      <div
        key={result.id}
        onClick={() => {
          setSelectedResult(result);
          setShowResultModal(true);
        }}
        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 cursor-pointer transition-all hover:scale-105 hover:bg-white/15"
      >
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getSubjectColor(result.subject)} rounded-xl flex items-center justify-center`}>
              <SubjectIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{result.quizTitle}</h3>
              <p className="text-blue-200 text-sm">{childName} - {formatDate(result.completedAt)}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className={`w-4 h-4 ${getRankColor(result.rank)}`} />
              <span className={`text-sm ${getRankColor(result.rank)}`}>#{result.rank}</span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-white text-lg font-bold">{result.questionsCorrect}/{result.questionsTotal}</div>
            <div className="text-blue-300 text-xs">Bonnes réponses</div>
          </div>
          <div className="text-center">
            <div className="text-white text-lg font-bold">{formatDuration(result.timeSpent)}</div>
            <div className="text-blue-300 text-xs">Temps passé</div>
          </div>
          <div className="text-center">
            <div className="text-white text-lg font-bold">{result.xpEarned}</div>
            <div className="text-blue-300 text-xs">XP gagnés</div>
          </div>
        </div>

        {/* Badges et amélioration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1">
            {result.badges.slice(0, 2).map((badge, index) => (
              <span key={index} className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                {badge}
              </span>
            ))}
            {result.badges.length > 2 && (
              <span className="text-yellow-400 text-xs">+{result.badges.length - 2}</span>
            )}
          </div>
          
          {result.isImprovement && result.previousScore && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                +{result.percentage - result.previousScore}%
              </span>
            </div>
          )}
        </div>

        {/* Barre de progression vs moyenne */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm">vs Moyenne de classe</span>
            <span className="text-blue-300 text-sm">{result.classAverage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getScoreGradient(result.percentage)} h-2 rounded-full transition-all`}
              style={{ width: `${Math.min((result.percentage / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Difficulté et tentatives */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(result.difficulty)}`}>
            {result.difficulty === 'easy' ? 'Facile' : 
             result.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
          </span>
          
          <div className="flex items-center space-x-2 text-blue-300 text-sm">
            <Clock className="w-4 h-4" />
            <span>{result.attempts} tentative{result.attempts > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Chargement des résultats de quiz...</p>
        </div>
      </div>
    );
  }

  if (!childData) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
        <h3 className="text-white text-lg font-semibold mb-2">Aucune donnée disponible</h3>
        <p className="text-blue-200">Sélectionnez un enfant pour voir ses résultats de quiz</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Résultats des quiz - {childData.fullName}</h1>
            <p className="text-blue-200">Classe: {childData.classLevel} | Total: {results.length} quiz</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            
            <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(childData.stats.averageScore)}`}>
              {childData.stats.averageScore}%
            </div>
            <div className="text-blue-300 text-sm">Score moyen</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.completedQuizzes}</div>
            <div className="text-blue-300 text-sm">Quiz terminés</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">#{childData.stats.rank}</div>
            <div className="text-blue-300 text-sm">Meilleur rang</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.currentStreak}</div>
            <div className="text-blue-300 text-sm">Série actuelle</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.totalXP}</div>
            <div className="text-blue-300 text-sm">XP total</div>
          </div>
        </div>
      </div>

      {/* Filtres détaillés */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-blue-200 text-sm mb-2">Enfant</label>
              <select
                value={selectedChild_}
                onChange={(e) => setSelectedChild_(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Tous les enfants</option>
                {parent?.children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-blue-200 text-sm mb-2">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Toutes matières</option>
                <option value="history">Histoire</option>
                <option value="geography">Géographie</option>
              </select>
            </div>

            <div>
              <label className="block text-blue-200 text-sm mb-2">Période</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="trimester">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>

            <div>
              <label className="block text-blue-200 text-sm mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="recent">Plus récents</option>
                <option value="score">Meilleur score</option>
                <option value="subject">Par matière</option>
                <option value="difficulty">Par difficulté</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Liste des résultats */}
      <div>
        {sortedResults.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Aucun résultat trouvé</h3>
            <p className="text-blue-200">Aucun quiz ne correspond à vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResults.map(result => renderResultCard(result))}
          </div>
        )}
      </div>

      {/* Modal de détail du résultat */}
      {showResultModal && selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Détails du résultat</h2>
              <button
                onClick={() => setShowResultModal(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                {/* En-tête du quiz */}
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor(selectedResult.subject)} rounded-xl flex items-center justify-center`}>
                      {React.createElement(getSubjectIcon(selectedResult.subject), { className: "w-8 h-8 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">{selectedResult.quizTitle}</h3>
                      <p className="text-blue-200">{getChildName(selectedResult.childId)}</p>
                      <p className="text-blue-300 text-sm">{formatDate(selectedResult.completedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(selectedResult.percentage)}`}>
                        {selectedResult.percentage}%
                      </div>
                      <div className="text-blue-300 text-sm">Score obtenu</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getRankColor(selectedResult.rank)}`}>
                        #{selectedResult.rank}
                      </div>
                      <div className="text-blue-300 text-sm">Classement</div>
                    </div>
                  </div>
                </div>

                {/* Commentaire du professeur */}
                {selectedResult.teacherComment && (
                  <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-400/30">
                    <h4 className="text-blue-300 font-semibold mb-3 flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Commentaire du professeur</span>
                    </h4>
                    <p className="text-white">{selectedResult.teacherComment}</p>
                  </div>
                )}

                {/* Points forts et faibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-green-400 font-semibold mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Points forts</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedResult.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <ThumbsUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-green-200 text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-orange-400 font-semibold mb-4 flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>À améliorer</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedResult.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <ThumbsDown className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          <span className="text-orange-200 text-sm">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badges obtenus */}
                {selectedResult.badges.length > 0 && (
                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-yellow-400 font-semibold mb-4 flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>Badges obtenus</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResult.badges.map((badge, index) => (
                        <span key={index} className="bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-lg font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistiques détaillées */}
              <div className="space-y-6">
                {/* Métriques */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Statistiques</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Questions correctes</span>
                      <span className="text-white font-semibold">
                        {selectedResult.questionsCorrect}/{selectedResult.questionsTotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Temps passé</span>
                      <span className="text-white font-semibold">
                        {formatDuration(selectedResult.timeSpent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Difficulté</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(selectedResult.difficulty)}`}>
                        {selectedResult.difficulty === 'easy' ? 'Facile' : 
                         selectedResult.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Tentatives</span>
                      <span className="text-white font-semibold">{selectedResult.attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">XP gagnés</span>
                      <span className="text-yellow-400 font-semibold">{selectedResult.xpEarned}</span>
                    </div>
                  </div>
                </div>

                {/* Comparaison avec la classe */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Comparaison classe</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-200 text-sm">Votre enfant</span>
                        <span className="text-white font-semibold">{selectedResult.percentage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${getScoreGradient(selectedResult.percentage)} h-2 rounded-full`}
                          style={{ width: `${selectedResult.percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-200 text-sm">Moyenne classe</span>
                        <span className="text-blue-300 font-semibold">{selectedResult.classAverage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-gray-500 to-slate-600 h-2 rounded-full"
                          style={{ width: `${selectedResult.classAverage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex items-center space-x-2">
                        {selectedResult.percentage > selectedResult.classAverage ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-semibold">
                              +{selectedResult.percentage - selectedResult.classAverage}% au-dessus
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm font-semibold">
                              {selectedResult.classAverage - selectedResult.percentage}% en-dessous
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amélioration */}
                {selectedResult.isImprovement && selectedResult.previousScore && (
                  <div className="bg-green-500/20 rounded-xl p-6 border border-green-400/30">
                    <h4 className="text-green-400 font-semibold mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Amélioration</span>
                    </h4>
                    <div className="text-center">
                      <div className="text-green-300 text-2xl font-bold">
                        +{selectedResult.percentage - selectedResult.previousScore}%
                      </div>
                      <div className="text-green-200 text-sm">
                        Par rapport à la tentative précédente ({selectedResult.previousScore}%)
                      </div>
                    </div>
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

export default QuizResultsTab;

