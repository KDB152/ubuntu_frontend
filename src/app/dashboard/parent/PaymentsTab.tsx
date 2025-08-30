'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  Receipt,
  Wallet,
} from 'lucide-react';

interface PaymentsTabProps {
  selectedChild: { id: string | number; name?: string; firstName?: string; lastName?: string; fullName?: string } | null;
  parent: any;
  searchQuery: string;
}

interface PaymentInfo {
  studentId: number;
  parentId: number;
  fullName: string;
  email: string;
  classLevel: string;
  seancesTotal: number;
  seancesPayees: number;
  seancesNonPayees: number;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  prixSeance: number;
  statut: string;
  dateDernierePresence?: string;
  dateDernierPaiement?: string;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ selectedChild, parent, searchQuery }) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paidSessions, setPaidSessions] = useState(1);

  const loadPaymentInfo = async () => {
    console.log('🔍 PaymentsTab - loadPaymentInfo appelé');
    console.log('   selectedChild:', selectedChild);

    if (!selectedChild?.id) {
      console.log('   ❌ Aucun enfant sélectionné');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/payments?studentId=${selectedChild.id}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de paiement');
      }
      
      const data = await response.json();
      console.log('   ✅ Données de paiement récupérées:', data);
      
      setPaymentInfo(data);
    } catch (error) {
      console.error('   ❌ Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des informations de paiement');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedChild?.id || !paymentInfo) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedChild.id,
          paidSessions: paidSessions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du paiement');
      }

      const result = await response.json();
      setSuccess(result.message);
      
      // Recharger les informations de paiement
      await loadPaymentInfo();
      
      // Réinitialiser le nombre de séances
      setPaidSessions(1);
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du paiement');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    console.log('🔍 PaymentsTab - useEffect déclenché');
    console.log('   selectedChild?.id:', selectedChild?.id);
    loadPaymentInfo();
  }, [selectedChild?.id]);

  // Obtenir la couleur du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'paye': return 'text-green-500';
      case 'partiel': return 'text-yellow-500';
      case 'en_retard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Obtenir l'icône du statut
  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'paye': return <CheckCircle className="w-5 h-5" />;
      case 'partiel': return <AlertTriangle className="w-5 h-5" />;
      case 'en_retard': return <XCircle className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  // Obtenir la couleur de fond du statut
  const getStatusBgColor = (statut: string) => {
    switch (statut) {
      case 'paye': return 'bg-green-500/20 border-green-500/30';
      case 'partiel': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'en_retard': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-blue-200">Aucune information de paiement disponible</p>
        <p className="text-blue-300 text-sm mt-2">
          Enfant sélectionné: {selectedChild?.fullName || selectedChild?.firstName || 'Aucun'}
        </p>
        <p className="text-blue-300 text-sm">
          ID: {selectedChild?.id || 'Aucun'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Paiements - {paymentInfo.fullName}
            </h2>
            <p className="text-blue-200 mt-1">
              Gérez les paiements de votre enfant
            </p>
          </div>
          
          <button
            onClick={loadPaymentInfo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Séances</p>
              <p className="text-white text-2xl font-bold">{paymentInfo.seancesTotal}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Séances Payées</p>
              <p className="text-white text-2xl font-bold">{paymentInfo.seancesPayees}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm">Séances Non Payées</p>
              <p className="text-white text-2xl font-bold">{paymentInfo.seancesNonPayees}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm">Montant Restant</p>
              <p className="text-white text-2xl font-bold">{paymentInfo.montantRestant.toFixed(2)} €</p>
            </div>
            <Wallet className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Détails des paiements */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Détails des Paiements
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Prix par séance:</span>
              <span className="text-white font-medium">{paymentInfo.prixSeance.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Montant total:</span>
              <span className="text-white font-medium">{paymentInfo.montantTotal.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Montant payé:</span>
              <span className="text-green-400 font-medium">{paymentInfo.montantPaye.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Montant restant:</span>
              <span className="text-red-400 font-medium">{paymentInfo.montantRestant.toFixed(2)} €</span>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusBgColor(paymentInfo.statut)}`}>
                <span className="text-white font-medium">Statut:</span>
                <div className={`flex items-center gap-2 ${getStatusColor(paymentInfo.statut)}`}>
                  {getStatusIcon(paymentInfo.statut)}
                  <span className="font-medium capitalize">{paymentInfo.statut}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions de paiement */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Effectuer un Paiement
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Nombre de séances à payer
              </label>
              <input
                type="number"
                min="1"
                max={paymentInfo.seancesNonPayees}
                value={paidSessions}
                onChange={(e) => setPaidSessions(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-gray-400 text-sm mt-1">
                Maximum: {paymentInfo.seancesNonPayees} séances disponibles
              </p>
            </div>
            
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Montant à payer:</span>
                <span className="text-white font-bold text-lg">
                  {(paidSessions * paymentInfo.prixSeance).toFixed(2)} €
                </span>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={updating || paymentInfo.seancesNonPayees === 0 || paidSessions > paymentInfo.seancesNonPayees}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Payer {paidSessions} séance(s)
                </>
              )}
            </button>
            
            {paymentInfo.seancesNonPayees === 0 && (
              <div className="text-center py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-green-200 text-sm">Toutes les séances sont payées !</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historique des paiements */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Historique des Paiements
        </h3>
        
        <div className="space-y-3">
          {paymentInfo.dateDernierePresence && (
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-blue-200">Dernière présence:</span>
              <span className="text-white">
                {new Date(paymentInfo.dateDernierePresence).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
          
          {paymentInfo.dateDernierPaiement && (
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-blue-200">Dernier paiement:</span>
              <span className="text-white">
                {new Date(paymentInfo.dateDernierPaiement).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
          
          {!paymentInfo.dateDernierePresence && !paymentInfo.dateDernierPaiement && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Aucun historique disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;