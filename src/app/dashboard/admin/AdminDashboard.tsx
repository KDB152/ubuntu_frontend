'use client';

import React, { useState, useEffect } from 'react';
import { useAdminDashboard } from '@/hooks/useDashboard';
import { useRealStats } from '@/hooks/useRealStats';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  FileText,
  Shield,
  Bell,
  Database,
  Zap,
  Menu,
  X,
  LogOut,
  User,
  Search,
  Palette,
  Archive,
  Activity,
  Globe,
  Lock,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  Target,
  TrendingUp,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Save,
  Filter,
  Star,
  Heart,
  Flag,
  Tag,
  Bookmark,
  Share2,
  ExternalLink,
  Home,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  CreditCard
} from 'lucide-react';

// Import des composants d'onglets
import DashboardOverviewTab from './DashboardOverviewTab';
import UsersManagementTab from './UsersManagementTab';
import QuizzesManagementTab from './QuizzesManagementTab';
import MessagesManagementTab from './MessagesManagementTab';
import RendezVousManagementTab from './RendezVousManagementTab';
import AttendanceTab from './AttendanceTab';
import PaymentsManagementTab from './PaymentsManagementTab';
import SettingsManagementTab from './SettingsManagementTab';
import FileManagementTab from './FileManagementTab';
import { AnimatedPage, AnimatedCard, AnimatedButton, AnimatedList, AnimatedListItem } from '../../../components/ui/animations';

type TabType = 'overview' | 'users' | 'quizzes' | 'messages' | 'rendez-vous' | 'attendance' | 'payments' | 'files' | 'settings';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  lastLogin: string;
}

const AdminDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Use the admin dashboard hook
  const {
    stats,
    students,
    parents,
    quizzes,
    files,
    notifications,
    loading,
    error,
    loadStats,
    loadStudents,
    loadParents,
    loadQuizzes,
    loadFiles,
    loadNotifications,
    createStudent,
    updateStudent,
    deleteStudent,
    createParent,
    updateParent,
    deleteParent,
    approveUser,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    uploadFile,
    deleteFile,
    bulkDeleteFiles,
    markNotificationAsRead,
    deleteNotification,
    logout,
    clearError,
  } = useAdminDashboard();

  // Use real stats hook
  const { stats: realStats } = useRealStats();

  // Données de l'utilisateur admin connecté
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    id: '',
    name: '',
    email: '',
    role: 'admin',
    lastLogin: ''
  });

  // Charger les données de l'utilisateur admin
  useEffect(() => {
    const loadAdminData = () => {
      try {
        const userData = localStorage.getItem('userDetails');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser({
            id: String(user.id),
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Administrateur',
            email: user.email || '',
            role: user.role === 'super_admin' ? 'super_admin' : 'admin',
            lastLogin: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données admin:', error);
      }
    };

    loadAdminData();
  }, []);

  const menuItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: BarChart3,
      description: 'Statistiques et tableau de bord principal',
      badge: null
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gestion des étudiants et parents'
    },
    {
      id: 'quizzes',
      label: 'Quiz',
      icon: BookOpen,
      description: 'Création et gestion des questionnaires'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communication avec les utilisateurs'
    },
    {
      id: 'rendez-vous',
      label: 'Rendez-vous',
      icon: Calendar,
      description: 'Gestion des demandes de rendez-vous',
      badge: null
    },
    {
      id: 'attendance',
      label: 'Présence',
      icon: Users,
      description: 'Liste de présence des étudiants',
      badge: null
    },
    {
      id: 'payments',
      label: 'Paiements',
      icon: CreditCard,
      description: 'Gestion des paiements des étudiants',
      badge: null
    },
    {
      id: 'files',
      label: 'Fichiers',
      icon: FileText,
      description: 'Gestion des documents et médias',
      badge: null
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du système'
    }
  ];

  // Gérer les paramètres d'URL pour les onglets
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'users', 'quizzes', 'messages', 'rendez-vous', 'attendance', 'payments', 'files', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    router.replace(url.pathname + url.search);
    
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
      logout();
    }
  };

  const handleRefresh = () => {
    loadStats();
    loadStudents();
    loadParents();
    loadQuizzes();
    loadFiles();
    loadNotifications();
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverviewTab />;
      case 'users':
        return <UsersManagementTab 
          students={students}
          parents={parents}
          loading={loading}
          onCreateStudent={createStudent}
          onUpdateStudent={updateStudent}
          onDeleteStudent={deleteStudent}
          onCreateParent={createParent}
          onUpdateParent={updateParent}
          onDeleteParent={deleteParent}
          onApproveUser={approveUser}
          loadStudents={loadStudents}
          loadParents={loadParents}
        />;
      case 'quizzes':
        return <QuizzesManagementTab />;
      case 'messages':
        return <MessagesManagementTab />;
      case 'rendez-vous':
        return <RendezVousManagementTab onRefresh={handleRefresh} />;
      case 'attendance':
        return <AttendanceTab />;
      case 'payments':
        return <PaymentsManagementTab />;
      case 'files':
        return <FileManagementTab />;
      case 'settings':
        return <SettingsManagementTab />;
      default:
        return <DashboardOverviewTab />;
    }
  };

  const getCurrentTabInfo = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  const currentTabInfo = getCurrentTabInfo();

  return (
    <AnimatedPage className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="h-full bg-white/10 backdrop-blur-xl border-r border-white/20">
          {/* Header du sidebar */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">Chrono-Carto</h1>
                  <p className="text-blue-200 text-sm">Administration</p>
                </div>
              )}
              <AnimatedButton
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </AnimatedButton>
            </div>
          </div>

          {/* Navigation */}
          <AnimatedList className="p-4 space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <AnimatedListItem key={item.id}>
                  <AnimatedButton
                    onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      </>
                    )}
                  </AnimatedButton>
                </AnimatedListItem>
              );
            })}
          </AnimatedList>

          {/* Profil utilisateur */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold text-sm">{currentUser.name}</div>
                    <div className="text-blue-300 text-xs">{currentUser.role}</div>
                  </div>
                )}
              </button>

                              {/* Menu utilisateur */}
                {showUserMenu && !sidebarCollapsed && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 backdrop-blur-xl rounded-xl border border-slate-600 shadow-xl">
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-200 hover:text-white hover:bg-slate-700 rounded-lg transition-all text-left">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Mon profil</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-200 hover:text-white hover:bg-slate-700 rounded-lg transition-all text-left">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Préférences</span>
                      </button>
                      <hr className="my-2 border-slate-600" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-500/40 rounded-lg transition-all text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-semibold">Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-80'
      }`}>
        {/* Header principal */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <currentTabInfo.icon className="w-6 h-6 text-blue-300" />
                    <h1 className="text-2xl font-bold text-white">{currentTabInfo.label}</h1>
                  </div>
                  <p className="text-blue-200 text-sm">{currentTabInfo.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Barre de recherche */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 w-64 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>

                {/* Actions rapides */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all relative"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      )}
                    </button>

                    {/* Menu des notifications */}
                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-80 backdrop-blur-xl rounded-xl border shadow-xl z-50 bg-white/10 border-white/20">
                        <div className="p-4 border-b border-white/20">
                          <h3 className="font-semibold text-white">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-blue-200">
                              Aucune notification
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b transition-all cursor-pointer ${
                                  !notification.isRead ? 'bg-blue-500/10' : ''
                                } border-white/10 hover:bg-white/5`}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    !notification.isRead ? 'bg-blue-500' : 'bg-transparent'
                                  }`} />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm text-white">
                                      {notification.title}
                                    </h4>
                                    <p className="text-xs mt-1 text-blue-200">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs mt-1 text-blue-300">
                                      {new Date(notification.createdAt).toLocaleString('fr-FR')}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="text-red-300 hover:text-red-200"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleRefresh}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Actualiser"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  
                  {/* Bouton de déconnexion dans le header */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-all"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Déconnexion</span>
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
        <footer className="bg-white/5 backdrop-blur-xl border-t border-white/20 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-blue-300">
              © 2024 Chrono-Carto. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-4 text-blue-300">
              <span>Version 2.1.0</span>
              <span>•</span>
              <button className="hover:text-white transition-all">
                Documentation
              </button>
              <span>•</span>
              <button className="hover:text-white transition-all">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default AdminDashboard;