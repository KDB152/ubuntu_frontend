'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setMessage('Token de vérification manquant');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
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
      setMessage('Erreur lors de la vérification');
    }
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold mb-2">Vérification de l'email</h1>
          <p className="text-blue-200">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-md w-full">
        {verificationStatus === 'success' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-white text-2xl font-bold mb-4">Email Vérifié !</h1>
            <p className="text-green-200 mb-6">{message}</p>
            <a
              href="/dashboard"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-all"
            >
              Aller au Dashboard
            </a>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-white text-2xl font-bold mb-4">Erreur de Vérification</h1>
            <p className="text-red-200 mb-6">{message}</p>
            <a
              href="/dashboard"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-all"
            >
              Retour au Dashboard
            </a>
          </>
        )}
      </div>
    </div>
  );
}
