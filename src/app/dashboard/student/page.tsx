'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  PenTool,
  BarChart3,
  TrendingUp,
  MessageSquare,
  User,
  Award,
  Calendar,
  Library,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronRight,
  Star,
  Clock,
  Target,
  Zap,
  Heart,
  BookMarked,
  GraduationCap,
  Trophy,
  Flag,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Filter,
  Download,
  Upload,
  Share2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react';

// Import des composants d'onglets
import DashboardHomeTab from './DashboardHomeTab';
import QuizListTab from './QuizListTab';
import QuizTakeTab from './QuizTakeTab';
import ResultsTab from './ResultsTab';
import ProgressTab from './ProgressTab';
import MessagesTab from './MessagesTab';
import ProfileTab from './ProfileTab';
import AchievementsTab from './AchievmentsTab';
import CalendarTab from './CalendarTab';
import ResourcesTab from './ResourcesTab';

type TabType = 'home' | 'quizzes' | 'quiz-take' | 'results' | 'progress' | 'messages' | 'profile' | 'achievements' | 'calendar' | 'resources';

interface StudentUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  grade: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  lastActivity: string;
}

interface Notification {
  id: string;
  type: 'quiz' | 'message' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);

  // Données de l'étudiant connecté
  const currentStudent: StudentUser = {
    id: 'student-1',
    firstName: 'Marie',
    lastName: 'Dubois',
    username: 'marie.dubois',
    email: 'marie.dubois@email.com',
    grade: '3ème',
    level: 12,
    xp: 2450,
    streak: 7,
    lastActivity: '2024-12-20T10:30:00'
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      description: 'Vue d\'ensemble de vos activités',
      badge: null,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'quizzes',
      label: 'Quiz',
      icon: BookOpen,
      description: 'Quiz disponibles et à faire',
      badge: '3',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'results',
      label: 'Résultats',
      icon: BarChart3,
      description: 'Vos résultats et corrections',
      badge: null,
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'progress',
      label: 'Progrès',
      icon: TrendingUp,
      description: 'Suivi de votre progression',
      badge: null,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communications avec vos professeurs',
      badge: '2',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'achievements',
      label: 'Récompenses',
      icon: Award,
      description: 'Vos badges et accomplissements',
      badge: null,
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
      description: 'Planning et échéances',
      badge: null,
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: Library,
      description: 'Documents et supports de cours',
      badge: null,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      description: 'Vos informations personnelles',
      badge: null,
      color: 'from-gray-500 to-slate-600'
    }
  ];

  useEffect(() => {
    // Simulation des notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'quiz',
        title: 'Nouveau quiz disponible',
        message: 'Le quiz "La Révolution française" est maintenant disponible',
        timestamp: '2024-12-20T09:30:00',
        isRead: false,
        priority: 'normal'
      },
      {
        id: '2',
        type: 'message',
        title: 'Message du professeur',
        message: 'Votre professeur a répondu à votre question',
        timestamp: '2024-12-20T08:45:00',
        isRead: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Nouveau badge obtenu !',
        message: 'Félicitations ! Vous avez obtenu le badge "Historien en herbe"',
        timestamp: '2024-12-19T16:20:00',
        isRead: true,
        priority: 'normal'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleTabChange = (tabId: TabType, quizId?: string) => {
    setActiveTab(tabId);
    if (tabId === 'quiz-take' && quizId) {
      setCurrentQuizId(quizId);
    }
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      window.location.href = '/login';
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const getXPProgress = () => {
    const currentLevelXP = currentStudent.level * 200;
    const nextLevelXP = (currentStudent.level + 1) * 200;
    const progress = ((currentStudent.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHomeTab onNavigateToQuiz={(quizId) => handleTabChange('quiz-take', quizId)} />;
      case 'quizzes':
        return <QuizListTab onStartQuiz={(quizId) => handleTabChange('quiz-take', quizId)} />;
      case 'quiz-take':
        return <QuizTakeTab quizId={currentQuizId} onComplete={() => handleTabChange('results')} />;
      case 'results':
        return <ResultsTab />;
      case 'progress':
        return <ProgressTab />;
      case 'messages':
        return <MessagesTab />;
      case 'profile':
        return <ProfileTab />;
      case 'achievements':
        return <AchievementsTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'resources':
        return <ResourcesTab />;
      default:
        return <DashboardHomeTab onNavigateToQuiz={(quizId) => handleTabChange('quiz-take', quizId)} />;
    }
  };

  const getCurrentTabInfo = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  const currentTabInfo = getCurrentTabInfo();
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-80'
      }`}>
        <div className={`h-full backdrop-blur-xl border-r transition-colors duration-300 ${
          darkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-gray-200'
        }`}>
          {/* Header du sidebar */}
          <div className={`p-6 border-b transition-colors duration-300 ${
            darkMode ? 'border-white/20' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className={`text-xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Chrono-Carto
                  </h1>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    Espace Étudiant
                  </p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg transition-all lg:hidden ${
                  darkMode 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Profil étudiant dans la sidebar */}
          {!sidebarCollapsed && (
            <div className={`p-4 border-b transition-colors duration-300 ${
              darkMode ? 'border-white/20' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentStudent.firstName} {currentStudent.lastName}
                  </h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    {currentStudent.grade}
                  </p>
                </div>
              </div>
              
              {/* Barre de progression XP */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Niveau {currentStudent.level}
                  </span>
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    {currentStudent.xp} XP
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full transition-colors duration-300 ${
                  darkMode ? 'bg-white/10' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${getXPProgress()}%` }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Zap className={`w-3 h-3 transition-colors duration-300 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {currentStudent.streak} jours
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className={`w-3 h-3 transition-colors duration-300 ${
                    darkMode ? 'text-orange-400' : 'text-orange-500'
                  }`} />
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                    Rang #3
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as TabType)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : darkMode
                      ? 'text-blue-200 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <IconComponent className={`w-5 h-5 ${
                    isActive ? 'text-white' : darkMode ? 'text-blue-300' : 'text-gray-500'
                  }`} />
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : darkMode
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions du bas */}
          <div className={`p-4 border-t transition-colors duration-300 ${
            darkMode ? 'border-white/20' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    darkMode 
                      ? 'text-blue-200 hover:text-white hover:bg-white/10' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-sm">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-all ${
                  darkMode 
                    ? 'text-red-300 hover:text-red-200 hover:bg-red-500/20' 
                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Contenu principal */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      }`}>
        {/* Header principal */}
        <header className={`backdrop-blur-xl border-b sticky top-0 z-30 transition-colors duration-300 ${
          darkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`p-2 rounded-lg transition-all lg:hidden ${
                    darkMode 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <currentTabInfo.icon className={`w-6 h-6 transition-colors duration-300 ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`} />
                    <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentTabInfo.label}
                    </h1>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    {currentTabInfo.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Barre de recherche */}
                <div className="relative hidden md:block">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                    darkMode ? 'text-blue-300' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className={`pl-10 pr-4 py-2 w-64 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-md ${
                      darkMode 
                        ? 'border-white/20 bg-white/10 text-white placeholder-blue-300' 
                        : 'border-gray-200 bg-white/80 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>

                {/* Actions rapides */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className={`p-2 rounded-lg transition-all ${
                      darkMode 
                        ? 'text-white/80 hover:text-white hover:bg-white/10' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`p-2 rounded-lg transition-all relative ${
                        darkMode 
                          ? 'text-white/80 hover:text-white hover:bg-white/10' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>

                    {/* Menu des notifications */}
                    {showNotifications && (
                      <div className={`absolute right-0 top-full mt-2 w-80 backdrop-blur-xl rounded-xl border shadow-xl z-50 transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-white/10 border-white/20' 
                          : 'bg-white/90 border-gray-200'
                      }`}>
                        <div className={`p-4 border-b transition-colors duration-300 ${
                          darkMode ? 'border-white/20' : 'border-gray-200'
                        }`}>
                          <h3 className={`font-semibold transition-colors duration-300 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b transition-all cursor-pointer ${
                                darkMode 
                                  ? 'border-white/10 hover:bg-white/5' 
                                  : 'border-gray-100 hover:bg-gray-50'
                              } ${!notification.isRead ? (darkMode ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  !notification.isRead ? 'bg-blue-500' : 'bg-transparent'
                                }`} />
                                <div className="flex-1">
                                  <h4 className={`font-medium text-sm transition-colors duration-300 ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className={`text-xs mt-1 transition-colors duration-300 ${
                                    darkMode ? 'text-blue-200' : 'text-gray-600'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className={`text-xs mt-1 transition-colors duration-300 ${
                                    darkMode ? 'text-blue-300' : 'text-gray-400'
                                  }`}>
                                    {new Date(notification.timestamp).toLocaleString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button className={`p-2 rounded-lg transition-all ${
                    darkMode 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu de l'onglet */}
        <main className="p-6">
          {renderTabContent()}
        </main>

        {/* Footer */}
        <footer className={`backdrop-blur-xl border-t px-6 py-4 transition-colors duration-300 ${
          darkMode 
            ? 'bg-white/5 border-white/20' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-sm">
            <div className={`transition-colors duration-300 ${
              darkMode ? 'text-blue-300' : 'text-gray-600'
            }`}>
              © 2024 Chrono-Carto. Plateforme éducative.
            </div>
            <div className={`flex items-center space-x-4 transition-colors duration-300 ${
              darkMode ? 'text-blue-300' : 'text-gray-600'
            }`}>
              <span>Version 2.1.0</span>
              <span>•</span>
              <button className={`transition-colors duration-300 ${
                darkMode ? 'hover:text-white' : 'hover:text-gray-900'
              }`}>
                Aide
              </button>
              <span>•</span>
              <button className={`transition-colors duration-300 ${
                darkMode ? 'hover:text-white' : 'hover:text-gray-900'
              }`}>
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudentDashboard;

