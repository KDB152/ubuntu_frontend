'use client';

import React from 'react';
import SecuritySettings from '@/components/SecuritySettings';

interface SettingsTabProps {
  admin: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ admin }) => {
  // Récupérer l'ID utilisateur depuis localStorage
  const getUserDetails = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userDetails');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    }
    return 0;
  };

  const userId = getUserDetails();

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h1 className="text-white text-base font-bold mb-2">Paramètres Administrateur</h1>
        <p className="text-blue-200">Gérez vos préférences et paramètres de sécurité</p>
      </div>

      {/* Paramètres de sécurité */}
      <SecuritySettings 
        userId={userId}
        currentEmail={admin?.email || ''}
      />

      {/* Paramètres d'administration */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-base mb-4">Paramètres d'administration</h3>
        <p className="text-blue-200 text-sm">Configuration des privilèges et accès à venir...</p>
      </div>

      {/* Paramètres système */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-base mb-4">Paramètres système</h3>
        <p className="text-blue-200 text-sm">Configuration du système à venir...</p>
      </div>
    </div>
  );
};

export default SettingsTab;
