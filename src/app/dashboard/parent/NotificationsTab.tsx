'use client';

import React, { useState, useMemo } from 'react';
import { getChildName, getChildFullName } from '@/lib/userUtils';
import {
  Bell,
  BellRing,
  Archive,
  Trash2,
  Mail,
  Check,
  X,
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  CreditCard,
  Settings,
  User,
  Users,
  Clock,
  Tag,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';

export type NotificationType = 'message' | 'alert' | 'reminder' | 'report' | 'payment' | 'achievement' | 'progress' | 'meeting';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  childId?: string;
  childName?: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  isStarred: boolean;
  priority: NotificationPriority;
  action?: { label: string; url: string; };
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Résultat de quiz disponible',
            message: `${getChildName('child-1')} a terminé le quiz "La Révolution française" avec un score de 92%.`,
    childId: 'child-1',
    childName: 'Lucas Dubois',
    timestamp: '2024-12-20T16:35:00',
    isRead: false,
    isArchived: false,
    isStarred: true,
    priority: 'high',
    action: { label: 'Voir les résultats', url: '/parent/quiz-results' }
  },
  {
    id: 'notif-2',
    type: 'reminder',
    title: 'Rappel de réunion',
    message: 'Votre réunion avec Mme Martin est prévue demain à 18:00.',
    childId: 'child-1',
    childName: 'Lucas Dubois',
    timestamp: '2024-12-21T10:00:00',
    isRead: false,
    isArchived: false,
    isStarred: false,
    priority: 'urgent',
    action: { label: 'Voir les détails', url: '/parent/meetings' }
  },
  {
    id: 'notif-3',
    type: 'progress',
    title: 'Progression hebdomadaire',
    message: 'Emma a amélioré son score moyen de 5% en Géographie cette semaine.',
    childId: 'child-2',
    childName: 'Emma Dubois',
    timestamp: '2024-12-19T09:00:00',
    isRead: true,
    isArchived: false,
    isStarred: false,
    priority: 'medium',
    action: { label: 'Voir la progression', url: '/parent/progress' }
  },
  {
    id: 'notif-4',
    type: 'message',
    title: 'Nouveau message de M. Leroy',
    message: 'Bonjour, je souhaiterais discuter des excellents résultats d\'Emma...', 
    childId: 'child-2',
    childName: 'Emma Dubois',
    timestamp: '2024-12-18T14:20:00',
    isRead: true,
    isArchived: true,
    isStarred: false,
    priority: 'low',
    action: { label: 'Lire le message', url: '/parent/messages' }
  }
];

const notificationIcon = (type: NotificationType) => {
  const map: Record<NotificationType, { icon: any; color: string }> = {
    message: { icon: MessageSquare, color: 'text-blue-400' },
    alert: { icon: AlertTriangle, color: 'text-yellow-400' },
    reminder: { icon: BellRing, color: 'text-orange-400' },
    report: { icon: FileText, color: 'text-purple-400' },
    payment: { icon: CreditCard, color: 'text-green-400' },
    achievement: { icon: Award, color: 'text-yellow-300' },
    progress: { icon: TrendingUp, color: 'text-green-300' },
    meeting: { icon: Calendar, color: 'text-indigo-400' },
  };
  const Icon = map[type].icon;
  return <Icon className={`w-5 h-5 ${map[type].color}`} />;
};

const priorityBadge = (priority: NotificationPriority) => {
  const map: Record<NotificationPriority, { text: string; class: string }> = {
    low: { text: 'Faible', class: 'text-gray-300 bg-gray-500/20' },
    medium: { text: 'Moyenne', class: 'text-blue-300 bg-blue-500/20' },
    high: { text: 'Élevée', class: 'text-orange-300 bg-orange-500/20' },
    urgent: { text: 'Urgente', class: 'text-red-300 bg-red-500/20' },
  };
  return <span className={`inline-block text-xs px-2 py-1 rounded ${map[priority].class}`}>{map[priority].text}</span>;
};

const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [filters, setFilters] = useState<{ child: 'all' | 'child-1' | 'child-2'; type: 'all' | NotificationType; status: 'all' | 'read' | 'unread' | 'archived' | 'starred' }>({ child: 'all', type: 'all', status: 'all' });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => notifications.filter(n => {
    const f1 = filters.child === 'all' || n.childId === filters.child;
    const f2 = filters.type === 'all' || n.type === filters.type;
    const f3 = filters.status === 'all' || 
               (filters.status === 'read' && n.isRead) || 
               (filters.status === 'unread' && !n.isRead) || 
               (filters.status === 'archived' && n.isArchived) || 
               (filters.status === 'starred' && n.isStarred);
    return f1 && f2 && f3;
  }), [notifications, filters]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelected(newSet);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(n => n.id)));
    }
  };

  const updateMany = (ids: Set<string>, updates: Partial<Notification>) => {
    setNotifications(prev => prev.map(n => ids.has(n.id) ? { ...n, ...updates } : n));
    setSelected(new Set());
  };

  const deleteMany = (ids: Set<string>) => {
    setNotifications(prev => prev.filter(n => !ids.has(n.id)));
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Centre de notifications</h2>
            <p className="text-blue-200">Toutes vos alertes et messages importants en un seul endroit</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
              <Settings className="w-4 h-4" /> Paramètres
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters.child} onChange={e => setFilters(f => ({ ...f, child: e.target.value as any }))}>
            <option value="all">Tous les enfants</option>
            <option value="child-1">Lucas</option>
            <option value="child-2">Emma</option>
          </select>
          <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value as any }))}>
            <option value="all">Tous les types</option>
            <option value="message">Message</option>
            <option value="alert">Alerte</option>
            <option value="reminder">Rappel</option>
            <option value="progress">Progression</option>
          </select>
          <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}>
            <option value="all">Tous les statuts</option>
            <option value="unread">Non lues</option>
            <option value="read">Lues</option>
            <option value="starred">Favorites</option>
            <option value="archived">Archivées</option>
          </select>
        </div>
      </div>

      {/* Actions toolbar */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleSelectAll} />
          <span className="text-blue-200 text-sm">{selected.size} sélectionné(s)</span>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <button onClick={() => updateMany(selected, { isRead: true })} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg inline-flex items-center gap-2"><Eye className="w-4 h-4" /> Marquer comme lu</button>
            <button onClick={() => updateMany(selected, { isRead: false })} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg inline-flex items-center gap-2"><EyeOff className="w-4 h-4" /> Marquer non lu</button>
            <button onClick={() => updateMany(selected, { isArchived: true })} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg inline-flex items-center gap-2"><Archive className="w-4 h-4" /> Archiver</button>
            <button onClick={() => deleteMany(selected)} className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> Supprimer</button>
          </div>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.map(n => (
          <div key={n.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${selected.has(n.id) ? 'bg-blue-500/20 border-blue-400' : 'bg-white/10 border-white/20'} ${!n.isRead ? 'border-l-4 border-l-blue-400' : ''}`}>
            <input type="checkbox" className="w-4 h-4 mt-1" checked={selected.has(n.id)} onChange={() => toggleSelect(n.id)} />
            <div className="flex-shrink-0 mt-1">{notificationIcon(n.type)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-white font-semibold">{n.title}</div>
                <div className="text-blue-300 text-xs flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {new Date(n.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  <button onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isStarred: !x.isStarred } : x))}>
                    <Star className={`w-4 h-4 transition-all ${n.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`} />
                  </button>
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-1">{n.message}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {priorityBadge(n.priority)}
                  {n.childName && <span className="text-xs text-blue-300 bg-white/10 px-2 py-1 rounded inline-flex items-center gap-1"><User className="w-3 h-3" /> {n.childName}</span>}
                </div>
                {n.action && <a href={n.action.url} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">{n.action.label}</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;