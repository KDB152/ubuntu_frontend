'use client';

import React, { useState, useEffect } from 'react';
import { getGenericUserName } from '@/lib/userUtils';
import { useRealStats } from '@/hooks/useRealStats';
import { useRendezVous } from '@/hooks/useRendezVous';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  Download,
  Upload,
  Star,
  Heart,
  Zap,
  Target,
  PieChart,
  LineChart,
  BarChart,
  RefreshCw,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Database,
  Server,
  Wifi,
  Shield,
  Lock,
  Key,
  UserCheck,
  UserX,
  UserPlus
} from 'lucide-react';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  quizzes: {
    total: number;
    completed: number;
    averageScore: number;
    growth: number;
  };
  messages: {
    total: number;
    unread: number;
    replied: number;
    growth: number;
  };
  engagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    averageSession: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'quiz_completed' | 'message_sent' | 'login' | 'achievement';
  user: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
}

const DashboardOverviewTab = () => {
  const router = useRouter();
  const { stats: realStats } = useRealStats();
  const { rendezVous, stats: rendezVousStats, loading: rendezVousLoading, getPendingRendezVous, isUrgent } = useRendezVous();
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: realStats.totalUsers, active: realStats.totalUsers, new: 0, growth: 0 },
    quizzes: { total: realStats.totalQuizzes, completed: realStats.completedQuizzes, averageScore: realStats.averageScore, growth: 0 },
    messages: { total: realStats.totalMessages, unread: realStats.userUnreadMessages, replied: realStats.totalMessages - realStats.userUnreadMessages, growth: 0 },
    engagement: { dailyActive: 0, weeklyActive: 0, monthlyActive: 0, averageSession: 0 }
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 99.8,
    responseTime: 145,
    memoryUsage: 68,
    diskUsage: 42,
    activeConnections: 156
  });

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulation des données d'activité récente
    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'user_registration',
        user: 'Utilisateur',
        description: 'Nouvelle inscription d\'étudiant',
        timestamp: '2025-12-20T10:30:00'
      },
      {
        id: '2',
        type: 'quiz_completed',
        user: getGenericUserName(1),
        description: 'Quiz "La Révolution française" terminé avec 85%',
        timestamp: '2025-12-20T09:45:00'
      },
      {
        id: '3',
        type: 'message_sent',
        user: getGenericUserName(2),
        description: 'Nouveau message reçu',
        timestamp: '2025-12-20T09:15:00'
      },
      {
        id: '4',
        type: 'achievement',
        user: getGenericUserName(3),
        description: 'Badge "Expert en Histoire" obtenu',
        timestamp: '2025-12-20T08:30:00'
      },
      {
        id: '5',
        type: 'login',
        user: getGenericUserName(4),
        description: 'Connexion depuis mobile',
        timestamp: '2025-12-20T08:00:00'
      }
    ];

    setRecentActivity(mockActivity);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulation de mise à jour des données
      setStats(prev => ({
        ...prev,
        users: {
          ...prev.users,
          active: prev.users.active + Math.floor(Math.random() * 10) - 5
        }
      }));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return UserPlus;
      case 'quiz_completed': return BookOpen;
      case 'message_sent': return MessageSquare;
      case 'login': return UserCheck;
      case 'achievement': return Award;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration': return 'text-green-400 bg-green-500/20';
      case 'quiz_completed': return 'text-blue-400 bg-blue-500/20';
      case 'message_sent': return 'text-purple-400 bg-purple-500/20';
      case 'login': return 'text-indigo-400 bg-indigo-500/20';
      case 'achievement': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return ArrowUp;
    if (growth < 0) return ArrowDown;
    return Minus;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-400';
    if (growth < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'healthy': return { color: 'text-green-400 bg-green-500/20', icon: CheckCircle };
      case 'warning': return { color: 'text-yellow-400 bg-yellow-500/20', icon: AlertCircle };
      case 'critical': return { color: 'text-red-400 bg-red-500/20', icon: XCircle };
      default: return { color: 'text-gray-400 bg-gray-500/20', icon: AlertCircle };
    }
  };

  // Fonction pour formater le timestamp relatif
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `Il y a ${Math.floor(diffInMinutes)} min`;
    } else if (diffInMinutes < 1440) {
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
    }
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const healthStatus = getHealthStatus(systemHealth.status);
  const HealthIcon = healthStatus.icon;

  // Fonctions pour les actions rapides
  const handleAddUser = () => {
    router.push('/dashboard/admin?tab=users&action=create');
  };

  const handleCreateQuiz = () => {
    router.push('/dashboard/admin?tab=quizzes&action=create');
  };

  const handleSendMessage = () => {
    router.push('/dashboard/admin?tab=messages&action=compose');
  };

  const handleSettings = () => {
    router.push('/dashboard/admin?tab=settings');
  };

  const handleMeetings = () => {
    router.push('/dashboard/admin?tab=rendez-vous');
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec actions */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-300 mr-4" />
              Tableau de bord
            </h1>
            <p className="text-blue-200 mt-2">Vue d'ensemble de votre plateforme Chrono-Carto</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Utilisateurs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              {React.createElement(getGrowthIcon(stats.users.growth), {
                className: `w-4 h-4 ${getGrowthColor(stats.users.growth)}`
              })}
              <span className={`text-sm font-semibold ${getGrowthColor(stats.users.growth)}`}>
                {Math.abs(stats.users.growth)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.users.total.toLocaleString()}</h3>
          <p className="text-blue-200 text-sm mb-3">Utilisateurs totaux</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Actifs</span>
              <span className="text-white font-semibold">{stats.users.active}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Nouveaux</span>
              <span className="text-white font-semibold">{stats.users.new}</span>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              {React.createElement(getGrowthIcon(stats.quizzes.growth), {
                className: `w-4 h-4 ${getGrowthColor(stats.quizzes.growth)}`
              })}
              <span className={`text-sm font-semibold ${getGrowthColor(stats.quizzes.growth)}`}>
                {Math.abs(stats.quizzes.growth)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.quizzes.total}</h3>
          <p className="text-blue-200 text-sm mb-3">Quiz créés</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Complétés</span>
              <span className="text-white font-semibold">{stats.quizzes.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Score moyen</span>
              <span className="text-white font-semibold">{stats.quizzes.averageScore}%</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              {React.createElement(getGrowthIcon(stats.messages.growth), {
                className: `w-4 h-4 ${getGrowthColor(stats.messages.growth)}`
              })}
              <span className={`text-sm font-semibold ${getGrowthColor(stats.messages.growth)}`}>
                {Math.abs(stats.messages.growth)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.messages.total}</h3>
          <p className="text-blue-200 text-sm mb-3">Messages totaux</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Non lus</span>
              <span className="text-white font-semibold">{stats.messages.unread}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Répondus</span>
              <span className="text-white font-semibold">{stats.messages.replied}</span>
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">+15%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.engagement.dailyActive}</h3>
          <p className="text-blue-200 text-sm mb-3">Actifs aujourd'hui</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Cette semaine</span>
              <span className="text-white font-semibold">{stats.engagement.weeklyActive}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Session moy.</span>
              <span className="text-white font-semibold">{stats.engagement.averageSession}min</span>
            </div>
          </div>
        </div>
      </div>
          

      {/* Actions rapides */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 text-blue-300 mr-2" />
          Actions rapides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button 
            onClick={handleAddUser}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Ajouter un utilisateur</div>
              <div className="text-blue-300 text-sm">Créer un nouveau compte</div>
            </div>
          </button>
          
          <button 
            onClick={handleCreateQuiz}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Créer un quiz</div>
              <div className="text-blue-300 text-sm">Nouveau questionnaire</div>
            </div>
          </button>
          
          <button 
            onClick={handleSendMessage}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Envoyer un message</div>
              <div className="text-blue-300 text-sm">Communication globale</div>
            </div>
          </button>
          
          <button 
            onClick={handleMeetings}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Gérer les rendez-vous</div>
              <div className="text-blue-300 text-sm">
                {rendezVousLoading ? 'Chargement...' : `${rendezVousStats.pending} demandes en attente`}
              </div>
            </div>
          </button>
          
          <button 
            onClick={handleSettings}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Paramètres</div>
              <div className="text-blue-300 text-sm">Configuration système</div>
            </div>
          </button>
        </div>
      </div>

      {/* Demandes de rendez-vous en attente */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-5 h-5 text-blue-300 mr-2" />
            Demandes de rendez-vous
          </h2>
          <button 
            onClick={handleMeetings}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            <span>Voir tout</span>
            <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </div>
        
        {rendezVousLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-blue-200 text-sm">Chargement des rendez-vous...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {getPendingRendezVous(3).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-blue-300 mx-auto mb-3 opacity-50" />
                <h3 className="text-white text-lg font-semibold mb-2">Aucune demande en attente</h3>
                <p className="text-blue-200">Toutes les demandes ont été traitées.</p>
              </div>
            ) : (
              getPendingRendezVous(3).map((rdv) => {
                const urgent = isUrgent(rdv);
                const timeAgo = formatTimestamp(rdv.createdAt);
                const shortReason = rdv.parentReason.length > 50 
                  ? rdv.parentReason.substring(0, 50) + '...' 
                  : rdv.parentReason;

                return (
                  <div
                    key={rdv.id}
                    className={`border rounded-xl p-4 ${
                      urgent 
                        ? 'bg-red-500/10 border-red-500/20' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {urgent ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm font-semibold">URGENT</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm font-semibold">EN ATTENTE</span>
                            </>
                          )}
                          <span className="text-blue-300 text-xs">{timeAgo}</span>
                        </div>
                        <h3 className="text-white font-semibold mb-1">
                          {rdv.parentName} - {rdv.childName} ({rdv.childClass})
                        </h3>
                        <p className="text-blue-200 text-sm mb-2">{shortReason}</p>
                        <div className="flex items-center space-x-4 text-xs text-blue-300">
                          <span>{formatDateTime(rdv.timing)}</span>
                          <span>•</span>
                          <span>Rendez-vous demandé</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleMeetings}
                        className={`px-3 py-1 rounded-lg transition-all text-sm ${
                          urgent
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                      >
                        Traiter
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {rendezVousStats.pending > 0 && (
              <div className="text-center py-4">
                <button 
                  onClick={handleMeetings}
                  className="text-blue-300 hover:text-white transition-colors text-sm"
                >
                  Voir toutes les demandes ({rendezVousStats.pending} en attente)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewTab;

