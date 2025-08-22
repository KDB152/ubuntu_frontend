'use client';

import React, { useEffect, useState } from 'react';
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
  const [prefs, setPrefs] = useState<ParentPrefs>(parent?.preferences || defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (parent?.preferences) setPrefs(parent.preferences);
  }, [parent]);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedAt(new Date().toLocaleTimeString('fr-FR'));
    }, 800);
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
            <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Changer le mot de passe</button>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2 text-white font-medium mb-2">
              <Shield className="w-4 h-4" /> Double authentification
            </div>
            <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Configurer 2FA</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;


