'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUserFullName, getSchoolName } from '@/lib/userUtils';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Star,
  Bell,
  BellOff,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Download,
  Share2,
  RefreshCw,
  Settings,
  X,
  Save,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Target,
  Flag,
  Award,
  Zap,
  Brain,
  History,
  Globe,
  Home,
  School,
  Coffee,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Activity,
  Pause,
  Play,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Bluetooth,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Headphones,
  Camera,
  Mic,
  Video,
  Phone,
  Mail,
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Bookmark,
  Tag,
  Link,
  Hash,
  AtSign,
  Smile,
  Heart,
  ThumbsUp,
  Share,
  Copy,
  Cut,
  Paste,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  File,
  Folder,
  FolderOpen,
  Upload,
  Download as DownloadIcon,
  CloudUpload,
  CloudDownload,
  Cloud,
  Server,
  Database,
  HardDrive,
  Cpu,
  Memory,
  Zap as ZapIcon,
  Power,
  PowerOff
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'course' | 'homework' | 'exam' | 'meeting' | 'reminder' | 'personal';
  subject?: string;
  startDate: string;
  endDate?: string;
  isAllDay: boolean;
  location?: string;
  teacher?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  reminders: {
    time: number; // minutes avant
    enabled: boolean;
  }[];
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  participants?: string[];
  color?: string;
  isEditable: boolean;
}

interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

const CalendarTab: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<CalendarView>({ type: 'month', date: new Date() });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    type: 'personal',
    startDate: '',
    endDate: '',
    isAllDay: false,
    priority: 'medium',
    reminders: [{ time: 15, enabled: true }]
  });

  useEffect(() => {
    // Données simulées des événements
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Quiz - La Révolution française',
        description: 'Quiz sur les événements de 1789-1799',
        type: 'quiz',
        subject: 'Histoire',
        startDate: '2025-12-25T10:00:00',
        endDate: '2025-12-25T11:00:00',
        isAllDay: false,
        teacher: 'Mme Martin',
        priority: 'high',
        status: 'scheduled',
        reminders: [
          { time: 60, enabled: true },
          { time: 15, enabled: true }
        ],
        color: 'from-red-500 to-orange-600',
        isEditable: false
      },
      {
        id: 'event-2',
        title: 'Cours - Les climats européens',
        description: 'Étude des différents climats en Europe',
        type: 'course',
        subject: 'Géographie',
        startDate: '2025-12-23T14:00:00',
        endDate: '2025-12-23T15:30:00',
        isAllDay: false,
        location: 'Salle 205',
        teacher: getCurrentUserFullName(),
        priority: 'medium',
        status: 'scheduled',
        reminders: [{ time: 30, enabled: true }],
        color: 'from-green-500 to-emerald-600',
        isEditable: false
      },
      {
        id: 'event-3',
        title: 'Devoir - Carte de l\'Europe',
        description: 'Rendre la carte des capitales européennes',
        type: 'homework',
        subject: 'Géographie',
        startDate: '2025-12-24T23:59:00',
        isAllDay: false,
        priority: 'high',
        status: 'scheduled',
        reminders: [
          { time: 1440, enabled: true }, // 24h avant
          { time: 120, enabled: true }   // 2h avant
        ],
        color: 'from-blue-500 to-indigo-600',
        isEditable: true
      },
      {
        id: 'event-4',
        title: 'Révisions - Histoire',
        description: 'Session de révisions pour le contrôle',
        type: 'personal',
        subject: 'Histoire',
        startDate: '2025-12-22T16:00:00',
        endDate: '2025-12-22T18:00:00',
        isAllDay: false,
        location: 'Maison',
        priority: 'medium',
        status: 'completed',
        reminders: [{ time: 15, enabled: true }],
        color: 'from-purple-500 to-violet-600',
        isEditable: true
      },
      {
        id: 'event-5',
        title: 'Contrôle - Empire napoléonien',
        description: 'Évaluation sur l\'Empire de Napoléon',
        type: 'exam',
        subject: 'Histoire',
        startDate: '2025-12-27T09:00:00',
        endDate: '2025-12-27T11:00:00',
        isAllDay: false,
        location: 'Salle d\'examen A',
        teacher: 'Mme Martin',
        priority: 'urgent',
        status: 'scheduled',
        reminders: [
          { time: 2880, enabled: true }, // 2 jours avant
          { time: 1440, enabled: true }, // 1 jour avant
          { time: 60, enabled: true }    // 1h avant
        ],
        color: 'from-red-600 to-pink-600',
        isEditable: false
      },
      {
        id: 'event-6',
        title: 'Réunion parents-professeurs',
        description: 'Entretien avec les professeurs',
        type: 'meeting',
        startDate: '2025-12-26T17:00:00',
        endDate: '2025-12-26T18:00:00',
        isAllDay: false,
        location: getSchoolName(),
        participants: [`${getCurrentUserFullName()} (parent)`, 'Mme Martin', `${getCurrentUserFullName()} (prof)`],
        priority: 'medium',
        status: 'scheduled',
        reminders: [{ time: 120, enabled: true }],
        color: 'from-gray-500 to-gray-600',
        isEditable: true
      },
      {
        id: 'event-7',
        title: 'Vacances de Noël',
        description: 'Période de vacances scolaires',
        type: 'personal',
        startDate: '2025-12-21T00:00:00',
        endDate: '2025-01-06T23:59:59',
        isAllDay: true,
        priority: 'low',
        status: 'scheduled',
        reminders: [],
        color: 'from-green-400 to-blue-500',
        isEditable: true
      }
    ];

    setEvents(mockEvents);
  }, []);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Target;
      case 'course': return BookOpen;
      case 'homework': return Edit;
      case 'exam': return Award;
      case 'meeting': return Users;
      case 'reminder': return Bell;
      case 'personal': return User;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'from-orange-500 to-red-600';
      case 'course': return 'from-blue-500 to-indigo-600';
      case 'homework': return 'from-green-500 to-emerald-600';
      case 'exam': return 'from-red-500 to-pink-600';
      case 'meeting': return 'from-purple-500 to-violet-600';
      case 'reminder': return 'from-yellow-500 to-orange-600';
      case 'personal': return 'from-gray-500 to-slate-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'in_progress': return 'text-blue-400 bg-blue-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      case 'postponed': return 'text-yellow-400 bg-yellow-500/20';
      case 'scheduled': return 'text-blue-300 bg-blue-500/10';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    
    switch (view.type) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setView(prev => ({ ...prev, date: newDate }));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      
      return date >= new Date(eventStart.toDateString()) && 
             date <= new Date(eventEnd.toDateString());
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startDate) return;

    const event: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type as any,
      subject: newEvent.subject,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      isAllDay: newEvent.isAllDay || false,
      location: newEvent.location,
      priority: newEvent.priority as any,
      status: 'scheduled',
      reminders: newEvent.reminders || [{ time: 15, enabled: true }],
      color: getEventTypeColor(newEvent.type as string),
      isEditable: true
    };

    setEvents(prev => [...prev, event]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      type: 'personal',
      startDate: '',
      endDate: '',
      isAllDay: false,
      priority: 'medium',
      reminders: [{ time: 15, enabled: true }]
    });
  };

  const renderMonthView = () => {
    const year = view.date.getFullYear();
    const month = view.date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = getEventsForDate(currentDate);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={i}
          onClick={() => {
            setSelectedDate(new Date(currentDate));
            if (dayEvents.length === 1) {
              setSelectedEvent(dayEvents[0]);
              setShowEventModal(true);
            }
          }}
          className={`min-h-24 p-2 border border-white/10 cursor-pointer transition-all hover:bg-white/5 ${
            !isCurrentMonth ? 'opacity-50' : ''
          } ${isToday ? 'bg-blue-500/20 border-blue-400' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${
            isToday ? 'text-blue-300' : isCurrentMonth ? 'text-white' : 'text-gray-400'
          }`}>
            {currentDate.getDate()}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => {
              const IconComponent = getEventTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded bg-gradient-to-r ${event.color || getEventTypeColor(event.type)} text-white truncate flex items-center space-x-1`}
                >
                  <IconComponent className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{event.title}</span>
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div className="text-xs text-blue-300 font-semibold">
                +{dayEvents.length - 3} autres
              </div>
            )}
          </div>
        </div>
      );
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        {/* En-tête des jours */}
        <div className="grid grid-cols-7 bg-white/5">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="p-3 text-center text-blue-300 font-semibold border-r border-white/10 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const today = new Date();
    const upcomingEvents = filteredEvents
      .filter(event => new Date(event.startDate) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 10);

    return (
      <div className="space-y-4">
        {upcomingEvents.map(event => {
          const IconComponent = getEventTypeIcon(event.type);
          const eventDate = new Date(event.startDate);
          const isToday = eventDate.toDateString() === today.toDateString();
          const isTomorrow = eventDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
          
          return (
            <div
              key={event.id}
              onClick={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 cursor-pointer transition-all hover:bg-white/15"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${event.color || getEventTypeColor(event.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg truncate">{event.title}</h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-blue-200 text-sm mb-2 line-clamp-2">{event.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-blue-300">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isToday ? 'Aujourd\'hui' : 
                         isTomorrow ? 'Demain' : 
                         formatDate(event.startDate)}
                      </span>
                    </div>
                    
                    {!event.isAllDay && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(event.startDate)}
                          {event.endDate && ` - ${formatTime(event.endDate)}`}
                        </span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.subject && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{event.subject}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {upcomingEvents.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Aucun événement à venir</h3>
            <p className="text-blue-200">Votre agenda est libre pour les prochains jours</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Mon Calendrier</h1>
            <p className="text-blue-200">Organisez votre emploi du temps et vos échéances</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel événement</span>
          </button>
        </div>

        {/* Navigation et vues */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-white text-xl font-semibold min-w-48 text-center">
                {view.type === 'month' && view.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                {view.type === 'week' && `Semaine du ${view.date.toLocaleDateString('fr-FR')}`}
                {view.type === 'day' && view.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                {view.type === 'agenda' && 'Agenda'}
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setView(prev => ({ ...prev, date: new Date() }))}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all text-sm"
            >
              Aujourd'hui
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {['month', 'week', 'day', 'agenda'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(prev => ({ ...prev, type: viewType as any }))}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  view.type === viewType
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-blue-300 hover:text-white hover:bg-white/20'
                }`}
              >
                {viewType === 'month' ? 'Mois' :
                 viewType === 'week' ? 'Semaine' :
                 viewType === 'day' ? 'Jour' : 'Agenda'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Recherche */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un événement..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">Tous les types</option>
              <option value="quiz">Quiz</option>
              <option value="course">Cours</option>
              <option value="homework">Devoirs</option>
              <option value="exam">Examens</option>
              <option value="meeting">Réunions</option>
              <option value="reminder">Rappels</option>
              <option value="personal">Personnel</option>
            </select>

            <button className="p-2 rounded-lg bg-white/10 text-blue-300 hover:text-white hover:bg-white/20 transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu du calendrier */}
      <div>
        {view.type === 'month' && renderMonthView()}
        {view.type === 'agenda' && renderAgendaView()}
        {(view.type === 'week' || view.type === 'day') && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Vue {view.type === 'week' ? 'semaine' : 'jour'}</h3>
            <p className="text-blue-200">Cette vue sera bientôt disponible</p>
          </div>
        )}
      </div>

      {/* Modal de détail d'événement */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Détails de l'événement</h2>
              <div className="flex items-center space-x-2">
                {selectedEvent.isEditable && (
                  <button className="p-2 rounded-lg bg-white/10 text-blue-400 hover:text-white hover:bg-white/20 transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* En-tête de l'événement */}
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${selectedEvent.color || getEventTypeColor(selectedEvent.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {React.createElement(getEventTypeIcon(selectedEvent.type), { className: "w-8 h-8 text-white" })}
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                  {selectedEvent.description && (
                    <p className="text-blue-200 text-lg">{selectedEvent.description}</p>
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">
                        {formatDate(selectedEvent.startDate)}
                      </span>
                    </div>
                    
                    {!selectedEvent.isAllDay && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">
                          {formatTime(selectedEvent.startDate)}
                          {selectedEvent.endDate && ` - ${formatTime(selectedEvent.endDate)}`}
                        </span>
                      </div>
                    )}
                    
                    {selectedEvent.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">{selectedEvent.location}</span>
                      </div>
                    )}
                    
                    {selectedEvent.teacher && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">{selectedEvent.teacher}</span>
                      </div>
                    )}
                    
                    {selectedEvent.subject && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">{selectedEvent.subject}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Statut et priorité</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Priorité</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(selectedEvent.priority)}`}>
                        {selectedEvent.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Statut</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Type</span>
                      <span className="text-white text-sm font-semibold">
                        {selectedEvent.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rappels */}
              {selectedEvent.reminders && selectedEvent.reminders.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Rappels</h4>
                  <div className="space-y-2">
                    {selectedEvent.reminders.map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-blue-200 text-sm">
                          {reminder.time >= 1440 ? `${Math.floor(reminder.time / 1440)} jour(s) avant` :
                           reminder.time >= 60 ? `${Math.floor(reminder.time / 60)} heure(s) avant` :
                           `${reminder.time} minute(s) avant`}
                        </span>
                        <div className={`w-4 h-4 rounded-full ${reminder.enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants */}
              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Participants</h4>
                  <div className="space-y-2">
                    {selectedEvent.participants.map((participant, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200 text-sm">{participant}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'événement */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Nouvel événement</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Titre *</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'événement"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Description</label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'événement"
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Type</label>
                  <select
                    value={newEvent.type || 'personal'}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="personal">Personnel</option>
                    <option value="homework">Devoir</option>
                    <option value="reminder">Rappel</option>
                    <option value="meeting">Réunion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Priorité</label>
                  <select
                    value={newEvent.priority || 'medium'}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Date de début *</label>
                  <input
                    type="datetime-local"
                    value={newEvent.startDate || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Date de fin</label>
                  <input
                    type="datetime-local"
                    value={newEvent.endDate || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Lieu</label>
                <input
                  type="text"
                  value={newEvent.location || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Lieu de l'événement"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={newEvent.isAllDay || false}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, isAllDay: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <label htmlFor="allDay" className="text-blue-200 text-sm">
                  Événement sur toute la journée
                </label>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title || !newEvent.startDate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>Créer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;

