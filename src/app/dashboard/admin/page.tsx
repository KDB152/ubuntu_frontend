'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  FileText,
  TrendingUp,
  Activity,
  Clock,
  Award,
  Shield,
  Database,
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  Download,
  Upload,
  Star,
  Heart,
  Target,
  PieChart,
  LineChart,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
  Save,
  Edit,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Import du composant AdminDashboard complet
import AdminDashboard from './AdminDashboard';
import { useRealStats } from '@/hooks/useRealStats';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'admin';
  lastActivity: string;
  isActive: boolean;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completions: number;
  averageScore: number;
  createdAt: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalQuizzes: number;
  completedQuizzes: number;
  unreadMessages: number;
  averageScore: number;
  userGrowth: number;
  engagementRate: number;
}

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const { stats: realStats, refreshStats } = useRealStats();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    unreadMessages: 0,
    averageScore: 0,
    userGrowth: 0,
    engagementRate: 0
  });

  // Chargement des données avec timeout de sécurité
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Afficher le bouton de rafraîchissement après 5 secondes
      const refreshButtonTimeout = setTimeout(() => {
        setShowRefreshButton(true);
      }, 5000);

      // Timeout de sécurité : forcer l'arrêt du chargement après 10 secondes
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ Timeout atteint - Affichage du dashboard avec données partielles');
        setStats({
          totalUsers: realStats.totalUsers || 0,
          activeUsers: realStats.totalUsers || 0,
          totalQuizzes: realStats.totalQuizzes || 0,
          completedQuizzes: realStats.completedQuizzes || 0,
          unreadMessages: realStats.userUnreadMessages || 0,
          averageScore: realStats.averageScore || 0,
          userGrowth: 0,
          engagementRate: 0
        });
        setIsLoading(false);
      }, 10000); // 10 secondes maximum

      try {
        // Attendre que les statistiques soient chargées ou timeout
        const startTime = Date.now();
        
        // Attendre un maximum de 8 secondes pour les stats
        while (realStats.loading && (Date.now() - startTime) < 8000) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Données réelles
        setStats({
          totalUsers: realStats.totalUsers || 0,
          activeUsers: realStats.totalUsers || 0,
          totalQuizzes: realStats.totalQuizzes || 0,
          completedQuizzes: realStats.completedQuizzes || 0,
          unreadMessages: realStats.userUnreadMessages || 0,
          averageScore: realStats.averageScore || 0,
          userGrowth: 0,
          engagementRate: 0
        });
        
        console.log('✅ Dashboard chargé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        // En cas d'erreur, afficher quand même le dashboard avec des valeurs par défaut
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalQuizzes: 0,
          completedQuizzes: 0,
          unreadMessages: 0,
          averageScore: 0,
          userGrowth: 0,
          engagementRate: 0
        });
      } finally {
        clearTimeout(refreshButtonTimeout);
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [realStats.loading]);

  // Fonction pour forcer le rafraîchissement
  const handleForceRefresh = () => {
    setIsLoading(true);
    setShowRefreshButton(false);
    refreshStats();
    window.location.reload();
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 mx-auto">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Chargement du tableau de bord</h2>
          <p className="text-blue-200">Initialisation de l'interface d'administration...</p>
          
          {/* Barre de progression animée */}
          <div className="w-64 h-2 bg-white/10 rounded-full mt-3 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
          </div>

          {/* Bouton de rafraîchissement après 5 secondes */}
          {showRefreshButton && (
            <div className="mt-6">
              <p className="text-orange-300 text-sm mb-3">Le chargement prend plus de temps que prévu...</p>
              <button
                onClick={handleForceRefresh}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Interface d'administration complète
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Message de bienvenue pour la première visite */}
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/20 backdrop-blur-xl flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Interface d'administration Chrono-Carto</h1>
                <p className="text-blue-200 text-sm">Toutes les fonctionnalités sont maintenant disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Composant AdminDashboard complet */}
      <div className="flex-1 overflow-y-auto">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminPage;

