'use client';

import React, { useState, useEffect } from 'react';

const TestRendezVousPage = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testTable = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-rendez-vous');
      const data = await response.json();

      if (response.ok) {
        setTestResult(data);
      } else {
        setError(data.error || 'Erreur lors du test');
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
            Test de la table Rendez-vous
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Cette page permet de tester la connexion à la base de données et 
              d'afficher la structure de la table <code className="bg-gray-100 px-2 py-1 rounded">rendez_vous</code>.
            </p>
          </div>

          <button
            onClick={testTable}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Test en cours...' : 'Tester la table'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Erreur :</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {testResult && (
            <div className="mt-6 space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Test réussi !</h3>
                <p className="text-green-700">{testResult.message}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Structure de la table :</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(testResult.data.structure, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Nombre total de rendez-vous :</h3>
                <p className="text-gray-700">{testResult.data.totalCount}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Exemples de données :</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(testResult.data.samples, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestRendezVousPage;
