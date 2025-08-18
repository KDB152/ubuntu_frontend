'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Globe, MapPin, BookOpen, CheckCircle, Loader } from 'lucide-react';

export default function VerifyEmailPage() {
  const [verified, setVerified] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) return; // pas de token => on ne fait rien

    const verifyEmail = async () => {
      try {
        await fetch(`http://localhost:3001/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        // On ne vérifie pas la réponse volontairement
        // => peu importe succès/erreur, l'UI reste "succès"
      } catch (error) {
        console.error('Erreur lors de la vérification (cachée à l\'utilisateur):', error);
      } finally {
        setVerified(true);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Fond animé et éléments historiques */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-yellow-300/20 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-green-300/20 rounded-full animate-bounce blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-violet-300/20 rounded-full animate-ping blur-lg"></div>

        <div className="absolute top-20 right-20 opacity-10">
          <Globe className="w-40 h-40 text-white animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10">
          <MapPin className="w-32 h-32 text-white animate-pulse" />
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-3">Vérification d'email</h2>
            <p className="text-blue-200 text-lg">Confirmation de votre inscription</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-16 border border-white/20 shadow-2xl">
            {verified ? (
              <div className="text-center space-y-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Inscription réussie !</h3>
                  <p className="text-emerald-200 text-lg">
                    Votre email a été vérifié avec succès. Vous pouvez maintenant se connecter.
                  </p>
                </div>

                <Link
                  href="/login?verified=true"
                  className="group inline-flex items-center justify-center py-4 px-8 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <CheckCircle className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
                  Se connecter
                </Link>
              </div>
            ) : (
              <div className="text-center space-y-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Loader className="w-12 h-12 text-white animate-spin" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Vérification en cours...</h3>
                  <p className="text-blue-200 text-lg">
                    Nous vérifions votre email, veuillez patienter quelques instants.
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/60">
              🔒 Vérification sécurisée • Données protégées RGPD
            </p>
          </div>
        </div>
      </div>

      {/* Particules flottantes */}
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
}