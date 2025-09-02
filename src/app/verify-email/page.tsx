'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw, Mail, Shield, AlertTriangle } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setMessage('Token de vérification manquant ou invalide');
    }
    
    // Animation d'entrée
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setVerificationStatus('loading');
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const result = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(result.message || 'Email vérifié avec succès !');
      } else {
        setVerificationStatus('error');
        setMessage(result.error || 'Erreur lors de la vérification');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleRetry = () => {
    if (token && retryCount < 3) {
      setRetryCount(prev => prev + 1);
      verifyEmail(token);
    }
  };

  // État de chargement avec animation élégante
  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className={`relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center max-w-lg w-full shadow-2xl transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Icône de chargement avec effet de pulsation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          
          <h1 className="text-white text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Vérification de l'email
          </h1>
          <p className="text-blue-200 text-lg">Vérification en cours...</p>
          
          {/* Barre de progression animée */}
          <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse loading-bar"></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          .loading-bar {
            animation: loading 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 text-center max-w-lg w-full shadow-2xl transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {verificationStatus === 'success' ? (
          <div className="space-y-6">
            {/* Icône de succès avec animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Confettis effet */}
            <div className="relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full animate-bounce bg-gradient-to-r from-yellow-400 to-orange-400`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
              <h1 className="text-white text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Email Vérifié !
              </h1>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <p className="text-green-200 font-semibold">Vérification réussie</p>
              </div>
              <p className="text-green-200 text-sm leading-relaxed">{message}</p>
            </div>

            <div className="space-y-4">
              <a
                href="/login?verified=true"
                className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] transform relative overflow-hidden"
              >
                {/* Effet shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10 flex items-center space-x-3">
                  <span>Se connecter maintenant</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <div className="text-center">
                <p className="text-slate-300 text-sm">
                  Votre compte est maintenant activé et prêt à être utilisé !
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Icône d'erreur avec animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-rose-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <XCircle className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>

            <h1 className="text-white text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
              Erreur de Vérification
            </h1>

            <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 font-semibold">Vérification échouée</p>
              </div>
              <p className="text-red-200 text-sm leading-relaxed">{message}</p>
            </div>

            {/* Suggestions d'aide */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Que faire ?</span>
              </h3>
              <div className="text-slate-300 text-xs space-y-2 text-left">
                <div className="flex items-start space-x-2 p-2 bg-white/5 rounded-lg">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Le lien de vérification a peut-être expiré</span>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/5 rounded-lg">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Le token de vérification est invalide</span>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/5 rounded-lg">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Votre email est peut-être déjà vérifié</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Bouton de retry si pas trop d'essais */}
              {token && retryCount < 3 && (
                <button
                  onClick={handleRetry}
                  className="group w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transform relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10 flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Réessayer la vérification</span>
                  </div>
                </button>
              )}

              <a
                href="/login"
                className="group w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-slate-500/25 hover:scale-[1.02] transform"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>Retour à la connexion</span>
              </a>

              {/* Lien pour demander un nouveau lien */}
              <div className="text-center pt-4">
                <a
                  href="/auth/email-verification-required"
                  className="text-blue-400 hover:text-blue-300 text-sm underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
                >
                  Demander un nouveau lien de vérification
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Indicateur de statut en bas */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
            verificationStatus === 'success' ? 'bg-green-400 animate-pulse' : 
            verificationStatus === 'error' ? 'bg-red-400 animate-pulse' : 
            'bg-blue-400 animate-pulse'
          }`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-500 delay-200 ${
            verificationStatus === 'success' ? 'bg-green-400 animate-pulse' : 
            verificationStatus === 'error' ? 'bg-red-400 animate-pulse' : 
            'bg-blue-400 animate-pulse'
          }`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-500 delay-400 ${
            verificationStatus === 'success' ? 'bg-green-400 animate-pulse' : 
            verificationStatus === 'error' ? 'bg-red-400 animate-pulse' : 
            'bg-blue-400 animate-pulse'
          }`}></div>
        </div>

        {/* Footer informatif */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-xs">
            {verificationStatus === 'success' 
              ? 'Redirection automatique dans quelques secondes...' 
              : 'Contactez le support si le problème persiste'
            }
          </p>
        </div>
      </div>

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes slideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .confetti {
          animation: confetti 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}