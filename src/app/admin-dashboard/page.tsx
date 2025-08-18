'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  MessageSquare, 
  TrendingUp,
  Settings,
  Bell,
  Search,
  Plus,
  BarChart3,
  FileText,
  Video,
  Calendar,
  Target,
  Globe,
  MapPin,
  Scroll,
  Menu,
  X,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Home,
  Shield,
  Activity,
  Zap,
  UserPlus,
  BookPlus,
  TrendingDown,
  Flame,
  Brain,
  Sparkles,
  Timer,
  Medal,
  Heart,
  ArrowRight,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Données simulées pour l'admin avec plus de détails
  const adminData = {
    totalStudents: 156,
    totalParents: 98,
    totalCourses: 24,
    totalQuizzes: 45,
    activeUsers: 142,
    newRegistrations: 8,
    averageScore: 14.2,
    completionRate: 73,
    weeklyGrowth: 12,
    monthlyRevenue: 2450,
    systemUptime: 99.8,
    supportTickets: 12
  };

  const recentActivity = [
    { 
      type: 'user', 
      action: 'Nouvel étudiant inscrit', 
      user: 'Pierre Martin', 
      time: '2 min', 
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100'
    },
    { 
      type: 'content', 
      action: 'Cours publié', 
      user: 'Admin', 
      details: 'La Révolution française',
      time: '15 min', 
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    { 
      type: 'quiz', 
      action: 'Quiz terminé', 
      user: 'Marie Dubois', 
      details: 'Score: 18/20',
      time: '32 min', 
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    },
    { 
      type: 'message', 
      action: 'Nouveau message', 
      user: 'Parent Dupont', 
      time: '1h', 
      icon: MessageSquare,
      color: 'text-orange-500',
      bg: 'bg-orange-100'
    },
    { 
      type: 'suggestion', 
      action: 'Nouvelle suggestion', 
      user: 'Classe Terminale S', 
      details: 'Plus de vidéos en géographie',
      time: '2h', 
      icon: Target,
      color: 'text-pink-500',
      bg: 'bg-pink-100'
    }
  ];

  const topPerformers = [
    { name: 'Marie Dubois', class: 'Terminale S', score: 18.5, progress: 95, trend: '+2.1' },
    { name: 'Jean Moreau', class: 'Terminale ES', score: 17.8, progress: 92, trend: '+1.8' },
    { name: 'Sophie Laurent', class: 'Terminale L', score: 17.2, progress: 88, trend: '+1.5' },
    { name: 'Paul Durand', class: 'Terminale S', score: 16.9, progress: 85, trend: '+1.2' }
  ];

  const contentStats = [
    { subject: 'Histoire', courses: 8, videos: 12, quizzes: 15, engagement: 87, growth: '+5%' },
    { subject: 'Géographie', courses: 7, videos: 10, quizzes: 12, engagement: 82, growth: '+3%' },
    { subject: 'EMC', courses: 9, videos: 8, quizzes: 18, engagement: 79, growth: '+7%' }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, color: 'text-blue-500' },
    { id: 'users', label: 'Utilisateurs', icon: Users, color: 'text-emerald-500' },
    { id: 'content', label: 'Contenu', icon: BookOpen, color: 'text-purple-500' },
    { id: 'quizzes', label: 'Quiz', icon: Award, color: 'text-orange-500' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-pink-500' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-indigo-500' },
    { id: 'suggestions', label: 'Suggestions', icon: Target, color: 'text-yellow-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-red-500' },
    { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-500' }
  ];

  const subjectColors = {
    'Histoire': 'from-red-500 to-pink-600',
    'Géographie': 'from-emerald-500 to-blue-600', 
    'EMC': 'from-purple-500 to-indigo-600'
  };

  const subjectIcons = {
    'Histoire': Scroll,
    'Géographie': Globe,
    'EMC': Shield
  };

  const weeklyStats = {
    monday: 85,
    tuesday: 92,
    wednesday: 78,
    thursday: 95,
    friday: 88,
    saturday: 76,
    sunday: 82
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return (
      <div className={`w-10 h-10 ${activity.bg} rounded-xl flex items-center justify-center`}>
        <IconComponent className={`w-5 h-5 ${activity.color}`} />
      </div>
    );
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Confirmer la déconnexion</h3>
            <p className="text-blue-200 mb-6">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 bg-white/10 text-blue-200 rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Non
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar moderne avec thème cohérent */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-800/95 to-blue-900/95 backdrop-blur-xl shadow-2xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header du sidebar */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-8 w-10 h-10 bg-white rounded-full animate-bounce"></div>
          </div>
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl">Admin Panel</span>
              <p className="text-blue-100 text-sm font-medium">Chrono-Carto</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profil admin moderne */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-800/50 to-blue-800/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/20">
              <span className="text-white font-bold text-lg">AD</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-lg">Administrateur</p>
              <p className="text-sm text-blue-200 font-medium">Système</p>
              <p className="text-xs text-blue-300">Chrono-Carto</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">{adminData.systemUptime}%</span>
              </div>
              <span className="text-xs text-blue-300">uptime</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Utilisateurs actifs</span>
                <span className="text-sm font-bold text-white">{adminData.activeUsers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-300">Système opérationnel</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Croissance</span>
                <span className="text-sm font-bold text-emerald-400">+{adminData.weeklyGrowth}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${adminData.weeklyGrowth * 5}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105 border border-white/20'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
              </div>
              <span className="font-semibold">{item.label}</span>
              {(item.id === 'messages' && notifications > 0) || (item.id === 'notifications' && adminData.supportTickets > 0) ? (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.id === 'messages' ? notifications : adminData.supportTickets}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5" />
                <span className="font-bold">Actions rapides</span>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un cours</span>
                </button>
                <button className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Créer un quiz</span>
                </button>
                <button className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Nouvel utilisateur</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-blue-200 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-0">
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-blue-200 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {getTimeOfDay()}, Administrateur ! 👨‍💼
                </h1>
                <p className="text-blue-200 text-sm font-medium">{formatDate(currentTime)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                <option value="day">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-3 w-80 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                />
              </div>
              <button className="relative p-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-white">Admin</p>
                  <p className="text-sm text-blue-200">Système</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl flex items-center justify-center border-2 border-white/20">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-blue-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Total étudiants</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.totalStudents}</p>
                      <p className="text-blue-300 text-sm font-semibold flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        +{adminData.newRegistrations} nouveaux
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-emerald-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Contenu actif</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.totalCourses}</p>
                      <p className="text-blue-300 text-sm font-semibold flex items-center mt-1">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {adminData.totalQuizzes} quiz
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-purple-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Taux d'achèvement</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.completionRate}%</p>
                      <p className="text-blue-300 text-sm font-semibold flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{adminData.weeklyGrowth}%
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-amber-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Tickets de support</p>
                      <p className="text-3xl font-bold text-white mt-1">{adminData.supportTickets}</p>
                      <p className="text-blue-300 text-sm font-semibold flex items-center mt-1">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {notifications} non lus
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Activity className="w-6 h-6 text-blue-400 mr-3" />
                      Activité récente
                    </h2>
                    <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                      Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                        {getActivityIcon(activity)}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{activity.action}</p>
                          <p className="text-xs text-blue-200">{activity.user} {activity.details && `• ${activity.details}`}</p>
                        </div>
                        <span className="text-xs text-blue-300">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Medal className="w-6 h-6 text-yellow-400 mr-3" />
                      Meilleurs étudiants
                    </h2>
                    <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                      Classement complet <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{student.name}</p>
                          <p className="text-xs text-blue-200">{student.class} • {student.score}/20</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{student.progress}%</p>
                          <p className="text-xs text-emerald-400">+{student.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
                    Statistiques du contenu
                    </h2>
                    <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                      Détails <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {contentStats.map((subject, index) => {
                      const SubjectIcon = subjectIcons[subject.subject] || FileText;
                      return (
                        <div key={index} className="group">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${subjectColors[subject.subject]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                <SubjectIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <span className="font-bold text-white">{subject.subject}</span>
                                <div className="flex items-center space-x-3 text-xs text-blue-300">
                                  <span>{subject.courses} cours</span>
                                  <span>•</span>
                                  <span>{subject.videos} vidéos</span>
                                  <span>•</span>
                                  <span>{subject.quizzes} quiz</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-white">{subject.engagement}%</span>
                              <div className="flex items-center text-xs text-emerald-400 font-semibold">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {subject.growth}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-4 relative overflow-hidden">
                            <div 
                              className={`bg-gradient-to-r ${subjectColors[subject.subject]} h-4 rounded-full transition-all duration-1000 shadow-sm relative`}
                              style={{ width: `${subject.engagement}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
          )}
          {activeTab !== 'dashboard' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Section {sidebarItems.find(item => item.id === activeTab)?.label}
              </h3>
              <p className="text-blue-200 mb-8 max-w-md mx-auto text-lg">
                Cette section sera bientôt disponible avec toutes les fonctionnalités avancées pour la gestion de la plateforme.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Retour au tableau de bord
                </button>
                <button className="px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold backdrop-blur-sm">
                  En savoir plus
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;