'use client';

import { useState, useEffect } from 'react';

export default function DebugStructurePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/debug/users-structure');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔍 Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Structure de la Base de Données</h1>
        
        {data && (
          <div className="space-y-6">
            {/* Structure de la table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">📋 Structure de la table users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Champ</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Null</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Clé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableStructure?.map((field: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2 font-mono">{field.Field}</td>
                        <td className="border border-gray-300 px-4 py-2">{field.Type}</td>
                        <td className="border border-gray-300 px-4 py-2">{field.Null}</td>
                        <td className="border border-gray-300 px-4 py-2">{field.Key}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Colonnes de vérification */}
            {data.verificationColumns && data.verificationColumns.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">🔐 Colonnes de vérification</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Colonne</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Nullable</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Défaut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.verificationColumns.map((col: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2 font-mono">{col.COLUMN_NAME}</td>
                          <td className="border border-gray-300 px-4 py-2">{col.DATA_TYPE}</td>
                          <td className="border border-gray-300 px-4 py-2">{col.IS_NULLABLE}</td>
                          <td className="border border-gray-300 px-4 py-2">{col.COLUMN_DEFAULT || 'NULL'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Utilisateurs avec tokens */}
            {data.usersWithTokens && data.usersWithTokens.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">👥 Utilisateurs avec tokens</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Token</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Expiration</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Vérifié</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.usersWithTokens.map((user: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                          <td className="border border-gray-300 px-4 py-2 font-mono text-xs">
                            {user.verification_token ? user.verification_token.substring(0, 20) + '...' : 'NULL'}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{user.email_verification_code_expiry || 'NULL'}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.email_verified ? '✅ Oui' : '❌ Non'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Exemple d'utilisateur complet */}
            {data.sampleUser && data.sampleUser.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">📊 Exemple d'utilisateur complet</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(data.sampleUser[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
