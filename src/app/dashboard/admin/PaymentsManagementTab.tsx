'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Plus, Minus, RefreshCw, Users, CheckCircle, AlertCircle, Edit, Save, X } from 'lucide-react';

interface StudentPayment {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  class_level: string;
  paid_sessions: number;
  unpaid_sessions: number;
  is_active: boolean;
}

const PaymentsManagementTab: React.FC = () => {
  const [students, setStudents] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentPayment | null>(null);
  const [sessionsToModify, setSessionsToModify] = useState(1);
  const [selectedAction, setSelectedAction] = useState('add_unpaid');
  
  // Nouvelles variables pour la modification directe
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [editPaidSessions, setEditPaidSessions] = useState(0);
  const [editUnpaidSessions, setEditUnpaidSessions] = useState(0);

  // Charger la liste des étudiants avec leurs informations de paiement
  const loadStudentsPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/attendance');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des étudiants');
      }
      const data = await response.json();
      
      // Les données sont déjà dans le bon format
      setStudents(data);
      setMessage('');
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  // Effectuer une action sur les paiements
  const performPaymentAction = async () => {
    if (!selectedStudent || sessionsToModify <= 0) {
      setMessage('Veuillez sélectionner un étudiant et un nombre valide de séances');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.student_id,
          action: selectedAction,
          sessions: sessionsToModify
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'action');
      }

      // Recharger la liste
      await loadStudentsPayments();
      setMessage('Action effectuée avec succès');
      setTimeout(() => setMessage(''), 3000);
      setSessionsToModify(1);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`Erreur: ${(error as Error).message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Commencer l'édition d'un étudiant
  const startEditing = (student: StudentPayment) => {
    setEditingStudent(student.student_id);
    setEditPaidSessions(student.paid_sessions || 0);
    setEditUnpaidSessions(student.unpaid_sessions || 0);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingStudent(null);
    setEditPaidSessions(0);
    setEditUnpaidSessions(0);
  };

  // Sauvegarder les modifications
  const saveEditing = async () => {
    if (editingStudent === null) return;

    try {
      setUpdating(true);
      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: editingStudent,
          action: 'set_both_sessions',
          paidSessions: editPaidSessions,
          unpaidSessions: editUnpaidSessions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification');
      }

      // Recharger la liste
      await loadStudentsPayments();
      setMessage('Modifications sauvegardées avec succès');
      setTimeout(() => setMessage(''), 3000);
      cancelEditing();
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`Erreur: ${(error as Error).message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Calculer les statistiques globales
  const stats = {
    totalStudents: students.length,
    totalPaidSessions: students.reduce((sum, s) => sum + (s.paid_sessions || 0), 0),
    totalUnpaidSessions: students.reduce((sum, s) => sum + (s.unpaid_sessions || 0), 0),
    totalSessions: students.reduce((sum, s) => sum + (s.paid_sessions || 0) + (s.unpaid_sessions || 0), 0),
    activeStudents: students.filter(s => s.is_active).length
  };

  useEffect(() => {
    loadStudentsPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-lg">Chargement des paiements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <CreditCard className="w-6 h-6 text-blue-300 mr-3" />
              Gestion des Paiements
            </h1>
            <p className="text-blue-200 mt-1">
              Gérez les paiements et les séances des étudiants
            </p>
          </div>
          <button
            onClick={loadStudentsPayments}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Étudiants</p>
              <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Étudiants Actifs</p>
              <p className="text-2xl font-bold text-green-400">{stats.activeStudents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Séances Payées</p>
              <p className="text-2xl font-bold text-green-400">{stats.totalPaidSessions}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Séances Non Payées</p>
              <p className="text-2xl font-bold text-red-400">{stats.totalUnpaidSessions}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-200">{message}</p>
        </div>
      )}

      {/* Actions de paiement */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-white text-xl font-bold mb-6">Actions de Paiement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection de l'étudiant */}
          <div className="space-y-4">
            <label className="text-blue-200 font-medium">Sélectionner un étudiant:</label>
            <select
              value={selectedStudent?.student_id || ''}
              onChange={(e) => {
                const student = students.find(s => s.student_id === parseInt(e.target.value));
                setSelectedStudent(student || null);
              }}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-full"
            >
              <option value="">Choisir un étudiant...</option>
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.first_name} {student.last_name} - {student.class_level}
                </option>
              ))}
            </select>
          </div>

          {/* Configuration de l'action */}
          <div className="space-y-4">
            <label className="text-blue-200 font-medium">Action:</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-full"
            >
              <option value="add_unpaid">Ajouter des séances non payées</option>
              <option value="remove_unpaid">Retirer des séances non payées</option>
              <option value="add_paid">Ajouter des séances payées</option>
              <option value="remove_paid">Retirer des séances payées</option>
            </select>
          </div>
        </div>

        {/* Nombre de séances */}
        <div className="mt-4 space-y-4">
          <label className="text-blue-200 font-medium">Nombre de séances:</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              value={sessionsToModify}
              onChange={(e) => setSessionsToModify(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-32"
            />
            <button
              onClick={performPaymentAction}
              disabled={updating || !selectedStudent}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                !selectedStudent
                  ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                  : selectedAction.includes('unpaid')
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {selectedAction.includes('add') ? <Plus size={16} /> : <Minus size={16} />}
              <span>
                {selectedAction.includes('add') ? 'Ajouter' : 'Retirer'} Séances
              </span>
            </button>
          </div>
        </div>

        {/* Informations de l'étudiant sélectionné */}
        {selectedStudent && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-blue-200 font-semibold mb-3">Informations de {selectedStudent.first_name} {selectedStudent.last_name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Séances payées:</span>
                <span className="text-green-400 ml-2 font-medium">{selectedStudent.paid_sessions || 0}</span>
              </div>
              <div>
                <span className="text-blue-200">Séances non payées:</span>
                <span className="text-red-400 ml-2 font-medium">{selectedStudent.unpaid_sessions || 0}</span>
              </div>
              <div>
                <span className="text-blue-200">Total séances:</span>
                <span className="text-white ml-2 font-medium">{(selectedStudent.paid_sessions || 0) + (selectedStudent.unpaid_sessions || 0)}</span>
              </div>
              <div>
                <span className="text-blue-200">Statut:</span>
                <span className={`ml-2 font-medium ${selectedStudent.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedStudent.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des étudiants */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Users className="w-5 h-5 text-blue-300 mr-2" />
            Étudiants ({students.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Séances Payées
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Séances Non Payées
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {students.map((student) => (
                <tr key={student.student_id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-sm text-blue-200">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.class_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingStudent === student.student_id ? (
                      <input
                        type="number"
                        min="0"
                        value={editPaidSessions}
                        onChange={(e) => setEditPaidSessions(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      />
                    ) : (
                      <span className="text-green-400 font-medium">{student.paid_sessions || 0}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingStudent === student.student_id ? (
                      <input
                        type="number"
                        min="0"
                        value={editUnpaidSessions}
                        onChange={(e) => setEditUnpaidSessions(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      />
                    ) : (
                      <span className="text-red-400 font-medium">{student.unpaid_sessions || 0}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      {editingStudent === student.student_id 
                        ? editPaidSessions + editUnpaidSessions
                        : (student.paid_sessions || 0) + (student.unpaid_sessions || 0)
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingStudent === student.student_id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={saveEditing}
                          disabled={updating}
                          className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          title="Sauvegarder"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updating}
                          className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          title="Annuler"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(student)}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Modifier les séances"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-200">Aucun étudiant trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsManagementTab;
