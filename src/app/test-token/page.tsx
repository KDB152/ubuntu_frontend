'use client';

import { useState } from 'react';

export default function TestTokenPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkToken = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/debug/token-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Test de Vérification de Token</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Vérifier un Token</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Collez le token ici..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={checkToken}
              disabled={loading || !token}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Résultat</h2>
            
            <div className="space-y-4">
              <div>
                <strong>Token trouvé :</strong> {result.tokenFound ? '✅ Oui' : '❌ Non'}
              </div>
              
              {result.tokenData && result.tokenData.length > 0 && (
                <div>
                  <strong>Données du token :</strong>
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify(result.tokenData, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.allTokens && result.allTokens.length > 0 && (
                <div>
                  <strong>Tous les tokens en base :</strong>
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify(result.allTokens, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.tableStructure && (
                <div>
                  <strong>Structure de la table users :</strong>
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify(result.tableStructure, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
