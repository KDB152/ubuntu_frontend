'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Star,
  Trash2,
  Search,
  Filter,
  Plus,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Image,
  File,
  Download,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  User,
  Users,
  School,
  GraduationCap,
  Bell,
  BellOff,
  Flag,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
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
  Building,
  UserCheck,
  Shield,
  Lock,
  Key,
  Edit,
  Save,
  Cancel,
  Upload,
  Mic,
  Video,
  Camera,
  Smile,
  Heart,
  ThumbsUp,
  Share2,
  Copy,
  Cut,
  Paste,
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
  Zap,
  Sparkles,
  Award,
  Trophy,
  Medal,
  Crown,
  Target,
  Brain,
  BookOpen,
  History,
  Globe,
  Map,
  Compass,
  Mountain,
  Waves,
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
  teacher: string;
}

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  children: Child[];
}

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    role: 'parent' | 'teacher' | 'admin' | 'student';
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
    role: 'parent' | 'teacher' | 'admin' | 'student';
    avatar?: string;
  };
  subject: string;
  content: string;
  type: 'message' | 'notification' | 'announcement' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'replied' | 'archived';
  sentAt: string;
  readAt?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  parentMessageId?: string;
  childId?: string;
  isStarred: boolean;
  tags: string[];
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
  isArchived: boolean;
}

interface MessagesTabProps {
  selectedChild?: Child;
  parent?: Parent;
  searchQuery?: string;
}

const MessagesTab: React.FC<MessagesTabProps> = ({
  selectedChild,
  parent,
  searchQuery
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'inbox' | 'sent' | 'archived' | 'starred'>('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'teachers' | 'admin' | 'announcements'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'medium' as const,
    childId: ''
  });

  useEffect(() => {
    // Données simulées des messages
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        from: {
          id: 'teacher-1',
          name: 'Mme Martin',
          role: 'teacher',
          avatar: '/avatars/teacher-martin.jpg'
        },
        to: {
          id: 'parent-1',
          name: 'Marie Dubois',
          role: 'parent'
        },
        subject: 'Excellent résultat de Lucas en Histoire',
        content: 'Bonjour Mme Dubois,\n\nJe tenais à vous féliciter pour l\'excellent résultat de Lucas au quiz sur la Révolution française. Il a obtenu 92%, ce qui le place dans le top 3 de la classe.\n\nLucas montre une très bonne compréhension des événements historiques et une capacité d\'analyse remarquable. Je l\'encourage à continuer sur cette voie.\n\nN\'hésitez pas si vous avez des questions.\n\nCordialement,\nMme Martin',
        type: 'message',
        priority: 'medium',
        status: 'unread',
        sentAt: '2024-12-20T16:45:00',
        childId: 'child-1',
        isStarred: false,
        tags: ['résultats', 'félicitations']
      },
      {
        id: 'msg-2',
        from: {
          id: 'admin-1',
          name: 'Direction Collège Jean Moulin',
          role: 'admin',
          avatar: '/avatars/admin-school.jpg'
        },
        to: {
          id: 'parent-1',
          name: 'Marie Dubois',
          role: 'parent'
        },
        subject: 'Réunion parents-professeurs - 27 décembre',
        content: 'Chers parents,\n\nNous vous rappelons que la réunion parents-professeurs aura lieu le vendredi 27 décembre de 17h00 à 19h00.\n\nVous pourrez rencontrer les professeurs de vos enfants pour faire le point sur leur progression.\n\nMerci de confirmer votre présence.\n\nCordialement,\nLa Direction',
        type: 'announcement',
        priority: 'high',
        status: 'read',
        sentAt: '2024-12-19T14:30:00',
        readAt: '2024-12-19T18:20:00',
        isStarred: true,
        tags: ['réunion', 'important']
      },
      {
        id: 'msg-3',
        from: {
          id: 'teacher-2',
          name: 'M. Leroy',
          role: 'teacher',
          avatar: '/avatars/teacher-leroy.jpg'
        },
        to: {
          id: 'parent-1',
          name: 'Marie Dubois',
          role: 'parent'
        },
        subject: 'Performance exceptionnelle d\'Emma',
        content: 'Bonjour,\n\nJe souhaitais vous informer de la performance exceptionnelle d\'Emma cette semaine. Elle a obtenu 98% au quiz sur l\'Empire napoléonien et continue de montrer un niveau remarquable.\n\nEmma pourrait envisager de participer au concours d\'histoire régional. Qu\'en pensez-vous ?\n\nBien cordialement,\nM. Leroy',
        type: 'message',
        priority: 'medium',
        status: 'read',
        sentAt: '2024-12-18T11:15:00',
        readAt: '2024-12-18T19:45:00',
        childId: 'child-2',
        isStarred: false,
        tags: ['performance', 'concours']
      },
      {
        id: 'msg-4',
        from: {
          id: 'parent-1',
          name: 'Marie Dubois',
          role: 'parent'
        },
        to: {
          id: 'teacher-2',
          name: 'M. Leroy',
          role: 'teacher'
        },
        subject: 'Re: Performance exceptionnelle d\'Emma',
        content: 'Bonjour M. Leroy,\n\nMerci pour ce retour très positif sur Emma. Nous sommes très fiers de ses résultats.\n\nConcernant le concours d\'histoire, nous sommes tout à fait favorables à sa participation. Pourriez-vous nous donner plus de détails ?\n\nCordialement,\nMarie Dubois',
        type: 'message',
        priority: 'medium',
        status: 'read',
        sentAt: '2024-12-18T20:30:00',
        parentMessageId: 'msg-3',
        childId: 'child-2',
        isStarred: false,
        tags: ['réponse', 'concours']
      },
      {
        id: 'msg-5',
        from: {
          id: 'system-1',
          name: 'Système Chrono-Carto',
          role: 'admin'
        },
        to: {
          id: 'parent-1',
          name: 'Marie Dubois',
          role: 'parent'
        },
        subject: 'Rappel: Quiz non terminé - Lucas',
        content: 'Bonjour,\n\nNous vous informons que Lucas n\'a pas encore terminé le quiz "Les climats européens" qui était prévu pour aujourd\'hui.\n\nÉchéance: 22 décembre 2024\nTemps restant: 2 jours\n\nVous pouvez lui rappeler de se connecter pour terminer ce quiz.\n\nCordialement,\nL\'équipe Chrono-Carto',
        type: 'reminder',
        priority: 'urgent',
        status: 'unread',
        sentAt: '2024-12-20T09:00:00',
        childId: 'child-1',
        isStarred: false,
        tags: ['rappel', 'quiz', 'échéance']
      },
      {
        id: 'msg-6',
        from: {
          id: 'teacher-1',
          name: 'Mme Martin',
          role: 'teacher'
        },
        to: {
          id: 'parent-1',
          name: 'Marie Dubois',
          role: 'parent'
        },
        subject: 'Sortie pédagogique - Musée d\'Histoire',
        content: 'Chers parents,\n\nNous organisons une sortie pédagogique au Musée d\'Histoire le 8 janvier 2025.\n\nDétails:\n- Date: 8 janvier 2025\n- Horaires: 14h00 - 17h00\n- Lieu: Musée d\'Histoire de la ville\n- Coût: 12€ par élève\n\nMerci de retourner l\'autorisation signée avant le 2 janvier.\n\nCordialement,\nMme Martin',
        type: 'announcement',
        priority: 'medium',
        status: 'read',
        sentAt: '2024-12-17T16:20:00',
        readAt: '2024-12-17T18:30:00',
        attachments: [
          {
            id: 'att-1',
            name: 'Autorisation_sortie_musee.pdf',
            url: '/attachments/autorisation_sortie.pdf',
            type: 'application/pdf',
            size: 245760
          }
        ],
        isStarred: false,
        tags: ['sortie', 'autorisation', 'musée']
      }
    ];

    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participants: [
          {
            id: 'teacher-1',
            name: 'Mme Martin',
            role: 'teacher',
            avatar: '/avatars/teacher-martin.jpg'
          },
          {
            id: 'parent-1',
            name: 'Marie Dubois',
            role: 'parent'
          }
        ],
        lastMessage: mockMessages[0],
        unreadCount: 1,
        isArchived: false
      },
      {
        id: 'conv-2',
        participants: [
          {
            id: 'teacher-2',
            name: 'M. Leroy',
            role: 'teacher',
            avatar: '/avatars/teacher-leroy.jpg'
          },
          {
            id: 'parent-1',
            name: 'Marie Dubois',
            role: 'parent'
          }
        ],
        lastMessage: mockMessages[3],
        unreadCount: 0,
        isArchived: false
      }
    ];

    setMessages(mockMessages);
    setConversations(mockConversations);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'notification': return Bell;
      case 'announcement': return Flag;
      case 'reminder': return Clock;
      default: return Mail;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return GraduationCap;
      case 'admin': return School;
      case 'student': return User;
      case 'parent': return Users;
      default: return User;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getChildName = (childId?: string) => {
    if (!childId || !parent) return '';
    const child = parent.children.find(c => c.id === childId);
    return child ? child.firstName : '';
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
                         message.content.toLowerCase().includes(searchQuery?.toLowerCase() || '');
    
    const matchesView = (() => {
      switch (activeView) {
        case 'inbox': return message.to.id === parent?.id;
        case 'sent': return message.from.id === parent?.id;
        case 'archived': return message.status === 'archived';
        case 'starred': return message.isStarred;
        default: return true;
      }
    })();

    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'teachers' && message.from.role === 'teacher') ||
                         (selectedFilter === 'admin' && message.from.role === 'admin') ||
                         (selectedFilter === 'announcements' && message.type === 'announcement');

    const matchesPriority = selectedPriority === 'all' || message.priority === selectedPriority;

    return matchesSearch && matchesView && matchesFilter && matchesPriority;
  });

  const unreadCount = messages.filter(m => m.status === 'unread' && m.to.id === parent?.id).length;
  const starredCount = messages.filter(m => m.isStarred).length;

  const handleSendMessage = () => {
    if (!composeData.to || !composeData.subject || !composeData.content) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      from: {
        id: parent?.id || 'parent-1',
        name: `${parent?.firstName} ${parent?.lastName}` || 'Parent',
        role: 'parent'
      },
      to: {
        id: composeData.to,
        name: composeData.to,
        role: 'teacher'
      },
      subject: composeData.subject,
      content: composeData.content,
      type: 'message',
      priority: composeData.priority,
      status: 'read',
      sentAt: new Date().toISOString(),
      childId: composeData.childId || undefined,
      isStarred: false,
      tags: []
    };

    setMessages(prev => [newMessage, ...prev]);
    setComposeData({
      to: '',
      subject: '',
      content: '',
      priority: 'medium',
      childId: ''
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
      msg.id === messageId && msg.status === 'unread' 
        ? { ...msg, status: 'read', readAt: new Date().toISOString() }
        : msg
    ));
  };

  const renderMessageList = () => {
    return (
      <div className="space-y-2">
        {filteredMessages.map((message) => {
          const TypeIcon = getTypeIcon(message.type);
          const RoleIcon = getRoleIcon(message.from.role);
          const childName = getChildName(message.childId);
          
          return (
            <div
              key={message.id}
              onClick={() => {
                setSelectedMessage(message);
                if (message.status === 'unread') {
                  markAsRead(message.id);
                }
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/15 ${
                message.status === 'unread'
                  ? 'bg-blue-500/10 border-blue-400/30'
                  : 'bg-white/10 border-white/20'
              } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.from.avatar ? (
                    <img
                      src={message.from.avatar}
                      alt={message.from.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <RoleIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${message.status === 'unread' ? 'text-white' : 'text-blue-200'}`}>
                        {message.from.name}
                      </span>
                      <TypeIcon className="w-4 h-4 text-blue-400" />
                      {childName && (
                        <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">
                          {childName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 text-xs">{formatDate(message.sentAt)}</span>
                      {message.priority !== 'medium' && (
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className={`font-medium mb-1 truncate ${message.status === 'unread' ? 'text-white' : 'text-blue-200'}`}>
                    {message.subject}
                  </h3>
                  
                  <p className="text-blue-300 text-sm line-clamp-2">
                    {message.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Paperclip className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-xs">{message.attachments.length}</span>
                        </div>
                      )}
                      {message.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {message.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                      className={`p-1 rounded transition-all ${
                        message.isStarred 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${message.isStarred ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessageDetail = () => {
    if (!selectedMessage) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Sélectionnez un message</h3>
            <p className="text-blue-200">Choisissez un message dans la liste pour le lire</p>
          </div>
        </div>
      );
    }

    const RoleIcon = getRoleIcon(selectedMessage.from.role);
    const childName = getChildName(selectedMessage.childId);

    return (
      <div className="h-full flex flex-col">
        {/* En-tête du message */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedMessage(null)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleStar(selectedMessage.id)}
                className={`p-2 rounded-lg transition-all ${
                  selectedMessage.isStarred 
                    ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-500/20' 
                    : 'text-white/60 hover:text-white bg-white/10'
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
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            {selectedMessage.from.avatar ? (
              <img
                src={selectedMessage.from.avatar}
                alt={selectedMessage.from.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <RoleIcon className="w-6 h-6 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white text-xl font-bold">{selectedMessage.subject}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(selectedMessage.priority)}`}>
                  {selectedMessage.priority}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-blue-200 text-sm">
                <span>De: {selectedMessage.from.name}</span>
                <span>À: {selectedMessage.to.name}</span>
                <span>{new Date(selectedMessage.sentAt).toLocaleString('fr-FR')}</span>
                {childName && (
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Concernant: {childName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du message */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-blue-100 whitespace-pre-wrap leading-relaxed">
              {selectedMessage.content}
            </div>
          </div>
          
          {/* Pièces jointes */}
          {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
            <div className="mt-6 p-4 bg-white/10 rounded-xl">
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <Paperclip className="w-5 h-5" />
                <span>Pièces jointes ({selectedMessage.attachments.length})</span>
              </h4>
              
              <div className="space-y-2">
                {selectedMessage.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">{attachment.name}</div>
                        <div className="text-blue-300 text-sm">{formatFileSize(attachment.size)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-white/10 text-blue-400 hover:text-white hover:bg-white/20 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone de réponse rapide */}
        <div className="p-6 border-t border-white/20">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all">
              <Reply className="w-4 h-4" />
              <span>Répondre</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
              <Forward className="w-4 h-4" />
              <span>Transférer</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
              <Archive className="w-4 h-4" />
              <span>Archiver</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex">
      {/* Sidebar gauche */}
      <div className="w-80 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
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
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-white/20">
          <div className="space-y-1">
            {[
              { id: 'inbox', label: 'Boîte de réception', icon: Inbox, count: unreadCount },
              { id: 'sent', label: 'Messages envoyés', icon: Send, count: 0 },
              { id: 'starred', label: 'Messages favoris', icon: Star, count: starredCount },
              { id: 'archived', label: 'Messages archivés', icon: Archive, count: 0 }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    activeView === item.id
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtres */}
        <div className="p-4 border-b border-white/20">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-2 text-blue-200 hover:text-white transition-all"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtres</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-blue-200 text-xs mb-1">Expéditeur</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Tous</option>
                  <option value="teachers">Professeurs</option>
                  <option value="admin">Administration</option>
                  <option value="announcements">Annonces</option>
                </select>
              </div>
              
              <div>
                <label className="block text-blue-200 text-xs mb-1">Priorité</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">Toutes</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">Élevée</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Liste des messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderMessageList()}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 bg-white/5">
        {renderMessageDetail()}
      </div>

      {/* Modal de composition */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Nouveau message</h2>
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
                  <option value="">Sélectionner un destinataire</option>
                  <option value="teacher-1">Mme Martin (Professeure d'Histoire)</option>
                  <option value="teacher-2">M. Leroy (Professeur de Géographie)</option>
                  <option value="admin-1">Direction</option>
                </select>
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Concernant (optionnel)</label>
                <select
                  value={composeData.childId}
                  onChange={(e) => setComposeData(prev => ({ ...prev, childId: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Général</option>
                  {parent?.children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
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
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Message</label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Votre message..."
                  rows={8}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Priorité</label>
                <select
                  value={composeData.priority}
                  onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Image className="w-5 h-5" />
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
                    disabled={!composeData.to || !composeData.subject || !composeData.content}
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

