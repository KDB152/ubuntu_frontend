'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Calendar,
  Target,
  Globe,
  MapPin,
  Scroll,
  Video,
  FileText,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  BarChart3,
  User,
  Star,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Mail,
  Phone,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Activity,
  Heart,
  Shield,
  Zap,
  Lightbulb,
  BookmarkCheck,
  LogOut,
  Home,
  Trophy,
  Timer,
  Brain,
  Flame,
  Medal,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

const ParentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChild, setSelectedChild] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(2);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Données simulées pour le parent
  const parentData = {
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '06 12 34 56 78',
    children: [
      {
        id: 1,
        name: 'Paul Martin',
        class: 'Terminale S',
        age: 17,
        avatar: 'PM',
        progress: 85,
        averageScore: 15.2,
        rank: 8,
        totalStudents: 32,
        lastActivity: '2025-01-16',
        currentStreak: 8,
        studyTime: 642, // minutes cette semaine
        strengths: ['Histoire', 'Géographie'],
        weaknesses: ['EMC'],
        recentScores: [
          { subject: 'Histoire', score: 17, date: '2025-01-15', type: 'Quiz' },
          { subject: 'Géographie', score: 16, date: '2025-01-14', type: 'Devoir' },
          { subject: 'EMC', score: 12, date: '2025-01-13', type: 'Quiz' },
          { subject: 'Histoire', score: 18, date: '2025-01-12', type: 'Contrôle' }
        ],
        upcomingEvents: [
          { type: 'quiz', subject: 'Histoire', title: 'Quiz Révolution française', date: '2025-01-18', isImportant: true },
          { type: 'exam', subject: 'Géographie', title: 'Contrôle climats européens', date: '2025-01-20', isImportant: false }
        ],
        weeklyActivity: [
          { day: 'Lun', hours: 2.5 },
          { day: 'Mar', hours: 1.8 },
          { day: 'Mer', hours: 3.2 },
          { day: 'Jeu', hours: 2.1 },
          { day: 'Ven', hours: 2.8 },
          { day: 'Sam', hours: 1.5 },
          { day: 'Dim', hours: 0.8 }
        ]
      },
      {
        id: 2,
        name: 'Julie Martin',
        class: 'Première ES',
        age: 16,
        avatar: 'JM',
        progress: 72,
        averageScore: 13.8,
        rank: 15,
        totalStudents: 28,
        lastActivity: '2025-01-16',
        currentStreak: 5,
        studyTime: 456, // minutes cette semaine
        strengths: ['EMC', 'Histoire'],
        weaknesses: ['Géographie'],
        recentScores: [
          { subject: 'EMC', score: 16, date: '2025-01-15', type: 'Exposé' },
          { subject: 'Histoire', score: 14, date: '2025-01-14', type: 'Quiz' },
          { subject: 'Géographie', score: 11, date: '2025-01-13', type: 'Devoir' },
          { subject: 'EMC', score: 15, date: '2025-01-12', type: 'Quiz' }
        ],
        upcomingEvents: [
          { type: 'presentation', subject: 'EMC', title: 'Exposé démocratie', date: '2025-01-19', isImportant: false },
          { type: 'quiz', subject: 'Histoire', title: 'Quiz Première Guerre', date: '2025-01-21', isImportant: true }
        ],
        weeklyActivity: [
          { day: 'Lun', hours: 1.8 },
          { day: 'Mar', hours: 2.2 },
          { day: 'Mer', hours: 2.5 },
          { day: 'Jeu', hours: 1.9 },
          { day: 'Ven', hours: 2.1 },
          { day: 'Sam', hours: 1.2 },
          { day: 'Dim', hours: 0.5 }
        ]
      }
    ]
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, color: 'text-blue-500' },
    { id: 'children', label: 'Mes enfants', icon: Users, color: 'text-emerald-500' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-indigo-500' },
    { id: 'calendar', label: 'Calendrier', icon: Calendar, color: 'text-purple-500' },
    { id: 'reports', label: 'Rapports', icon: FileText, color: 'text-orange-500' },
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

  const currentChild = parentData.children[selectedChild];

  const getScoreColor = (score) => {
    if (score >= 16) return 'text-emerald-500';
    if (score >= 14) return 'text-blue-500';
    if (score >= 12) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 16) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 14) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 12) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'quiz': return Award;
      case 'exam': return FileText;
      case 'presentation': return Users;
      default: return Calendar;
    }
  };

  const getInitials = (name) => {
    const nameParts = name.split(' ');
    return `${nameParts[0].charAt(0)}${nameParts[1]?.charAt(0) || ''}`.toUpperCase();
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

  const maxHours = Math.max(...currentChild.weeklyActivity.map(d => d.hours));

  const logout = () => {
    console.log('Déconnexion...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar moderne avec thème bleu */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-800/95 to-blue-900/95 backdrop-blur-xl shadow-2xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header du sidebar */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-8 w-10 h-10 bg-white rounded-full animate-bounce"></div>
          </div>
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl">Chrono-Carto</span>
              <p className="text-blue-100 text-sm font-medium">Espace Parent</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profil parent moderne */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-800/50 to-blue-800/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/20">
              <span className="text-white font-bold text-lg">
                {getInitials(parentData.name)}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-lg">{parentData.name}</p>
              <p className="text-sm text-blue-200 font-medium">Parent</p>
              <p className="text-xs text-blue-300">{parentData.children.length} enfant{parentData.children.length > 1 ? 's' : ''} suivi{parentData.children.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          
          {/* Sélecteur d'enfant moderne */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Enfant sélectionné</span>
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </div>
            <select 
              value={selectedChild}
              onChange={(e) => setSelectedChild(parseInt(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              {parentData.children.map((child, index) => (
                <option key={child.id} value={index} className="bg-slate-800 text-white">
                  {child.name} - {child.class}
                </option>
              ))}
            </select>
          </div>

          {/* Informations enfant sélectionné */}
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Progression</span>
                <span className="text-sm font-bold text-white">{currentChild.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${currentChild.progress}%` }}
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Classement</span>
                <span className="text-sm font-bold text-white">#{currentChild.rank}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Medal className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-blue-300">sur {currentChild.totalStudents} élèves</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation moderne */}
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
              {item.id === 'messages' && notifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Contact rapide moderne */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold">Contact rapide</span>
              </div>
              <button className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity mb-1">
                📧 Contacter le professeur
              </button>
              <button className="w-full text-left text-sm opacity-90 hover:opacity-100 transition-opacity">
                📞 Urgence établissement
              </button>
            </div>
          </div>
        </div>

        {/* Déconnexion */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-blue-200 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-0">
        {/* Header moderne */}
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
                  {getTimeOfDay()}, {parentData.name.split(' ')[0]} ! 👋
                </h1>
                <p className="text-blue-200 text-sm font-medium">{formatDate(currentTime)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Barre de recherche moderne */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-3 w-64 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profil rapide */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-white">{parentData.name.split(' ')[0]}</p>
                  <p className="text-sm text-blue-200">Parent</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-purple-600 rounded-xl flex items-center justify-center border-2 border-white/20">
                  <span className="text-white font-bold text-sm">
                    {getInitials(parentData.name)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Carte de l'enfant sélectionné moderne */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/20">
                      <span className="text-white font-bold text-2xl">{currentChild.avatar}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{currentChild.name}</h2>
                      <p className="text-blue-200 font-medium">{currentChild.class} • {currentChild.age} ans</p>
                      <p className="text-sm text-blue-300">Dernière activité: {currentChild.lastActivity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white mb-2">{currentChild.progress}%</div>
                    <div className="text-sm text-blue-200 font-medium">Progression générale</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Medal className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-white">#{currentChild.rank}</span>
                      <span className="text-sm text-blue-300">sur {currentChild.totalStudents}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {/* Progression */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <h3 className="font-bold text-white mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                      Progression
                    </h3>
                    <div className="w-full bg-white/20 rounded-full h-4 mb-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${currentChild.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-blue-200">Moyenne: <span className="font-bold text-white">{currentChild.averageScore}/20</span></p>
                  </div>

                  {/* Points forts */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <h3 className="font-bold text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                      Points forts
                    </h3>
                    <div className="space-y-2">
                      {currentChild.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-blue-200">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points à améliorer */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <h3 className="font-bold text-white mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-amber-400" />
                      À améliorer
                    </h3>
                    <div className="space-y-2">
                      {currentChild.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-sm text-blue-200">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Métriques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-blue-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Moyenne générale</p>
                      <p className="text-3xl font-bold text-white mt-1">{currentChild.averageScore}<span className="text-lg text-blue-200">/20</span></p>
                      <p className="text-emerald-400 text-sm font-semibold flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +0.5 ce mois
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-emerald-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Série actuelle</p>
                      <p className="text-3xl font-bold text-white mt-1">{currentChild.currentStreak}</p>
                      <p className="text-emerald-400 text-sm font-semibold flex items-center mt-1">
                        <Flame className="w-4 h-4 mr-1" />
                        jours consécutifs
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Flame className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-purple-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Temps d'étude</p>
                      <p className="text-3xl font-bold text-white mt-1">{Math.floor(currentChild.studyTime/60)}h {currentChild.studyTime%60}min</p>
                      <p className="text-blue-300 text-sm font-semibold flex items-center mt-1">
                        <Timer className="w-4 h-4 mr-1" />
                        cette semaine
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Timer className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full -mr-10 -mt-10 group-hover:bg-amber-400/30 transition-colors"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-blue-200 text-sm font-semibold">Classement</p>
                      <p className="text-3xl font-bold text-white mt-1">#{currentChild.rank}</p>
                      <p className="text-blue-300 text-sm font-semibold flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        sur {currentChild.totalStudents}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Medal className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Activité hebdomadaire et notes récentes */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Activité hebdomadaire modernisée */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Activity className="w-6 h-6 text-blue-400 mr-3" />
                      Activité cette semaine
                    </h2>
                    <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                      Détails <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="flex items-end justify-between space-x-3 h-40">
                    {currentChild.weeklyActivity.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-lg transition-all duration-500 hover:shadow-lg relative group"
                          style={{ height: `${(day.hours/maxHours)*100}%`, minHeight: '8px' }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/20">
                            {day.hours}h
                          </div>
                        </div>
                        <span className="text-xs text-blue-200 mt-3 font-medium capitalize">
                          {day.day}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-200">Total cette semaine</span>
                      <span className="text-lg font-bold text-white">
                        {currentChild.weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes récentes modernisées */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Award className="w-6 h-6 text-amber-400 mr-3" />
                      Notes récentes
                    </h2>
                    <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                      Tout voir <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentChild.recentScores.map((score, index) => {
                      const SubjectIcon = subjectIcons[score.subject] || FileText;
                      return (
                        <div key={index} className="group p-4 border border-white/20 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 bg-gradient-to-br ${subjectColors[score.subject] || 'from-slate-400 to-slate-500'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                <SubjectIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">{score.subject}</p>
                                <p className="text-xs text-blue-200 font-medium">{score.type} • {score.date}</p>
                              </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl border ${getScoreBgColor(score.score)} backdrop-blur-sm`}>
                              <span className={`font-bold text-lg ${getScoreColor(score.score)}`}>
                                {score.score}/20
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Événements à venir modernisés */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Calendar className="w-6 h-6 text-emerald-400 mr-3" />
                    Événements à venir
                  </h2>
                  <button className="text-blue-300 hover:text-white text-sm font-semibold flex items-center transition-colors">
                    Planning complet <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentChild.upcomingEvents.map((event, index) => {
                    const IconComponent = getEventIcon(event.type);
                    const SubjectIcon = subjectIcons[event.subject] || FileText;
                    return (
                      <div key={index} className="group p-4 border border-white/20 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm relative">
                        {event.isImportant && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${subjectColors[event.subject]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                            <SubjectIcon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">{event.title}</h3>
                            <p className="text-xs text-blue-200 font-medium">{event.subject}</p>
                            <p className="text-xs text-blue-300">{event.date}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                {event.type === 'quiz' ? 'Quiz' : event.type === 'exam' ? 'Contrôle' : 'Exposé'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides modernisées */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button className="group p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Messages</div>
                      <div className="text-sm opacity-90">Contacter professeur</div>
                    </div>
                  </div>
                </button>

                <button className="group p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Rapports</div>
                      <div className="text-sm opacity-90">Analyse détaillée</div>
                    </div>
                  </div>
                </button>

                <button className="group p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Calendrier</div>
                      <div className="text-sm opacity-90">Planning complet</div>
                    </div>
                  </div>
                </button>

                <button className="group p-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-amber-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Paramètres</div>
                      <div className="text-sm opacity-90">Configuration</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Autres sections avec design cohérent */}
          {activeTab !== 'dashboard' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Section {sidebarItems.find(item => item.id === activeTab)?.label}
              </h3>
              <p className="text-blue-200 mb-8 max-w-md mx-auto text-lg">
                Cette section sera bientôt disponible avec toutes les fonctionnalités avancées pour suivre la progression de votre enfant.
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

export default ParentDashboard;