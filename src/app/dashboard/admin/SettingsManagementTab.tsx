'use client';

import React, { useState, useEffect } from 'react';
import { settingsAPI, authAPI } from '../../../lib/api';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Mail,
  Lock,
  Globe,
  Monitor,
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Key,
  Server,
  Cloud,
  HardDrive,
  Wifi,
  Camera,
  Mic,
  Volume2,
  Zap,
  Clock,
  Calendar,
  MapPin,
  Phone,
  AtSign,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Loader2,
  X,
  Plus,
  Edit,
  Copy,
  Share2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requirePasswordChange: boolean;
    allowRegistration: boolean;
    emailVerification: boolean;
    ipWhitelist: string[];
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    newUserRegistration: boolean;
    newMessage: boolean;
    quizCompleted: boolean;
    systemAlerts: boolean;
    maintenanceMode: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;
    faviconUrl: string;
    customCss: string;
    showBranding: boolean;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageProvider: 'local' | 'aws' | 'gcp' | 'azure';
    storageQuota: number;
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
  };
  integrations: {
    googleAnalytics: string;
    googleMaps: string;
    emailProvider: 'smtp' | 'sendgrid' | 'mailgun';
    smsProvider: 'twilio' | 'nexmo' | 'aws';
    paymentProvider: 'stripe' | 'paypal' | 'square';
    socialLogin: {
      google: boolean;
      facebook: boolean;
      microsoft: boolean;
    };
  };
}

const SettingsManagementTab = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      adminEmail: '',
      timezone: '',
      language: '',
      dateFormat: '',
      timeFormat: ''
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requirePasswordChange: false,
      allowRegistration: true,
      emailVerification: true,
      ipWhitelist: []
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newUserRegistration: true,
      newMessage: true,
      quizCompleted: true,
      systemAlerts: true,
      maintenanceMode: false
    },
    appearance: {
      theme: 'dark',
      primaryColor: '#3B82F6',
      secondaryColor: '#6366F1',
      accentColor: '#F59E0B',
      logoUrl: '',
      faviconUrl: '',
      customCss: '',
      showBranding: true
    },
    storage: {
      maxFileSize: 100,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'avi', 'mov'],
      storageProvider: 'local',
      storageQuota: 10000,
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30
    },
    integrations: {
      googleAnalytics: '',
      googleMaps: '',
      emailProvider: 'smtp',
      smsProvider: 'twilio',
      paymentProvider: 'stripe',
      socialLogin: {
        google: false,
        facebook: false,
        microsoft: false
      }
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'appearance' | 'storage' | 'integrations'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load settings from database on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const systemSettings = await settingsAPI.getSystemSettingsAsObject();
      
      // Map database settings to component state
      const mappedSettings: SystemSettings = {
        general: {
          siteName: systemSettings['site.name'] || '',
          siteDescription: systemSettings['site.description'] || '',
          siteUrl: systemSettings['site.url'] || '',
          adminEmail: systemSettings['site.admin_email'] || '',
          timezone: systemSettings['site.timezone'] || '',
          language: systemSettings['site.language'] || '',
          dateFormat: systemSettings['site.date_format'] || 'DD/MM/YYYY',
          timeFormat: systemSettings['site.time_format'] || '24h'
        },
        security: {
          enableTwoFactor: systemSettings['security.enable_two_factor'] === 'true',
          sessionTimeout: parseInt(systemSettings['security.session_timeout']) || 30,
          maxLoginAttempts: parseInt(systemSettings['security.max_login_attempts']) || 5,
          passwordMinLength: parseInt(systemSettings['security.password_min_length']) || 8,
          requirePasswordChange: systemSettings['security.require_password_change'] === 'true',
          allowRegistration: systemSettings['security.allow_registration'] !== 'false',
          emailVerification: systemSettings['security.email_verification'] !== 'false',
          ipWhitelist: systemSettings['security.ip_whitelist'] ? JSON.parse(systemSettings['security.ip_whitelist']) : []
        },
        notifications: {
          emailNotifications: systemSettings['notifications.email'] !== 'false',
          smsNotifications: systemSettings['notifications.sms'] === 'true',
          pushNotifications: systemSettings['notifications.push'] !== 'false',
          newUserRegistration: systemSettings['notifications.new_user_registration'] !== 'false',
          newMessage: systemSettings['notifications.new_message'] !== 'false',
          quizCompleted: systemSettings['notifications.quiz_completed'] !== 'false',
          systemAlerts: systemSettings['notifications.system_alerts'] !== 'false',
          maintenanceMode: systemSettings['notifications.maintenance_mode'] === 'true'
        },
        appearance: {
          theme: (systemSettings['appearance.theme'] as 'light' | 'dark' | 'auto') || 'dark',
          primaryColor: systemSettings['appearance.primary_color'] || '#3B82F6',
          secondaryColor: systemSettings['appearance.secondary_color'] || '#6366F1',
          accentColor: systemSettings['appearance.accent_color'] || '#F59E0B',
          logoUrl: systemSettings['appearance.logo_url'] || '',
          faviconUrl: systemSettings['appearance.favicon_url'] || '',
          customCss: systemSettings['appearance.custom_css'] || '',
          showBranding: systemSettings['appearance.show_branding'] !== 'false'
        },
        storage: {
          maxFileSize: parseInt(systemSettings['storage.max_file_size']) || 100,
          allowedFileTypes: systemSettings['storage.allowed_file_types'] ? JSON.parse(systemSettings['storage.allowed_file_types']) : ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'avi', 'mov'],
          storageProvider: (systemSettings['storage.provider'] as 'local' | 'aws' | 'gcp' | 'azure') || 'local',
          storageQuota: parseInt(systemSettings['storage.quota']) || 10000,
          autoBackup: systemSettings['storage.auto_backup'] !== 'false',
          backupFrequency: (systemSettings['storage.backup_frequency'] as 'daily' | 'weekly' | 'monthly') || 'daily',
          retentionPeriod: parseInt(systemSettings['storage.retention_period']) || 30
        },
        integrations: {
          googleAnalytics: systemSettings['integrations.google_analytics'] || '',
          googleMaps: systemSettings['integrations.google_maps'] || '',
          emailProvider: (systemSettings['integrations.email_provider'] as 'smtp' | 'sendgrid' | 'mailgun') || 'smtp',
          smsProvider: (systemSettings['integrations.sms_provider'] as 'twilio' | 'nexmo' | 'aws') || 'twilio',
          paymentProvider: (systemSettings['integrations.payment_provider'] as 'stripe' | 'paypal' | 'square') || 'stripe',
          socialLogin: {
            google: systemSettings['integrations.social_login.google'] === 'true',
            facebook: systemSettings['integrations.social_login.facebook'] === 'true',
            microsoft: systemSettings['integrations.social_login.microsoft'] === 'true'
          }
        }
      };
      
      setSettings(mappedSettings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      showNotification('error', 'Erreur lors du chargement des paramètres');
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSettingsChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleNestedSettingsChange = (section: keyof SystemSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Convert component state to database format
      const settingsToSave = [
        // General settings
        { key: 'site.name', value: settings.general.siteName, category: 'general' },
        { key: 'site.description', value: settings.general.siteDescription, category: 'general' },
        { key: 'site.url', value: settings.general.siteUrl, category: 'general' },
        { key: 'site.admin_email', value: settings.general.adminEmail, category: 'general' },
        { key: 'site.timezone', value: settings.general.timezone, category: 'general' },
        { key: 'site.language', value: settings.general.language, category: 'general' },
        { key: 'site.date_format', value: settings.general.dateFormat, category: 'general' },
        { key: 'site.time_format', value: settings.general.timeFormat, category: 'general' },
        
        // Security settings
        { key: 'security.enable_two_factor', value: settings.security.enableTwoFactor.toString(), category: 'security' },
        { key: 'security.session_timeout', value: settings.security.sessionTimeout.toString(), category: 'security' },
        { key: 'security.max_login_attempts', value: settings.security.maxLoginAttempts.toString(), category: 'security' },
        { key: 'security.password_min_length', value: settings.security.passwordMinLength.toString(), category: 'security' },
        { key: 'security.require_password_change', value: settings.security.requirePasswordChange.toString(), category: 'security' },
        { key: 'security.allow_registration', value: settings.security.allowRegistration.toString(), category: 'security' },
        { key: 'security.email_verification', value: settings.security.emailVerification.toString(), category: 'security' },
        { key: 'security.ip_whitelist', value: JSON.stringify(settings.security.ipWhitelist), category: 'security' },
        
        // Notifications settings
        { key: 'notifications.email', value: settings.notifications.emailNotifications.toString(), category: 'notifications' },
        { key: 'notifications.sms', value: settings.notifications.smsNotifications.toString(), category: 'notifications' },
        { key: 'notifications.push', value: settings.notifications.pushNotifications.toString(), category: 'notifications' },
        { key: 'notifications.new_user_registration', value: settings.notifications.newUserRegistration.toString(), category: 'notifications' },
        { key: 'notifications.new_message', value: settings.notifications.newMessage.toString(), category: 'notifications' },
        { key: 'notifications.quiz_completed', value: settings.notifications.quizCompleted.toString(), category: 'notifications' },
        { key: 'notifications.system_alerts', value: settings.notifications.systemAlerts.toString(), category: 'notifications' },
        { key: 'notifications.maintenance_mode', value: settings.notifications.maintenanceMode.toString(), category: 'notifications' },
        
        // Appearance settings
        { key: 'appearance.theme', value: settings.appearance.theme, category: 'appearance' },
        { key: 'appearance.primary_color', value: settings.appearance.primaryColor, category: 'appearance' },
        { key: 'appearance.secondary_color', value: settings.appearance.secondaryColor, category: 'appearance' },
        { key: 'appearance.accent_color', value: settings.appearance.accentColor, category: 'appearance' },
        { key: 'appearance.logo_url', value: settings.appearance.logoUrl, category: 'appearance' },
        { key: 'appearance.favicon_url', value: settings.appearance.faviconUrl, category: 'appearance' },
        { key: 'appearance.custom_css', value: settings.appearance.customCss, category: 'appearance' },
        { key: 'appearance.show_branding', value: settings.appearance.showBranding.toString(), category: 'appearance' },
        
        // Storage settings
        { key: 'storage.max_file_size', value: settings.storage.maxFileSize.toString(), category: 'storage' },
        { key: 'storage.allowed_file_types', value: JSON.stringify(settings.storage.allowedFileTypes), category: 'storage' },
        { key: 'storage.provider', value: settings.storage.storageProvider, category: 'storage' },
        { key: 'storage.quota', value: settings.storage.storageQuota.toString(), category: 'storage' },
        { key: 'storage.auto_backup', value: settings.storage.autoBackup.toString(), category: 'storage' },
        { key: 'storage.backup_frequency', value: settings.storage.backupFrequency, category: 'storage' },
        { key: 'storage.retention_period', value: settings.storage.retentionPeriod.toString(), category: 'storage' },
        
        // Integrations settings
        { key: 'integrations.google_analytics', value: settings.integrations.googleAnalytics, category: 'integrations' },
        { key: 'integrations.google_maps', value: settings.integrations.googleMaps, category: 'integrations' },
        { key: 'integrations.email_provider', value: settings.integrations.emailProvider, category: 'integrations' },
        { key: 'integrations.sms_provider', value: settings.integrations.smsProvider, category: 'integrations' },
        { key: 'integrations.payment_provider', value: settings.integrations.paymentProvider, category: 'integrations' },
        { key: 'integrations.social_login.google', value: settings.integrations.socialLogin.google.toString(), category: 'integrations' },
        { key: 'integrations.social_login.facebook', value: settings.integrations.socialLogin.facebook.toString(), category: 'integrations' },
        { key: 'integrations.social_login.microsoft', value: settings.integrations.socialLogin.microsoft.toString(), category: 'integrations' }
      ];

      await settingsAPI.bulkUpdateSystemSettings(settingsToSave);
      showNotification('success', 'Paramètres sauvegardés avec succès');
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification('error', 'Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Réinitialisation aux valeurs par défaut
        window.location.reload();
      } catch (error) {
        showNotification('error', 'Erreur lors de la réinitialisation');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chronocarto-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Paramètres exportés avec succès');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setUnsavedChanges(true);
          showNotification('success', 'Paramètres importés avec succès');
        } catch (error) {
          showNotification('error', 'Erreur lors de l\'importation du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  const changePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      showNotification('error', 'Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwords.new.length < 8) {
      showNotification('error', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    try {
      // Debug: Vérifier le token
      const token = localStorage.getItem('accessToken');
      console.log('🔍 Debug - Token exists:', !!token);
      console.log('🔍 Debug - Token (first 50 chars):', token ? token.substring(0, 50) + '...' : 'No token');
      console.log('🔍 Debug - Current password:', passwords.current);
      console.log('🔍 Debug - New password:', passwords.new);

      // Appel à l'API de changement de mot de passe
      const result = await authAPI.changePassword(passwords.current, passwords.new);
      console.log('🔍 Debug - API Response:', result);
      
      showNotification('success', 'Mot de passe modifié avec succès');
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordFields(false);
    } catch (error) {
      console.error('🔍 Debug - Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.log('🔍 Debug - Error message:', errorMessage);
      
      if (errorMessage.includes('Mot de passe actuel incorrect')) {
        showNotification('error', 'Mot de passe actuel incorrect');
      } else if (errorMessage.includes('différent de l\'actuel')) {
        showNotification('error', 'Le nouveau mot de passe doit être différent de l\'actuel');
      } else {
        showNotification('error', 'Erreur lors du changement de mot de passe: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('success', 'Email de test envoyé avec succès');
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'envoi de l\'email de test');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('success', 'Cache vidé avec succès');
    } catch (error) {
      showNotification('error', 'Erreur lors du vidage du cache');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'storage', label: 'Stockage', icon: Database },
    { id: 'integrations', label: 'Intégrations', icon: Zap }
  ];

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-xl border ${
          notification.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30 text-green-100' 
            : notification.type === 'error'
            ? 'bg-red-500/20 border-red-500/30 text-red-100'
            : 'bg-blue-500/20 border-blue-500/30 text-blue-100'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : notification.type === 'error' ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Settings className="w-8 h-8 text-blue-300 mr-4" />
              Paramètres système
            </h1>
            <p className="text-blue-200 mt-2">Configurez votre plateforme Chrono-Carto</p>
            {unsavedChanges && (
              <div className="flex items-center space-x-2 mt-3 text-yellow-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Vous avez des modifications non sauvegardées</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
              id="import-settings"
            />
            <label
              htmlFor="import-settings"
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Importer</span>
            </label>
            <button
              onClick={exportSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            <button
              onClick={resetSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
            <button
              onClick={saveSettings}
              disabled={isLoading || !unsavedChanges}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-6 h-6 text-blue-300 mr-3" />
                Paramètres généraux
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Nom du site</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingsChange('general', 'siteName', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">URL du site</label>
                  <input
                    type="url"
                    value={settings.general.siteUrl}
                    onChange={(e) => handleSettingsChange('general', 'siteUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-white mb-2">Description du site</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingsChange('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email administrateur</label>
                  <input
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => handleSettingsChange('general', 'adminEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Fuseau horaire</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingsChange('general', 'timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Langue</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleSettingsChange('general', 'language', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Format de date</label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => handleSettingsChange('general', 'dateFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="border-t border-white/20 pt-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Key className="w-5 h-5 text-blue-300 mr-2" />
                Mot de passe administrateur
              </h3>
              
              {!showPasswordFields ? (
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier le mot de passe</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Mot de passe actuel</label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={changePassword}
                      disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Changer le mot de passe</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswords({ current: '', new: '', confirm: '' });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 text-blue-300 mr-3" />
                Paramètres de sécurité
              </h2>
              
              <div className="space-y-6">
                {/* Authentification */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Authentification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.enableTwoFactor}
                          onChange={(e) => handleSettingsChange('security', 'enableTwoFactor', e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-white">Activer l'authentification à deux facteurs</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.emailVerification}
                          onChange={(e) => handleSettingsChange('security', 'emailVerification', e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-white">Vérification email obligatoire</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Timeout de session (minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingsChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Tentatives de connexion max</label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => handleSettingsChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Mots de passe */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Politique des mots de passe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Longueur minimale</label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleSettingsChange('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.requirePasswordChange}
                          onChange={(e) => handleSettingsChange('security', 'requirePasswordChange', e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-white">Forcer le changement de mot de passe</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Inscription */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Inscription</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.allowRegistration}
                        onChange={(e) => handleSettingsChange('security', 'allowRegistration', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Autoriser les nouvelles inscriptions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Bell className="w-6 h-6 text-blue-300 mr-3" />
                Paramètres de notifications
              </h2>
              
              <div className="space-y-6">
                {/* Types de notifications */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Types de notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingsChange('notifications', 'emailNotifications', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <Mail className="w-5 h-5 text-blue-300" />
                      <span className="text-white">Notifications par email</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingsChange('notifications', 'smsNotifications', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <Phone className="w-5 h-5 text-blue-300" />
                      <span className="text-white">Notifications par SMS</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingsChange('notifications', 'pushNotifications', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <Smartphone className="w-5 h-5 text-blue-300" />
                      <span className="text-white">Notifications push</span>
                    </label>
                  </div>
                </div>

                {/* Événements */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Événements à notifier</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newUserRegistration}
                        onChange={(e) => handleSettingsChange('notifications', 'newUserRegistration', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Nouvelle inscription</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newMessage}
                        onChange={(e) => handleSettingsChange('notifications', 'newMessage', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Nouveau message</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.quizCompleted}
                        onChange={(e) => handleSettingsChange('notifications', 'quizCompleted', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Quiz terminé</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemAlerts}
                        onChange={(e) => handleSettingsChange('notifications', 'systemAlerts', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Alertes système</span>
                    </label>
                  </div>
                </div>

                {/* Test des notifications */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Test des notifications</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={testEmailSettings}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Tester l'email</span>
                    </button>
                    <span className="text-blue-300 text-sm">Envoie un email de test à l'adresse administrateur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Palette className="w-6 h-6 text-blue-300 mr-3" />
                Paramètres d'apparence
              </h2>
              
              <div className="space-y-6">
                {/* Thème */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Thème</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={settings.appearance.theme === 'light'}
                        onChange={(e) => handleSettingsChange('appearance', 'theme', e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Clair</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={settings.appearance.theme === 'dark'}
                        onChange={(e) => handleSettingsChange('appearance', 'theme', e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Sombre</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="auto"
                        checked={settings.appearance.theme === 'auto'}
                        onChange={(e) => handleSettingsChange('appearance', 'theme', e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Automatique</span>
                    </label>
                  </div>
                </div>

                {/* Couleurs */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Couleurs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Couleur primaire</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-12 border border-white/20 rounded-lg bg-white/10"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Couleur secondaire</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'secondaryColor', e.target.value)}
                          className="w-12 h-12 border border-white/20 rounded-lg bg-white/10"
                        />
                        <input
                          type="text"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'secondaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Couleur d'accent</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleSettingsChange('appearance', 'accentColor', e.target.value)}
                          className="w-12 h-12 border border-white/20 rounded-lg bg-white/10"
                        />
                        <input
                          type="text"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleSettingsChange('appearance', 'accentColor', e.target.value)}
                          className="flex-1 px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo et branding */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Logo et branding</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">URL du logo</label>
                      <input
                        type="url"
                        value={settings.appearance.logoUrl}
                        onChange={(e) => handleSettingsChange('appearance', 'logoUrl', e.target.value)}
                        placeholder="https://exemple.com/logo.png"
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">URL du favicon</label>
                      <input
                        type="url"
                        value={settings.appearance.faviconUrl}
                        onChange={(e) => handleSettingsChange('appearance', 'faviconUrl', e.target.value)}
                        placeholder="https://exemple.com/favicon.ico"
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                      />
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.appearance.showBranding}
                        onChange={(e) => handleSettingsChange('appearance', 'showBranding', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Afficher le branding Chrono-Carto</span>
                    </label>
                  </div>
                </div>

                {/* CSS personnalisé */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">CSS personnalisé</h3>
                  <textarea
                    value={settings.appearance.customCss}
                    onChange={(e) => handleSettingsChange('appearance', 'customCss', e.target.value)}
                    rows={8}
                    placeholder="/* Votre CSS personnalisé ici */"
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Database className="w-6 h-6 text-blue-300 mr-3" />
                Paramètres de stockage
              </h2>
              
              <div className="space-y-6">
                {/* Fichiers */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Gestion des fichiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Taille max par fichier (MB)</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={settings.storage.maxFileSize}
                        onChange={(e) => handleSettingsChange('storage', 'maxFileSize', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Quota de stockage (MB)</label>
                      <input
                        type="number"
                        min="1000"
                        max="100000"
                        value={settings.storage.storageQuota}
                        onChange={(e) => handleSettingsChange('storage', 'storageQuota', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-white mb-2">Types de fichiers autorisés</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'avi', 'mov', 'jpg', 'png', 'gif', 'txt'].map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.storage.allowedFileTypes.includes(type)}
                            onChange={(e) => {
                              const types = e.target.checked 
                                ? [...settings.storage.allowedFileTypes, type]
                                : settings.storage.allowedFileTypes.filter(t => t !== type);
                              handleSettingsChange('storage', 'allowedFileTypes', types);
                            }}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-sm">{type.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sauvegarde */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Sauvegarde automatique</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.storage.autoBackup}
                        onChange={(e) => handleSettingsChange('storage', 'autoBackup', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Activer la sauvegarde automatique</span>
                    </label>
                    
                    {settings.storage.autoBackup && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Fréquence</label>
                          <select
                            value={settings.storage.backupFrequency}
                            onChange={(e) => handleSettingsChange('storage', 'backupFrequency', e.target.value)}
                            className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                          >
                            <option value="daily">Quotidienne</option>
                            <option value="weekly">Hebdomadaire</option>
                            <option value="monthly">Mensuelle</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Rétention (jours)</label>
                          <input
                            type="number"
                            min="7"
                            max="365"
                            value={settings.storage.retentionPeriod}
                            onChange={(e) => handleSettingsChange('storage', 'retentionPeriod', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions de maintenance */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Maintenance</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={clearCache}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Vider le cache</span>
                    </button>
                    <span className="text-blue-300 text-sm">Supprime les fichiers temporaires et le cache système</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 text-blue-300 mr-3" />
                Intégrations
              </h2>
              
              <div className="space-y-6">
                {/* Analytics */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Analytics et suivi</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Google Analytics ID</label>
                      <input
                        type="text"
                        value={settings.integrations.googleAnalytics}
                        onChange={(e) => handleSettingsChange('integrations', 'googleAnalytics', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Google Maps API Key</label>
                      <input
                        type="text"
                        value={settings.integrations.googleMaps}
                        onChange={(e) => handleSettingsChange('integrations', 'googleMaps', e.target.value)}
                        placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white placeholder-blue-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Connexion sociale */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Connexion sociale</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.socialLogin.google}
                        onChange={(e) => handleNestedSettingsChange('integrations', 'socialLogin', 'google', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Connexion avec Google</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.socialLogin.facebook}
                        onChange={(e) => handleNestedSettingsChange('integrations', 'socialLogin', 'facebook', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Connexion avec Facebook</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.socialLogin.microsoft}
                        onChange={(e) => handleNestedSettingsChange('integrations', 'socialLogin', 'microsoft', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Connexion avec Microsoft</span>
                    </label>
                  </div>
                </div>

                {/* Fournisseurs de services */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Fournisseurs de services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Email</label>
                      <select
                        value={settings.integrations.emailProvider}
                        onChange={(e) => handleSettingsChange('integrations', 'emailProvider', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      >
                        <option value="smtp">SMTP</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">SMS</label>
                      <select
                        value={settings.integrations.smsProvider}
                        onChange={(e) => handleSettingsChange('integrations', 'smsProvider', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      >
                        <option value="twilio">Twilio</option>
                        <option value="nexmo">Nexmo</option>
                        <option value="aws">AWS SNS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Paiement</label>
                      <select
                        value={settings.integrations.paymentProvider}
                        onChange={(e) => handleSettingsChange('integrations', 'paymentProvider', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/10 backdrop-blur-md text-white"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManagementTab;

