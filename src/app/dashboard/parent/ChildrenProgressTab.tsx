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
        
        // Transformer les données de progression
        const transformedProgressData: ProgressData[] = data.progress.map((p: any) => ({
          childId: data.id,
          subject: p.subject,
          period: 'month',
          scores: data.quizResults
            .filter((qr: any) => qr.subject === p.subject)
            .slice(0, 7)
            .map((qr: any) => qr.percentage),
          dates: data.quizResults
            .filter((qr: any) => qr.subject === p.subject)
            .slice(0, 7)
            .map((qr: any) => qr.completedAt.split('T')[0]),
          averageScore: p.progressPercentage,
          improvement: 0, // À calculer
          strengths: p.strengths || [],
          weaknesses: p.weaknesses || [],
          recommendations: [
            'Continuer à pratiquer régulièrement',
            'Revoir les points faibles identifiés',
            'Participer aux quiz de révision'
          ]
        }));
        
        setProgressData(transformedProgressData);
        
        // Transformer les données de progression par matière
        const transformedSubjectProgress: SubjectProgress[] = data.progress.map((p: any) => ({
          subject: p.subject,
          level: p.level,
          progressPercentage: p.progressPercentage,
          quizzesCompleted: data.quizResults.filter((qr: any) => qr.subject === p.subject).length,
          averageScore: data.quizResults
            .filter((qr: any) => qr.subject === p.subject)
            .reduce((sum: number, qr: any) => sum + qr.percentage, 0) / 
            Math.max(1, data.quizResults.filter((qr: any) => qr.subject === p.subject).length),
          lastActivity: p.lastUpdated,
          strengths: p.strengths || [],
          weaknesses: p.weaknesses || []
        }));
        
        setSubjectProgress(transformedSubjectProgress);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données enfant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChildData();
  }, [selectedChild?.id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Chargement des données de progression...</p>
        </div>
      </div>
    );
  }

  if (!childData) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
        <h3 className="text-white text-lg font-semibold mb-2">Aucune donnée disponible</h3>
        <p className="text-blue-200">Sélectionnez un enfant pour voir ses progrès</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de l'enfant */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Progrès de {childData.fullName}</h1>
            <p className="text-blue-200">
              Classe: {childData.classLevel} | Niveau: {childData.stats.level} | XP: {childData.stats.totalXP}
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
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.averageScore}%</div>
            <div className="text-blue-300 text-sm">Score moyen</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.completedQuizzes}</div>
            <div className="text-blue-300 text-sm">Quiz terminés</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.currentStreak}</div>
            <div className="text-blue-300 text-sm">Série actuelle</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-white text-2xl font-bold">{childData.stats.badges}</div>
            <div className="text-blue-300 text-sm">Badges</div>
          </div>
        </div>
      </div>

      {/* Progression par matière */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white text-xl font-bold mb-6">Progression par matière</h3>
        
        <div className="space-y-6">
          {subjectProgress.map((subject) => (
            <div key={subject.subject} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {subject.subject === 'history' ? (
                    <History className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Globe className="w-6 h-6 text-green-400" />
                  )}
                  <h4 className="text-white font-semibold capitalize">{subject.subject}</h4>
                </div>
                <div className="text-right">
                  <div className="text-white text-lg font-bold">{Math.round(subject.averageScore)}%</div>
                  <div className="text-blue-300 text-sm">{subject.quizzesCompleted} quiz</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200 text-sm">Progression</span>
                  <span className="text-white font-semibold">{subject.progressPercentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${subject.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Points forts et faibles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-green-400 font-medium mb-2 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Points forts</span>
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {subject.strengths.map((strength, index) => (
                      <span key={index} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-orange-400 font-medium mb-2 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>À améliorer</span>
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {subject.weaknesses.map((weakness, index) => (
                      <span key={index} className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activité récente */}
      {childData.quizResults.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-6">Activité récente</h3>
          
          <div className="space-y-4">
            {childData.quizResults.slice(0, 5).map((quiz: any) => (
              <div key={quiz.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{quiz.quizTitle}</h4>
                    <p className="text-blue-300 text-sm capitalize">{quiz.subject}</p>
                    <p className="text-blue-200 text-xs">
                      {new Date(quiz.completedAt).toLocaleDateString('fr-FR')} • {quiz.timeSpent} min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-lg font-bold">{quiz.percentage}%</div>
                    <div className="text-blue-300 text-sm">{quiz.questionsCorrect}/{quiz.questionsTotal}</div>
                    <div className="text-green-400 text-xs">+{quiz.xpEarned} XP</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges et achievements */}
      {childData.achievements.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-6">Badges et récompenses</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {childData.achievements.map((achievement: any) => (
              <div key={achievement.id} className="bg-white/5 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold text-sm">{achievement.name}</h4>
                <p className="text-blue-300 text-xs">{achievement.description}</p>
                <div className="text-green-400 text-xs mt-1">+{achievement.xpReward} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrenProgressTab;