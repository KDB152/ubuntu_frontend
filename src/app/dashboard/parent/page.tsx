'use client';

import React, { useState, useEffect } from 'react';
import { useParentDashboard } from '@/hooks/useDashboard';
import {
  Home,
  TrendingUp,
  FileText,
  MessageSquare,
  Calendar,
  ClipboardList,
  Users,
  CreditCard,
  Bell,
  Settings,
  Search,
  RefreshCw,
  Plus,
  ChevronLeft,
  Menu,
  User,
  ChevronDown,
  LogOut,
  HelpCircle
} from 'lucide-react';

// Import des composants d'onglets
import DashboardOverviewTab from './DashboardOverviewTab';
import ChildrenProgressTab from './ChildrenProgressTab';
import QuizResultsTab from './QuizResultsTab';
import MessagesTab from './MessagesTab';
import CalendarTab from './CalendarTab';
import ReportsTab from './ReportsTab';
import MeetingsTab from './MeetingsTab';
import PaymentsTab from './PaymentsTab';
import NotificationsTab from './NotificationsTab';
import SettingsTab from './SettingsTab';

interface Child {
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

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  children: Child[];
  notifications: {
    unread: number;
    urgent: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType<any>;
  badge?: number;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [childSelectorOpen, setChildSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Use the parent dashboard hook
  const {
    children,
    selectedChild,
    messages,
    conversations,
    notifications,
    loading,
    error,
    setSelectedChild,
    loadChildren,
    loadConversations,
    loadMessages,
    loadNotifications,
    sendMessage,
    createConversation,
    markNotificationAsRead,
    logout,
    clearError,
  } = useParentDashboard();

  // Mock parent data - in real app this would come from API
  const [parent, setParent] = useState<Parent | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockParent: Parent = {
        id: 'parent-1',
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@email.com',
        phone: '+33 6 12 34 56 78',
        avatar: '/avatars/parent-marie.jpg',
        children: [
          {
            id: 'child-1',
            firstName: 'Lucas',
            lastName: 'Dubois',
            avatar: '/avatars/lucas.jpg',
            class: '5ème A',
            level: 'Collège',
            school: 'Collège Jean Moulin',
            teacher: 'Mme Martin',
            stats: {
              averageScore: 87,
              totalQuizzes: 24,
              completedQuizzes: 22,
              currentStreak: 5,
              totalXP: 2450,
              badges: 8,
              rank: 3
            },
            recentActivity: {
              lastQuiz: 'La Révolution française',
              lastScore: 92,
              lastActive: '2024-12-20T16:30:00'
            }
          },
          {
            id: 'child-2',
            firstName: 'Emma',
            lastName: 'Dubois',
            avatar: '/avatars/emma.jpg',
            class: '3ème B',
            level: 'Collège',
            school: 'Collège Jean Moulin',
            teacher: 'M. Leroy',
            stats: {
              averageScore: 94,
              totalQuizzes: 31,
              completedQuizzes: 29,
              currentStreak: 12,
              totalXP: 3890,
              badges: 15,
              rank: 1
            },
            recentActivity: {
              lastQuiz: 'Les climats européens',
              lastScore: 98,
              lastActive: '2024-12-20T18:45:00'
            }
          }
        ],
        notifications: {
          unread: 7,
          urgent: 2
        },
        preferences: {
          theme: 'dark',
          language: 'fr',
          notifications: {
            email: true,
            sms: true,
            push: true
          }
        }
      };

      setParent(mockParent);
      setSelectedChild(mockParent.children[0].id);
      setIsLoading(false);

      // Load dashboard data
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      loadChildren(userDetails.id);
      loadConversations(userDetails.id);
      loadNotifications(userDetails.id);
    }, 1000);
  }, [setSelectedChild, loadChildren, loadConversations, loadNotifications]);

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      component: DashboardOverviewTab
    },
    {
      id: 'progress',
      label: 'Progrès des enfants',
      icon: TrendingUp,
      component: ChildrenProgressTab
    },
    {
      id: 'results',
      label: 'Résultats des quiz',
      icon: FileText,
      component: QuizResultsTab
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      component: MessagesTab,
      badge: parent?.notifications.unread || 0
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
      component: CalendarTab
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: ClipboardList,
      component: ReportsTab
    },
    {
      id: 'meetings',
      label: 'Rendez-vous',
      icon: Users,
      component: MeetingsTab
    },
    {
      id: 'payments',
      label: 'Paiements',
      icon: CreditCard,
      component: PaymentsTab
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      component: NotificationsTab,
      badge: parent?.notifications.urgent || 0
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      component: SettingsTab
    }
  ];

  const currentMenuItem = menuItems.find(item => item.id === activeTab);
  const CurrentComponent = currentMenuItem?.component || DashboardOverviewTab;

  const selectedChildData = parent?.children.find(child => child.id === selectedChild);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = parent?.firstName || 'Parent';
    
    if (hour < 12) return `Bonjour ${firstName}`;
    if (hour < 17) return `Bon après-midi ${firstName}`;
    return `Bonsoir ${firstName}`;
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  const handleRefresh = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    loadChildren(userDetails.id);
    loadConversations(userDetails.id);
    loadNotifications(userDetails.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Chargement du tableau de bord</h2>
          <p className="text-blue-200">Préparation de l'espace parent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-80' : 'w-20'
      } bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col`}>
        {/* Header de la sidebar */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-white text-xl font-bold">Espace Parent</h1>
                <p className="text-blue-200 text-sm">Chrono-Carto</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sélecteur d'enfant */}
        {sidebarOpen && parent && parent.children.length > 1 && (
          <div className="p-4 border-b border-white/20">
            <div className="relative">
              <button
                onClick={() => setChildSelectorOpen(!childSelectorOpen)}
                className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                <div className="flex items-center space-x-3">
                  {selectedChildData?.avatar ? (
                    <img
                      src={selectedChildData.avatar}
                      alt={selectedChildData.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-semibold">{selectedChildData?.firstName}</div>
                    <div className="text-xs text-blue-200">{selectedChildData?.class}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${childSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {childSelectorOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-white/20 shadow-xl z-50">
                  {parent.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setSelectedChild(child.id);
                        setChildSelectorOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 text-left hover:bg-white/10 transition-all first:rounded-t-xl last:rounded-b-xl ${
                        selectedChild === child.id ? 'bg-blue-500/20 text-blue-300' : 'text-white'
                      }`}
                    >
                      {child.avatar ? (
                        <img
                          src={child.avatar}
                          alt={child.firstName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{child.firstName} {child.lastName}</div>
                        <div className="text-xs text-blue-200">{child.class} - {child.school}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu de navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {sidebarOpen && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.label}</div>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profil utilisateur */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/20">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-sm">{parent?.firstName} {parent?.lastName}</div>
                  <div className="text-blue-300 text-xs">Parent</div>
                </div>
              </button>

              {/* Menu utilisateur */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl border border-white/20 shadow-xl">
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-white/10 rounded-lg transition-all">
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-white/10 rounded-lg transition-all">
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-white/10 rounded-lg transition-all">
                      <HelpCircle className="w-4 h-4" />
                      <span>Aide</span>
                    </button>
                    <hr className="my-2 border-white/20" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-80' : 'ml-20'
      } flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">
                {getGreeting()}
              </h1>
              <p className="text-blue-200">
                {currentMenuItem?.label} 
                {selectedChildData && ` - ${selectedChildData.firstName}`}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 w-64 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Notifications */}
              <button
                onClick={() => setActiveTab('notifications')}
                className="relative p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                <Bell className="w-5 h-5" />
                {parent && parent.notifications.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {parent.notifications.unread > 9 ? '9+' : parent.notifications.unread}
                    </span>
                  </div>
                )}
              </button>

              {/* Actions rapides */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleRefresh}
                  className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                  title="Actualiser"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de l'onglet */}
        <div className="flex-1 overflow-y-auto p-6">
          <CurrentComponent 
            selectedChild={selectedChildData}
            parent={parent}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

