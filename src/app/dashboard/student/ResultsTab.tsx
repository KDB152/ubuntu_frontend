'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Star,
  Award,
  Eye,
  Download,
  Share2,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Brain,
  Zap,
  Trophy,
  Medal,
  Crown,
  Flag,
  Heart,
  ThumbsUp,
  MessageCircle,
  RotateCcw,
  Play,
  Pause,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Check,
  Info,
  HelpCircle,
  Lightbulb,
  Globe,
  History,
  Users,
  Bookmark,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: 'history' | 'geography' | 'both';
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt: string;
  duration: number; // en secondes
  score: number;
  maxScore: number;
  percentage: number;
  questionsCorrect: number;
  questionsTotal: number;
  timeSpent: number;
  attempts: number;
  rank?: number;
  classAverage?: number;
  improvement?: number;
  badges?: string[];
  xpEarned: number;
  feedback?: string;
  detailedResults: {
    questionId: string;
    question: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
    timeSpent: number;
    explanation?: string;
    difficulty: string;
  }[];
}

interface ResultsTabProps {}

const ResultsTab: React.FC<ResultsTabProps> = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detailed'>('list');
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  useEffect(() => {
    // Données simulées des résultats
    const mockResults: QuizResult[] = [
      {
        id: 'result-1',
        quizId: 'quiz-1',
        quizTitle: 'La Révolution française',
        subject: 'history',
        difficulty: 'medium',
        completedAt: '2024-12-20T10:30:00',
        duration: 1200, // 20 minutes
        score: 135,
        maxScore: 150,
        percentage: 90,
        questionsCorrect: 7,
        questionsTotal: 8,
        timeSpent: 1200,
        attempts: 1,
        rank: 3,
        classAverage: 75,
        improvement: 15,
        badges: ['Révolutionnaire', 'Historien en herbe'],
        xpEarned: 135,
        feedback: 'Excellent travail ! Vous maîtrisez bien les événements de la Révolution française.',
        detailedResults: [
          {
            questionId: 'q1',
            question: 'En quelle année a commencé la Révolution française ?',
            userAnswer: '1789',
            correctAnswer: '1789',
            isCorrect: true,
            points: 10,
            maxPoints: 10,
            timeSpent: 45,
            explanation: 'La Révolution française a commencé en 1789 avec la convocation des États généraux.',
            difficulty: 'easy'
          },
          {
            questionId: 'q2',
            question: 'La Déclaration des droits de l\'homme et du citoyen a été adoptée en 1789.',
            userAnswer: true,
            correctAnswer: true,
            isCorrect: true,
            points: 8,
            maxPoints: 8,
            timeSpent: 30,
            explanation: 'La Déclaration a été adoptée le 26 août 1789.',
            difficulty: 'easy'
          },
          {
            questionId: 'q3',
            question: 'Qui était le roi de France au début de la Révolution ?',
            userAnswer: 'Louis XVI',
            correctAnswer: 'Louis XVI',
            isCorrect: true,
            points: 10,
            maxPoints: 10,
            timeSpent: 60,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'result-2',
        quizId: 'quiz-2',
        quizTitle: 'Les climats européens',
        subject: 'geography',
        difficulty: 'easy',
        completedAt: '2024-12-19T14:15:00',
        duration: 900, // 15 minutes
        score: 102,
        maxScore: 120,
        percentage: 85,
        questionsCorrect: 10,
        questionsTotal: 12,
        timeSpent: 900,
        attempts: 2,
        rank: 5,
        classAverage: 72,
        improvement: 10,
        badges: ['Géographe'],
        xpEarned: 102,
        feedback: 'Bonne compréhension des climats européens. Travaillez les nuances entre les différents types.',
        detailedResults: []
      },
      {
        id: 'result-3',
        quizId: 'quiz-4',
        quizTitle: 'Les grandes villes mondiales',
        subject: 'geography',
        difficulty: 'medium',
        completedAt: '2024-12-18T16:45:00',
        duration: 1500, // 25 minutes
        score: 165,
        maxScore: 180,
        percentage: 92,
        questionsCorrect: 16,
        questionsTotal: 18,
        timeSpent: 1500,
        attempts: 1,
        rank: 1,
        classAverage: 81,
        improvement: 0,
        badges: ['Explorateur urbain', 'Champion'],
        xpEarned: 165,
        feedback: 'Performance exceptionnelle ! Vous êtes premier de la classe sur ce quiz.',
        detailedResults: []
      },
      {
        id: 'result-4',
        quizId: 'quiz-3',
        quizTitle: 'L\'Empire de Napoléon',
        subject: 'history',
        difficulty: 'hard',
        completedAt: '2024-12-17T11:20:00',
        duration: 1800, // 30 minutes
        score: 140,
        maxScore: 200,
        percentage: 70,
        questionsCorrect: 14,
        questionsTotal: 20,
        timeSpent: 1800,
        attempts: 1,
        rank: 8,
        classAverage: 65,
        improvement: 5,
        badges: ['Stratège'],
        xpEarned: 140,
        feedback: 'Quiz difficile bien maîtrisé. Continuez à approfondir vos connaissances sur cette période.',
        detailedResults: []
      }
    ];

    setResults(mockResults);
    setFilteredResults(mockResults);
  }, []);

  useEffect(() => {
    let filtered = [...results];

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(result =>
        result.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrage par matière
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(result => result.subject === selectedSubject);
    }

    // Filtrage par difficulté
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(result => result.difficulty === selectedDifficulty);
    }

    // Tri
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        break;
      case 'score':
        filtered.sort((a, b) => b.percentage - a.percentage);
        break;
      case 'title':
        filtered.sort((a, b) => a.quizTitle.localeCompare(b.quizTitle));
        break;
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
    }

    setFilteredResults(filtered);
  }, [results, searchQuery, selectedSubject, selectedDifficulty, sortBy]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 75) return 'text-blue-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const calculateOverallStats = () => {
    if (results.length === 0) return null;

    const totalScore = results.reduce((sum, result) => sum + result.percentage, 0);
    const averageScore = Math.round(totalScore / results.length);
    
    const totalXP = results.reduce((sum, result) => sum + result.xpEarned, 0);
    const totalBadges = new Set(results.flatMap(result => result.badges || [])).size;
    
    const recentResults = results.slice(0, 5);
    const trend = recentResults.length >= 2 ? 
      recentResults[0].percentage - recentResults[recentResults.length - 1].percentage : 0;

    return {
      averageScore,
      totalQuizzes: results.length,
      totalXP,
      totalBadges,
      trend,
      bestScore: Math.max(...results.map(r => r.percentage)),
      totalTimeSpent: results.reduce((sum, result) => sum + result.timeSpent, 0)
    };
  };

  const stats = calculateOverallStats();

  const renderResultCard = (result: QuizResult) => {
    const SubjectIcon = getSubjectIcon(result.subject);
    const isExpanded = expandedResult === result.id;

    return (
      <div key={result.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        {/* Header de la carte */}
        <div className={`bg-gradient-to-r ${getSubjectColor(result.subject)} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <SubjectIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{result.quizTitle}</h3>
                <p className="text-white/80 text-sm">
                  {new Date(result.completedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                {result.percentage}%
              </div>
              <div className="text-white/80 text-sm">
                {result.score}/{result.maxScore} pts
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-4">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-white text-lg font-bold">{result.questionsCorrect}/{result.questionsTotal}</div>
              <div className="text-blue-300 text-xs">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">{formatDuration(result.timeSpent)}</div>
              <div className="text-blue-300 text-xs">Temps</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">#{result.rank || 'N/A'}</div>
              <div className="text-blue-300 text-xs">Rang</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">{result.xpEarned}</div>
              <div className="text-blue-300 text-xs">XP</div>
            </div>
          </div>

          {/* Badges */}
          {result.badges && result.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {result.badges.map((badge, index) => (
                <span key={index} className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Comparaison avec la classe */}
          {result.classAverage && (
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-200 text-sm">Comparaison avec la classe</span>
                <span className={`text-sm font-semibold ${
                  result.percentage > result.classAverage ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {result.percentage > result.classAverage ? '+' : ''}{result.percentage - result.classAverage}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${result.classAverage}%` }}
                  />
                </div>
                <span className="text-blue-300 text-xs">{result.classAverage}% (classe)</span>
              </div>
            </div>
          )}

          {/* Feedback */}
          {result.feedback && (
            <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-blue-100 text-sm">{result.feedback}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(result.difficulty)}`}>
                {result.difficulty === 'easy' ? 'Facile' : result.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
              </span>
              {result.attempts > 1 && (
                <span className="text-blue-300 text-xs">
                  Tentative #{result.attempts}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setExpandedResult(isExpanded ? null : result.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-lg text-blue-300 hover:text-white hover:bg-white/20 transition-all text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>{isExpanded ? 'Masquer' : 'Détails'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button className="p-2 bg-white/10 rounded-lg text-blue-300 hover:text-white hover:bg-white/20 transition-all">
                <Download className="w-4 h-4" />
              </button>
              
              <button className="p-2 bg-white/10 rounded-lg text-blue-300 hover:text-white hover:bg-white/20 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Détails étendus */}
          {isExpanded && result.detailedResults.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/20">
              <h4 className="text-white font-semibold mb-4">Détail des réponses</h4>
              <div className="space-y-3">
                {result.detailedResults.map((detail, index) => (
                  <div key={detail.questionId} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="text-white font-medium text-sm mb-2">
                          Question {index + 1}: {detail.question}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-blue-200 text-xs mb-1">Votre réponse :</p>
                            <p className={`text-sm ${detail.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                              {typeof detail.userAnswer === 'boolean' 
                                ? (detail.userAnswer ? 'Vrai' : 'Faux')
                                : detail.userAnswer}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-xs mb-1">Réponse correcte :</p>
                            <p className="text-green-400 text-sm">
                              {typeof detail.correctAnswer === 'boolean' 
                                ? (detail.correctAnswer ? 'Vrai' : 'Faux')
                                : detail.correctAnswer}
                            </p>
                          </div>
                        </div>
                        {detail.explanation && (
                          <div className="mt-3 p-3 bg-blue-500/20 rounded-lg">
                            <p className="text-blue-100 text-sm">{detail.explanation}</p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className={`flex items-center space-x-1 ${detail.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {detail.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span className="text-sm font-semibold">
                            {detail.points}/{detail.maxPoints}
                          </span>
                        </div>
                        <div className="text-blue-300 text-xs mt-1">
                          {detail.timeSpent}s
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques globales */}
      {stats && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold mb-2">Mes Résultats</h1>
              <p className="text-blue-200">Suivez vos performances et votre progression</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all">
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-white text-2xl font-bold">{stats.averageScore}%</div>
              <div className="text-blue-300 text-sm">Score moyen</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-white text-2xl font-bold">{stats.totalQuizzes}</div>
              <div className="text-blue-300 text-sm">Quiz terminés</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-white text-2xl font-bold">{stats.bestScore}%</div>
              <div className="text-blue-300 text-sm">Meilleur score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-white text-2xl font-bold">{stats.totalXP}</div>
              <div className="text-blue-300 text-sm">XP total</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-white text-2xl font-bold">{stats.totalBadges}</div>
              <div className="text-blue-300 text-sm">Badges</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold flex items-center justify-center ${
                stats.trend > 0 ? 'text-green-400' : stats.trend < 0 ? 'text-red-400' : 'text-blue-400'
              }`}>
                {stats.trend > 0 ? <TrendingUp className="w-6 h-6" /> : 
                 stats.trend < 0 ? <TrendingDown className="w-6 h-6" /> : 
                 <Target className="w-6 h-6" />}
              </div>
              <div className="text-blue-300 text-sm">Tendance</div>
            </div>
          </div>

          {/* Graphique de progression */}
          <div className="mt-6 bg-white/5 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Évolution des scores</h3>
            <div className="h-32 flex items-end space-x-2">
              {results.slice(-10).map((result, index) => (
                <div key={result.id} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t"
                    style={{ height: `${(result.percentage / 100) * 100}%` }}
                  />
                  <div className="text-blue-300 text-xs mt-2 transform -rotate-45 origin-left">
                    {new Date(result.completedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
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

          {/* Filtres */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Filtres détaillés */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-blue-200 text-sm mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="recent">Plus récents</option>
                  <option value="score">Meilleur score</option>
                  <option value="title">Titre</option>
                  <option value="difficulty">Difficulté</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des résultats */}
      <div className="space-y-6">
        {filteredResults.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <BarChart3 className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Aucun résultat trouvé</h3>
            <p className="text-blue-200">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map(result => renderResultCard(result))}
          </div>
        )}
      </div>

      {/* Analyse détaillée */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Analyse détaillée</h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Contenu de l'analyse détaillée */}
            <div className="space-y-6">
              {/* Ici on pourrait ajouter des graphiques détaillés, des comparaisons, etc. */}
              <p className="text-blue-200">Analyse détaillée en cours de développement...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTab;

