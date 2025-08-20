'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Bell,
  BellOff,
  MapPin,
  User,
  Users,
  School,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Flag,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  Share2,
  Download,
  RefreshCw,
  Settings,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Star,
  Heart,
  Smile,
  Coffee,
  Home,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Walk,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Mic,
  Camera,
  FileText,
  Image,
  File,
  Link,
  Tag,
  Hash,
  AtSign,
  Globe,
  Map,
  Compass,
  Mountain,
  TreePine,
  Flower,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Thermometer,
  Umbrella,
  Rainbow,
  Snowflake,
  Flame,
  Droplets,
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
  Sparkles,
  Fireworks,
  Confetti,
  Balloon,
  Gift,
  Party,
  Cake,
  IceCream,
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
  class: string;
  school: string;
}

interface Parent {
  id: string;
  children: Child[];
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'exam' | 'meeting' | 'class' | 'event' | 'deadline' | 'reminder' | 'holiday';
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  childId?: string;
  teacherId?: string;
  teacherName?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  reminders: {
    time: number; // minutes avant
    method: 'notification' | 'email' | 'sms';
  }[];
  attendees?: {
    id: string;
    name: string;
    role: string;
    status: 'pending' | 'accepted' | 'declined';
  }[];
  color?: string;
  isAllDay: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

interface CalendarTabProps {
  selectedChild?: Child;
  parent?: Parent;
  searchQuery?: string;
}

const CalendarTab: React.FC<CalendarTabProps> = ({
  selectedChild,
  parent,
  searchQuery
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [showFilters, setShowFilters] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    type: 'reminder',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium',
    isAllDay: false,
    reminders: [{ time: 15, method: 'notification' }]
  });

  useEffect(() => {
    // Données simulées d'événements
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Quiz - La Révolution française',
        description: 'Quiz sur les événements de la Révolution française (1789-1799)',
        type: 'quiz',
        startDate: '2024-12-23',
        startTime: '10:00',
        endTime: '11:00',
        childId: 'child-1',
        teacherId: 'teacher-1',
        teacherName: 'Mme Martin',
        priority: 'high',
        status: 'scheduled',
        isRecurring: false,
        reminders: [
          { time: 60, method: 'notification' },
          { time: 15, method: 'notification' }
        ],
        color: '#f59e0b',
        isAllDay: false,
        createdBy: 'teacher-1',
        createdAt: '2024-12-20T10:00:00'
      },
      {
        id: 'event-2',
        title: 'Réunion parents-professeurs',
        description: 'Entretien avec les professeurs de Lucas et Emma pour faire le point sur leur progression',
        type: 'meeting',
        startDate: '2024-12-27',
        startTime: '17:00',
        endTime: '18:00',
        location: 'Collège Jean Moulin - Salle 205',
        teacherId: 'teacher-1',
        teacherName: 'Mme Martin',
        priority: 'urgent',
        status: 'confirmed',
        isRecurring: false,
        reminders: [
          { time: 1440, method: 'email' },
          { time: 60, method: 'notification' }
        ],
        attendees: [
          { id: 'parent-1', name: 'Marie Dubois', role: 'parent', status: 'accepted' },
          { id: 'teacher-1', name: 'Mme Martin', role: 'teacher', status: 'accepted' },
          { id: 'teacher-2', name: 'M. Leroy', role: 'teacher', status: 'accepted' }
        ],
        color: '#ef4444',
        isAllDay: false,
        createdBy: 'admin-1',
        createdAt: '2024-12-15T14:30:00'
      },
      {
        id: 'event-3',
        title: 'Contrôle d\'Histoire',
        description: 'Évaluation sur la Révolution française et l\'Empire napoléonien',
        type: 'exam',
        startDate: '2024-12-30',
        startTime: '09:00',
        endTime: '11:00',
        childId: 'child-2',
        teacherId: 'teacher-2',
        teacherName: 'M. Leroy',
        priority: 'high',
        status: 'scheduled',
        isRecurring: false,
        reminders: [
          { time: 2880, method: 'email' },
          { time: 1440, method: 'notification' },
          { time: 60, method: 'notification' }
        ],
        color: '#dc2626',
        isAllDay: false,
        createdBy: 'teacher-2',
        createdAt: '2024-12-18T16:20:00'
      },
      {
        id: 'event-4',
        title: 'Sortie pédagogique - Musée d\'Histoire',
        description: 'Visite guidée sur l\'époque médiévale avec activités pédagogiques',
        type: 'event',
        startDate: '2025-01-08',
        startTime: '14:00',
        endTime: '17:00',
        location: 'Musée d\'Histoire de la ville',
        teacherId: 'teacher-1',
        teacherName: 'Mme Martin',
        priority: 'medium',
        status: 'scheduled',
        isRecurring: false,
        reminders: [
          { time: 10080, method: 'email' },
          { time: 1440, method: 'notification' }
        ],
        color: '#10b981',
        isAllDay: false,
        createdBy: 'teacher-1',
        createdAt: '2024-12-17T11:45:00'
      },
      {
        id: 'event-5',
        title: 'Remise des bulletins',
        description: 'Distribution des bulletins du premier trimestre',
        type: 'deadline',
        startDate: '2025-01-15',
        startTime: '18:00',
        endTime: '19:00',
        location: 'Collège Jean Moulin - Hall principal',
        priority: 'medium',
        status: 'scheduled',
        isRecurring: false,
        reminders: [
          { time: 10080, method: 'email' },
          { time: 2880, method: 'notification' }
        ],
        color: '#8b5cf6',
        isAllDay: false,
        createdBy: 'admin-1',
        createdAt: '2024-12-10T09:30:00'
      },
      {
        id: 'event-6',
        title: 'Cours d\'Histoire',
        description: 'L\'Empire napoléonien - Conquêtes et réformes',
        type: 'class',
        startDate: '2024-12-21',
        startTime: '10:00',
        endTime: '11:00',
        childId: 'child-1',
        teacherId: 'teacher-1',
        teacherName: 'Mme Martin',
        priority: 'low',
        status: 'scheduled',
        isRecurring: true,
        recurringPattern: 'weekly',
        reminders: [
          { time: 15, method: 'notification' }
        ],
        color: '#6366f1',
        isAllDay: false,
        createdBy: 'teacher-1',
        createdAt: '2024-09-01T08:00:00'
      },
      {
        id: 'event-7',
        title: 'Vacances de Noël',
        description: 'Vacances scolaires de fin d\'année',
        type: 'holiday',
        startDate: '2024-12-21',
        endDate: '2025-01-06',
        priority: 'low',
        status: 'scheduled',
        isRecurring: false,
        reminders: [],
        color: '#f97316',
        isAllDay: true,
        createdBy: 'admin-1',
        createdAt: '2024-09-01T00:00:00'
      },
      {
        id: 'event-8',
        title: 'Rappel: Réviser la géographie',
        description: 'Réviser les capitales européennes pour le prochain quiz',
        type: 'reminder',
        startDate: '2024-12-22',
        startTime: '19:00',
        endTime: '20:00',
        childId: 'child-1',
        priority: 'medium',
        status: 'scheduled',
        isRecurring: false,
        reminders: [
          { time: 0, method: 'notification' }
        ],
        color: '#06b6d4',
        isAllDay: false,
        createdBy: 'parent-1',
        createdAt: '2024-12-20T18:30:00'
      }
    ];

    setEvents(mockEvents);
  }, []);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Target;
      case 'exam': return Award;
      case 'meeting': return Users;
      case 'class': return BookOpen;
      case 'event': return Calendar;
      case 'deadline': return Flag;
      case 'reminder': return Bell;
      case 'holiday': return Sun;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'from-yellow-500 to-orange-600';
      case 'exam': return 'from-red-500 to-pink-600';
      case 'meeting': return 'from-blue-500 to-indigo-600';
      case 'class': return 'from-indigo-500 to-purple-600';
      case 'event': return 'from-green-500 to-emerald-600';
      case 'deadline': return 'from-purple-500 to-violet-600';
      case 'reminder': return 'from-cyan-500 to-blue-600';
      case 'holiday': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-slate-600';
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
      case 'confirmed': return 'text-green-400 bg-green-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getChildName = (childId?: string) => {
    if (!childId || !parent) return '';
    const child = parent.children.find(c => c.id === childId);
    return child ? child.firstName : '';
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Lundi = 0
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (event.endDate) {
        // Événement sur plusieurs jours
        return dateString >= event.startDate && dateString <= event.endDate;
      }
      return event.startDate === dateString;
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
                         event.description?.toLowerCase().includes(searchQuery?.toLowerCase() || '');
    
    const matchesFilter = selectedFilters.includes('all') || 
                         selectedFilters.includes(event.type) ||
                         (selectedFilters.includes('child-specific') && event.childId);

    return matchesSearch && matchesFilter;
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Jours du mois précédent
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
      const day = prevMonth.getDate() - i;
      days.push(
        <div key={`prev-${day}`} className="p-2 text-blue-400 opacity-50">
          <div className="text-sm">{day}</div>
        </div>
      );
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border border-white/10 transition-all hover:bg-white/5 ${
            isToday ? 'bg-blue-500/20 border-blue-400/50' : ''
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-300' : 'text-white'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => {
              const IconComponent = getEventTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventModal(true);
                  }}
                  className="text-xs p-1 rounded cursor-pointer transition-all hover:scale-105"
                  style={{ backgroundColor: event.color + '40', color: event.color }}
                >
                  <div className="flex items-center space-x-1">
                    <IconComponent className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{event.title}</span>
                  </div>
                  {event.startTime && !event.isAllDay && (
                    <div className="text-xs opacity-75">{event.startTime}</div>
                  )}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div className="text-xs text-blue-400 cursor-pointer hover:text-white">
                +{dayEvents.length - 3} autres
              </div>
            )}
          </div>
        </div>
      );
    }

    // Jours du mois suivant
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="p-2 text-blue-400 opacity-50">
          <div className="text-sm">{day}</div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-white/20 rounded-xl overflow-hidden">
        {/* En-têtes des jours */}
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div key={day} className="p-3 bg-white/10 text-center text-white font-semibold border-b border-white/20">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => 
      new Date(a.startDate + ' ' + (a.startTime || '00:00')).getTime() - 
      new Date(b.startDate + ' ' + (b.startTime || '00:00')).getTime()
    );

    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => {
          const IconComponent = getEventTypeIcon(event.type);
          const childName = getChildName(event.childId);
          
          return (
            <div
              key={event.id}
              onClick={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 cursor-pointer transition-all hover:scale-105 hover:bg-white/15"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getEventTypeColor(event.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-blue-200 text-sm mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {!event.isAllDay && event.startTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.startTime)}</span>
                        {event.endTime && <span>- {formatTime(event.endTime)}</span>}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-blue-300 text-sm mb-3 line-clamp-2">
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
                      {event.teacherName && (
                        <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">
                          {event.teacherName}
                        </span>
                      )}
                      {event.isRecurring && (
                        <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-1 rounded">
                          Récurrent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {event.reminders.length > 0 && (
                        <Bell className="w-4 h-4 text-yellow-400" />
                      )}
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-xs">{event.attendees.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedEvents.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Aucun événement</h3>
            <p className="text-blue-200">Aucun événement ne correspond à vos critères</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-2xl font-bold">Calendrier familial</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-white text-xl font-semibold min-w-[200px] text-center">
                {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              {[
                { id: 'month', label: 'Mois', icon: Calendar },
                { id: 'agenda', label: 'Agenda', icon: FileText }
              ].map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all ${
                      viewMode === mode.id 
                        ? 'bg-blue-500 text-white' 
                        : 'text-blue-300 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau</span>
            </button>
          </div>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tous', color: 'blue' },
                { id: 'quiz', label: 'Quiz', color: 'yellow' },
                { id: 'exam', label: 'Examens', color: 'red' },
                { id: 'meeting', label: 'Réunions', color: 'blue' },
                { id: 'class', label: 'Cours', color: 'indigo' },
                { id: 'event', label: 'Événements', color: 'green' },
                { id: 'deadline', label: 'Échéances', color: 'purple' },
                { id: 'reminder', label: 'Rappels', color: 'cyan' },
                { id: 'holiday', label: 'Vacances', color: 'orange' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    if (filter.id === 'all') {
                      setSelectedFilters(['all']);
                    } else {
                      setSelectedFilters(prev => {
                        const newFilters = prev.filter(f => f !== 'all');
                        if (newFilters.includes(filter.id)) {
                          const filtered = newFilters.filter(f => f !== filter.id);
                          return filtered.length === 0 ? ['all'] : filtered;
                        } else {
                          return [...newFilters, filter.id];
                        }
                      });
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilters.includes(filter.id) || selectedFilters.includes('all')
                      ? `bg-${filter.color}-500/20 text-${filter.color}-300 border border-${filter.color}-400/30`
                      : 'bg-white/10 text-blue-200 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      {viewMode === 'month' ? renderMonthView() : renderAgendaView()}

      {/* Modal de détail d'événement */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Détails de l'événement</h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* En-tête de l'événement */}
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getEventTypeColor(selectedEvent.type)} rounded-xl flex items-center justify-center`}>
                  {React.createElement(getEventTypeIcon(selectedEvent.type), { className: "w-8 h-8 text-white" })}
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-2">{selectedEvent.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(selectedEvent.priority)}`}>
                      {selectedEvent.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                    {selectedEvent.isRecurring && (
                      <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                        Récurrent ({selectedEvent.recurringPattern})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-2">Description</h4>
                  <p className="text-blue-200">{selectedEvent.description}</p>
                </div>
              )}

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Informations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">{formatDate(selectedEvent.startDate)}</span>
                    </div>
                    {!selectedEvent.isAllDay && selectedEvent.startTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">
                          {formatTime(selectedEvent.startTime)}
                          {selectedEvent.endTime && ` - ${formatTime(selectedEvent.endTime)}`}
                        </span>
                      </div>
                    )}
                    {selectedEvent.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">{selectedEvent.location}</span>
                      </div>
                    )}
                    {selectedEvent.childId && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">Concernant: {getChildName(selectedEvent.childId)}</span>
                      </div>
                    )}
                    {selectedEvent.teacherName && (
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">Professeur: {selectedEvent.teacherName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rappels */}
                {selectedEvent.reminders.length > 0 && (
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">Rappels</h4>
                    <div className="space-y-2">
                      {selectedEvent.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-yellow-400" />
                          <span className="text-blue-200">
                            {reminder.time === 0 ? 'À l\'heure' : 
                             reminder.time < 60 ? `${reminder.time} min avant` :
                             reminder.time < 1440 ? `${Math.floor(reminder.time / 60)}h avant` :
                             `${Math.floor(reminder.time / 1440)} jour(s) avant`}
                          </span>
                          <span className="text-blue-400 text-xs">({reminder.method})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Participants */}
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Participants</h4>
                  <div className="space-y-2">
                    {selectedEvent.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-200">{attendee.name}</span>
                          <span className="text-blue-400 text-xs">({attendee.role})</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          attendee.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                          attendee.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="text-blue-300 text-sm">
                  Créé le {new Date(selectedEvent.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
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
                <label className="block text-blue-200 text-sm mb-2">Titre</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'événement"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Type</label>
                <select
                  value={newEvent.type || 'reminder'}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="reminder">Rappel</option>
                  <option value="meeting">Réunion</option>
                  <option value="event">Événement</option>
                  <option value="deadline">Échéance</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={newEvent.startDate || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  />
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
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newEvent.isAllDay || false}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, isAllDay: e.target.checked }))}
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-blue-200 text-sm">Toute la journée</span>
                </label>
              </div>
              
              {!newEvent.isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">Heure de début</label>
                    <input
                      type="time"
                      value={newEvent.startTime || ''}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">Heure de fin</label>
                    <input
                      type="time"
                      value={newEvent.endTime || ''}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Description</label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'événement"
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <span className="text-blue-200 text-sm">Rappel 15 min avant</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // Logique de création d'événement
                      setShowCreateModal(false);
                    }}
                    disabled={!newEvent.title || !newEvent.startDate}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;

