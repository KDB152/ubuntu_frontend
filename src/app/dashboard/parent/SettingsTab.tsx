'use client';

import React, { useEffect, useState } from 'react';
import { settingsAPI, authAPI } from '../../../lib/api';
import {
  Settings,
  Bell,
  Mail,
  Phone,
  Globe,
  Sun,
  Moon,
  Monitor,
  Save,
  Shield,
  Lock,
  X,
  Loader2
} from 'lucide-react';

interface ParentPrefs {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

interface SettingsTabProps {
  parent?: {
    id: string;
    firstName: string;
    lastName: string;
    preferences?: ParentPrefs;
  } | null;
}

const defaultPrefs: ParentPrefs = {
  theme: 'dark',
  language: 'fr',
  notifications: { email: true, sms: true, push: true }
};

const SettingsTab: React.FC<SettingsTabProps> = ({ parent }) => {
  const [prefs, setPrefs] = useState<ParentPrefs>(defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  // États pour le changement de mot de passe
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const userData = localStorage.getItem('userDetails');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
        
        const userPreferences = await settingsAPI.getUserPreferencesAsObject(user.id);
        
        const loadedPrefs: ParentPrefs = {
          theme: (userPreferences['preferences.theme'] as 'light' | 'dark' | 'auto') || 'dark',
          language: (userPreferences['preferences.language'] as 'fr' | 'en') || 'fr',
          notifications: {
            email: userPreferences['preferences.notifications.email'] !== 'false',
            sms: userPreferences['preferences.notifications.sms'] === 'true',
            push: userPreferences['preferences.notifications.push'] !== 'false'
          }
        };
        
        setPrefs(loadedPrefs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  const save = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const preferencesToSave = [
        { key: 'preferences.theme', value: prefs.theme, category: 'preferences' },
        { key: 'preferences.language', value: prefs.language, category: 'preferences' },
        { key: 'preferences.notifications.email', value: prefs.notifications.email.toString(), category: 'preferences' },
        { key: 'preferences.notifications.sms', value: prefs.notifications.sms.toString(), category: 'preferences' },
        { key: 'preferences.notifications.push', value: prefs.notifications.push.toString(), category: 'preferences' }
      ];

      await settingsAPI.bulkUpdateUserPreferences(userId, preferencesToSave);
      setSavedAt(new Date().toLocaleTimeString('fr-FR'));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validation des champs
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.new.length < 8) {
      alert('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setPasswordLoading(true);
    try {
      // Debug: Vérifier le token
      const token = localStorage.getItem('accessToken');
      console.log('🔍 Debug - Token exists:', !!token);
      console.log('🔍 Debug - Token (first 50 chars):', token ? token.substring(0, 50) + '...' : 'No token');
      console.log('🔍 Debug - Current password:', passwordData.current);
      console.log('🔍 Debug - New password:', passwordData.new);
      
      // Appel à l'API de changement de mot de passe
      const result = await authAPI.changePassword(passwordData.current, passwordData.new);
      console.log('🔍 Debug - API Response:', result);
      
      // Succès
      alert('Mot de passe modifié avec succès');
      setShowPasswordModal(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      // Gestion des erreurs
      console.error('🔍 Debug - Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.log('🔍 Debug - Error message:', errorMessage);
      
      if (errorMessage.includes('Mot de passe actuel incorrect')) {
        alert('Mot de passe actuel incorrect');
      } else if (errorMessage.includes('différent de l\'actuel')) {
        alert('Le nouveau mot de passe doit être différent de l\'actuel');
      } else {
        alert('Erreur lors du changement de mot de passe: ' + errorMessage);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Paramètres</h1>
            <p className="text-blue-200">Personnalisez votre expérience Chrono-Carto</p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 rounded-lg text-white"
          >
            <Save className="w-4 h-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
        {savedAt && (
          <div className="mt-2 text-blue-300 text-sm">Enregistré à {savedAt}</div>
        )}
      </div>

      {/* Thème et langue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5" /> Apparence
          </h2>
          <div className="space-y-3">
            <label className="block text-blue-200 text-sm">Thème</label>
            <div className="flex items-center gap-2">
              {[
                { id: 'auto', label: 'Auto', icon: Monitor },
                { id: 'light', label: 'Clair', icon: Sun },
                { id: 'dark', label: 'Sombre', icon: Moon }
              ].map(opt => {
                const Icon = opt.icon as any;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPrefs(p => ({ ...p, theme: opt.id as any }))}
                    className={`px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2 ${
                      prefs.theme === opt.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" /> Langue
          </h2>
          <select
            value={prefs.language}
            onChange={(e) => setPrefs(p => ({ ...p, language: e.target.value as any }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
            <Mail className="w-5 h-5 text-blue-300" />
            <span className="text-white">Email</span>
            <input
              type="checkbox"
              className="ml-auto w-5 h-5"
              checked={prefs.notifications.email}
              onChange={(e) => setPrefs(p => ({ ...p, notifications: { ...p.notifications, email: e.target.checked } }))}
            />
          </label>
          <label className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
            <Phone className="w-5 h-5 text-blue-300" />
            <span className="text-white">SMS</span>
            <input
              type="checkbox"
              className="ml-auto w-5 h-5"
              checked={prefs.notifications.sms}
              onChange={(e) => setPrefs(p => ({ ...p, notifications: { ...p.notifications, sms: e.target.checked } }))}
            />
          </label>
          <label className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
            <Bell className="w-5 h-5 text-blue-300" />
            <span className="text-white">Notifications push</span>
            <input
              type="checkbox"
              className="ml-auto w-5 h-5"
              checked={prefs.notifications.push}
              onChange={(e) => setPrefs(p => ({ ...p, notifications: { ...p.notifications, push: e.target.checked } }))}
            />
          </label>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Sécurité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2 text-white font-medium mb-2">
              <Lock className="w-4 h-4" /> Mot de passe
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
            >
              Changer le mot de passe
            </button>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2 text-white font-medium mb-2">
              <Shield className="w-4 h-4" /> Double authentification
            </div>
            <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Configurer 2FA</button>
          </div>
        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Changer le mot de passe</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 text-sm mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm || passwordLoading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Modification...</span>
                    </>
                  ) : (
                    <span>Changer</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;


