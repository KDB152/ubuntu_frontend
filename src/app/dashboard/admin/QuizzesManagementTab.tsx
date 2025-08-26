'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Play,
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Shield,
  BookOpen,
  Target,
  Star,
  TrendingUp,
  Calendar,
  Settings,
  Save,
  X,
  Loader2,
  FileText,
  Brain,
  Zap,
  Timer,
  HelpCircle,
  Copy,
  Share2,
  List
} from 'lucide-react';
import QuestionManagementModal from './QuestionManagementModal';
import QuizStatisticsModal from './QuizStatisticsModal';

interface Question {
  id: string;
  question: string;
  type: 'multiple' | 'single' | 'text' | 'boolean';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  duration: number; // en minutes
  questions: Question[];
  totalPoints: number;
  attempts: number;
  averageScore: number;
  passScore: number;
  status: 'Publié' | 'Brouillon' | 'Archivé';
  createdDate: string;
  lastModified: string;
  tags: string[];
  isTimeLimited: boolean;
  allowRetake: boolean;
  showResults: boolean;
  randomizeQuestions: boolean;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
  answers: Record<string, any>;
}

const QuizzesManagementTab = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterLevel, setFilterLevel] = useState('Tous');
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [quizToViewResults, setQuizToViewResults] = useState<Quiz | null>(null);
  const [quizToManageQuestions, setQuizToManageQuestions] = useState<Quiz | null>(null);
  const [quizForStatistics, setQuizForStatistics] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'results'>('quizzes');

  const subjects = ['Histoire', 'Géographie', 'EMC'];
  const levels = ['Seconde', 'Première', 'Terminale'];

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/quizzes`);
        const json = await res.json();
        const mapped: Quiz[] = (json.items || []).map((q: any) => ({
          id: String(q.id),
          title: q.title,
          description: q.description || '',
          subject: q.subject,
          level: q.level,
          duration: q.duration || 0,
          questions: [],
          totalPoints: q.total_points || 0,
          attempts: q.attempts || 0,
          averageScore: Number(q.average_score || 0),
          passScore: q.pass_score || 0,
          status: q.status,
          createdDate: q.created_at?.slice(0,10) || '',
          lastModified: q.updated_at?.slice(0,10) || '',
          tags: q.tags || [],
          isTimeLimited: !!q.is_time_limited,
          allowRetake: !!q.allow_retake,
          showResults: !!q.show_results,
          randomizeQuestions: !!q.randomize_questions,
        }));
        
        // Charger toutes les tentatives pour tous les quiz
        const allAttempts: QuizAttempt[] = [];
        for (const quiz of json.items || []) {
          try {
            const resA = await fetch(`${API_BASE}/quizzes/${quiz.id}/attempts`);
            if (resA.ok) {
              const arr = await resA.json();
              const mappedA: QuizAttempt[] = (arr || []).map((a: any) => ({
                id: String(a.id),
                quizId: String(a.quiz_id),
                studentId: String(a.student_id),
                studentName: a.student_name,
                score: a.score,
                totalPoints: a.total_points,
                percentage: a.percentage,
                timeSpent: a.time_spent,
                completedAt: a.completed_at,
                answers: a.answers || {}
              }));
              allAttempts.push(...mappedA);
            }
          } catch (e) {
            console.error(`Erreur lors du chargement des tentatives pour le quiz ${quiz.id}:`, e);
          }
        }
        
        // Mettre à jour les quiz avec les vraies statistiques calculées
        const updatedQuizzes = mapped.map(quiz => {
          const quizAttempts = allAttempts.filter(attempt => attempt.quizId === quiz.id);
          const totalAttempts = quizAttempts.length;
          const averageScore = totalAttempts > 0 
            ? quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts 
            : 0;
          
          return {
            ...quiz,
            attempts: totalAttempts,
            averageScore: averageScore
          };
        });
        
        setQuizzes(updatedQuizzes);
        setAttempts(allAttempts);
      } catch (e) {
        console.error('Erreur lors du chargement:', e);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeleteQuiz = async (quiz: Quiz) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${API_BASE}/quizzes/${quiz.id}`, { method: 'DELETE' });
      setQuizzes(prev => prev.filter(q => q.id !== quiz.id));
      showNotification('success', 'Quiz supprimé avec succès');
      setShowDeleteModal(false);
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression du quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuizStatus = async (quiz: Quiz) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const newStatus = quiz.status === 'Publié' ? 'Brouillon' : 'Publié';
      await fetch(`${API_BASE}/quizzes/${quiz.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setQuizzes(prev => prev.map(q => 
        q.id === quiz.id ? { ...q, status: newStatus } : q
      ));
      showNotification('success', `Quiz ${newStatus === 'Publié' ? 'publié' : 'dépublié'} avec succès`);
    } catch (error) {
      showNotification('error', 'Erreur lors du changement de statut');
    } finally {
      setIsLoading(false);
    }
  };

  const duplicateQuiz = async (quiz: Quiz) => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const duplicateData = {
        title: `${quiz.title} (Copie)`,
        description: quiz.description,
        subject: quiz.subject,
        level: quiz.level,
        duration: quiz.duration,
        total_points: quiz.totalPoints,
        pass_score: quiz.passScore,
        status: 'Brouillon',
        tags: quiz.tags,
        is_time_limited: quiz.isTimeLimited,
        allow_retake: quiz.allowRetake,
        show_results: quiz.showResults,
        randomize_questions: quiz.randomizeQuestions
      };
      
      const response = await fetch(`${API_BASE}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });
      
      if (response.ok) {
        const newQuiz = await response.json();
        setQuizzes(prev => [...prev, {
          ...quiz,
          id: String(newQuiz.id),
          title: duplicateData.title,
          status: 'Brouillon',
          createdDate: new Date().toISOString().slice(0,10),
          lastModified: new Date().toISOString().slice(0,10)
        }]);
        showNotification('success', 'Quiz dupliqué avec succès');
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de la duplication du quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = filterSubject === 'Tous' || quiz.subject === filterSubject;
    const matchesStatus = filterStatus === 'Tous' || quiz.status === filterStatus;
    const matchesLevel = filterLevel === 'Tous' || quiz.level === filterLevel;
    
    return matchesSearch && matchesSubject && matchesStatus && matchesLevel;
  });

  const handleSelectAll = () => {
    if (selectedQuizzes.length === filteredQuizzes.length) {
      setSelectedQuizzes([]);
    } else {
      setSelectedQuizzes(filteredQuizzes.map(q => q.id));
    }
  };

  const handleSelectQuiz = (quizId: string) => {
    setSelectedQuizzes(prev => 
      prev.includes(quizId) 
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  };

  const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
    if (selectedQuizzes.length === 0) return;
    
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      for (const quizId of selectedQuizzes) {
        switch (action) {
          case 'delete':
            await fetch(`${API_BASE}/quizzes/${quizId}`, { method: 'DELETE' });
            break;
          case 'publish':
            await fetch(`${API_BASE}/quizzes/${quizId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Publié' })
            });
            break;
          case 'unpublish':
            await fetch(`${API_BASE}/quizzes/${quizId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Brouillon' })
            });
            break;
        }
      }
      
             // Reload quizzes with real statistics
       const res = await fetch(`${API_BASE}/quizzes`);
       const json = await res.json();
       const mapped: Quiz[] = (json.items || []).map((q: any) => ({
         id: String(q.id),
         title: q.title,
         description: q.description || '',
         subject: q.subject,
         level: q.level,
         duration: q.duration || 0,
         questions: [],
         totalPoints: q.total_points || 0,
         attempts: q.attempts || 0,
         averageScore: Number(q.average_score || 0),
         passScore: q.pass_score || 0,
         status: q.status,
         createdDate: q.created_at?.slice(0,10) || '',
         lastModified: q.updated_at?.slice(0,10) || '',
         tags: q.tags || [],
         isTimeLimited: !!q.is_time_limited,
         allowRetake: !!q.allow_retake,
         showResults: !!q.show_results,
         randomizeQuestions: !!q.randomize_questions,
       }));
       
       // Reload attempts and update statistics
       const allAttempts: QuizAttempt[] = [];
       for (const quiz of json.items || []) {
         try {
           const resA = await fetch(`${API_BASE}/quizzes/${quiz.id}/attempts`);
           if (resA.ok) {
             const arr = await resA.json();
             const mappedA: QuizAttempt[] = (arr || []).map((a: any) => ({
               id: String(a.id),
               quizId: String(a.quiz_id),
               studentId: String(a.student_id),
               studentName: a.student_name,
               score: a.score,
               totalPoints: a.total_points,
               percentage: a.percentage,
               timeSpent: a.time_spent,
               completedAt: a.completed_at,
               answers: a.answers || {}
             }));
             allAttempts.push(...mappedA);
           }
         } catch (e) {
           console.error(`Erreur lors du chargement des tentatives pour le quiz ${quiz.id}:`, e);
         }
       }
       
       // Update quizzes with real statistics
       const updatedQuizzes = mapped.map(quiz => {
         const quizAttempts = allAttempts.filter(attempt => attempt.quizId === quiz.id);
         const totalAttempts = quizAttempts.length;
         const averageScore = totalAttempts > 0 
           ? quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts 
           : 0;
         
         return {
           ...quiz,
           attempts: totalAttempts,
           averageScore: averageScore
         };
       });
       
       setQuizzes(updatedQuizzes);
       setAttempts(allAttempts);
      setSelectedQuizzes([]);
      
      const actionMessages = {
        delete: 'Quizs supprimés avec succès',
        publish: 'Quizs publiés avec succès',
        unpublish: 'Quizs dépubliés avec succès'
      };
      showNotification('success', actionMessages[action]);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'action en lot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Quiz</h1>
          <p className="text-blue-300 mt-1">Créez et gérez vos quiz pour évaluer vos étudiants</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Créer un quiz</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
        <div className="flex border-b border-white/20">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
              activeTab === 'quizzes'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5'
                : 'text-blue-300 hover:text-blue-400 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Quiz ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
              activeTab === 'results'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5'
                : 'text-blue-300 hover:text-blue-400 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Résultats ({quizzes.filter(quiz => attempts.some(attempt => attempt.quizId === quiz.id)).length})
          </button>
        </div>

        {activeTab === 'quizzes' && (
          <>
            {/* Filters and Search */}
            <div className="p-6 border-b border-white/20">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un quiz..."
                      className="pl-10 pr-4 py-2 w-64 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                    />
                  </div>
                  
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    <option value="Tous">Toutes les matières</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    <option value="Tous">Tous les niveaux</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    <option value="Tous">Tous les statuts</option>
                    <option value="Publié">Publié</option>
                    <option value="Brouillon">Brouillon</option>
                    <option value="Archivé">Archivé</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Actualiser"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedQuizzes.length > 0 && (
              <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300">
                    {selectedQuizzes.length} quiz(s) sélectionné(s)
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkAction('publish')}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                    >
                      Publier
                    </button>
                    <button
                      onClick={() => handleBulkAction('unpublish')}
                      className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm"
                    >
                      Dépublier
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedQuizzes.includes(quiz.id)}
                            onChange={() => handleSelectQuiz(quiz.id)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            quiz.status === 'Publié' 
                              ? 'bg-green-500/20 text-green-300' 
                              : quiz.status === 'Brouillon'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {quiz.status}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {quiz.title}
                        </h3>
                        <p className="text-blue-300 text-sm line-clamp-2">
                          {quiz.description || 'Aucune description'}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-300">{quiz.subject}</span>
                          <span className="text-blue-300">{quiz.level}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-300">{quiz.duration}min</span>
                          <span className="text-blue-300">{quiz.totalPoints} points</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-300">{quiz.attempts} tentatives</span>
                          <span className="text-blue-300">{quiz.averageScore.toFixed(1)}% moy</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setQuizToManageQuestions(quiz);
                                setShowQuestionModal(true);
                              }}
                              className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Gérer les questions"
                            >
                              <List className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => duplicateQuiz(quiz)}
                              className="p-2 text-green-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Dupliquer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setQuizToEdit(quiz);
                                setShowEditModal(true);
                              }}
                              className="p-2 text-yellow-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleQuizStatus(quiz)}
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                                quiz.status === 'Publié' 
                                  ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                              }`}
                            >
                              {quiz.status === 'Publié' ? 'Dépublier' : 'Publier'}
                            </button>
                            <button
                              onClick={() => {
                                setQuizToDelete(quiz);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredQuizzes.length === 0 && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                  <Award className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-200 text-xl mb-2">Aucun quiz trouvé</p>
                  <p className="text-blue-300 mb-6">Créez votre premier quiz pour commencer à évaluer vos étudiants</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Créer un quiz
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'results' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                // Filtrer les tentatives pour ce quiz spécifique
                const quizAttempts = attempts.filter(attempt => attempt.quizId === quiz.id);
                const totalAttempts = quizAttempts.length;
                const averageScore = totalAttempts > 0 
                  ? quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts 
                  : 0;
                const passRate = totalAttempts > 0 
                  ? (quizAttempts.filter(attempt => attempt.percentage >= quiz.passScore).length / totalAttempts) * 100 
                  : 0;
                const uniqueStudents = new Set(quizAttempts.map(attempt => attempt.studentId)).size;

                return (
                  <div key={quiz.id} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            quiz.status === 'Publié' 
                              ? 'bg-green-500/20 text-green-300' 
                              : quiz.status === 'Brouillon'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {quiz.status}
                          </span>
                        </div>
                      </div>

                      {/* Quiz Info */}
                      <div className="space-y-3 mb-6">
                        <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
                        <p className="text-blue-300 text-sm">{quiz.subject} - {quiz.level}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-300">{quiz.duration}min</span>
                          <span className="text-blue-300">{quiz.totalPoints} points</span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-white">{totalAttempts}</div>
                          <div className="text-xs text-blue-300">Tentatives</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-white">{uniqueStudents}</div>
                          <div className="text-xs text-blue-300">Étudiants</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-white">{averageScore.toFixed(1)}%</div>
                          <div className="text-xs text-blue-300">Moyenne</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-white">{passRate.toFixed(1)}%</div>
                          <div className="text-xs text-blue-300">Réussite</div>
                        </div>
                      </div>

                      {/* Recent Attempts */}
                      {totalAttempts > 0 && (
                        <div className="space-y-3 mb-6">
                          <h4 className="text-sm font-semibold text-blue-300">Dernières tentatives</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {quizAttempts.slice(0, 3).map((attempt) => (
                              <div key={attempt.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {attempt.studentName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="text-sm text-white">{attempt.studentName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm font-bold ${
                                    attempt.percentage >= 80 ? 'text-green-400' :
                                    attempt.percentage >= 60 ? 'text-blue-400' :
                                    attempt.percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    {attempt.percentage}%
                                  </span>
                                  <span className="text-xs text-blue-300">
                                    {new Date(attempt.completedAt).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {totalAttempts > 3 && (
                              <div className="text-center">
                                <span className="text-xs text-blue-300">
                                  +{totalAttempts - 3} autres tentatives
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <button
                          onClick={() => {
                            setQuizForStatistics(quiz);
                            setShowStatisticsModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                        >
                          <span>Voir détails</span>
                        </button>
                        {totalAttempts === 0 && (
                          <span className="text-xs text-blue-300">Aucune tentative</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {quizzes.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <p className="text-blue-200 text-xl mb-2">Aucun quiz trouvé</p>
                <p className="text-blue-300">Créez des quiz pour voir les résultats ici</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 flex items-center space-x-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="text-white text-lg">Chargement...</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Créer un nouveau quiz</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-blue-300">Fonctionnalité de création de quiz à implémenter</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && quizToEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Modifier le quiz</h2>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-blue-300">Fonctionnalité de modification de quiz à implémenter</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && quizToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Confirmer la suppression</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-blue-300 mb-6">
                Êtes-vous sûr de vouloir supprimer le quiz "{quizToDelete.title}" ? Cette action est irréversible.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quizToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Management Modal */}
      {showQuestionModal && quizToManageQuestions && (
        <QuestionManagementModal
          quiz={quizToManageQuestions}
          isOpen={showQuestionModal}
          onClose={() => {
            setShowQuestionModal(false);
            setQuizToManageQuestions(null);
          }}
        />
      )}

      {/* Modal de Statistiques Détaillées */}
      <QuizStatisticsModal
        quiz={quizForStatistics}
        isOpen={showStatisticsModal}
        onClose={() => {
          setShowStatisticsModal(false);
          setQuizForStatistics(null);
        }}
      />
    </div>
  );
};

export default QuizzesManagementTab;
