'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Award,
  Star,
  Trophy,
  Medal,
  Crown,
  Zap,
  Brain,
  BookOpen,
  Clock,
  Calendar,
  User,
  Users,
  Eye,
  Filter,
  Download,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  X,
  Check,
  Info,
  AlertCircle,
  CheckCircle,
  History,
  Globe,
  Map,
  Compass,
  Flag,
  Mountain,
  Waves,
  TreePine,
  Flower,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Thermometer,
  Umbrella,
  Rainbow,
  Snowflake,
  Flame,
  Sparkles,
  Heart,
  Smile,
  Frown,
  Meh
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
  stats: {
    averageScore: number;
    totalQuizzes: number;
    completedQuizzes: number;
    currentStreak: number;
    totalXP: number;
    badges: number;
    rank: number;
  };
  recentActivity: {
    lastQuiz: string;
    lastScore: number;
    lastActive: string;
  };
}

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  children: Child[];
}

interface ProgressData {
  childId: string;
  subject: 'history' | 'geography' | 'both';
  period: string;
  scores: number[];
  dates: string[];
  averageScore: number;
  improvement: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface SubjectProgress {
  subject: string;
  currentLevel: number;
  maxLevel: number;
  progress: number;
  recentScores: number[];
  trend: 'up' | 'down' | 'stable';
  nextMilestone: string;
}

interface ChildrenProgressTabProps {
  selectedChild?: Child;
  parent?: Parent;
  searchQuery?: string;
}

const ChildrenProgressTab: React.FC<ChildrenProgressTabProps> = ({
  selectedChild,
  parent,
  searchQuery
}) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'trimester' | 'year'>('month');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'history' | 'geography'>('all');
  const [comparisonMode, setComparisonMode] = useState<'individual' | 'comparative'>('individual');
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Données simulées de progression
    const mockProgressData: ProgressData[] = [
      {
        childId: 'child-1',
        subject: 'history',
        period: 'month',
        scores: [78, 82, 85, 88, 92, 89, 94],
        dates: ['2024-11-15', '2024-11-22', '2024-11-29', '2024-12-06', '2024-12-13', '2024-12-17', '2024-12-20'],
        averageScore: 87,
        improvement: 16,
        strengths: ['Révolution française', 'Chronologie', 'Personnages historiques'],
        weaknesses: ['Causes économiques', 'Contexte européen'],
        recommendations: [
          'Approfondir les aspects économiques de l\'histoire',
          'Utiliser plus de cartes historiques',
          'Faire des liens avec la géographie'
        ]
      },
      {
        childId: 'child-1',
        subject: 'geography',
        period: 'month',
        scores: [85, 88, 83, 90, 87, 92, 89],
        dates: ['2024-11-15', '2024-11-22', '2024-11-29', '2024-12-06', '2024-12-13', '2024-12-17', '2024-12-20'],
        averageScore: 88,
        improvement: 4,
        strengths: ['Capitales européennes', 'Reliefs', 'Climats'],
        weaknesses: ['Économie régionale', 'Démographie'],
        recommendations: [
          'Étudier les liens entre géographie et économie',
          'Approfondir les données démographiques',
          'Utiliser plus de graphiques et statistiques'
        ]
      },
      {
        childId: 'child-2',
        subject: 'history',
        period: 'month',
        scores: [92, 95, 98, 94, 96, 99, 97],
        dates: ['2024-11-15', '2024-11-22', '2024-11-29', '2024-12-06', '2024-12-13', '2024-12-17', '2024-12-20'],
        averageScore: 96,
        improvement: 5,
        strengths: ['Analyse de documents', 'Synthèse', 'Argumentation', 'Chronologie'],
        weaknesses: ['Cartographie historique'],
        recommendations: [
          'Continuer l\'excellent travail',
          'Développer les compétences cartographiques',
          'Approfondir l\'histoire européenne'
        ]
      },
      {
        childId: 'child-2',
        subject: 'geography',
        period: 'month',
        scores: [89, 92, 94, 91, 95, 98, 96],
        dates: ['2024-11-15', '2024-11-22', '2024-11-29', '2024-12-06', '2024-12-13', '2024-12-17', '2024-12-20'],
        averageScore: 94,
        improvement: 7,
        strengths: ['Analyse spatiale', 'Cartes', 'Phénomènes climatiques', 'Urbanisation'],
        weaknesses: ['Géologie'],
        recommendations: [
          'Excellent niveau général',
          'Approfondir les aspects géologiques',
          'Développer l\'analyse critique des données'
        ]
      }
    ];

    const mockSubjectProgress: SubjectProgress[] = [
      {
        subject: 'Histoire',
        currentLevel: 12,
        maxLevel: 20,
        progress: 60,
        recentScores: [87, 92, 89, 94, 88],
        trend: 'up',
        nextMilestone: 'Maître de la Révolution française'
      },
      {
        subject: 'Géographie',
        currentLevel: 14,
        maxLevel: 20,
        progress: 70,
        recentScores: [88, 89, 92, 87, 91],
        trend: 'stable',
        nextMilestone: 'Expert des climats européens'
      }
    ];

    setProgressData(mockProgressData);
    setSubjectProgress(mockSubjectProgress);
  }, []);

  const getChildProgressData = (childId: string) => {
    return progressData.filter(data => data.childId === childId);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-600';
    if (progress >= 60) return 'from-blue-500 to-indigo-600';
    if (progress >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const calculateOverallProgress = (child: Child) => {
    const childData = getChildProgressData(child.id);
    if (childData.length === 0) return { average: 0, trend: 'stable', improvement: 0 };

    const totalAverage = childData.reduce((sum, data) => sum + data.averageScore, 0) / childData.length;
    const totalImprovement = childData.reduce((sum, data) => sum + data.improvement, 0) / childData.length;
    
    return {
      average: Math.round(totalAverage),
      trend: totalImprovement > 5 ? 'up' : totalImprovement < -5 ? 'down' : 'stable',
      improvement: Math.round(totalImprovement)
    };
  };

  const renderChildCard = (child: Child) => {
    const progress = calculateOverallProgress(child);
    const TrendIcon = getTrendIcon(progress.trend);
    const childData = getChildProgressData(child.id);

    return (
      <div key={child.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        {/* En-tête de l'enfant */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            {child.avatar ? (
              <img
                src={child.avatar}
                alt={child.firstName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold">{child.firstName} {child.lastName}</h3>
              <p className="text-blue-200">{child.class} - {child.school}</p>
              <p className="text-blue-300 text-sm">Professeur: {child.teacher}</p>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(progress.average)}`}>
                {progress.average}%
              </div>
              <div className="flex items-center space-x-1">
                <TrendIcon className={`w-4 h-4 ${getTrendColor(progress.trend)}`} />
                <span className={`text-sm ${getTrendColor(progress.trend)}`}>
                  {progress.improvement > 0 ? '+' : ''}{progress.improvement}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="p-6 border-b border-white/20">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-white text-lg font-bold">{child.stats.completedQuizzes}</div>
              <div className="text-blue-300 text-xs">Quiz terminés</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">#{child.stats.rank}</div>
              <div className="text-blue-300 text-xs">Classement</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">{child.stats.currentStreak}</div>
              <div className="text-blue-300 text-xs">Série actuelle</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">{child.stats.badges}</div>
              <div className="text-blue-300 text-xs">Badges</div>
            </div>
          </div>
        </div>

        {/* Progression par matière */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">Progression par matière</h4>
            <button
              onClick={() => setShowDetails(prev => ({ ...prev, [child.id]: !prev[child.id] }))}
              className="text-blue-400 hover:text-white transition-all"
            >
              {showDetails[child.id] ? 'Masquer' : 'Détails'}
            </button>
          </div>

          <div className="space-y-4">
            {childData.map((data) => (
              <div key={`${data.childId}-${data.subject}`} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {data.subject === 'history' ? (
                      <History className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Globe className="w-5 h-5 text-green-400" />
                    )}
                    <span className="text-white font-medium capitalize">{data.subject === 'history' ? 'Histoire' : 'Géographie'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getScoreColor(data.averageScore)}`}>
                      {data.averageScore}%
                    </span>
                    <div className="flex items-center space-x-1">
                      {data.improvement > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-400" />
                      ) : data.improvement < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <Minus className="w-4 h-4 text-blue-400" />
                      )}
                      <span className={`text-sm ${
                        data.improvement > 0 ? 'text-green-400' : 
                        data.improvement < 0 ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {data.improvement > 0 ? '+' : ''}{data.improvement}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Graphique de progression simplifié */}
                <div className="mb-3">
                  <div className="flex items-end space-x-1 h-16">
                    {data.scores.slice(-7).map((score, index) => (
                      <div
                        key={index}
                        className={`flex-1 bg-gradient-to-t ${getProgressColor(score)} rounded-t opacity-80`}
                        style={{ height: `${(score / 100) * 100}%` }}
                        title={`${score}%`}
                      />
                    ))}
                  </div>
                  <div className="text-blue-300 text-xs text-center mt-1">
                    Évolution des 7 derniers quiz
                  </div>
                </div>

                {/* Détails étendus */}
                {showDetails[child.id] && (
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    {/* Points forts */}
                    <div>
                      <h5 className="text-green-400 font-medium mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Points forts</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {data.strengths.map((strength, index) => (
                          <span key={index} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Points à améliorer */}
                    <div>
                      <h5 className="text-orange-400 font-medium mb-2 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>À améliorer</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {data.weaknesses.map((weakness, index) => (
                          <span key={index} className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded">
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommandations */}
                    <div>
                      <h5 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Recommandations</span>
                      </h5>
                      <ul className="space-y-1">
                        {data.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-blue-200 text-sm flex items-start space-x-2">
                            <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderComparativeView = () => {
    if (!parent || parent.children.length < 2) {
      return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
          <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-white text-xl font-bold mb-2">Comparaison non disponible</h3>
          <p className="text-blue-200">Il faut au moins 2 enfants pour afficher la vue comparative</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Comparaison globale */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-6">Comparaison des performances</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parent.children.map((child) => {
              const progress = calculateOverallProgress(child);
              const TrendIcon = getTrendIcon(progress.trend);
              
              return (
                <div key={child.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    {child.avatar ? (
                      <img
                        src={child.avatar}
                        alt={child.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-semibold">{child.firstName}</h4>
                      <p className="text-blue-300 text-sm">{child.class}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Score moyen</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getScoreColor(progress.average)}`}>
                          {progress.average}%
                        </span>
                        <TrendIcon className={`w-4 h-4 ${getTrendColor(progress.trend)}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Classement</span>
                      <span className="text-white font-bold">#{child.stats.rank}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Quiz terminés</span>
                      <span className="text-white font-bold">{child.stats.completedQuizzes}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Badges</span>
                      <span className="text-white font-bold">{child.stats.badges}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphique comparatif */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-6">Évolution comparative</h3>
          
          <div className="h-64 flex items-end space-x-4">
            {parent.children.map((child, childIndex) => {
              const childData = getChildProgressData(child.id);
              const historyData = childData.find(d => d.subject === 'history');
              const geographyData = childData.find(d => d.subject === 'geography');
              
              return (
                <div key={child.id} className="flex-1 space-y-2">
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">{child.firstName}</div>
                  </div>
                  
                  <div className="space-y-1">
                    {historyData && (
                      <div
                        className="bg-gradient-to-t from-amber-500 to-orange-600 rounded-t"
                        style={{ height: `${(historyData.averageScore / 100) * 200}px` }}
                        title={`Histoire: ${historyData.averageScore}%`}
                      />
                    )}
                    {geographyData && (
                      <div
                        className="bg-gradient-to-t from-green-500 to-emerald-600 rounded-t"
                        style={{ height: `${(geographyData.averageScore / 100) * 200}px` }}
                        title={`Géographie: ${geographyData.averageScore}%`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded"></div>
              <span className="text-blue-200 text-sm">Histoire</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
              <span className="text-blue-200 text-sm">Géographie</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Suivi des progrès</h1>
            <p className="text-blue-200">
              {comparisonMode === 'individual' 
                ? 'Analyse détaillée par enfant'
                : 'Comparaison entre les enfants'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="trimester">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">Toutes matières</option>
              <option value="history">Histoire</option>
              <option value="geography">Géographie</option>
            </select>
            
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setComparisonMode('individual')}
                className={`px-3 py-2 rounded-md text-sm transition-all ${
                  comparisonMode === 'individual' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                Individuel
              </button>
              <button
                onClick={() => setComparisonMode('comparative')}
                className={`px-3 py-2 rounded-md text-sm transition-all ${
                  comparisonMode === 'comparative' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                Comparatif
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      {comparisonMode === 'individual' ? (
        <div className="space-y-6">
          {parent?.children.map(child => renderChildCard(child))}
        </div>
      ) : (
        renderComparativeView()
      )}

      {/* Niveaux et progression */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white text-xl font-bold mb-6">Niveaux et progression</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectProgress.map((subject) => {
            const TrendIcon = getTrendIcon(subject.trend);
            
            return (
              <div key={subject.subject} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {subject.subject === 'Histoire' ? (
                      <History className="w-6 h-6 text-amber-400" />
                    ) : (
                      <Globe className="w-6 h-6 text-green-400" />
                    )}
                    <h4 className="text-white font-semibold">{subject.subject}</h4>
                  </div>
                  <TrendIcon className={`w-5 h-5 ${getTrendColor(subject.trend)}`} />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Niveau {subject.currentLevel}/{subject.maxLevel}</span>
                    <span className="text-white font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${getProgressColor(subject.progress)} h-3 rounded-full transition-all`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-blue-200 text-sm mb-2">Scores récents</div>
                  <div className="flex items-end space-x-1 h-8">
                    {subject.recentScores.map((score, index) => (
                      <div
                        key={index}
                        className={`flex-1 bg-gradient-to-t ${getProgressColor(score)} rounded-t opacity-80`}
                        style={{ height: `${(score / 100) * 100}%` }}
                        title={`${score}%`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-blue-200 text-sm mb-1">Prochain objectif</div>
                  <div className="text-white font-medium">{subject.nextMilestone}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChildrenProgressTab;