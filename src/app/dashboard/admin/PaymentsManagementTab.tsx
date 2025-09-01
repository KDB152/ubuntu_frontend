'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Euro,
  Download,
  Eye,
  Loader2,
  Edit
} from 'lucide-react';

// Liste des classes disponibles (même que dans l'enregistrement)
const AVAILABLE_CLASSES = [
  'Terminale groupe 1',
  'Terminale groupe 2',
  'Terminale groupe 3',
  'Terminale groupe 4',
  '1ère groupe 1',
  '1ère groupe 2',
  '1ère groupe 3'
];

interface Payment {
  id: number;
  student_id: number;
  parent_id: number | null;
  seances_total: number;
  seances_non_payees: number;
  seances_payees: number;
  montant_total: number;
  montant_paye: number;
  montant_restant: number;
  prix_seance: number;
  statut: string;
  date_derniere_presence: string | null;
  date_dernier_paiement: string | null;
  student_first_name: string;
  student_last_name: string;
  class_level: string;
  parent_first_name: string | null;
  parent_last_name: string | null;
  date_creation: string;
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
}

const PaymentsManagementTab: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('Total');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Charger la liste des paiements
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
             const params = new URLSearchParams();
       // Ajouter la classe sélectionnée seulement si ce n'est pas "Total"
       if (selectedClass !== 'Total') {
         params.append('class', selectedClass);
       }
      if (selectedStatus !== 'Tous') {
        params.append('status', selectedStatus);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des paiements');
      }
      
                     const data = await response.json();
        console.log('Données reçues de l\'API:', data);
        
        // Log détaillé pour déboguer
        if (data.length > 0) {
          console.log('🔍 Premier paiement détaillé:', {
            id: data[0].id,
            student: `${data[0].student_first_name} ${data[0].student_last_name}`,
            montant_total: data[0].montant_total,
            montant_paye: data[0].montant_paye,
            montant_restant: data[0].montant_restant,
            seances_total: data[0].seances_total,
            seances_payees: data[0].seances_payees,
            seances_non_payees: data[0].seances_non_payees
          });
        }
        
        setPayments(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du chargement des paiements:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedStatus, searchQuery]);

  // Filtrer les paiements - Les statistiques se basent sur ce tableau filtré
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchQuery === '' || 
      payment.student_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.student_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.class_level.toLowerCase().includes(searchQuery.toLowerCase());
    
         const matchesClass = selectedClass === 'Total' || payment.class_level === selectedClass;
    const matchesStatus = selectedStatus === 'Tous' || payment.statut === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Fonction pour calculer un total de manière sécurisée
  const calculateTotal = (payments: Payment[], field: keyof Payment): number => {
    return payments.reduce((sum, p) => {
      const value = p[field];
      if (typeof value === 'number' && !isNaN(value)) {
        return sum + value;
      }
      return sum;
    }, 0);
  };

  // Statistiques - Calculer les totaux à partir du tableau filtré affiché
  const stats: PaymentStats = {
    totalPayments: filteredPayments.length, // Nombre de paiements filtrés
    totalAmount: calculateTotal(filteredPayments, 'montant_total'), // Total du tableau affiché
    paidAmount: calculateTotal(filteredPayments, 'montant_paye'), // Total payé du tableau affiché
    unpaidAmount: calculateTotal(filteredPayments, 'montant_restant'), // Total non payé du tableau affiché
    overdueAmount: 0 // Supprimé
  };

  // Log des statistiques calculées
  console.log('📊 Statistiques calculées:', {
    totalPayments: stats.totalPayments,
    totalAmount: stats.totalAmount,
    paidAmount: stats.paidAmount,
    unpaidAmount: stats.unpaidAmount,
    filteredPaymentsLength: filteredPayments.length,
    paymentsLength: payments.length
  });

  // Obtenir la couleur de fond selon le statut
  const getStatusBgColor = (statut: string) => {
    switch (statut) {
      case 'paye': return 'bg-green-500/20 border-green-500/30';
      case 'partiel': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'en_attente': return 'bg-blue-500/20 border-blue-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  // Formater les dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Formater les montants
  const formatAmount = (amount: number) => {
    // Vérifier que le montant est un nombre valide
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '0,00 €';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Fonction pour voir les détails d'un paiement
  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  // Fonction pour éditer un paiement
  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  // Fonction pour marquer comme payé
  const handleMarkAsPaid = async (payment: Payment) => {
    try {
      const response = await fetch(`/api/admin/payments/${payment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut: 'paye',
          montant_paye: payment.montant_total,
          montant_restant: 0
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      // Recharger les paiements pour mettre à jour l'affichage
      await loadPayments();
      
      // Afficher un message de succès
      alert('Paiement marqué comme payé avec succès !');
      
    } catch (err) {
      console.error('Erreur lors du marquage comme payé:', err);
      alert('Erreur lors du marquage comme payé');
    }
  };

  // Fermer les modales
  const closeModals = () => {
    setShowEditModal(false);
    setShowDetailsModal(false);
    setSelectedPayment(null);
  };



  useEffect(() => {
    // Charger les paiements si une classe est sélectionnée ou si "Total" est choisi
    if (selectedClass) {
      loadPayments();
    }
  }, [loadPayments, selectedClass]);



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-lg text-white">Chargement des paiements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
                 <div className="text-center">
           <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur de chargement</h3>
           <p className="text-gray-600 mb-4">{error}</p>
           <button
             onClick={loadPayments}
             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
           >
             Réessayer
           </button>
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
              Gérez les paiements des étudiants et suivez leur statut financier
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-300" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white"
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Paiements</p>
              <p className="text-2xl font-bold text-white">{stats.totalPayments}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Montant Total</p>
              <p className="text-2xl font-bold text-white">{formatAmount(stats.totalAmount)}</p>
            </div>
            <Euro className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Payé</p>
              <p className="text-2xl font-bold text-green-400">{formatAmount(stats.paidAmount)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Non Payé</p>
              <p className="text-2xl font-bold text-orange-400">{formatAmount(stats.unpaidAmount)}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
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
              placeholder="Rechercher par nom, email ou classe..."
              className="pl-10 pr-4 py-3 w-full border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
            />
          </div>
          <div className="flex items-center space-x-3">
                                      {/* Filtre par classe */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
              >
                <option value="Total">Total (Toutes les classes)</option>
                {AVAILABLE_CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            
            {/* Filtre par statut */}
                         <select
               value={selectedStatus}
               onChange={(e) => setSelectedStatus(e.target.value)}
               className="px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
             >
               <option value="Tous">Tous les statuts</option>
               <option value="paye">Payé</option>
               <option value="partiel">Partiel</option>
               <option value="en_attente">En attente</option>
             </select>
            
            
          </div>
        </div>
      </div>

      {/* Liste des paiements */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="w-5 h-5 text-blue-300 mr-2" />
            Paiements ({filteredPayments.length})
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
                  Séances
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Montants
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {payment.student_first_name} {payment.student_last_name}
                      </div>
                      <div className="text-sm text-blue-200">
                        {payment.parent_first_name && payment.parent_last_name 
                          ? `Parent: ${payment.parent_first_name} ${payment.parent_last_name}`
                          : 'Aucun parent'
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {payment.class_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">Payées: {payment.seances_payees}</span>
                        <span className="text-orange-400">Non payées: {payment.seances_non_payees}</span>
                      </div>
                      <div className="text-xs text-blue-200">
                        Total: {payment.seances_total}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">Payé: {formatAmount(payment.montant_paye)}</span>
                        <span className="text-orange-400">Restant: {formatAmount(payment.montant_restant)}</span>
                      </div>
                      <div className="text-xs text-blue-200">
                        Total: {formatAmount(payment.montant_total)}
                      </div>
                    </div>
                  </td>
                                     <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBgColor(payment.statut)}`}>
                       {payment.statut === 'paye' && <CheckCircle className="w-3 h-3 mr-1" />}
                       {payment.statut === 'partiel' && <Clock className="w-3 h-3 mr-1" />}
                       {payment.statut === 'en_attente' && <Clock className="w-3 h-3 mr-1" />}
                       {payment.statut}
                     </span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMarkAsPaid(payment)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                        title="Marquer comme payé"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(payment)}
                        className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors"
                        title="Éditer"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-200">Aucun paiement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsManagementTab;
