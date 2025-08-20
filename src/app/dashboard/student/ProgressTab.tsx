
'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
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

interface Student {
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

interface ProgressData {
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

interface ProgressTabProps {
  student?: Student;
  searchQuery?: string;
}

const ProgressTab: React.FC<ProgressTabProps> = ({
  student,
  searchQuery
}) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'trimester' | 'year'>('month');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'history' | 'geography'>('all');
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Données simulées de progression
    const mockProgressData: ProgressData[] = [
      {
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

  const calculateOverallProgress = () => {
    if (progressData.length === 0) return { average: 0, trend: 'stable', improvement: 0 };

    const totalAverage = progressData.reduce((sum, data) => sum + data.averageScore, 0) / progressData.length;
    const totalImprovement = progressData.reduce((sum, data) => sum + data.improvement, 0) / progressData.length;
    
    return {
      average: Math.round(totalAverage),
      trend: totalImprovement > 5 ? 'up' : totalImprovement < -5 ? 'down' : 'stable',
      improvement: Math.round(totalImprovement)
    };
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Mon Suivi de Progrès</h1>
            <p className="text-blue-200">
              Analyse détaillée de votre performance académique
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
            
            <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(overallProgress.average)}`}>
              {overallProgress.average}%
            </div>
            <div className="text-blue-300 text-sm">Score moyen</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{student?.stats.completedQuizzes || 0}</div>
            <div className="text-blue-300 text-sm">Quiz terminés</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{student?.stats.totalXP.toLocaleString() || 0}</div>
            <div className="text-blue-300 text-sm">XP total</div>
          </div>
        </div>
      </div>

      {/* Progression par matière */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-white text-xl font-bold">Progression par matière</h2>
        </div>
        
        <div className="space-y-6 p-6">
          {progressData.filter(data => selectedSubject === 'all' || data.subject === selectedSubject).map((data) => (
            <div key={data.subject} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {data.subject === 'history' ? (
                    <History className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Globe className="w-6 h-6 text-green-400" />
                  )}
                  <span className="text-white font-semibold capitalize">{data.subject === 'history' ? 'Histoire' : 'Géographie'}</span>
                </div>
<div className="flex items-center space-x-2">
  <span className={`text-xl font-bold ${getScoreColor(data.averageScore)}`}>
    {data.averageScore}%
  </span>
  <div className="flex items-center space-x-1">
    {(() => {
      const TrendIcon = getTrendIcon(data.improvement > 0 ? 'up' : data.improvement < 0 ? 'down' : 'stable');
      return <TrendIcon className={`w-5 h-5 ${getTrendColor(data.improvement > 0 ? 'up' : data.improvement < 0 ? 'down' : 'stable')}`} />;
    })()}
    <span className={`text-sm ${getTrendColor(data.improvement > 0 ? 'up' : data.improvement < 0 ? 'down' : 'stable')}`}>
      {data.improvement > 0 ? '+' : ''}{data.improvement}%
    </span>
  </div>
</div>
              </div>

              {/* Graphique de progression */}
              <div className="mb-4">
                <div className="h-32 w-full bg-white/5 rounded-lg p-2 flex items-end justify-around">
                  {data.scores.map((score, index) => (
                    <div
                      key={index}
                      className={`w-4 rounded-t-md bg-gradient-to-t ${getProgressColor(score)}`}
                      style={{ height: `${score}%` }}
                      title={`${score}%`}
                    />
                  ))}
                </div>
                <div className="text-blue-300 text-xs text-center mt-2">Évolution des scores récents</div>
              </div>

              {/* Détails étendus */}
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
            </div>
          ))}
        </div>
      </div>

      {/* Niveaux et progression */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-white text-xl font-bold mb-6">Niveaux et objectifs</h2>
        
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
                        className={`flex-1 bg-gradient-to-t ${getProgressColor(score)} rounded-t`}
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

export default ProgressTab;