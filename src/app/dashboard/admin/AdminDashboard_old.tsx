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
import SettingsTab from './SettingsTab';
import FileManagementTab from './FileManagementTab';
import { AnimatedCard, AnimatedButton, AnimatedList, AnimatedListItem } from '../../../components/ui/animations';

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
      description: 'Gestion des documents et médias avec organisation en dossiers',
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
        return <SettingsTab admin={currentUser} />;
      default:
        return <DashboardOverviewTab />;
    }
  };

  const getCurrentTabInfo = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  const currentTabInfo = getCurrentTabInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="h-full bg-blue-900/80 backdrop-blur-xl border-r border-blue-700/50 flex flex-col">
          {/* Header du sidebar */}
          <div className="p-6 border-b border-blue-700/50">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-blue-100">Chrono-Carto</h1>
                  <p className="text-blue-300 text-sm">Administration</p>
                </div>
              )}
              <AnimatedButton
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-blue-200 hover:text-blue-100 hover:bg-blue-800/50 rounded-lg transition-all"
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </AnimatedButton>
            </div>
          </div>

          {/* Navigation */}
          <AnimatedList className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
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
                        : 'text-blue-200 hover:bg-blue-800/50 hover:text-blue-100'
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
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700/50">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-800/50 transition-all"
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
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-blue-800 backdrop-blur-xl rounded-xl border border-blue-700/50 shadow-xl">
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-blue-200 hover:text-blue-100 hover:bg-blue-700/50 rounded-lg transition-all text-left">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Mon profil</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-blue-200 hover:text-blue-100 hover:bg-blue-700/50 rounded-lg transition-all text-left">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Préférences</span>
                      </button>
                      <hr className="my-2 border-blue-700/50" />
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
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${
        sidebarCollapsed ? 'ml-20' : 'ml-80'
      }`}>
        {/* Header principal */}
        <header className="bg-blue-900/80 backdrop-blur-xl border-b border-blue-700/50 sticky top-0 z-30">
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
                    className="pl-10 pr-4 py-2 w-64 border border-blue-700/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-blue-800/50 backdrop-blur-md text-blue-100 placeholder-blue-300"
                  />
                </div>

                {/* Actions rapides */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-blue-200 hover:text-blue-100 hover:bg-blue-800/50 rounded-lg transition-all"
                    title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  

                    {/* Menu des notifications */}
                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-80 backdrop-blur-xl rounded-xl border shadow-xl z-50 bg-blue-800/80 border-blue-700/50">
                        <div className="p-4 border-b border-blue-700/50">
                          <h3 className="font-semibold text-blue-100">Notifications</h3>
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
                    className="p-2 text-blue-200 hover:text-blue-100 hover:bg-blue-800/50 rounded-lg transition-all"
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
        <main className="flex-1 p-6 overflow-y-auto">
          {renderTabContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white/5 backdrop-blur-xl border-t border-white/20 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-blue-300">
              © 2025 Chrono-Carto. Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>

      {/* Styles pour la scrollbar personnalisée */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
