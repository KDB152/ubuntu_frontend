'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Loader2, ArrowLeft, Clock, Shield, UserPlus } from 'lucide-react';

export default function EmailVerificationRequiredPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const userId = searchParams.get('userId');
  const isNewUser = searchParams.get('newUser') === 'true';
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const childEmail = searchParams.get('childEmail');
  const childPhone = searchParams.get('childPhone');
  
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/login');
      return;
    }

    // Si c'est un nouvel utilisateur, on peut renvoyer l'email immédiatement
    if (isNewUser) {
      setCanResend(true);
      setTimeLeft(0);
    }

    // Animation de l'icône au chargement
    const timer = setTimeout(() => setAnimateIcon(true), 500);
    return () => clearTimeout(timer);
  }, [email, userId, isNewUser, router]);

  // Timer pour le cooldown de renvoi
  useEffect(() => {
    if (resendStatus === 'success' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, resendStatus]);

  const handleResendEmail = async () => {
    if (!email || !canResend) return;

    setIsResending(true);
    setResendStatus('idle');
    setMessage('');

    try {
      // Si c'est un nouvel utilisateur, on utilise l'API d'inscription pour renvoyer l'email
      if (isNewUser) {
        // Pour les nouveaux utilisateurs, on affiche juste un message de succès
        setResendStatus('success');
        setMessage('Email de vérification envoyé ! Vérifiez votre boîte de réception.');
        setTimeLeft(60);
        setCanResend(false);
      } else {
        // Pour les utilisateurs existants, on utilise l'API de renvoi
        const response = await fetch('/api/auth/send-verification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, userId: userId ? parseInt(userId) : undefined }),
        });

        const result = await response.json();

        if (response.ok) {
          setResendStatus('success');
          setMessage('Email de vérification renvoyé avec succès !');
          setTimeLeft(60);
          setCanResend(false);
        } else {
          setResendStatus('error');
          setMessage(result.error || 'Erreur lors de l\'envoi de l\'email');
        }
      }
    } catch (error) {
      setResendStatus('error');
      setMessage('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!email) return;

    // Si c'est un nouvel utilisateur, on redirige vers la connexion
    if (isNewUser) {
      router.push('/login');
      return;
    }

    if (!userId) return;

    setIsChecking(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/check-email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      const result = await response.json();

      if (response.ok && result.verified) {
        // Rediriger vers la page de connexion
        router.push('/login');
      } else {
        setMessage('Votre email n\'est pas encore vérifié. Vérifiez votre boîte de réception.');
      }
    } catch (error) {
      setMessage('Erreur lors de la vérification');
    } finally {
      setIsChecking(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center shadow-2xl">
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-indigo-200">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center max-w-md w-full shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
        {/* Header avec animation */}
        <div className="mb-8">
          <div className={`relative transition-all duration-1000 ${animateIcon ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-white text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {isNewUser ? 'Bienvenue !' : 'Vérification d\'email requise'}
          </h1>
          {isNewUser && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <UserPlus className="w-5 h-5 text-green-400" />
                  <span className="text-green-200 text-sm font-semibold">Compte créé avec succès !</span>
                </div>
                <p className="text-green-200 text-sm">
                  Bonjour {firstName} {lastName}, votre compte a été créé et un email de vérification a été envoyé.
                </p>
                
                {/* Informations de l'enfant pour les parents */}
                {childEmail && childPhone && (
                  <div className="mt-3 p-2 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-green-200 text-xs font-medium mb-1">Informations de votre enfant :</p>
                    <div className="text-green-200 text-xs space-y-1">
                      <p>📧 Email : {childEmail}</p>
                      <p>📱 Téléphone : {childPhone}</p>
                    </div>
                  </div>
                )}
              </div>
          )}
          <p className="text-blue-200 text-sm mb-2">
            {isNewUser ? 'Vérifiez votre boîte de réception pour :' : 'Nous avons envoyé un lien de vérification à :'}
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 mt-3">
            <p className="text-white font-medium break-all">{email}</p>
          </div>
        </div>

        {/* Statut avec icône de sécurité */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <p className="text-blue-200 text-sm font-semibold">Email envoyé !</p>
          </div>
          <p className="text-blue-200 text-sm">
            Un email de vérification a été envoyé à votre adresse. Vérifiez votre boîte de réception et cliquez sur le lien de vérification.
          </p>
        </div>

        {/* Instructions avec design amélioré */}
        <div className="bg-gradient-to-r from-slate-500/10 to-gray-500/10 border border-slate-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <p className="text-slate-200 text-sm font-semibold mb-3 flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Étapes à suivre :</span>
          </p>
          <div className="text-slate-200 text-sm space-y-2">
            <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span>Vérifiez votre boîte de réception (et les spams)</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Cliquez sur le lien de vérification dans l'email</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>Revenez ici et cliquez sur "Vérifier"</span>
            </div>
          </div>
        </div>

        {/* Message de statut avec animations */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 transition-all duration-500 transform ${
            resendStatus === 'success' 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 scale-100 opacity-100' 
              : resendStatus === 'error'
              ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30 scale-100 opacity-100'
              : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 scale-100 opacity-100'
          }`}>
            <div className="flex-shrink-0">
              {resendStatus === 'success' ? <CheckCircle className="w-5 h-5 animate-bounce" /> : 
               resendStatus === 'error' ? <AlertCircle className="w-5 h-5 animate-pulse" /> : 
               <Mail className="w-5 h-5" />}
            </div>
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Boutons avec design moderne */}
        <div className="space-y-4">
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] transform"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{isNewUser ? 'Aller à la connexion' : 'Vérifier mon email'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={isResending || !canResend || isNewUser}
            className={`group w-full font-semibold px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:scale-[1.02] transform relative overflow-hidden ${
              isNewUser 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-default' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-blue-500/25'
            }`}
          >
            {/* Effet de shimmer pour le bouton */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex items-center space-x-3">
              {isResending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Envoi...</span>
                </>
              ) : !canResend && resendStatus === 'success' ? (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Attendre {timeLeft}s</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>{isNewUser ? 'Email envoyé' : 'Renvoyer l\'email'}</span>
                </>
              )}
            </div>
          </button>

          <button
            onClick={() => router.push('/login')}
            className="group w-full bg-white/5 border border-white/20 text-white font-medium px-6 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-[1.02] transform"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à la connexion</span>
          </button>
        </div>

        {/* Section d'aide améliorée */}
        <div className="mt-8 space-y-4">
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span>Pas reçu l'email ?</span>
            </h3>
            <div className="text-blue-300 text-xs space-y-2">
              <div className="bg-white/5 rounded-lg p-3 text-left">
                <p className="font-medium mb-1">✓ Vérifiez votre dossier spam/courrier indésirable</p>
                <p className="font-medium mb-1">✓ Assurez-vous que l'adresse email est correcte</p>
                <p className="font-medium">✓ L'email peut prendre jusqu'à 10 minutes pour arriver</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-xs">
              Besoin d'aide ? Contactez notre support technique
            </p>
          </div>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>

      {/* Styles CSS pour les animations personnalisées */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}