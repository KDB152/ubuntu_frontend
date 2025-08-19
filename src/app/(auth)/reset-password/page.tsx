'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle, Globe, MapPin, BookOpen, Eye, EyeOff } from 'lucide-react';

export const viewport = {
  themeColor: '#F59E0B',
  viewport: 'width=device-width, initial-scale=1',
};

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réinitialisation');
      }

      setIsSuccess(true);
    } catch (error) {
      setErrors({ global: error.message });
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
      {/* Fond animé et éléments décoratifs */}
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

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour à la connexion
            </button>
          </div>

          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-16 border border-white/20 shadow-2xl">
            {isSuccess ? (
              <div className="text-center space-y-8">
                <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-5xl font-bold text-white">Mot de passe réinitialisé</h2>
                <p className="text-blue-200 text-lg">Votre mot de passe a été mis à jour avec succès.</p>
                <a
                  href="/login"
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Se connecter
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center">
                  <h2 className="text-5xl font-bold text-white mb-3">Nouveau mot de passe</h2>
                  <p className="text-blue-200 text-lg">Définissez votre nouveau mot de passe</p>
                </div>
                
                {!token && (
                  <p className="text-red-400 text-center text-lg">Aucun token de réinitialisation fourni.</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Nouveau mot de passe
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                        errors.password ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Entrez votre nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                        errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Confirmez votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
                </div>

                {errors.global && <p className="text-sm text-red-400 text-center">{errors.global}</p>}
                
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Réinitialisation en cours...
                    </div>
                  ) : (
                    'Réinitialiser le mot de passe'
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-white/60">
                🔒 Connexion sécurisée • Données protégées RGPD
              </p>
            </div>
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
};

export default ResetPasswordPage;