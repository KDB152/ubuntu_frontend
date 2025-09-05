'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Crown,
  Star,
  Zap,
  Target,
  Flame,
  Sparkles,
  Heart,
  Shield,
  Sword,
  Flag,
  Rocket,
  Mountain,
  Compass,
  Map,
  Globe,
  BookOpen,
  Brain,
  History,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  Lock,
  Eye,
  Share2,
  Download,
  Filter,
  Search,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  Plus,
  Info,
  Lightbulb,
  Gift,
  Gem,
  Diamond,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Pentagon,
  Octagon,
  Star as StarIcon,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Waves,
  TreePine,
  Flower,
  Leaf,
  Snowflake,
  Rainbow,
  Umbrella,
  Anchor,
  Plane,
  Car,
  Train,
  Ship,
  Bike,
  Camera,
  Music,
  Palette,
  Brush,
  Scissors,
  Hammer,
  Wrench,
  Key,
  Lock as LockIcon,
  Unlock,
  Home,
  Building,
  Castle,
  Church,
  Factory,
  Hospital,
  School,
  Store,
  Bank,
  Library,
  Museum,
  Theater,
  Stadium,
  Park,
  Bridge,
  Tower,
  Lighthouse,
  Windmill
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'progress' | 'social' | 'special' | 'seasonal';
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirements: string[];
  relatedSubject?: string;
  nextLevel?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  category: string;
  level: number;
  maxLevel: number;
}

interface Reward {
  id: string;
  type: 'avatar' | 'theme' | 'title' | 'feature' | 'cosmetic';
  name: string;
  description: string;
  cost: number;
  currency: 'xp' | 'coins' | 'gems';
  isUnlocked: boolean;
  isPurchased: boolean;
  rarity: string;
  preview?: string;
}

const AchievementsTab: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'rewards'>('achievements');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [playerStats, setPlayerStats] = useState({
    totalXP: 2450,
    coins: 150,
    gems: 25,
    level: 12,
    unlockedAchievements: 0,
    totalAchievements: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Données simulées des succès
    const mockAchievements: Achievement[] = [
      {
        id: 'first_quiz',
        title: 'Premier pas',
        description: 'Terminez votre premier quiz',
        category: 'academic',
        type: 'bronze',
        icon: 'play',
        isUnlocked: true,
        unlockedAt: '2025-12-15T10:00:00',
        rarity: 'common',
        xpReward: 50,
        requirements: ['Terminer 1 quiz'],
        relatedSubject: 'general'
      },
      {
        id: 'perfect_score',
        title: 'Perfection',
        description: 'Obtenez un score parfait de 100%',
        category: 'academic',
        type: 'gold',
        icon: 'star',
        isUnlocked: true,
        unlockedAt: '2025-12-18T14:30:00',
        rarity: 'rare',
        xpReward: 200,
        requirements: ['Obtenir 100% à un quiz'],
        relatedSubject: 'geography'
      },
      {
        id: 'quiz_master',
        title: 'Maître des Quiz',
        description: 'Terminez 10 quiz avec succès',
        category: 'progress',
        type: 'silver',
        icon: 'trophy',
        isUnlocked: true,
        unlockedAt: '2025-12-20T16:45:00',
        progress: {
          current: 14,
          target: 10,
          unit: 'quiz'
        },
        rarity: 'uncommon',
        xpReward: 150,
        requirements: ['Terminer 10 quiz'],
        nextLevel: 'quiz_legend'
      },
      {
        id: 'quiz_legend',
        title: 'Légende des Quiz',
        description: 'Terminez 50 quiz avec succès',
        category: 'progress',
        type: 'platinum',
        icon: 'crown',
        isUnlocked: false,
        progress: {
          current: 14,
          target: 50,
          unit: 'quiz'
        },
        rarity: 'epic',
        xpReward: 500,
        requirements: ['Terminer 50 quiz'],
        relatedSubject: 'general'
      },
      {
        id: 'history_expert',
        title: 'Expert en Histoire',
        description: 'Obtenez une moyenne de 85% en Histoire',
        category: 'academic',
        type: 'gold',
        icon: 'history',
        isUnlocked: true,
        unlockedAt: '2025-12-19T12:20:00',
        rarity: 'rare',
        xpReward: 250,
        requirements: ['Moyenne de 85% en Histoire sur 5 quiz'],
        relatedSubject: 'history'
      },
      {
        id: 'geography_master',
        title: 'Maître Géographe',
        description: 'Obtenez une moyenne de 90% en Géographie',
        category: 'academic',
        type: 'platinum',
        icon: 'globe',
        isUnlocked: true,
        unlockedAt: '2025-12-20T09:15:00',
        rarity: 'epic',
        xpReward: 300,
        requirements: ['Moyenne de 90% en Géographie sur 5 quiz'],
        relatedSubject: 'geography'
      },
      {
        id: 'speed_demon',
        title: 'Démon de la Vitesse',
        description: 'Terminez un quiz en moins de 5 minutes',
        category: 'special',
        type: 'silver',
        icon: 'zap',
        isUnlocked: false,
        progress: {
          current: 6,
          target: 5,
          unit: 'minutes'
        },
        rarity: 'uncommon',
        xpReward: 175,
        requirements: ['Terminer un quiz en moins de 5 minutes']
      },
      {
        id: 'streak_master',
        title: 'Série Parfaite',
        description: 'Maintenez une série de 7 jours consécutifs',
        category: 'progress',
        type: 'gold',
        icon: 'flame',
        isUnlocked: true,
        unlockedAt: '2025-12-20T18:00:00',
        progress: {
          current: 7,
          target: 7,
          unit: 'jours'
        },
        rarity: 'rare',
        xpReward: 300,
        requirements: ['Série de 7 jours consécutifs']
      },
      {
        id: 'revolutionary',
        title: 'Révolutionnaire',
        description: 'Maîtrisez tous les quiz sur la Révolution française',
        category: 'academic',
        type: 'diamond',
        icon: 'flag',
        isUnlocked: true,
        unlockedAt: '2025-12-20T10:30:00',
        rarity: 'legendary',
        xpReward: 400,
        requirements: ['Terminer tous les quiz sur la Révolution française avec 80%+'],
        relatedSubject: 'history'
      },
      {
        id: 'explorer',
        title: 'Grand Explorateur',
        description: 'Découvrez toutes les capitales européennes',
        category: 'academic',
        type: 'gold',
        icon: 'compass',
        isUnlocked: false,
        progress: {
          current: 15,
          target: 27,
          unit: 'capitales'
        },
        rarity: 'rare',
        xpReward: 275,
        requirements: ['Identifier correctement 27 capitales européennes'],
        relatedSubject: 'geography'
      }
    ];

    const mockBadges: Badge[] = [
      {
        id: 'badge_1',
        name: 'Révolutionnaire',
        description: 'Expert de la Révolution française',
        icon: 'flag',
        color: 'from-red-500 to-blue-600',
        earnedAt: '2025-12-20T10:30:00',
        category: 'Histoire',
        level: 1,
        maxLevel: 3
      },
      {
        id: 'badge_2',
        name: 'Explorateur urbain',
        description: 'Connaisseur des grandes villes',
        icon: 'building',
        color: 'from-green-500 to-emerald-600',
        earnedAt: '2025-12-18T16:45:00',
        category: 'Géographie',
        level: 2,
        maxLevel: 3
      },
      {
        id: 'badge_3',
        name: 'Géographe',
        description: 'Maître des climats et reliefs',
        icon: 'globe',
        color: 'from-blue-500 to-cyan-600',
        earnedAt: '2025-12-19T14:15:00',
        category: 'Géographie',
        level: 1,
        maxLevel: 5
      },
      {
        id: 'badge_4',
        name: 'Historien en herbe',
        description: 'Passionné d\'histoire',
        icon: 'history',
        color: 'from-amber-500 to-orange-600',
        earnedAt: '2025-12-20T10:30:00',
        category: 'Histoire',
        level: 1,
        maxLevel: 4
      }
    ];

    const mockRewards: Reward[] = [
      {
        id: 'avatar_1',
        type: 'avatar',
        name: 'Avatar Napoléon',
        description: 'Avatar historique de l\'Empereur',
        cost: 500,
        currency: 'xp',
        isUnlocked: false,
        isPurchased: false,
        rarity: 'epic'
      },
      {
        id: 'theme_1',
        type: 'theme',
        name: 'Thème Renaissance',
        description: 'Interface aux couleurs de la Renaissance',
        cost: 300,
        currency: 'xp',
        isUnlocked: true,
        isPurchased: false,
        rarity: 'rare'
      },
      {
        id: 'title_1',
        type: 'title',
        name: 'Maître Cartographe',
        description: 'Titre prestigieux pour les experts en géographie',
        cost: 15,
        currency: 'gems',
        isUnlocked: false,
        isPurchased: false,
        rarity: 'legendary'
      }
    ];

    setAchievements(mockAchievements);
    setBadges(mockBadges);
    setRewards(mockRewards);

    // Calculer les statistiques
    const unlockedCount = mockAchievements.filter(a => a.isUnlocked).length;
    setPlayerStats(prev => ({
      ...prev,
      unlockedAchievements: unlockedCount,
      totalAchievements: mockAchievements.length,
      completionRate: Math.round((unlockedCount / mockAchievements.length) * 100)
    }));
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'from-amber-600 to-yellow-700';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-blue-400 to-indigo-600';
      case 'diamond': return 'from-purple-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      play: Trophy,
      star: Star,
      trophy: Trophy,
      crown: Crown,
      history: History,
      globe: Globe,
      zap: Zap,
      flame: Flame,
      flag: Flag,
      compass: Compass,
      building: Building,
      medal: Medal,
      award: Award,
      target: Target,
      rocket: Rocket,
      mountain: Mountain,
      map: Map,
      book: BookOpen,
      brain: Brain,
      users: Users,
      clock: Clock,
      calendar: Calendar,
      trending: TrendingUp,
      check: CheckCircle,
      shield: Shield,
      sword: Sword,
      sparkles: Sparkles,
      heart: Heart,
      gem: Diamond,
      gift: Gift
    };
    return icons[iconName] || Trophy;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesType = selectedType === 'all' || achievement.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const renderAchievementCard = (achievement: Achievement) => {
    const IconComponent = getIconComponent(achievement.icon);
    const progress = achievement.progress;
    const progressPercentage = progress ? Math.min((progress.current / progress.target) * 100, 100) : 100;

    return (
      <div
        key={achievement.id}
        onClick={() => setSelectedAchievement(achievement)}
        className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 cursor-pointer transition-all hover:scale-105 hover:bg-white/15 ${
          !achievement.isUnlocked ? 'opacity-75' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(achievement.type)} rounded-xl flex items-center justify-center ${
            !achievement.isUnlocked ? 'grayscale' : ''
          }`}>
            {achievement.isUnlocked ? (
              <IconComponent className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="text-right">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRarityColor(achievement.rarity)} bg-current bg-opacity-20`}>
              {achievement.rarity}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="mb-4">
          <h3 className={`font-bold text-lg mb-2 ${achievement.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.title}
          </h3>
          <p className={`text-sm ${achievement.isUnlocked ? 'text-blue-200' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
        </div>

        {/* Progression */}
        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Progression</span>
              <span className="text-white text-sm font-semibold">
                {progress.current}/{progress.target} {progress.unit}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getTypeColor(achievement.type)} h-2 rounded-full transition-all`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">{achievement.xpReward} XP</span>
          </div>
          {achievement.isUnlocked && achievement.unlockedAt && (
            <span className="text-green-400 text-xs">
              {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderBadgeCard = (badge: Badge) => {
    const IconComponent = getIconComponent(badge.icon);
    
    return (
      <div key={badge.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="text-center">
          <div className={`w-20 h-20 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-white font-bold text-lg mb-2">{badge.name}</h3>
          <p className="text-blue-200 text-sm mb-4">{badge.description}</p>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="text-blue-300">{badge.category}</span>
            <span className="text-yellow-400">Niveau {badge.level}/{badge.maxLevel}</span>
          </div>
          
          <div className="mt-4 text-green-400 text-xs">
            Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    );
  };

  const renderRewardCard = (reward: Reward) => {
    const canPurchase = (() => {
      switch (reward.currency) {
        case 'xp': return playerStats.totalXP >= reward.cost;
        case 'coins': return playerStats.coins >= reward.cost;
        case 'gems': return playerStats.gems >= reward.cost;
        default: return false;
      }
    })();

    return (
      <div key={reward.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-white font-bold text-lg mb-2">{reward.name}</h3>
          <p className="text-blue-200 text-sm mb-4">{reward.description}</p>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-yellow-400 font-bold">{reward.cost}</span>
            <span className="text-blue-300 text-sm">
              {reward.currency === 'xp' ? 'XP' : reward.currency === 'coins' ? 'Pièces' : 'Gemmes'}
            </span>
          </div>
          
          {reward.isPurchased ? (
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Possédé</span>
            </div>
          ) : reward.isUnlocked ? (
            <button
              disabled={!canPurchase}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                canPurchase
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
            >
              Acheter
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Verrouillé</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Succès & Récompenses</h1>
            <p className="text-blue-200">Débloquez des succès et gagnez des récompenses</p>
          </div>
          <div className="text-right">
            <div className="text-white text-2xl font-bold">{playerStats.completionRate}%</div>
            <div className="text-blue-300 text-sm">Complété</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{playerStats.level}</div>
            <div className="text-blue-300 text-sm">Niveau</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{playerStats.totalXP}</div>
            <div className="text-blue-300 text-sm">XP Total</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{playerStats.unlockedAchievements}</div>
            <div className="text-blue-300 text-sm">Succès</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{badges.length}</div>
            <div className="text-blue-300 text-sm">Badges</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{playerStats.gems}</div>
            <div className="text-blue-300 text-sm">Gemmes</div>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="flex">
          {[
            { id: 'achievements', label: 'Succès', icon: Trophy },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'rewards', label: 'Récompenses', icon: Gift }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-400'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtres pour les succès */}
      {activeTab === 'achievements' && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Recherche */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un succès..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Toutes catégories</option>
                <option value="academic">Académique</option>
                <option value="progress">Progression</option>
                <option value="social">Social</option>
                <option value="special">Spécial</option>
                <option value="seasonal">Saisonnier</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Tous types</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Argent</option>
                <option value="gold">Or</option>
                <option value="platinum">Platine</option>
                <option value="diamond">Diamant</option>
              </select>

              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu des onglets */}
      <div>
        {activeTab === 'achievements' && (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredAchievements.map(achievement => renderAchievementCard(achievement))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {badges.map(badge => renderBadgeCard(badge))}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rewards.map(reward => renderRewardCard(reward))}
          </div>
        )}
      </div>

      {/* Modal de détail du succès */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Détails du succès</h2>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Icône et titre */}
              <div className="text-center">
                <div className={`w-24 h-24 bg-gradient-to-br ${getTypeColor(selectedAchievement.type)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {React.createElement(getIconComponent(selectedAchievement.icon), { className: "w-12 h-12 text-white" })}
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">{selectedAchievement.title}</h3>
                <p className="text-blue-200 text-lg">{selectedAchievement.description}</p>
              </div>

              {/* Informations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white text-xl font-bold">{selectedAchievement.type}</div>
                  <div className="text-blue-300 text-sm">Type</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className={`text-xl font-bold ${getRarityColor(selectedAchievement.rarity)}`}>
                    {selectedAchievement.rarity}
                  </div>
                  <div className="text-blue-300 text-sm">Rareté</div>
                </div>
              </div>

              {/* Progression */}
              {selectedAchievement.progress && (
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Progression</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-300">
                      {selectedAchievement.progress.current}/{selectedAchievement.progress.target} {selectedAchievement.progress.unit}
                    </span>
                    <span className="text-white font-semibold">
                      {Math.round((selectedAchievement.progress.current / selectedAchievement.progress.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${getTypeColor(selectedAchievement.type)} h-3 rounded-full transition-all`}
                      style={{ width: `${Math.min((selectedAchievement.progress.current / selectedAchievement.progress.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Prérequis */}
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">Prérequis</h4>
                <ul className="space-y-2">
                  {selectedAchievement.requirements.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-blue-200">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Récompense */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-semibold">Récompense</div>
                    <div className="text-yellow-400 font-bold">{selectedAchievement.xpReward} XP</div>
                  </div>
                </div>
              </div>

              {/* Date de déblocage */}
              {selectedAchievement.isUnlocked && selectedAchievement.unlockedAt && (
                <div className="text-center">
                  <div className="text-green-400 font-semibold">
                    Débloqué le {new Date(selectedAchievement.unlockedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsTab;

