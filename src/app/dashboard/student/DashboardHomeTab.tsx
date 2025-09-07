'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUserName } from '@/lib/userUtils';
import { useRealStats } from '@/hooks/useRealStats';
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  AlertCircle,
  Trophy,
  Zap,
  Heart,
  BookMarked,
  Users,
  BarChart3,
  Activity,
  Timer,
  Flag,
  Sparkles,
  Gift,
  ArrowRight,
  Plus,
  Eye,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Send,
  Coffee,
  Sun,
  Moon,
  CloudRain,
  Smile
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
  badge?: string;
}

interface UpcomingTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  type: 'quiz' | 'assignment' | 'exam';
  completed: boolean;
}

interface DashboardHomeTabProps {
  onNavigateToQuiz: (quizId: string) => void;
  onNavigateToQuizzes: () => void;
  onNavigateToResults: () => void;
  onNavigateToMessages: () => void;
  onNavigateToCalendar: () => void;
}

const DashboardHomeTab: React.FC<DashboardHomeTabProps> = ({ 
  onNavigateToQuiz, 
  onNavigateToQuizzes,
  onNavigateToResults, 
  onNavigateToMessages, 
  onNavigateToCalendar 
}) => {
  const { stats: realStats } = useRealStats();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    timeSpent: 0,
    streak: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Définir le message de salutation
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }

    return () => clearInterval(timer);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'start-quiz',
      title: 'Commencer un quiz',
      description: 'Démarrer un nouveau quiz disponible',
      icon: Play,
      color: 'from-green-500 to-emerald-600',
      action: () => onNavigateToQuizzes(),

    },
    {
      id: 'view-results',
      title: 'Voir mes résultats',
      description: 'Consulter vos derniers résultats',
      icon: BarChart3,
      color: 'from-blue-500 to-indigo-600',
      action: () => onNavigateToResults()
    },
    {
      id: 'check-messages',
      title: 'Messages',
      description: 'Lire vos nouveaux messages',
      icon: MessageSquare,
      color: 'from-purple-500 to-violet-600',
      action: () => onNavigateToMessages()
    },
    {
      id: 'view-calendar',
      title: 'Planning',
      description: 'Voir votre calendrier',
      icon: Calendar,
      color: 'from-orange-500 to-red-600',
      action: () => onNavigateToCalendar()
    }
  ];

  const formatTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return 'Échéance dépassée';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Bientôt';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-orange-500 bg-orange-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };


  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {getCurrentUserName()} ! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Prêt à continuer votre apprentissage aujourd'hui ?
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="text-blue-200">
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-4 right-4 opacity-20">
          <img src="/images/chrono_carto_logo.png" alt="Chrono-Carto" className="w-32 h-32" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <Sparkles className="w-24 h-24" />
        </div>
      </div>

      {/* Statistiques de la semaine */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Quiz terminés</p>
              <p className="text-white text-2xl font-bold">{weeklyStats.quizzesCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2 cette semaine
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Score moyen</p>
              <p className="text-white text-2xl font-bold">{weeklyStats.averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5% ce mois-ci
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Temps d'étude</p>
              <p className="text-white text-2xl font-bold">{Math.floor(weeklyStats.timeSpent / 60)}h{weeklyStats.timeSpent % 60}m</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-400 text-sm">
            <Activity className="w-4 h-4 mr-1" />
            Cette semaine
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Série actuelle</p>
              <p className="text-white text-2xl font-bold">{weeklyStats.streak} jours</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-yellow-400 text-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            Record personnel !
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-400" />
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {action.badge && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                    <p className="text-blue-200 text-sm">{action.description}</p>
                    <div className="flex items-center mt-3 text-blue-300 group-hover:text-white transition-colors">
                      <span className="text-sm">Commencer</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Motivation du jour */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center mb-3">
              <Heart className="w-6 h-6 mr-2 text-pink-200" />
              <h2 className="text-lg font-bold">Motivation du jour</h2>
            </div>
            <p className="text-pink-100 text-sm mb-4">
              "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
            </p>
            <p className="text-pink-200 text-xs">- Nelson Mandela</p>
            <div className="mt-4 flex items-center justify-between">
              <button className="flex items-center text-pink-200 hover:text-white text-sm transition-colors">
                <ThumbsUp className="w-4 h-4 mr-1" />
                J'aime
              </button>
              <button className="flex items-center text-pink-200 hover:text-white text-sm transition-colors">
                <Share2 className="w-4 h-4 mr-1" />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeTab;

