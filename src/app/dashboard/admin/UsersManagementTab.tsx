'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AVAILABLE_CLASSES, AVAILABLE_LEVELS } from '@/constants/classes';
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
  Lock,
  Baby,
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
  loadStudents: () => Promise<void>;
  loadParents: () => Promise<void>;
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
  loadStudents,
  loadParents,
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

  const classes = AVAILABLE_CLASSES;
  const levels = AVAILABLE_LEVELS;

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
    try {
      setIsLoading(true);
      
    if (activeTab === 'students') {
        // Créer un étudiant avec son parent via l'endpoint d'inscription
        const registrationData = {
          userType: 'student',
          first_name: (newUser as any).firstName,
          last_name: (newUser as any).lastName,
        email: (newUser as any).email,
        phone: (newUser as any).phoneNumber,
          password: 'changeme123', // Mot de passe temporaire
          studentBirthDate: (newUser as any).birthDate || '2000-01-01',
          studentClass: (newUser as any).classLevel,
          // Informations du parent
          parentFirstName: (newUser as any).parentFirstName || 'Parent',
          parentLastName: (newUser as any).parentLastName || 'Temporaire',
          parentEmail: (newUser as any).parentEmail || `parent.${(newUser as any).email}`,
          parentPhone: (newUser as any).parentPhone || (newUser as any).phoneNumber,
          parentPassword: 'changeme123'
        };
        
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la création de l\'étudiant et du parent');
        }
        
        showNotification('success', 'Étudiant et parent créés avec succès');
    } else {
        // Créer un parent avec son enfant via l'endpoint d'inscription
        const registrationData = {
          userType: 'parent',
          first_name: (newUser as any).firstName,
          last_name: (newUser as any).lastName,
        email: (newUser as any).email,
        phone: (newUser as any).phoneNumber,
          password: 'changeme123', // Mot de passe temporaire
          // Informations de l'enfant
          childFirstName: (newUser as any).childFirstName || 'Enfant',
          childLastName: (newUser as any).childLastName || 'Temporaire',
          childEmail: (newUser as any).childEmail || `enfant.${(newUser as any).email}`,
          childPhone: (newUser as any).childPhone || (newUser as any).phoneNumber,
          childBirthDate: (newUser as any).childBirthDate || '2010-01-01',
          childClass: (newUser as any).childClass || 'Terminale groupe 1',
          childPassword: 'changeme123'
        };
        
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la création du parent et de l\'enfant');
        }
        
        showNotification('success', 'Parent et enfant créés avec succès');
      }
      
      setShowAddModal(false);
      // Recharger les données
      if (activeTab === 'students') {
        loadStudents();
      } else {
        loadParents();
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
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

  return (
    <div className="space-y-4">
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
            <h1 className="text-base font-bold text-white flex items-center">
              <Users className="w-5 h-5 text-blue-300 mr-4" />
              Gestion des utilisateurs
            </h1>
            <p className="text-blue-200 mt-2">Gérez les comptes étudiants et parents</p>
            <div className="flex items-center space-x-3 mt-3 text-sm text-blue-300">
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
              className="flex items-center space-x-2 px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
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
            className={`flex-1 px-3 py-4 text-center font-semibold transition-all ${
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
            className={`flex-1 px-3 py-4 text-center font-semibold transition-all ${
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
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-3">
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
          <h2 className="text-base font-bold text-white flex items-center">
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
                <th className="px-3 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Utilisateur</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Contact</th>
                {activeTab === 'students' && (
                  <>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Classe</th>
                  </>
                )}
                <th className="px-3 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Statut</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Approbation</th>
                <th className="px-3 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {(activeTab === 'students' ? filteredStudents : filteredParents).map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-4 whitespace-nowrap">
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
                  <td className="px-3 py-4 whitespace-nowrap">
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
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="text-sm text-blue-200">{(user as Student).classLevel}</span>
                      </td>
                    </>
                  )}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.isActive ? 'Actif' : 'Inactif')}`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isApproved 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {user.isApproved ? 'Approuvé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
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
            <div className="text-center py-6">
              <Users className="w-10 h-10 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-200 text-base">Aucun utilisateur trouvé</p>
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
          <h2 className="text-base font-bold text-white flex items-center">
            <UserPlus className="w-5 h-5 text-blue-300 mr-3" />
            Ajouter un {userType === 'students' ? 'étudiant' : 'parent'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, firstName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, lastName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Téléphone *</label>
              <input
                type="tel"
                value={(formData as any).phone}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
          </div>

          {userType === 'students' && (
            <>
              {/* Informations personnelles de l'étudiant */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-300" />
                  Informations personnelles
                </h3>
                
                {/* Date de naissance et classe */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Date de naissance</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                      <input
                        type="date"
                        value={formData.birthDate || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Classe</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <BookOpen className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                  <select
                    value={formData.classLevel}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, classLevel: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none border-white/20"
                        required
                      >
                        <option value="" className="bg-slate-800 text-white">Sélectionnez la classe</option>
                        {classes.map((classe) => (
                          <option 
                            key={classe} 
                            value={classe} 
                            className="bg-slate-800 text-white"
                          >
                            {classe}
                          </option>
                    ))}
                  </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                </div>
                    </div>
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/90 mb-3">Mot de passe</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Mot de passe de l'étudiant"
                      required
                    />
                  </div>
                </div>

                {/* Confirmation du mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">Confirmer le mot de passe</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Confirmez le mot de passe de l'étudiant"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informations des parents */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-300" />
                  Informations des parents
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Prénom du parent</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                  <input
                    type="text"
                        value={formData.parentFirstName || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, parentFirstName: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="Prénom du parent"
                        required
                  />
                </div>
                  </div>

                <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Nom du parent</label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.parentLastName || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, parentLastName: e.target.value }))}
                        className="w-full pl-4 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="Nom du parent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Email du parent</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                  <input
                    type="email"
                        value={formData.parentEmail || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, parentEmail: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="parent@email.com"
                        required
                  />
                </div>
                  </div>

                <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Téléphone du parent</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                  <input
                    type="tel"
                        value={formData.parentPhone || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, parentPhone: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="Téléphone du parent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mot de passe du parent */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/90 mb-3">Mot de passe du parent</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.parentPassword || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, parentPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Mot de passe du parent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">Confirmer le mot de passe du parent</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.parentConfirmPassword || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, parentConfirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Confirmez le mot de passe du parent"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {userType === 'parents' && (
            <>
              {/* Informations personnelles du parent */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-300" />
                  Informations personnelles
                </h3>
                
                {/* Mot de passe */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/90 mb-3">Mot de passe</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Mot de passe du parent"
                      required
                    />
                  </div>
                </div>

                {/* Confirmation du mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">Confirmer le mot de passe</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Confirmez le mot de passe du parent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informations de l'enfant */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center">
                  <Baby className="w-5 h-5 mr-2 text-amber-300" />
                  Informations de l'enfant
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Prénom de l'enfant</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Baby className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={formData.childFirstName || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, childFirstName: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="Prénom de l'enfant"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Nom de l'enfant</label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.childLastName || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, childLastName: e.target.value }))}
                        className="w-full pl-4 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="Nom de l'enfant"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email et téléphone de l'enfant */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Email de l'enfant</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={formData.childEmail || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, childEmail: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="enfant@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Téléphone de l'enfant</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        value={formData.childPhone || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, childPhone: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        placeholder="Numéro de téléphone de l'enfant"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date de naissance et classe de l'enfant */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Date de naissance de l'enfant</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                      <input
                        type="date"
                        value={formData.childBirthDate || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, childBirthDate: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Classe de l'enfant</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <BookOpen className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                      </div>
                      <select
                        value={formData.childClass || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, childClass: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none border-white/20"
                        required
                      >
                        <option value="" className="bg-slate-800 text-white">Sélectionnez la classe de l'enfant</option>
                        {classes.map((classe) => (
                          <option 
                            key={classe} 
                            value={classe} 
                            className="bg-slate-800 text-white"
                          >
                            {classe}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mot de passe de l'enfant */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/90 mb-3">Mot de passe de l'enfant</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.childPassword || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, childPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Mot de passe de l'enfant"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">Confirmer le mot de passe de l'enfant</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={formData.childConfirmPassword || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, childConfirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm border-white/20"
                      placeholder="Confirmez le mot de passe de l'enfant"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
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
          <h2 className="text-base font-bold text-white flex items-center">
            <Edit className="w-5 h-5 text-blue-300 mr-3" />
            Modifier {userType === 'students' ? 'l\'étudiant' : 'le parent'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, firstName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, lastName: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Téléphone *</label>
              <input
                type="tel"
                value={(formData as any).phone}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
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
                    value={(formData as any).class}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, class: e.target.value }))}
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
                    value={(formData as any).level}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, level: e.target.value }))}
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
                    value={(formData as any).parentName || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email du parent</label>
                  <input
                    type="email"
                    value={(formData as any).parentEmail || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, parentEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Téléphone du parent</label>
                  <input
                    type="tel"
                    value={(formData as any).parentPhone || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, parentPhone: e.target.value }))}
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
                    value={(formData as any).completedCourses}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, completedCourses: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Total cours</label>
                  <input
                    type="number"
                    min="0"
                    value={(formData as any).totalCourses}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, totalCourses: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Statut</label>
            <select
              value={(formData as any).status}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value as any }))}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
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
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirmer la suppression</h3>
              <p className="text-blue-200 text-sm">Cette action est irréversible</p>
            </div>
          </div>
          
          <p className="text-blue-200 mb-3">
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

