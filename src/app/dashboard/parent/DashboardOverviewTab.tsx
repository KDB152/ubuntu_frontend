'use client';

import React, { useState, useEffect } from 'react';
import { getChildName, getSchoolName } from '@/lib/userUtils';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Clock,
  Calendar,
  BookOpen,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Bell,
  MessageSquare,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Heart,
  Brain,
  Trophy,
  Medal,
  Crown,
  Flag,
  Sparkles,
  Flame,
  Rocket,
  Mountain,
  Compass,
  Map,
  Globe,
  History,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Share2,
  RefreshCw,
  Settings,
  HelpCircle,
  ExternalLink,
  Link,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Mail,
  Phone,
  MapPin,
  Home,
  School,
  GraduationCap,
  UserCheck,
  Users2,
  Baby,
  Child,
  User,
  UserPlus,
  UserMinus,
  UserX,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  CreditCard,
  Wallet,
  Coins,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  BanknoteIcon,
  Receipt,
  Calculator,
  PiggyBank,
  TrendingUpIcon,
  LineChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  Gauge,
  Speedometer,
  Timer,
  Stopwatch,
  Hourglass,
  AlarmClock,
  Watch,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Umbrella,
  Rainbow,
  Snowflake,
  Droplets,
  Waves,
  TreePine,
  Flower,
  Leaf,
  Seedling,
  Sprout,
  Cactus,
  PalmTree,
  Evergreen,
  Deciduous,
  Mushroom,
  Shell,
  Bug,
  Butterfly,
  Bird,
  Fish,
  Rabbit,
  Turtle,
  Snail,
  Ant,
  Bee,
  Spider,
  Worm,
  Microbe,
  Dna,
  Atom,
  Molecule,
  Magnet,
  Flashlight,
  Lightbulb,
  Candle,
  Fire,
  Fireworks,
  Confetti,
  Balloon,
  Gift,
  Party,
  Cake,
  IceCream,
  Coffee,
  Tea,
  Wine,
  Beer,
  Cocktail,
  Juice,
  Milk
} from 'lucide-react';

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
}

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  childId?: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface UpcomingEvent {
  id: string;
  title: string;
  type: 'quiz' | 'exam' | 'meeting' | 'event' | 'deadline';
  date: string;
  childId?: string;
  location?: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface DashboardOverviewTabProps {
  selectedChild?: Child;
  parent?: Parent;
  searchQuery?: string;
  onNavigateToMessages?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToMeetings?: () => void;
  onNavigateToReports?: () => void;
  onNavigateToSettings?: () => void;
}

const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  selectedChild,
  parent,
  searchQuery,
  onNavigateToMessages,
  onNavigateToCalendar,
  onNavigateToMeetings,
  onNavigateToReports,
  onNavigateToSettings
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Données simulées des alertes
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        type: 'success',
        title: 'Excellent résultat !',
        message: `${getChildName('child-1')} a obtenu 98% au quiz sur la Révolution française`,
        childId: 'child-1',
        timestamp: '2025-12-20T16:30:00',
        isRead: false,
        action: {
          label: 'Voir les détails',
          url: '/results/quiz-123'
        }
      },
      {
        id: 'alert-2',
        type: 'warning',
        title: 'Rendez-vous programmé',
        message: 'Réunion parents-professeurs le 27 décembre à 17h00',
        timestamp: '2025-12-20T14:15:00',
        isRead: false,
        action: {
          label: 'Confirmer',
          url: '/meetings/confirm-456'
        }
      },
      {
        id: 'alert-3',
        type: 'info',
        title: 'Nouveau quiz disponible',
        message: `Un nouveau quiz sur l'Empire napoléonien est disponible pour ${getChildName('child-2')}`,
        childId: 'child-2',
        timestamp: '2025-12-20T10:45:00',
        isRead: true
      },
      {
        id: 'alert-4',
        type: 'error',
        title: 'Quiz non terminé',
        message: `${getChildName('child-1')} n'a pas terminé le quiz sur les climats européens (échéance dans 2 jours)`,
        childId: 'child-1',
        timestamp: '2025-12-19T18:20:00',
        isRead: false,
        action: {
          label: `Rappeler à ${getChildName('child-1')}`,
          url: '/messages/send-reminder'
        }
      },
      {
        id: 'alert-5',
        type: 'success',
        title: 'Badge obtenu !',
        message: `${getChildName('child-2')} a débloqué le badge "Géographe Expert"`,
        childId: 'child-2',
        timestamp: '2025-12-19T15:30:00',
        isRead: true
      }
    ];

    const mockEvents: UpcomingEvent[] = [
      {
        id: 'event-1',
        title: 'Quiz - Empire napoléonien',
        type: 'quiz',
        date: '2025-12-23T10:00:00',
        childId: 'child-1',
        description: 'Quiz sur l\'Empire de Napoléon Bonaparte',
        priority: 'high'
      },
      {
        id: 'event-2',
        title: 'Réunion parents-professeurs',
        type: 'meeting',
        date: '2025-12-27T17:00:00',
        location: `${getSchoolName()} - Salle 205`,
        description: `Entretien avec les professeurs de ${getChildName('child-1')} et ${getChildName('child-2')}`,
        priority: 'urgent'
      },
      {
        id: 'event-3',
        title: 'Contrôle d\'Histoire',
        type: 'exam',
        date: '2025-12-30T09:00:00',
        childId: 'child-2',
        description: 'Évaluation sur la Révolution française',
        priority: 'high'
      },
      {
        id: 'event-4',
        title: 'Sortie pédagogique - Musée d\'Histoire',
        type: 'event',
        date: '2025-01-08T14:00:00',
        location: 'Musée d\'Histoire de la ville',
        description: 'Visite guidée sur l\'époque médiévale',
        priority: 'medium'
      },
      {
        id: 'event-5',
        title: 'Remise des bulletins',
        type: 'deadline',
        date: '2025-01-15T18:00:00',
        description: 'Distribution des bulletins du premier trimestre',
        priority: 'medium'
      }
    ];

    setAlerts(mockAlerts);
    setUpcomingEvents(mockEvents);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return X;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-green-500 to-emerald-600';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'error': return 'from-red-500 to-pink-600';
      case 'info': return 'from-blue-500 to-indigo-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Target;
      case 'exam': return Award;
      case 'meeting': return Users;
      case 'event': return Calendar;
      case 'deadline': return Clock;
      default: return Calendar;
    }
  };

  const getEventColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-pink-600';
      case 'high': return 'from-orange-500 to-red-600';
      case 'medium': return 'from-blue-500 to-indigo-600';
      case 'low': return 'from-gray-500 to-slate-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Demain à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
      return `Dans ${diffInDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
    }
  };

  const getChildName = (childId?: string) => {
    if (!childId || !parent) return '';
    const child = parent.children.find(c => c.id === childId);
    return child ? child.firstName : '';
  };

  const calculateOverallStats = () => {
    if (!parent || parent.children.length === 0) {
      return {
        averageScore: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
        totalXP: 0,
        totalBadges: 0,
        bestRank: 0
      };
    }

    const stats = parent.children.reduce((acc, child) => {
      acc.averageScore += child.stats.averageScore;
      acc.totalQuizzes += child.stats.totalQuizzes;
      acc.completedQuizzes += child.stats.completedQuizzes;
      acc.totalXP += child.stats.totalXP;
      acc.totalBadges += child.stats.badges;
      acc.bestRank = Math.min(acc.bestRank || Infinity, child.stats.rank);
      return acc;
    }, {
      averageScore: 0,
      totalQuizzes: 0,
      completedQuizzes: 0,
      totalXP: 0,
      totalBadges: 0,
      bestRank: Infinity
    });

    return {
      ...stats,
      averageScore: Math.round(stats.averageScore / parent.children.length),
      bestRank: stats.bestRank === Infinity ? 0 : stats.bestRank
    };
  };

  const overallStats = calculateOverallStats();
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const urgentEvents = upcomingEvents.filter(event => event.priority === 'urgent' || event.priority === 'high');

  return (
    <div className="space-y-6">
      {/* En-tête avec salutation */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">
              Tableau de bord familial
            </h1>
            <p className="text-blue-200">
              {parent && parent.children.length > 1 
                ? `Suivi de ${parent.children.length} enfants`
                : selectedChild 
                  ? `Suivi de ${selectedChild.firstName}`
                  : 'Vue d\'ensemble'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            
            <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold">{overallStats.averageScore}%</div>
              <div className="text-blue-300 text-sm">Score moyen</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+5% ce mois</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold">{overallStats.completedQuizzes}</div>
              <div className="text-blue-300 text-sm">Quiz terminés</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-300 text-sm">sur {overallStats.totalQuizzes} au total</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold">{overallStats.totalXP.toLocaleString()}</div>
              <div className="text-blue-300 text-sm">XP total</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">+250 XP cette semaine</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold">{overallStats.totalBadges}</div>
              <div className="text-blue-300 text-sm">Badges obtenus</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">Meilleur rang: #{overallStats.bestRank}</span>
          </div>
        </div>
      </div>

      {/* Alertes et événements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes importantes */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Alertes importantes</h2>
              <div className="flex items-center space-x-2">
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-semibold">
                  {unreadAlerts.length} non lues
                </span>
                <button
                  onClick={() => setShowAllAlerts(!showAllAlerts)}
                  className="text-blue-400 hover:text-white transition-all"
                >
                  {showAllAlerts ? 'Voir moins' : 'Voir tout'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {(showAllAlerts ? alerts : alerts.slice(0, 3)).map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              const childName = getChildName(alert.childId);
              
              return (
                <div
                  key={alert.id}
                  className={`p-4 border-b border-white/10 last:border-b-0 transition-all hover:bg-white/5 ${
                    !alert.isRead ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getAlertColor(alert.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold ${!alert.isRead ? 'text-white' : 'text-blue-200'}`}>
                          {alert.title}
                        </h3>
                        <span className="text-blue-400 text-xs ml-2 flex-shrink-0">
                          {formatRelativeTime(alert.timestamp)}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-2 ${!alert.isRead ? 'text-blue-200' : 'text-blue-300'}`}>
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {childName && (
                          <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">
                            {childName}
                          </span>
                        )}
                        
                        {alert.action && (
                          <button 
                            onClick={() => {
                              if (alert.action?.url.includes('messages')) {
                                onNavigateToMessages?.();
                              } else if (alert.action?.url.includes('meetings')) {
                                onNavigateToCalendar?.();
                              }
                            }}
                            className="text-blue-400 hover:text-white text-xs font-semibold transition-all"
                          >
                            {alert.action.label} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Événements à venir */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Événements à venir</h2>
              <div className="flex items-center space-x-2">
                <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full font-semibold">
                  {urgentEvents.length} urgents
                </span>
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="text-blue-400 hover:text-white transition-all"
                >
                  {showAllEvents ? 'Voir moins' : 'Voir tout'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {(showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 3)).map((event) => {
              const IconComponent = getEventIcon(event.type);
              const childName = getChildName(event.childId);
              
              return (
                <div
                  key={event.id}
                  className="p-4 border-b border-white/10 last:border-b-0 transition-all hover:bg-white/5"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getEventColor(event.priority)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-semibold">
                          {event.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          event.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          event.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          event.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {event.priority}
                        </span>
                      </div>
                      
                      <p className="text-blue-200 text-sm mb-2">
                        {formatDate(event.date)}
                      </p>
                      
                      {event.description && (
                        <p className="text-blue-300 text-sm mb-2">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {childName && (
                            <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">
                              {childName}
                            </span>
                          )}
                          {event.location && (
                            <span className="text-blue-400 text-xs flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </span>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (event.type === 'quiz' || event.type === 'exam') {
                              onNavigateToReports?.();
                            } else if (event.type === 'meeting') {
                              onNavigateToCalendar?.();
                            }
                          }}
                          className="text-blue-400 hover:text-white text-xs font-semibold transition-all"
                        >
                          Voir détails →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Résumé des enfants */}
      {parent && parent.children.length > 1 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold">Résumé par enfant</h2>
            <button 
              onClick={() => onNavigateToReports?.()}
              className="text-blue-400 hover:text-white transition-all"
            >
              Voir détails complets →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parent.children.map((child) => (
              <div key={child.id} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-4">
                  {child.avatar ? (
                    <img
                      src={child.avatar}
                      alt={child.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{child.firstName} {child.lastName}</h3>
                    <p className="text-blue-300 text-sm">{child.class} - {child.school}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-white text-xl font-bold">{child.stats.averageScore}%</div>
                    <div className="text-blue-300 text-xs">Score moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-xl font-bold">#{child.stats.rank}</div>
                    <div className="text-blue-300 text-xs">Classement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-xl font-bold">{child.stats.completedQuizzes}</div>
                    <div className="text-blue-300 text-xs">Quiz terminés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-xl font-bold">{child.stats.badges}</div>
                    <div className="text-blue-300 text-xs">Badges</div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Dernière activité</span>
                    <span className="text-blue-400 text-xs">
                      {formatRelativeTime(child.recentActivity.lastActive)}
                    </span>
                  </div>
                  <div className="text-white text-sm">
                    {child.recentActivity.lastQuiz} - {child.recentActivity.lastScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-white text-xl font-bold mb-4">Actions rapides</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={onNavigateToMessages}
            className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span className="text-white text-sm font-medium">Envoyer un message</span>
          </button>
          
          <button 
            onClick={onNavigateToMeetings}
            className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            <Calendar className="w-8 h-8 text-green-400" />
            <span className="text-white text-sm font-medium">Planifier RDV</span>
          </button>
          
          <button 
            onClick={onNavigateToReports}
            className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            <FileText className="w-8 h-8 text-purple-400" />
            <span className="text-white text-sm font-medium">Voir rapports</span>
          </button>
          
          <button 
            onClick={onNavigateToSettings}
            className="flex flex-col items-center space-y-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            <Settings className="w-8 h-8 text-orange-400" />
            <span className="text-white text-sm font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewTab;

