'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Users,
  Mail,
  Phone,
  Calendar,
  Tag,
  Paperclip,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  X,
  Save,
  Loader2,
  Shield,
  Heart,
  BookOpen,
  Award,
  Settings,
  Bell,
  Flag,
  Circle,
  CheckCircle2
} from 'lucide-react';

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'parent' | 'admin';
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'parent' | 'admin';
  };
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'academic' | 'technical' | 'administrative';
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
  }[];
  parentMessageId?: string;
  replies?: Message[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    type: 'student' | 'parent' | 'admin';
  }[];
  lastMessage: Message;
  unreadCount: number;
  isArchived: boolean;
}

const MessagesManagementTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSender, setFilterSender] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'archived' | 'starred'>('inbox');
  const [viewMode, setViewMode] = useState<'list' | 'conversation'>('list');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Données simulées
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        from: {
          id: '1',
          name: 'Marie Dubois',
          email: 'marie.dubois@email.com',
          type: 'student'
        },
        to: {
          id: 'admin',
          name: 'Professeur',
          email: 'admin@chronocarto.fr',
          type: 'admin'
        },
        subject: 'Question sur le cours de la Révolution française',
        content: 'Bonjour Professeur,\n\nJ\'ai une question concernant le cours sur la Révolution française. Pourriez-vous m\'expliquer plus en détail les causes économiques de la révolution ?\n\nMerci d\'avance pour votre réponse.\n\nCordialement,\nMarie',
        timestamp: '2024-12-20T10:30:00',
        isRead: false,
        isStarred: true,
        isArchived: false,
        priority: 'normal',
        category: 'academic'
      },
      {
        id: '2',
        from: {
          id: '2',
          name: 'Jean Dubois',
          email: 'parent.dubois@email.com',
          type: 'parent'
        },
        to: {
          id: 'admin',
          name: 'Professeur',
          email: 'admin@chronocarto.fr',
          type: 'admin'
        },
        subject: 'Suivi des résultats de Marie',
        content: 'Bonjour,\n\nJe suis le père de Marie Dubois. Je souhaiterais avoir un point sur ses résultats récents et ses progrès en histoire-géographie.\n\nPourriez-vous me donner un rendez-vous pour en discuter ?\n\nCordialement,\nJean Dubois',
        timestamp: '2024-12-19T16:45:00',
        isRead: true,
        isStarred: false,
        isArchived: false,
        priority: 'high',
        category: 'administrative'
      },
      {
        id: '3',
        from: {
          id: '3',
          name: 'Pierre Martin',
          email: 'pierre.martin@email.com',
          type: 'student'
        },
        to: {
          id: 'admin',
          name: 'Professeur',
          email: 'admin@chronocarto.fr',
          type: 'admin'
        },
        subject: 'Problème technique avec la plateforme',
        content: 'Bonjour,\n\nJe rencontre des difficultés pour accéder aux quiz en ligne. La page se charge mais les questions n\'apparaissent pas.\n\nPouvez-vous m\'aider à résoudre ce problème ?\n\nMerci,\nPierre',
        timestamp: '2024-12-19T14:20:00',
        isRead: true,
        isStarred: false,
        isArchived: false,
        priority: 'urgent',
        category: 'technical',
        attachments: [
          {
            id: '1',
            name: 'screenshot_error.png',
            size: '245 KB',
            type: 'image'
          }
        ]
      },
      {
        id: '4',
        from: {
          id: '4',
          name: 'Sophie Laurent',
          email: 'sophie.laurent@email.com',
          type: 'student'
        },
        to: {
          id: 'admin',
          name: 'Professeur',
          email: 'admin@chronocarto.fr',
          type: 'admin'
        },
        subject: 'Demande de cours supplémentaires',
        content: 'Bonjour Professeur,\n\nJe trouve vos cours très intéressants et je souhaiterais savoir s\'il serait possible d\'avoir des cours supplémentaires sur la géopolitique contemporaine.\n\nMerci pour votre excellent travail !\n\nSophie',
        timestamp: '2024-12-18T11:15:00',
        isRead: true,
        isStarred: true,
        isArchived: false,
        priority: 'low',
        category: 'general'
      }
    ];

    setMessages(mockMessages);

    // Générer les conversations
    const conversationsMap = new Map<string, Conversation>();
    mockMessages.forEach(message => {
      const participantKey = message.from.type === 'admin' ? message.to.id : message.from.id;
      const participant = message.from.type === 'admin' ? message.to : message.from;
      
      if (!conversationsMap.has(participantKey)) {
        conversationsMap.set(participantKey, {
          id: participantKey,
          participants: [
            participant,
            { id: 'admin', name: 'Professeur', type: 'admin' }
          ],
          lastMessage: message,
          unreadCount: message.isRead ? 0 : 1,
          isArchived: false
        });
      } else {
        const conv = conversationsMap.get(participantKey)!;
        if (new Date(message.timestamp) > new Date(conv.lastMessage.timestamp)) {
          conv.lastMessage = message;
        }
        if (!message.isRead) {
          conv.unreadCount++;
        }
      }
    });

    setConversations(Array.from(conversationsMap.values()));
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const markAsRead = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
    
    // Mettre à jour les conversations
    setConversations(prev => prev.map(conv => {
      if (conv.lastMessage.id === messageId) {
        return {
          ...conv,
          lastMessage: { ...conv.lastMessage, isRead: true },
          unreadCount: Math.max(0, conv.unreadCount - 1)
        };
      }
      return conv;
    }));
  };

  const markAsUnread = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: false } : msg
    ));
  };

  const toggleStar = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
    showNotification('success', 'Message mis à jour');
  };

  const archiveMessage = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: true } : msg
    ));
    showNotification('success', 'Message archivé');
  };

  const deleteMessage = async (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    showNotification('success', 'Message supprimé');
  };

  const sendMessage = async (messageData: Partial<Message>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage: Message = {
        ...messageData,
        id: Date.now().toString(),
        from: {
          id: 'admin',
          name: 'Professeur',
          email: 'admin@chronocarto.fr',
          type: 'admin'
        },
        timestamp: new Date().toISOString(),
        isRead: true,
        isStarred: false,
        isArchived: false,
        priority: messageData.priority || 'normal',
        category: messageData.category || 'general'
      } as Message;
      
      setMessages(prev => [newMessage, ...prev]);
      showNotification('success', 'Message envoyé avec succès');
      setShowComposeModal(false);
      setShowReplyModal(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  const bulkAction = async (action: 'read' | 'unread' | 'star' | 'archive' | 'delete') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages(prev => prev.map(msg => {
        if (selectedMessages.includes(msg.id)) {
          switch (action) {
            case 'read':
              return { ...msg, isRead: true };
            case 'unread':
              return { ...msg, isRead: false };
            case 'star':
              return { ...msg, isStarred: !msg.isStarred };
            case 'archive':
              return { ...msg, isArchived: true };
            default:
              return msg;
          }
        }
        return msg;
      }));
      
      if (action === 'delete') {
        setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
      }
      
      setSelectedMessages([]);
      showNotification('success', `Action "${action}" appliquée à ${selectedMessages.length} message(s)`);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'action groupée');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    // Filtrage par onglet
    switch (activeTab) {
      case 'inbox':
        if (message.from.type === 'admin' || message.isArchived) return false;
        break;
      case 'sent':
        if (message.from.type !== 'admin') return false;
        break;
      case 'archived':
        if (!message.isArchived) return false;
        break;
      case 'starred':
        if (!message.isStarred) return false;
        break;
    }

    // Filtrage par recherche
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrage par catégorie
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;

    // Filtrage par priorité
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;

    // Filtrage par statut
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'read' && message.isRead) ||
                         (filterStatus === 'unread' && !message.isRead);

    // Filtrage par expéditeur
    const matchesSender = filterSender === 'all' || message.from.type === filterSender;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesSender;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-100';
      case 'high': return 'text-orange-500 bg-orange-100';
      case 'normal': return 'text-blue-500 bg-blue-100';
      case 'low': return 'text-gray-500 bg-gray-100';
      default: return 'text-blue-500 bg-blue-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return BookOpen;
      case 'technical': return Settings;
      case 'administrative': return Shield;
      case 'general': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getSenderIcon = (type: string) => {
    switch (type) {
      case 'student': return User;
      case 'parent': return Heart;
      case 'admin': return Shield;
      default: return User;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 jours
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead && msg.from.type !== 'admin').length;
  const starredCount = messages.filter(msg => msg.isStarred).length;
  const archivedCount = messages.filter(msg => msg.isArchived).length;

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-xl border ${
          notification.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30 text-green-100' 
            : 'bg-red-500/20 border-red-500/30 text-red-100'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-300 mr-4" />
              Messagerie
            </h1>
            <p className="text-blue-200 mt-2">Gérez vos communications avec les étudiants et parents</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-blue-300">
              <span>Total: {messages.length} messages</span>
              <span>Non lus: {unreadCount}</span>
              <span>Favoris: {starredCount}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button
              onClick={() => setShowComposeModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Onglets et mode d'affichage */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all mr-2 ${
                activeTab === 'inbox'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Boîte de réception</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all mr-2 ${
                activeTab === 'sent'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Envoyés</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('starred')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all mr-2 ${
                activeTab === 'starred'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Favoris</span>
                {starredCount > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {starredCount}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'archived'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Archive className="w-4 h-4" />
                <span>Archivés</span>
                {archivedCount > 0 && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    {archivedCount}
                  </span>
                )}
              </div>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('conversation')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'conversation' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les messages..."
              className="pl-10 pr-4 py-3 w-full border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="all">Toutes les catégories</option>
              <option value="academic">Académique</option>
              <option value="technical">Technique</option>
              <option value="administrative">Administratif</option>
              <option value="general">Général</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="normal">Normale</option>
              <option value="low">Faible</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="read">Lus</option>
              <option value="unread">Non lus</option>
            </select>
            <select
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="all">Tous les expéditeurs</option>
              <option value="student">Étudiants</option>
              <option value="parent">Parents</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions groupées */}
      {selectedMessages.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">
              {selectedMessages.length} message(s) sélectionné(s)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => bulkAction('read')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                disabled={isLoading}
              >
                Marquer comme lu
              </button>
              <button
                onClick={() => bulkAction('unread')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                disabled={isLoading}
              >
                Marquer comme non lu
              </button>
              <button
                onClick={() => bulkAction('star')}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all text-sm"
                disabled={isLoading}
              >
                Ajouter aux favoris
              </button>
              <button
                onClick={() => bulkAction('archive')}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm"
                disabled={isLoading}
              >
                Archiver
              </button>
              <button
                onClick={() => bulkAction('delete')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                disabled={isLoading}
              >
                Supprimer
              </button>
              <button
                onClick={() => setSelectedMessages([])}
                className="px-3 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des messages */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MessageSquare className="w-5 h-5 text-blue-300 mr-2" />
            {activeTab === 'inbox' && 'Boîte de réception'}
            {activeTab === 'sent' && 'Messages envoyés'}
            {activeTab === 'starred' && 'Messages favoris'}
            {activeTab === 'archived' && 'Messages archivés'}
            ({filteredMessages.length})
          </h2>
        </div>

        <div className="divide-y divide-white/10">
          {filteredMessages.map((message) => {
            const CategoryIcon = getCategoryIcon(message.category);
            const SenderIcon = getSenderIcon(message.from.type);
            
            return (
              <div
                key={message.id}
                className={`p-6 hover:bg-white/5 transition-all cursor-pointer ${
                  !message.isRead ? 'bg-blue-500/5 border-l-4 border-l-blue-500' : ''
                } ${selectedMessages.includes(message.id) ? 'bg-blue-500/10' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.isRead) {
                    markAsRead(message.id);
                  }
                }}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox de sélection */}
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        setSelectedMessages(prev => [...prev, message.id]);
                      } else {
                        setSelectedMessages(prev => prev.filter(id => id !== message.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                  />

                  {/* Avatar de l'expéditeur */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SenderIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Contenu du message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-semibold ${!message.isRead ? 'text-white' : 'text-blue-200'}`}>
                          {message.from.name}
                        </h3>
                        <span className="text-xs text-blue-300">{message.from.email}</span>
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-4 h-4 text-blue-300" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-300">{formatTimestamp(message.timestamp)}</span>
                        {message.attachments && message.attachments.length > 0 && (
                          <Paperclip className="w-4 h-4 text-blue-300" />
                        )}
                        {message.isStarred && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        {!message.isRead && (
                          <Circle className="w-3 h-3 text-blue-500 fill-current" />
                        )}
                      </div>
                    </div>
                    
                    <h4 className={`font-medium mb-2 ${!message.isRead ? 'text-white' : 'text-blue-200'}`}>
                      {message.subject}
                    </h4>
                    
                    <p className="text-blue-300 text-sm line-clamp-2">
                      {message.content}
                    </p>

                    {/* Pièces jointes */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Paperclip className="w-4 h-4 text-blue-300" />
                        <span className="text-xs text-blue-300">
                          {message.attachments.length} pièce(s) jointe(s)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions rapides */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        message.isStarred 
                          ? 'text-yellow-400 hover:bg-yellow-500/20' 
                          : 'text-blue-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${message.isStarred ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        message.isRead ? markAsUnread(message.id) : markAsRead(message.id);
                      }}
                      className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      {message.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveMessage(message.id);
                      }}
                      className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-200 text-lg">Aucun message trouvé</p>
            <p className="text-blue-300 text-sm">Essayez de modifier vos filtres ou créez un nouveau message</p>
          </div>
        )}
      </div>

      {/* Modal de composition */}
      {showComposeModal && (
        <ComposeMessageModal
          onSend={sendMessage}
          onClose={() => setShowComposeModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Modal de réponse */}
      {showReplyModal && selectedMessage && (
        <ReplyMessageModal
          originalMessage={selectedMessage}
          onSend={sendMessage}
          onClose={() => setShowReplyModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Modal de détail du message */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={() => {
            setShowReplyModal(true);
            setSelectedMessage(null);
          }}
          onStar={() => toggleStar(selectedMessage.id)}
          onArchive={() => archiveMessage(selectedMessage.id)}
          onDelete={() => deleteMessage(selectedMessage.id)}
        />
      )}
    </div>
  );
};

// Composants modaux
interface ComposeMessageModalProps {
  onSend: (message: Partial<Message>) => void;
  onClose: () => void;
  isLoading: boolean;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ onSend, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    to: { id: '', name: '', email: '', type: 'student' as const },
    subject: '',
    content: '',
    priority: 'normal' as const,
    category: 'general' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Plus className="w-6 h-6 text-blue-300 mr-3" />
            Nouveau message
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Destinataire *</label>
              <input
                type="email"
                value={formData.to.email}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  to: { ...prev.to, email: e.target.value }
                }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                placeholder="email@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Priorité</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                <option value="general">Général</option>
                <option value="academic">Académique</option>
                <option value="technical">Technique</option>
                <option value="administrative">Administratif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Sujet *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              placeholder="Sujet du message"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Message *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={8}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              placeholder="Votre message..."
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              disabled={isLoading || !formData.subject || !formData.content}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Envoyer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReplyMessageModalProps {
  originalMessage: Message;
  onSend: (message: Partial<Message>) => void;
  onClose: () => void;
  isLoading: boolean;
}

const ReplyMessageModal: React.FC<ReplyMessageModalProps> = ({ originalMessage, onSend, onClose, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      to: originalMessage.from,
      subject: `Re: ${originalMessage.subject}`,
      content,
      priority: originalMessage.priority,
      category: originalMessage.category,
      parentMessageId: originalMessage.id
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Reply className="w-6 h-6 text-blue-300 mr-3" />
            Répondre à {originalMessage.from.name}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Message original */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Message original</span>
              <span className="text-xs text-blue-300">{formatTimestamp(originalMessage.timestamp)}</span>
            </div>
            <h4 className="font-medium text-blue-200 mb-2">{originalMessage.subject}</h4>
            <p className="text-blue-300 text-sm">{originalMessage.content}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Votre réponse *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                placeholder="Votre réponse..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                disabled={isLoading || !content}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Reply className="w-5 h-5" />
                    <span>Répondre</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface MessageDetailModalProps {
  message: Message;
  onClose: () => void;
  onReply: () => void;
  onStar: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({ 
  message, 
  onClose, 
  onReply, 
  onStar, 
  onArchive, 
  onDelete 
}) => {
  const CategoryIcon = getCategoryIcon(message.category);
  const SenderIcon = getSenderIcon(message.from.type);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MessageSquare className="w-6 h-6 text-blue-300 mr-3" />
            Détail du message
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* En-tête du message */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <SenderIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{message.from.name}</h3>
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="w-5 h-5 text-blue-300" />
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </div>
              </div>
              <p className="text-blue-200 mb-2">{message.from.email}</p>
              <p className="text-blue-300 text-sm">{formatTimestamp(message.timestamp)}</p>
            </div>
          </div>

          {/* Sujet */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">{message.subject}</h4>
          </div>

          {/* Contenu */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="whitespace-pre-wrap text-blue-200 leading-relaxed">
              {message.content}
            </div>
          </div>

          {/* Pièces jointes */}
          {message.attachments && message.attachments.length > 0 && (
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Pièces jointes</h5>
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="w-5 h-5 text-blue-300" />
                      <div>
                        <p className="text-white font-medium">{attachment.name}</p>
                        <p className="text-blue-300 text-sm">{attachment.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <button
                onClick={onReply}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                <Reply className="w-4 h-4" />
                <span>Répondre</span>
              </button>
              <button
                onClick={onStar}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  message.isStarred 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Star className={`w-4 h-4 ${message.isStarred ? 'fill-current' : ''}`} />
                <span>{message.isStarred ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onArchive}
                className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Archiver"
              >
                <Archive className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonctions utilitaires
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 jours
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'text-red-500 bg-red-100';
    case 'high': return 'text-orange-500 bg-orange-100';
    case 'normal': return 'text-blue-500 bg-blue-100';
    case 'low': return 'text-gray-500 bg-gray-100';
    default: return 'text-blue-500 bg-blue-100';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'academic': return BookOpen;
    case 'technical': return Settings;
    case 'administrative': return Shield;
    case 'general': return MessageSquare;
    default: return MessageSquare;
  }
};

const getSenderIcon = (type: string) => {
  switch (type) {
    case 'student': return User;
    case 'parent': return Heart;
    case 'admin': return Shield;
    default: return User;
  }
};

export default MessagesManagementTab;

