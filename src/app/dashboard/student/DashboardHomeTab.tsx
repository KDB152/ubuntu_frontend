'use client';

import React, { useState, useEffect } from 'react';
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
  Bell,
  ArrowRight,
  Plus,
  Eye,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Send,
  Lightbulb,
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

interface RecentActivity {
  id: string;
  type: 'quiz' | 'achievement' | 'message' | 'resource';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  icon: any;
  color: string;
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

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  priority: 'normal' | 'important' | 'urgent';
  category: 'general' | 'academic' | 'event';
}

interface DashboardHomeTabProps {
  onNavigateToQuiz: (quizId: string) => void;
}

const DashboardHomeTab: React.FC<DashboardHomeTabProps> = ({ onNavigateToQuiz }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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

    // Données simulées
    setRecentActivities([
      {
        id: '1',
        type: 'quiz',
        title: 'Quiz terminé : La Révolution française',
        description: 'Score : 18/20 - Excellent travail !',
        timestamp: '2024-12-20T10:30:00',
        score: 90,
        icon: BookOpen,
        color: 'from-green-500 to-emerald-600'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Nouveau badge obtenu !',
        description: 'Badge "Historien en herbe" débloqué',
        timestamp: '2024-12-20T09:15:00',
        icon: Award,
        color: 'from-yellow-500 to-amber-600'
      },
      {
        id: '3',
        type: 'message',
        title: 'Message du professeur',
        description: 'Félicitations pour vos progrès récents',
        timestamp: '2024-12-19T16:45:00',
        icon: MessageSquare,
        color: 'from-blue-500 to-indigo-600'
      }
    ]);

    setUpcomingTasks([
      {
        id: '1',
        title: 'Quiz : L\'Empire de Napoléon',
        subject: 'Histoire',
        dueDate: '2024-12-22T14:00:00',
        priority: 'high',
        type: 'quiz',
        completed: false
      },
      {
        id: '2',
        title: 'Devoir : Les climats européens',
        subject: 'Géographie',
        dueDate: '2024-12-23T18:00:00',
        priority: 'medium',
        type: 'assignment',
        completed: false
      },
      {
        id: '3',
        title: 'Révisions : Contrôle d\'Histoire',
        subject: 'Histoire',
        dueDate: '2024-12-25T08:00:00',
        priority: 'high',
        type: 'exam',
        completed: false
      }
    ]);

    setAnnouncements([
      {
        id: '1',
        title: 'Nouveaux quiz disponibles',
        content: 'De nouveaux quiz sur la géographie européenne sont maintenant disponibles dans votre espace.',
        author: 'Mme Martin',
        timestamp: '2024-12-20T08:00:00',
        priority: 'important',
        category: 'academic'
      },
      {
        id: '2',
        title: 'Maintenance programmée',
        content: 'Une maintenance de la plateforme aura lieu dimanche de 2h à 4h du matin.',
        author: 'Administration',
        timestamp: '2024-12-19T15:30:00',
        priority: 'normal',
        category: 'general'
      }
    ]);

    setWeeklyStats({
      quizzesCompleted: 5,
      averageScore: 85,
      timeSpent: 240, // en minutes
      streak: 7
    });

    return () => clearInterval(timer);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'start-quiz',
      title: 'Commencer un quiz',
      description: 'Démarrer un nouveau quiz disponible',
      icon: Play,
      color: 'from-green-500 to-emerald-600',
      action: () => onNavigateToQuiz('quiz-1'),
      badge: '3 disponibles'
    },
    {
      id: 'view-results',
      title: 'Voir mes résultats',
      description: 'Consulter vos derniers résultats',
      icon: BarChart3,
      color: 'from-blue-500 to-indigo-600',
      action: () => console.log('Navigate to results')
    },
    {
      id: 'check-messages',
      title: 'Messages',
      description: 'Lire vos nouveaux messages',
      icon: MessageSquare,
      color: 'from-purple-500 to-violet-600',
      action: () => console.log('Navigate to messages'),
      badge: '2 nouveaux'
    },
    {
      id: 'view-calendar',
      title: 'Planning',
      description: 'Voir votre calendrier',
      icon: Calendar,
      color: 'from-orange-500 to-red-600',
      action: () => console.log('Navigate to calendar')
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

  const getAnnouncementIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return AlertCircle;
      case 'important': return Bell;
      default: return Lightbulb;
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
                {greeting}, Marie ! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Prêt à continuer votre apprentissage aujourd'hui ?
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-300 font-semibold">{weeklyStats.streak} jours de suite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-orange-300" />
                  <span className="text-orange-300 font-semibold">Niveau 12</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-pink-300" />
                  <span className="text-pink-300 font-semibold">2450 XP</span>
                </div>
              </div>
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
          <BookOpen className="w-32 h-32" />
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

          {/* Activité récente */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-green-400" />
              Activité récente
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className={`w-10 h-10 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{activity.title}</h3>
                      <p className="text-blue-200 text-sm mt-1">{activity.description}</p>
                      <p className="text-blue-300 text-xs mt-2">
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {activity.score && (
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-lg">{activity.score}%</div>
                        <div className="text-green-300 text-xs">Score</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Tâches à venir */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-orange-400" />
              À venir
            </h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium text-sm">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-blue-200 text-xs mb-2">{task.subject}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-300 text-xs">
                      {formatTimeRemaining(task.dueDate)}
                    </span>
                    <button className="text-blue-400 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-300 hover:text-white text-sm flex items-center justify-center py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-all">
              <Plus className="w-4 h-4 mr-1" />
              Voir tout le planning
            </button>
          </div>

          {/* Annonces */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center">
              <Bell className="w-6 h-6 mr-2 text-blue-400" />
              Annonces
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement) => {
                const IconComponent = getAnnouncementIcon(announcement.priority);
                return (
                  <div key={announcement.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`w-5 h-5 mt-0.5 ${
                        announcement.priority === 'urgent' ? 'text-red-400' :
                        announcement.priority === 'important' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-blue-200 text-xs mb-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 text-xs">
                            {announcement.author}
                          </span>
                          <span className="text-blue-300 text-xs">
                            {new Date(announcement.timestamp).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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

