'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Award, 
  MessageSquare, 
  User, 
  TrendingUp,
  Clock,
  Play,
  Download,
  CheckCircle,
  Star,
  Calendar,
  Target,
  Globe,
  MapPin,
  Scroll,
  Video,
  FileText,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  BarChart3,
  Filter,
  Grid,
  List,
  ArrowLeft,
  Eye,
  Bookmark,
  Share2,
  MoreVertical,
  PlayCircle,
  PauseCircle,
  Volume2,
  Maximize,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const StudentCourses = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Données simulées des cours
  const courses = [
    {
      id: 1,
      title: 'La Révolution française (1789-1799)',
      subject: 'Histoire',
      description: 'Étude complète de la Révolution française, ses causes, son déroulement et ses conséquences.',
      duration: '2h 30min',
      progress: 85,
      completed: false,
      difficulty: 'Moyen',
      chapters: 8,
      completedChapters: 7,
      lastAccessed: '2025-01-16',
      instructor: 'M. Dubois',
      thumbnail: '/images/revolution-francaise.jpg',
      type: 'cours',
      rating: 4.8,
      students: 156,
      resources: [
        { type: 'video', title: 'Introduction à la Révolution', duration: '15 min', completed: true },
        { type: 'pdf', title: 'Chronologie détaillée', pages: 12, completed: true },
        { type: 'quiz', title: 'Quiz : Les causes', questions: 10, completed: true },
        { type: 'video', title: 'La prise de la Bastille', duration: '20 min', completed: true },
        { type: 'pdf', title: 'Documents historiques', pages: 8, completed: true },
        { type: 'video', title: 'La Terreur', duration: '25 min', completed: false },
        { type: 'quiz', title: 'Quiz : Révolution et société', questions: 15, completed: false },
        { type: 'pdf', title: 'Bilan et conséquences', pages: 10, completed: false }
      ]
    },
    {
      id: 2,
      title: 'Les climats européens',
      subject: 'Géographie',
      description: 'Analyse des différents climats européens et de leurs caractéristiques.',
      duration: '1h 45min',
      progress: 60,
      completed: false,
      difficulty: 'Facile',
      chapters: 5,
      completedChapters: 3,
      lastAccessed: '2025-01-15',
      instructor: 'Mme Martin',
      thumbnail: '/images/climats-europe.jpg',
      type: 'cours',
      rating: 4.6,
      students: 142,
      resources: [
        { type: 'video', title: 'Introduction aux climats', duration: '12 min', completed: true },
        { type: 'pdf', title: 'Cartes climatiques', pages: 6, completed: true },
        { type: 'video', title: 'Climat océanique', duration: '18 min', completed: true },
        { type: 'quiz', title: 'Quiz : Climats tempérés', questions: 8, completed: false },
        { type: 'video', title: 'Climat méditerranéen', duration: '15 min', completed: false }
      ]
    },
    {
      id: 3,
      title: 'La démocratie française',
      subject: 'EMC',
      description: 'Comprendre le fonctionnement de la démocratie en France.',
      duration: '1h 20min',
      progress: 40,
      completed: false,
      difficulty: 'Moyen',
      chapters: 4,
      completedChapters: 2,
      lastAccessed: '2025-01-14',
      instructor: 'M. Laurent',
      thumbnail: '/images/democratie-francaise.jpg',
      type: 'cours',
      rating: 4.7,
      students: 128,
      resources: [
        { type: 'video', title: 'Qu\'est-ce que la démocratie ?', duration: '10 min', completed: true },
        { type: 'pdf', title: 'La Constitution française', pages: 15, completed: true },
        { type: 'video', title: 'Les institutions', duration: '22 min', completed: false },
        { type: 'quiz', title: 'Quiz : Institutions républicaines', questions: 12, completed: false }
      ]
    },
    {
      id: 4,
      title: 'La Première Guerre mondiale',
      subject: 'Histoire',
      description: 'Étude de la Grande Guerre et de ses conséquences sur l\'Europe.',
      duration: '3h 15min',
      progress: 25,
      completed: false,
      difficulty: 'Difficile',
      chapters: 10,
      completedChapters: 3,
      lastAccessed: '2025-01-13',
      instructor: 'M. Dubois',
      thumbnail: '/images/premiere-guerre-mondiale.jpg',
      type: 'cours',
      rating: 4.9,
      students: 167,
      resources: [
        { type: 'video', title: 'Les causes du conflit', duration: '18 min', completed: true },
        { type: 'pdf', title: 'Chronologie 1914-1918', pages: 20, completed: true },
        { type: 'video', title: 'La guerre de tranchées', duration: '25 min', completed: true },
        { type: 'quiz', title: 'Quiz : Début de guerre', questions: 15, completed: false }
      ]
    },
    {
      id: 5,
      title: 'L\'Union européenne',
      subject: 'Géographie',
      description: 'Construction européenne et géographie de l\'UE.',
      duration: '2h 10min',
      progress: 0,
      completed: false,
      difficulty: 'Moyen',
      chapters: 6,
      completedChapters: 0,
      lastAccessed: null,
      instructor: 'Mme Martin',
      thumbnail: '/images/union-europeenne.jpg',
      type: 'cours',
      rating: 4.5,
      students: 134,
      resources: [
        { type: 'video', title: 'Histoire de la construction européenne', duration: '20 min', completed: false },
        { type: 'pdf', title: 'Les traités européens', pages: 18, completed: false },
        { type: 'video', title: 'Géographie de l\'UE', duration: '25 min', completed: false }
      ]
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, href: '/dashboard/student' },
    { id: 'courses', label: 'Mes cours', icon: BookOpen, active: true },
    { id: 'quizzes', label: 'Quiz', icon: Award, href: '/dashboard/student/quizzes' },
    { id: 'progress', label: 'Progression', icon: TrendingUp, href: '/dashboard/student/progress' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/dashboard/student/messages' },
    { id: 'profile', label: 'Mon profil', icon: User, href: '/dashboard/student/profile' }
  ];

  const subjectColors = {
    'Histoire': 'from-red-400 to-pink-500',
    'Géographie': 'from-green-400 to-blue-500', 
    'EMC': 'from-purple-400 to-indigo-500'
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'quiz': return Award;
      default: return FileText;
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-white font-bold text-lg">Chrono-Carto</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profil utilisateur */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">MD</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Marie Dubois</p>
              <p className="text-sm text-gray-600">Terminale S</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                item.active
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour au dashboard
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mes cours</h1>
                  <p className="text-gray-600">Continuez votre apprentissage</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Filtres et recherche */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="all">Toutes les matières</option>
                <option value="Histoire">Histoire</option>
                <option value="Géographie">Géographie</option>
                <option value="EMC">EMC</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{filteredCourses.length} cours trouvé(s)</span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="p-6">
          {/* Vue grille */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  {/* Image de couverture */}
                  <div className={`h-32 bg-gradient-to-r ${subjectColors[course.subject]} relative`}>
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded-full">
                        {course.subject}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100">
                        <Bookmark className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{course.students} étudiants</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                    {/* Progression */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progression</span>
                        <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${subjectColors[course.subject]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{course.completedChapters}/{course.chapters} chapitres</span>
                        {course.lastAccessed && <span>Vu le {course.lastAccessed}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                      >
                        <Play className="w-4 h-4" />
                        <span>{course.progress > 0 ? 'Continuer' : 'Commencer'}</span>
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vue liste */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${subjectColors[course.subject]} rounded-lg flex items-center justify-center`}>
                        {course.subject === 'Histoire' && <Scroll className="w-8 h-8 text-white" />}
                        {course.subject === 'Géographie' && <Globe className="w-8 h-8 text-white" />}
                        {course.subject === 'EMC' && <Target className="w-8 h-8 text-white" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {course.subject}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.chapters} chapitres</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students} étudiants</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="mb-2">
                          <span className="text-2xl font-bold text-gray-900">{course.progress}%</span>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className={`bg-gradient-to-r ${subjectColors[course.subject]} h-2 rounded-full`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <button 
                          onClick={() => setSelectedCourse(course)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                        >
                          <Play className="w-4 h-4" />
                          <span>{course.progress > 0 ? 'Continuer' : 'Commencer'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun cours trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de détail du cours */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                  <p className="text-gray-600">{selectedCourse.subject} • {selectedCourse.instructor}</p>
                </div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600">{selectedCourse.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contenu du cours</h3>
                    <div className="space-y-3">
                      {selectedCourse.resources.map((resource, index) => {
                        const IconComponent = getResourceIcon(resource.type);
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              resource.completed ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {resource.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <IconComponent className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{resource.title}</p>
                              <p className="text-sm text-gray-600">
                                {resource.duration && `${resource.duration}`}
                                {resource.pages && `${resource.pages} pages`}
                                {resource.questions && `${resource.questions} questions`}
                              </p>
                            </div>
                            <button className="p-2 text-amber-500 hover:text-amber-600">
                              <Play className="w-5 h-5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Progression</h3>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{selectedCourse.progress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${subjectColors[selectedCourse.subject]} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${selectedCourse.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Chapitres terminés</span>
                        <span>{selectedCourse.completedChapters}/{selectedCourse.chapters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temps estimé restant</span>
                        <span>45 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <Play className="w-5 h-5" />
                      <span>{selectedCourse.progress > 0 ? 'Continuer le cours' : 'Commencer le cours'}</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Download className="w-5 h-5" />
                      <span>Télécharger les ressources</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Share2 className="w-5 h-5" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

