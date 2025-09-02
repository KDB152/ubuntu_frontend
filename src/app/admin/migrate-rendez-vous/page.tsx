'use client';

import React, { useState } from 'react';

const MigrateRendezVousPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const executeMigration = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/migrate-rendez-vous', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur lors de la migration');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Migration de la table Rendez-vous
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Cette migration va ajouter les colonnes nécessaires pour connecter la table 
              <code className="bg-gray-100 px-2 py-1 rounded">rendez_vous</code> aux vraies 
              tables <code className="bg-gray-100 px-2 py-1 rounded">users</code> et 
              <code className="bg-gray-100 px-2 py-1 rounded">students</code>.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Colonnes à ajouter :</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• <code>child_id</code> - Référence à la table students</li>
                <li>• <code>parent_id_int</code> - Référence numérique à la table users</li>
              </ul>
            </div>
          </div>

          <button
            onClick={executeMigration}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Migration en cours...' : 'Exécuter la Migration'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Erreur :</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Migration réussie !</h3>
              <div className="text-green-700 space-y-2">
                <p><strong>Message :</strong> {result.message}</p>
                <p><strong>Colonnes ajoutées :</strong> {result.details.columnsAdded.join(', ')}</p>
                <p><strong>Index créés :</strong> {result.details.indexesCreated.join(', ')}</p>
                <p><strong>Données mises à jour :</strong> {result.details.dataUpdated} lignes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrateRendezVousPage;
