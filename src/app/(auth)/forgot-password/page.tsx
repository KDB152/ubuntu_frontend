'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Globe, MapPin, BookOpen, Send, Clock } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  if (!formData.email) {
    setErrors({ email: "L'adresse email est requise" });
    return;
  }
  if (!validateEmail(formData.email)) {
    setErrors({ email: "Veuillez entrer une adresse email valide" });
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:3001/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 💡 Vérifie si l'erreur renvoyée est "User not found"
      if (data.message?.toLowerCase().includes("not found")) {
        setErrors({ email: "Cet utilisateur n'est pas inscrit et n'a pas de compte." });
      } else {
        setErrors({ email: data.message || 'Erreur lors de la demande de réinitialisation' });
      }
      return;
    }

    setIsSuccess(true);
  } catch (error) {
    setErrors({ email: error instanceof Error ? error.message : 'Une erreur est survenue' });
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* ✅ Animations de fond */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cercles lumineux */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-yellow-300/20 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-green-300/20 rounded-full animate-bounce blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-violet-300/20 rounded-full animate-ping blur-lg"></div>
        
        {/* Icônes décoratives */}
        <div className="absolute top-20 right-20 opacity-10">
          <Globe className="w-40 h-40 text-white animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10">
          <MapPin className="w-32 h-32 text-white animate-pulse" />
        </div>

        {/* Lignes de temps */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* ✅ Contenu principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl"> {/* plus large */}
          
          {/* Bouton retour */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour à la connexion
            </button>
          </div>

          {/* En-tête */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-3">Récupération</h2>
            <p className="text-blue-200 text-lg">
              {isSuccess ? "Email envoyé avec succès !" : "Réinitialisez votre mot de passe"}
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-16 border border-white/20 shadow-2xl">
            {isSuccess ? (
              <div className="text-center space-y-8">
                <div className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Email envoyé !</h3>
                <p className="text-white/80">Nous avons envoyé un lien de récupération à :</p>
                <p className="text-amber-300 font-medium text-lg">{formData.email}</p>

                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6 text-left">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <ul className="text-white/80 space-y-1 text-sm">
                      <li>• Vérifiez votre boîte de réception</li>
                      <li>• Cliquez sur le lien de récupération</li>
                      <li>• Créez un nouveau mot de passe</li>
                      <li>• Le lien expire dans 24 heures</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({ email: '' });
                  }}
                  className="w-full py-5 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Envoyer un autre email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center">
                  <p className="text-white/80 text-sm">
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

                {/* Champ Email */}
                <div>
                  <label className="block text-base font-medium text-white/90 mb-3">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-5 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                        errors.email ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                </div>

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-5 px-6 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
                      Envoyer le lien de récupération
                    </div>
                  )}
                </button>

                {/* Liens */}
                <div className="text-center pt-6 border-t border-white/20 space-y-2">
                  <p className="text-white/80 text-sm">
                    Vous avez votre mot de passe ?{' '}
                    <a href="/login" className="font-medium text-amber-300 hover:text-amber-200">Se connecter</a>
                  </p>
                  <p className="text-white/80 text-sm">
                    Pas encore de compte ?{' '}
                    <a href="/register" className="font-medium text-amber-300 hover:text-amber-200">Créer un compte</a>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/60">🔒 Connexion sécurisée • Données protégées RGPD</p>
          </div>
        </div>
      </div>

      {/* ✅ Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
