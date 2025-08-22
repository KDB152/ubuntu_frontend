'use client';

import React, { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Globe, MapPin, BookOpen, CheckCircle, AlertCircle, GraduationCap, Phone, Calendar, Baby } from 'lucide-react';

// Export viewport configuration
export const viewport = {
  themeColor: '#F59E0B',
  viewport: 'width=device-width, initial-scale=1',
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    acceptTerms: false,
    // Student-specific fields
    studentBirthDate: '',
    studentClass: '',
    // Parent-specific fields
    childFirstName: '',
    childLastName: '',
    childBirthDate: '',
    childClass: '',
    // Parent contact fields (for students)
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculer la force du mot de passe
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation spécifique aux étudiants
    if (formData.userType === 'student') {
      if (!formData.studentBirthDate) {
        newErrors.studentBirthDate = 'La date de naissance est requise';
      }
      if (!formData.studentClass) {
        newErrors.studentClass = 'La classe est requise';
      }
      if (!formData.parentFirstName) {
        newErrors.parentFirstName = 'Le prénom du parent est requis';
      }
      if (!formData.parentLastName) {
        newErrors.parentLastName = 'Le nom du parent est requis';
      }
      if (!formData.parentEmail) {
        newErrors.parentEmail = 'L\'email du parent est requis';
      } else if (!validateEmail(formData.parentEmail)) {
        newErrors.parentEmail = 'Veuillez entrer une adresse email valide pour le parent';
      }
      if (!formData.parentPhone) {
        newErrors.parentPhone = 'Le téléphone du parent est requis';
      }
    }

    // Validation spécifique aux parents
    if (formData.userType === 'parent') {
      if (!formData.childFirstName) {
        newErrors.childFirstName = 'Le prénom de l\'enfant est requis';
      }
      if (!formData.childLastName) {
        newErrors.childLastName = 'Le nom de l\'enfant est requis';
      }
      if (!formData.childBirthDate) {
        newErrors.childBirthDate = 'La date de naissance de l\'enfant est requise';
      }
      if (!formData.childClass) {
        newErrors.childClass = 'La classe de l\'enfant est requise';
      }
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
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

    setErrors({});
    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Prepare the data to send to the backend
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        // Student-specific fields
        studentBirthDate: formData.userType === 'student' ? formData.studentBirthDate : undefined,
        studentClass: formData.userType === 'student' ? formData.studentClass : undefined,
        // Parent-specific fields
        childFirstName: formData.userType === 'parent' ? formData.childFirstName : undefined,
        childLastName: formData.userType === 'parent' ? formData.childLastName : undefined,
        childBirthDate: formData.userType === 'parent' ? formData.childBirthDate : undefined,
        childClass: formData.userType === 'parent' ? formData.childClass : undefined,
        // Parent contact fields (for students)
        parentFirstName: formData.userType === 'student' ? formData.parentFirstName : undefined,
        parentLastName: formData.userType === 'student' ? formData.parentLastName : undefined,
        parentEmail: formData.userType === 'student' ? formData.parentEmail : undefined,
        parentPhone: formData.userType === 'student' ? formData.parentPhone : undefined,
      };

      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      setSuccessMessage(data.message || 'Inscription réussie !');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 'student',
        acceptTerms: false,
        studentBirthDate: '',
        studentClass: '',
        childFirstName: '',
        childLastName: '',
        childBirthDate: '',
        childClass: '',
        parentFirstName: '',
        parentLastName: '',
        parentEmail: '',
        parentPhone: ''
      });
    } catch (error) {
      setErrors({ ...errors, global: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Très faible', color: 'text-red-400' };
      case 2: return { text: 'Faible', color: 'text-orange-400' };
      case 3: return { text: 'Moyen', color: 'text-yellow-400' };
      case 4: return { text: 'Fort', color: 'text-green-400' };
      case 5: return { text: 'Très fort', color: 'text-emerald-400' };
      default: return { text: '', color: '' };
    }
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength / 5) * 100}%`;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-400';
    if (passwordStrength <= 2) return 'bg-orange-400';
    if (passwordStrength <= 3) return 'bg-yellow-400';
    if (passwordStrength <= 4) return 'bg-green-400';
    return 'bg-emerald-400';
  };

  return (
    <ToastProvider>
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
        <div className="relative z-10 flex min-h-screen">
          {/* Panneau droit - formulaire */}
          <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
            <div className="w-full max-w-4xl"> {/* Élargi pour accommoder plus de champs */}
              <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-5xl font-bold text-white mb-3">Inscription</h2>
                <p className="text-blue-200 text-lg">Créez votre compte d'apprentissage</p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-16 border border-white/20 shadow-2xl space-y-8"
              >
                {/* Messages d'erreur et de succès */}
                {errors.global && (
                  <div className="text-center">
                    <p className="text-sm text-red-400 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.global}
                    </p>
                  </div>
                )}
                {successMessage && (
                  <div className="text-center">
                    <p className="text-sm text-green-400 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Sélection du type d'utilisateur */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Je suis :
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'student' }))}
                      className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-center space-x-2 ${
                        formData.userType === 'student'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span className="text-sm font-medium">Élève</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'parent' }))}
                      className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-center space-x-2 ${
                        formData.userType === 'parent'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">Parent</span>
                    </button>
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-amber-300" />
                    Informations personnelles
                  </h3>
                  
                  {/* Nom et prénom */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-3">Prénom</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                            errors.firstName ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder="Votre prénom"
                          required
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-3">Nom</label>
                      <div className="relative group">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full pl-4 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                            errors.lastName ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email et téléphone */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-3">Adresse email</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                            errors.email ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-3">Numéro de téléphone</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                            errors.phone ? 'border-red-400' : 'border-white/20'
                          }`}
                          placeholder="Votre numéro de téléphone"
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Champs spécifiques selon le type d'utilisateur */}
                  {formData.userType === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Date de naissance</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="date"
                            name="studentBirthDate"
                            value={formData.studentBirthDate}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.studentBirthDate ? 'border-red-400' : 'border-white/20'
                            }`}
                            required
                          />
                        </div>
                        {errors.studentBirthDate && (
                          <p className="mt-2 text-sm text-red-400">{errors.studentBirthDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Classe</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <BookOpen className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="studentClass"
                            value={formData.studentClass}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.studentClass ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Ex: 6ème A, 3ème B..."
                            required
                          />
                        </div>
                        {errors.studentClass && (
                          <p className="mt-2 text-sm text-red-400">{errors.studentClass}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.userType === 'parent' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Prénom de l'enfant</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Baby className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="childFirstName"
                            value={formData.childFirstName}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.childFirstName ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Prénom de l'enfant"
                            required
                          />
                        </div>
                        {errors.childFirstName && (
                          <p className="mt-2 text-sm text-red-400">{errors.childFirstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Nom de l'enfant</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="childLastName"
                            value={formData.childLastName}
                            onChange={handleInputChange}
                            className={`w-full pl-4 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.childLastName ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Nom de l'enfant"
                            required
                          />
                        </div>
                        {errors.childLastName && (
                          <p className="mt-2 text-sm text-red-400">{errors.childLastName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.userType === 'parent' && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Date de naissance de l'enfant</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="date"
                            name="childBirthDate"
                            value={formData.childBirthDate}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.childBirthDate ? 'border-red-400' : 'border-white/20'
                            }`}
                            required
                          />
                        </div>
                        {errors.childBirthDate && (
                          <p className="mt-2 text-sm text-red-400">{errors.childBirthDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Classe de l'enfant</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <BookOpen className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="childClass"
                            value={formData.childClass}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.childClass ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Ex: 6ème A, 3ème B..."
                            required
                          />
                        </div>
                        {errors.childClass && (
                          <p className="mt-2 text-sm text-red-400">{errors.childClass}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Informations des parents (pour les étudiants) */}
                {formData.userType === 'student' && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-amber-300" />
                      Informations des parents
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Prénom du parent</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="parentFirstName"
                            value={formData.parentFirstName}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.parentFirstName ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Prénom du parent"
                            required
                          />
                        </div>
                        {errors.parentFirstName && (
                          <p className="mt-2 text-sm text-red-400">{errors.parentFirstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Nom du parent</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="parentLastName"
                            value={formData.parentLastName}
                            onChange={handleInputChange}
                            className={`w-full pl-4 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.parentLastName ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Nom du parent"
                            required
                          />
                        </div>
                        {errors.parentLastName && (
                          <p className="mt-2 text-sm text-red-400">{errors.parentLastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Email du parent</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.parentEmail ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="parent@email.com"
                            required
                          />
                        </div>
                        {errors.parentEmail && (
                          <p className="mt-2 text-sm text-red-400">{errors.parentEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Téléphone du parent</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-blue-300 group-focus-within:text-amber-300 transition-colors" />
                          </div>
                          <input
                            type="tel"
                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                              errors.parentPhone ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Téléphone du parent"
                            required
                          />
                        </div>
                        {errors.parentPhone && (
                          <p className="mt-2 text-sm text-red-400">{errors.parentPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mot de passe */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-amber-300" />
                    Sécurité
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/90 mb-3">Mot de passe</label>
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
                        placeholder="Votre mot de passe"
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
                    
                    {/* Indicateur de force du mot de passe */}
                    {formData.password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/70">Force du mot de passe</span>
                          <span className={`text-xs font-medium ${getPasswordStrengthText().color}`}>
                            {getPasswordStrengthText().text}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: getPasswordStrengthWidth() }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">Confirmer le mot de passe</label>
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
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Conditions d'utilisation */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-400 focus:ring-amber-300 border-white/30 rounded bg-white/10"
                    />
                    <span className="ml-2 text-sm text-white/80">
                          J'accepte les{' '}
                          <a href="conditions-utilisation" className="text-amber-300 hover:text-amber-400">
                            conditions d'utilisation
                          </a>{' '}
                          et la{' '}
                          <a href="politique-confidentialite" className="text-amber-300 hover:text-amber-400">
                            politique de confidentialité
                      </a>
                    </span>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-400">{errors.acceptTerms}</p>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Inscription en cours...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <UserPlus className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      S'inscrire
                    </div>
                  )}
                </button>

                {/* Lien de connexion */}
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-white/80">
                    Déjà un compte ?{' '}
                    <a href="/login" className="font-medium text-amber-300 hover:text-amber-200 transition-colors">
                      Se connecter
                    </a>
                  </p>
                </div>
              </form>

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
    </ToastProvider>
  );
};

export default RegisterPage;