'use client';

import React, { useState, useEffect } from 'react';
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
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 1247, active: 892, new: 23, growth: 12.5 },
    quizzes: { total: 156, completed: 2341, averageScore: 78.5, growth: 8.3 },
    messages: { total: 489, unread: 12, replied: 445, growth: -2.1 },
    engagement: { dailyActive: 234, weeklyActive: 567, monthlyActive: 892, averageSession: 24.5 }
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
        user: 'Marie Dubois',
        description: 'Nouvelle inscription d\'étudiant',
        timestamp: '2024-12-20T10:30:00'
      },
      {
        id: '2',
        type: 'quiz_completed',
        user: 'Pierre Martin',
        description: 'Quiz "La Révolution française" terminé avec 85%',
        timestamp: '2024-12-20T09:45:00'
      },
      {
        id: '3',
        type: 'message_sent',
        user: 'Sophie Laurent',
        description: 'Nouveau message reçu',
        timestamp: '2024-12-20T09:15:00'
      },
      {
        id: '4',
        type: 'achievement',
        user: 'Jean Dupont',
        description: 'Badge "Expert en Histoire" obtenu',
        timestamp: '2024-12-20T08:30:00'
      },
      {
        id: '5',
        type: 'login',
        user: 'Emma Wilson',
        description: 'Connexion depuis mobile',
        timestamp: '2024-12-20T08:00:00'
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `Il y a ${Math.floor(diffInMinutes)} min`;
    } else if (diffInMinutes < 1440) {
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
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

  const healthStatus = getHealthStatus(systemHealth.status);
  const HealthIcon = healthStatus.icon;

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

      {/* Graphiques et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique d'activité */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <LineChart className="w-5 h-5 text-blue-300 mr-2" />
              Activité des utilisateurs
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <BarChart className="w-4 h-4" />
              </button>
              <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <PieChart className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Simulation d'un graphique */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 82, 75, 88, 92, 85, 79, 86, 91, 88, 94, 89, 83].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg flex-1 transition-all hover:from-blue-500 hover:to-blue-300"
                style={{ height: `${height}%` }}
                title={`Jour ${index + 1}: ${height}%`}
              />
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-blue-300 mt-4">
            <span>Il y a 14j</span>
            <span>Il y a 7j</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="w-5 h-5 text-blue-300 mr-2" />
              Activité récente
            </h2>
            <button className="text-blue-300 hover:text-white text-sm transition-all">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <ActivityIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{activity.user}</p>
                    <p className="text-blue-300 text-xs">{activity.description}</p>
                    <p className="text-blue-400 text-xs">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* État du système */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Server className="w-5 h-5 text-blue-300 mr-2" />
            État du système
          </h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${healthStatus.color}`}>
            <HealthIcon className="w-4 h-4" />
            <span className="text-sm font-semibold capitalize">{systemHealth.status}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temps de fonctionnement */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Temps de fonctionnement</span>
              <Clock className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-white">{systemHealth.uptime}%</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${systemHealth.uptime}%` }}
              />
            </div>
          </div>

          {/* Temps de réponse */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Temps de réponse</span>
              <Zap className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-white">{systemHealth.responseTime}ms</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (500 - systemHealth.responseTime) / 5)}%` }}
              />
            </div>
          </div>

          {/* Utilisation mémoire */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Mémoire utilisée</span>
              <Database className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-white">{systemHealth.memoryUsage}%</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  systemHealth.memoryUsage > 80 ? 'bg-red-500' : 
                  systemHealth.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${systemHealth.memoryUsage}%` }}
              />
            </div>
          </div>

          {/* Utilisation disque */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Espace disque</span>
              <Archive className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-white">{systemHealth.diskUsage}%</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  systemHealth.diskUsage > 80 ? 'bg-red-500' : 
                  systemHealth.diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${systemHealth.diskUsage}%` }}
              />
            </div>
          </div>

          {/* Connexions actives */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Connexions actives</span>
              <Wifi className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-white">{systemHealth.activeConnections}</div>
            <div className="text-xs text-blue-300 mt-1">utilisateurs connectés</div>
          </div>

          {/* Sécurité */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Sécurité</span>
              <Shield className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-green-400">Sécurisé</div>
            <div className="text-xs text-blue-300 mt-1">SSL actif, 2FA activé</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 text-blue-300 mr-2" />
          Actions rapides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Ajouter un utilisateur</div>
              <div className="text-blue-300 text-sm">Créer un nouveau compte</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Créer un quiz</div>
              <div className="text-blue-300 text-sm">Nouveau questionnaire</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">Envoyer un message</div>
              <div className="text-blue-300 text-sm">Communication globale</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left">
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
    </div>
  );
};

export default DashboardOverviewTab;

