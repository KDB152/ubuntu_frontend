'use client';

import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Vérification en cours...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Aucun token fourni.');
      return;
    }

const verifyEmail = async () => {
  try {
    const res = await fetch(`/api/auth/verify-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    if (!res.ok) {
      // Handle non-200 responses without assuming JSON
      const text = await res.text();
      setStatus('error');
      setMessage(text || `Error: ${res.status} - Verification failed.`);
      return;
    }

    const data = await res.json();

    if (data.success) {
      setStatus('success');
      setMessage(data.message || 'Email vérifié avec succès !');
    } else {
      setStatus('error');
      setMessage(data.message || 'Échec de la vérification.');
    }
  } catch (err: any) {
    setStatus('error');
    setMessage(err?.message || 'Erreur inconnue lors de la vérification.');
  }
};

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {status === 'loading' && <p className="text-blue-600">{message}</p>}
      {status === 'success' && <p className="text-green-600 font-bold">{message}</p>}
      {status === 'error' && <p className="text-red-600 font-bold">{message}</p>}
    </div>
  );
}
