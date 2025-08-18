'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  Settings, 
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  UserCheck,
  UserX,
  Award,
  TrendingUp,
  Globe,
  MapPin,
  Clock,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(5);

  // Données simulées
  const stats = [
    { title: 'Élèves inscrits', value: '2,847', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Parents actifs', value: '1,923', change: '+8%', icon: UserCheck, color: 'from-green-500 to-green-600' },
    { title: 'Contenus publiés', value: '486', change: '+23%', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { title: 'Quiz complétés', value: '15,238', change: '+45%', icon: Award, color: 'from-orange-500 to-orange-600' }
  ];

  const recentUsers = [
    { name: 'Marie Dubois', email: 'marie.dubois@email.com', type: 'Élève', status: 'Actif', joinDate: '2025-01-15' },
    { name: 'Pierre Martin', email: 'pierre.martin@email.com', type: 'Parent', status: 'Actif', joinDate: '2025-01-14' },
    { name: 'Sophie Laurent', email: 'sophie.laurent@email.com', type: 'Élève', status: 'Inactif', joinDate: '2025-01-13' },
    { name: 'Jean Dupont', email: 'jean.dupont@email.com', type: 'Parent', status: 'Actif', joinDate: '2025-01-12' }
  ];

  const recentContent = [
    { title: 'La Révolution française', type: 'Cours', subject: 'Histoire', views: 234, date: '2025-01-15' },
    { title: 'Les climats en Europe', type: 'Vidéo', subject: 'Géographie', views: 187, date: '2025-01-14' },
    { title: 'Quiz : La Première Guerre mondiale', type: 'Quiz', subject: 'Histoire', views: 156, date: '2025-01-13' },
    { title: 'La démocratie française', type: 'Cours', subject: 'EMC', views: 142, date: '2025-01-12' }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'content', label: 'Contenus', icon: BookOpen },
    { id: 'quizzes', label: 'Quiz', icon: Award },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytiques', icon: TrendingUp },
    { id: 'suggestions', label: 'Suggestions', icon: Bell },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

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

        <nav className="mt-8 px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white text-center">
            <h3 className="font-semibold mb-2">Version Pro</h3>
            <p className="text-sm opacity-90 mb-3">Accédez à toutes les fonctionnalités avancées</p>
            <button className="w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              En savoir plus
            </button>
          </div>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">AD</span>
                </div>
                <span className="text-gray-700 font-medium">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-green-500 text-sm font-medium mt-1">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphiques et activité récente */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activité récente des utilisateurs */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Nouveaux utilisateurs</h2>
                    <button className="text-amber-500 hover:text-amber-600 text-sm font-medium">
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'Actif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{user.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contenu populaire */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Contenu populaire</h2>
                    <button className="text-amber-500 hover:text-amber-600 text-sm font-medium">
                      Gérer
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentContent.map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            content.type === 'Cours' ? 'bg-blue-100' :
                            content.type === 'Vidéo' ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            {content.type === 'Cours' ? <BookOpen className="w-5 h-5 text-blue-600" /> :
                             content.type === 'Vidéo' ? <Globe className="w-5 h-5 text-red-600" /> :
                             <Award className="w-5 h-5 text-green-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                            <p className="text-xs text-gray-500">{content.subject} • {content.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{content.views} vues</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Nouveau cours', icon: Plus, color: 'from-blue-500 to-blue-600' },
                    { label: 'Créer quiz', icon: Award, color: 'from-green-500 to-green-600' },
                    { label: 'Gérer utilisateurs', icon: Users, color: 'from-purple-500 to-purple-600' },
                    { label: 'Upload fichier', icon: Upload, color: 'from-orange-500 to-orange-600' },
                    { label: 'Statistiques', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
                    { label: 'Messages', icon: MessageSquare, color: 'from-pink-500 to-pink-600' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="p-4 bg-gradient-to-r hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-xl text-white"
                      style={{ backgroundImage: `linear-gradient(to right, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})` }}
                    >
                      <action.icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Section {sidebarItems.find(item => item.id === activeTab)?.label}
              </h3>
              <p className="text-gray-600 mb-6">
                Cette section sera développée prochainement avec toutes les fonctionnalités avancées.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                Retour à la vue d'ensemble
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;