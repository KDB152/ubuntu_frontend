'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Shield,
  User,
  Heart,
  Clock,
  Star,
  Activity,
  Settings,
  Ban,
  UserCheck,
  MessageSquare,
  FileText,
  Save,
  X,
  Plus,
  Loader2
} from 'lucide-react';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  classLevel: string;
  birthDate: string;
  progressPercentage: number;
  averageScore: number;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  notes?: string;
}

interface Parent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  notes?: string;
}

interface UsersManagementTabProps {
  students: any[];
  parents: any[];
  loading: boolean;
  onCreateStudent: (data: any) => Promise<any>;
  onUpdateStudent: (id: number, data: any) => Promise<any>;
  onDeleteStudent: (id: number) => Promise<void>;
  onCreateParent: (data: any) => Promise<any>;
  onUpdateParent: (id: number, data: any) => Promise<any>;
  onDeleteParent: (id: number) => Promise<void>;
  onApproveUser: (id: number, approve: boolean) => Promise<void>;
}

const UsersManagementTab: React.FC<UsersManagementTabProps> = ({
  students,
  parents,
  loading,
  onCreateStudent,
  onUpdateStudent,
  onDeleteStudent,
  onCreateParent,
  onUpdateParent,
  onDeleteParent,
  onApproveUser,
}) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'students' | 'parents'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterClass, setFilterClass] = useState('Tous');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Student | Parent | null>(null);
  const [userToDelete, setUserToDelete] = useState<Student | Parent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const classes = ['Seconde', 'Première L', 'Première ES', 'Première S', 'Terminale L', 'Terminale ES', 'Terminale S'];
  const levels = ['Seconde', 'Première', 'Terminale'];

  // Gérer les paramètres d'URL pour ouvrir automatiquement le modal de création
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle student creation
  const handleCreateStudent = async (studentData: any) => {
    try {
      setIsLoading(true);
      await onCreateStudent(studentData);
      showNotification('success', 'Étudiant créé avec succès');
      setShowAddModal(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de la création de l\'étudiant');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student update
  const handleUpdateStudent = async (id: number, studentData: any) => {
    try {
      setIsLoading(true);
      await onUpdateStudent(id, studentData);
      showNotification('success', 'Étudiant mis à jour avec succès');
      setShowEditModal(false);
      setUserToEdit(null);
    } catch (error) {
      showNotification('error', 'Erreur lors de la mise à jour de l\'étudiant');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (id: number) => {
    try {
      setIsLoading(true);
      await onDeleteStudent(id);
      showNotification('success', 'Étudiant supprimé avec succès');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression de l\'étudiant');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parent creation
  const handleCreateParent = async (parentData: any) => {
    try {
      setIsLoading(true);
      await onCreateParent(parentData);
      showNotification('success', 'Parent créé avec succès');
      setShowAddModal(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de la création du parent');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parent update
  const handleUpdateParent = async (id: number, parentData: any) => {
    try {
      setIsLoading(true);
      await onUpdateParent(id, parentData);
      showNotification('success', 'Parent mis à jour avec succès');
      setShowEditModal(false);
      setUserToEdit(null);
    } catch (error) {
      showNotification('error', 'Erreur lors de la mise à jour du parent');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parent deletion
  const handleDeleteParent = async (id: number) => {
    try {
      setIsLoading(true);
      await onDeleteParent(id);
      showNotification('success', 'Parent supprimé avec succès');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression du parent');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user approval
  const handleApproveUser = async (id: number, approve: boolean) => {
    try {
      setIsLoading(true);
      await onApproveUser(id, approve);
      showNotification('success', `Utilisateur ${approve ? 'approuvé' : 'désapprouvé'} avec succès`);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'approbation de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: Student | Parent) => {
    if (activeTab === 'students') {
      await handleDeleteStudent(user.id);
    } else {
      await handleDeleteParent(user.id);
    }
  };

  const handleEditUser = async (updatedUser: Student | Parent) => {
    if (activeTab === 'students') {
      await handleUpdateStudent(updatedUser.id, {
        firstName: (updatedUser as Student).firstName,
        lastName: (updatedUser as Student).lastName,
        email: (updatedUser as Student).email,
        phone: (updatedUser as Student).phoneNumber,
        class: (updatedUser as Student).classLevel,
        level: (updatedUser as Student).classLevel,
        averageScore: (updatedUser as Student).averageScore,
        completedCourses: 0,
        totalCourses: 0,
      });
    } else {
      await handleUpdateParent(updatedUser.id, {
        firstName: (updatedUser as Parent).firstName,
        lastName: (updatedUser as Parent).lastName,
        email: (updatedUser as Parent).email,
        phone: (updatedUser as Parent).phoneNumber,
        address: (updatedUser as Parent).address || '',
        occupation: (updatedUser as Parent).occupation || '',
      });
    }
  };

  const handleAddUser = async (newUser: Partial<Student | Parent>) => {
    if (activeTab === 'students') {
      await handleCreateStudent({
        firstName: (newUser as any).firstName,
        lastName: (newUser as any).lastName,
        email: (newUser as any).email,
        phone: (newUser as any).phoneNumber,
        class: (newUser as any).classLevel,
        level: (newUser as any).classLevel,
        averageScore: (newUser as any).averageScore || 0,
        completedCourses: 0,
        totalCourses: 0,
      });
    } else {
      await handleCreateParent({
        firstName: (newUser as any).firstName,
        lastName: (newUser as any).lastName,
        email: (newUser as any).email,
        phone: (newUser as any).phoneNumber,
        address: (newUser as any).address || '',
        occupation: (newUser as any).occupation || '',
      });
    }
  };

  const toggleUserStatus = async (user: Student | Parent) => {
    const newStatus = user.isActive ? false : true;
    const updatedUser = { ...user, isActive: newStatus };
    await handleEditUser(updatedUser);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (student.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (student.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Tous' || (student.isActive ? 'Actif' : 'Inactif') === filterStatus;
    const matchesClass = filterClass === 'Tous' || student.classLevel === filterClass;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  const filteredParents = parents.filter(parent => {
    const matchesSearch = (parent.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (parent.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (parent.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Tous' || (parent.isActive ? 'Actif' : 'Inactif') === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'Inactif': return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      case 'Suspendu': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 16) return 'from-green-400 to-emerald-500';
    if (score >= 14) return 'from-blue-400 to-indigo-500';
    if (score >= 12) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

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
              <Users className="w-8 h-8 text-blue-300 mr-4" />
              Gestion des utilisateurs
            </h1>
            <p className="text-blue-200 mt-2">Gérez les comptes étudiants et parents</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-blue-300">
              <span>Étudiants: {students.length}</span>
              <span>Parents: {parents.length}</span>
              <span>Actifs: {[...students, ...parents].filter(u => u.isActive).length}</span>
              <span className={`${[...students, ...parents].filter(u => !u.isApproved).length > 0 ? 'text-yellow-300' : ''}`}>
                En attente: {[...students, ...parents].filter(u => !u.isApproved).length}
              </span>
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
            {[...students, ...parents].filter(u => !u.isApproved).length > 0 && (
              <button
                onClick={async () => {
                  const pendingUsers = [...students, ...parents].filter(u => !u.isApproved);
                  for (const user of pendingUsers) {
                    try {
                      await handleApproveUser(user.id, true);
                    } catch (error) {
                      console.error('Erreur lors de l\'approbation:', error);
                    }
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approuver tous ({[...students, ...parents].filter(u => !u.isApproved).length})</span>
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              <UserPlus className="w-5 h-5" />
              <span>Ajouter un utilisateur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <User className="w-5 h-5" />
              <span>Étudiants ({students.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
              activeTab === 'parents'
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Parents ({parents.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="pl-10 pr-4 py-3 w-full border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              {activeTab === 'students' && <option value="Suspendu">Suspendu</option>}
            </select>
            {activeTab === 'students' && (
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                <option value="Tous">Toutes les classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center">
            {activeTab === 'students' ? (
              <>
                <User className="w-5 h-5 text-blue-300 mr-2" />
                Étudiants ({filteredStudents.length})
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 text-blue-300 mr-2" />
                Parents ({filteredParents.length})
              </>
            )}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Contact</th>
                {activeTab === 'students' && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Classe</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Progression</th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Inscription</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Dernière connexion</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Approbation</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {(activeTab === 'students' ? filteredStudents : filteredParents).map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.firstName || 'Prénom'} {user.lastName || 'Nom'}</p>
                        <p className="text-xs text-blue-300">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-200">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-32">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  {activeTab === 'students' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-blue-200">{(user as Student).classLevel}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-200">Moyenne</span>
                            <span className="text-white font-bold">{(user as Student).averageScore}/20</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${getProgressColor((user as Student).averageScore)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${((user as Student).averageScore / 20) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-blue-300">
                            Progression: {(user as Student).progressPercentage}%
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-blue-200">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-blue-200">-</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.isActive ? 'Actif' : 'Inactif')}`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isApproved 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {user.isApproved ? 'Approuvé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* Bouton d'approbation */}
                      <button
                        onClick={() => handleApproveUser(user.id, !user.isApproved)}
                        className={`p-2 rounded-lg transition-all ${
                          user.isApproved 
                            ? 'text-green-300 hover:text-white hover:bg-green-500/20' 
                            : 'text-yellow-300 hover:text-white hover:bg-yellow-500/20'
                        }`}
                        title={user.isApproved ? 'Approuvé' : 'En attente d\'approbation'}
                      >
                        {user.isApproved ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </button>
                      
                      {/* Bouton d'activation/désactivation */}
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`p-2 rounded-lg transition-all ${
                          user.isActive 
                            ? 'text-orange-300 hover:text-white hover:bg-orange-500/20' 
                            : 'text-green-300 hover:text-white hover:bg-green-500/20'
                        }`}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {user.isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      
                      {/* Bouton de modification */}
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {/* Bouton de suppression */}
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(activeTab === 'students' ? filteredStudents : filteredParents).length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-200 text-lg">Aucun utilisateur trouvé</p>
              <p className="text-blue-300 text-sm">Essayez de modifier vos filtres ou ajoutez un nouvel utilisateur</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          userType={activeTab}
          onSave={handleAddUser}
          onClose={() => setShowAddModal(false)}
          isLoading={isLoading}
          classes={classes}
          levels={levels}
        />
      )}

      {showEditModal && userToEdit && (
        <EditUserModal
          user={userToEdit}
          userType={activeTab}
          onSave={handleEditUser}
          onClose={() => {
            setShowEditModal(false);
            setUserToEdit(null);
          }}
          isLoading={isLoading}
          classes={classes}
          levels={levels}
        />
      )}

      {showDeleteModal && userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onConfirm={() => handleDeleteUser(userToDelete)}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// Composants modaux
interface AddUserModalProps {
  userType: 'students' | 'parents';
  onSave: (user: Partial<Student | Parent>) => void;
  onClose: () => void;
  isLoading: boolean;
  classes: string[];
  levels: string[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({ userType, onSave, onClose, isLoading, classes, levels }) => {
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    ...(userType === 'students' ? {
      classLevel: 'Terminale S',
      averageScore: 0,
      progressPercentage: 0,
      notes: ''
    } : {
      address: '',
      occupation: '',
      notes: ''
    })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <UserPlus className="w-6 h-6 text-blue-300 mr-3" />
            Ajouter un {userType === 'students' ? 'étudiant' : 'parent'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Téléphone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
          </div>

          {userType === 'students' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Classe</label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, classLevel: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Niveau</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Nom du parent</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email du parent</label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Téléphone du parent</label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Ajout...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditUserModalProps {
  user: Student | Parent;
  userType: 'students' | 'parents';
  onSave: (user: Student | Parent) => void;
  onClose: () => void;
  isLoading: boolean;
  classes: string[];
  levels: string[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, userType, onSave, onClose, isLoading, classes, levels }) => {
  const [formData, setFormData] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Edit className="w-6 h-6 text-blue-300 mr-3" />
            Modifier {userType === 'students' ? 'l\'étudiant' : 'le parent'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Téléphone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
          </div>

          {userType === 'students' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Classe</label>
                  <select
                    value={(formData as Student).class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Niveau</label>
                  <select
                    value={(formData as Student).level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Nom du parent</label>
                  <input
                    type="text"
                    value={(formData as Student).parentName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email du parent</label>
                  <input
                    type="email"
                    value={(formData as Student).parentEmail || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Téléphone du parent</label>
                  <input
                    type="tel"
                    value={(formData as Student).parentPhone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Moyenne générale</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={(formData as Student).averageScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, averageScore: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Cours terminés</label>
                  <input
                    type="number"
                    min="0"
                    value={(formData as Student).completedCourses}
                    onChange={(e) => setFormData(prev => ({ ...prev, completedCourses: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Total cours</label>
                  <input
                    type="number"
                    min="0"
                    value={(formData as Student).totalCourses}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalCourses: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              {userType === 'students' && <option value="Suspendu">Suspendu</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteUserModalProps {
  user: Student | Parent;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, onConfirm, onClose, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Confirmer la suppression</h3>
              <p className="text-blue-200 text-sm">Cette action est irréversible</p>
            </div>
          </div>
          
          <p className="text-blue-200 mb-6">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong className="text-white">"{user.firstName || 'Prénom'} {user.lastName || 'Nom'}"</strong> ?
          </p>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementTab;

