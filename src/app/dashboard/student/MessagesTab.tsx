'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Paperclip,
  Image,
  File,
  Download,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Smile,
  AtSign,
  Hash,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Quote,
  Code,
  Mic,
  Video,
  Phone,
  Calendar,
  Flag,
  Bell,
  BellOff,
  Settings,
  MoreHorizontal,
  Edit,
  Copy,
  Share2,
  Bookmark,
  Tag,
  Folder,
  FolderOpen,
  Mail,
  FileText,
  MailOpen,
  Inbox,
  ChevronLeft
} from 'lucide-react';

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    role: 'teacher' | 'parent' | 'admin' | 'student';
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
    role: 'teacher' | 'parent' | 'admin' | 'student';
  }[];
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'academic' | 'administrative' | 'personal';
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  threadId?: string;
  replyTo?: string;
  tags?: string[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  title?: string;
}

const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'normal' as const,
    category: 'general' as const
  });
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'starred' | 'archived'>('inbox');

  useEffect(() => {
    // Données simulées des messages
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        from: {
          id: 'teacher-1',
          name: 'Mme Martin',
          role: 'teacher',
          avatar: '/avatars/teacher-1.jpg'
        },
        to: [{
          id: 'student-1',
          name: 'Marie Dubois',
          role: 'student'
        }],
        subject: 'Félicitations pour votre excellent travail',
        content: 'Bonjour Marie,\n\nJe tenais à vous féliciter pour votre excellent résultat au quiz sur la Révolution française. Votre score de 90% démontre une très bonne maîtrise du sujet.\n\nContinuez ainsi !\n\nCordialement,\nMme Martin',
        timestamp: '2024-12-20T14:30:00',
        isRead: false,
        isStarred: true,
        isArchived: false,
        priority: 'normal',
        category: 'academic',
        threadId: 'thread-1'
      },
      {
        id: 'msg-2',
        from: {
          id: 'parent-1',
          name: 'M. Dubois',
          role: 'parent'
        },
        to: [{
          id: 'student-1',
          name: 'Marie Dubois',
          role: 'student'
        }],
        subject: 'Planning de révisions',
        content: 'Salut Marie,\n\nJ\'ai vu tes bons résultats récents, c\'est formidable ! Peux-tu me dire quand tu prévois de réviser pour le prochain contrôle d\'histoire ?\n\nBisous,\nPapa',
        timestamp: '2024-12-20T12:15:00',
        isRead: true,
        isStarred: false,
        isArchived: false,
        priority: 'normal',
        category: 'personal'
      },
      {
        id: 'msg-3',
        from: {
          id: 'admin-1',
          name: 'Administration',
          role: 'admin'
        },
        to: [{
          id: 'student-1',
          name: 'Marie Dubois',
          role: 'student'
        }],
        subject: 'Nouveau quiz disponible',
        content: 'Bonjour,\n\nUn nouveau quiz sur l\'Empire de Napoléon est maintenant disponible dans votre espace. N\'hésitez pas à le faire avant la date limite du 25 décembre.\n\nBonne chance !',
        timestamp: '2024-12-20T09:00:00',
        isRead: true,
        isStarred: false,
        isArchived: false,
        priority: 'normal',
        category: 'academic',
        tags: ['quiz', 'napoléon', 'histoire']
      }
    ];

    setMessages(mockMessages);

    // Créer les conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participants: [
          { id: 'teacher-1', name: 'Mme Martin', role: 'teacher' },
          { id: 'student-1', name: 'Marie Dubois', role: 'student' }
        ],
        lastMessage: mockMessages[0],
        unreadCount: 1,
        isGroup: false
      },
      {
        id: 'conv-2',
        participants: [
          { id: 'parent-1', name: 'M. Dubois', role: 'parent' },
          { id: 'student-1', name: 'Marie Dubois', role: 'student' }
        ],
        lastMessage: mockMessages[1],
        unreadCount: 0,
        isGroup: false
      }
    ];

    setConversations(mockConversations);
  }, []);

  const handleSendMessage = () => {
    if (!composeData.content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      from: {
        id: 'student-1',
        name: 'Marie Dubois',
        role: 'student'
      },
      to: [{
        id: composeData.to,
        name: 'Destinataire',
        role: 'teacher'
      }],
      subject: composeData.subject,
      content: composeData.content,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: composeData.priority,
      category: composeData.category
    };

    setMessages(prev => [newMessage, ...prev]);
    setComposeData({
      to: '',
      subject: '',
      content: '',
      priority: 'normal',
      category: 'general'
    });
    setShowCompose(false);
  };

  const toggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-blue-400';
      case 'parent': return 'text-green-400';
      case 'admin': return 'text-purple-400';
      case 'student': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return User;
      case 'parent': return Users;
      case 'admin': return Settings;
      case 'student': return User;
      default: return User;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'normal': return 'text-blue-400 bg-blue-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory;
    
    const matchesFolder = (() => {
      switch (activeFolder) {
        case 'inbox': return !message.isArchived;
        case 'starred': return message.isStarred;
        case 'archived': return message.isArchived;
        case 'sent': return message.from.id === 'student-1';
        case 'drafts': return false; // Pas de brouillons dans cette simulation
        default: return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesFolder;
  });

  const unreadCount = messages.filter(m => !m.isRead && !m.isArchived).length;

  return (
    <div className="h-full flex">
      {/* Sidebar gauche */}
      <div className="w-80 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Messages</h2>
            <button
              onClick={() => setShowCompose(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
        </div>

        {/* Dossiers */}
        <div className="p-4 border-b border-white/20">
          <div className="space-y-1">
            {[
              { id: 'inbox', label: 'Boîte de réception', icon: Inbox, count: unreadCount },
{ id: 'starred', label: 'Favoris', icon: Star, count: messages.filter(m => m.isStarred).length },
{ id: 'sent', label: 'Envoyés', icon: Send, count: 0 },
{ id: 'drafts', label: 'Brouillons', icon: FileText, count: 0 },
{ id: 'archived', label: 'Archivés', icon: Archive, count: messages.filter(m => m.isArchived).length }

            ].map((folder) => {
              const IconComponent = folder.icon;
              return (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                    activeFolder === folder.id
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtres */}
        <div className="p-4 border-b border-white/20">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">Toutes les catégories</option>
            <option value="academic">Académique</option>
            <option value="personal">Personnel</option>
            <option value="administrative">Administratif</option>
            <option value="general">Général</option>
          </select>
        </div>

        {/* Liste des messages */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map((message) => {
            const RoleIcon = getRoleIcon(message.from.role);
            return (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.isRead) markAsRead(message.id);
                }}
                className={`p-4 border-b border-white/10 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedMessage?.id === message.id ? 'bg-blue-500/20' : ''
                } ${!message.isRead ? 'bg-blue-500/10' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <RoleIcon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold text-sm ${getRoleColor(message.from.role)}`}>
                        {message.from.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        {message.isStarred && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                        {!message.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                    </div>
                    
                    <h3 className={`text-sm mb-1 truncate ${!message.isRead ? 'text-white font-semibold' : 'text-blue-200'}`}>
                      {message.subject}
                    </h3>
                    
                    <p className="text-blue-300 text-xs truncate mb-2">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 text-xs">
                        {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <>
            {/* Header du message */}
            <div className="p-6 border-b border-white/20 bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-white text-xl font-bold">{selectedMessage.subject}</h1>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStar(selectedMessage.id)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedMessage.isStarred
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${selectedMessage.isStarred ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Reply className="w-5 h-5" />
                  </button>
                  
                  <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Forward className="w-5 h-5" />
                  </button>
                  
                  <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Archive className="w-5 h-5" />
                  </button>
                  
                  <button className="p-2 rounded-lg bg-white/10 text-red-400 hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Infos de l'expéditeur */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">{selectedMessage.from.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(selectedMessage.from.role)} bg-current bg-opacity-20`}>
                      {selectedMessage.from.role}
                    </span>
                  </div>
                  <div className="text-blue-300 text-sm">
                    {new Date(selectedMessage.timestamp).toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contenu du message */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="prose prose-invert max-w-none">
                  {selectedMessage.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-blue-100 mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {/* Pièces jointes */}
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h4 className="text-white font-semibold mb-3">Pièces jointes</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                          <File className="w-5 h-5 text-blue-400" />
                          <div className="flex-1">
                            <div className="text-white text-sm">{attachment.name}</div>
                            <div className="text-blue-300 text-xs">{(attachment.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <button className="p-2 rounded-lg bg-white/10 text-blue-400 hover:text-white hover:bg-white/20 transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Zone de réponse */}
            <div className="p-6 border-t border-white/20 bg-white/5">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all">
                  <Reply className="w-4 h-4" />
                  <span>Répondre</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                  <Forward className="w-4 h-4" />
                  <span>Transférer</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Sélectionnez un message</h3>
              <p className="text-blue-200">Choisissez un message dans la liste pour le lire</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de composition */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Nouveau message</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Destinataire</label>
                <select
                  value={composeData.to}
                  onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Choisir un destinataire</option>
                  <option value="teacher-1">Mme Martin (Professeur)</option>
                  <option value="parent-1">M. Dubois (Parent)</option>
                  <option value="admin-1">Administration</option>
                </select>
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Sujet</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Sujet du message"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Priorité</label>
                  <select
                    value={composeData.priority}
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="low">Faible</option>
                    <option value="normal">Normale</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-blue-200 text-sm mb-2">Catégorie</label>
                  <select
                    value={composeData.category}
                    onChange={(e) => setComposeData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="general">Général</option>
                    <option value="academic">Académique</option>
                    <option value="personal">Personnel</option>
                    <option value="administrative">Administratif</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Message</label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tapez votre message ici..."
                  rows={8}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-white/10 text-blue-400 hover:text-white hover:bg-white/20 transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 text-blue-400 hover:text-white hover:bg-white/20 transition-all">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 text-blue-400 hover:text-white hover:bg-white/20 transition-all">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!composeData.to || !composeData.subject || !composeData.content.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer</span>
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

export default MessagesTab;

