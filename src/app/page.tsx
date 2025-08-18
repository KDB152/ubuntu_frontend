'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Award, ArrowRight, Play, CheckCircle, Globe, Clock, MapPin, Star, Menu, X, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Sophie L.",
      grade: "Terminale",
      text: "Grâce à Chrono-Carto, j'ai enfin compris les enjeux géopolitiques contemporains. Les cartes interactives sont fantastiques !",
      rating: 5
    },
    {
      name: "Thomas M.",
      grade: "1ère",
      text: "Les quiz m'ont aidé à réviser efficacement. J'ai progressé de 3 points de moyenne en histoire !",
      rating: 5
    },
    {
      name: "Marie D.",
      grade: "Terminale",
      text: "La préparation au Grand Oral avec les vidéos explicatives m'a donné confiance pour mon examen.",
      rating: 5
    }
  ];

  const quotes = [
    { text: "L'histoire est le témoin du passé, la lumière de la vérité", author: "Cicéron" },
    { text: "La géographie, c'est ce qui reste quand on a tout oublié", author: "Paul Vidal de La Blache" },
    { text: "Celui qui ne connaît pas l'histoire est condamné à la répéter", author: "George Santayana" },
    { text: "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde", author: "Nelson Mandela" }
  ];

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(quoteInterval);
    };
  }, [testimonials.length, quotes.length]);


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Animations de fond - Éléments historiques flottants */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cartes anciennes en arrière-plan */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-yellow-300/20 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-green-300/20 rounded-full animate-bounce blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-violet-300/20 rounded-full animate-ping blur-lg"></div>
        
        {/* Éléments décoratifs historiques */}
        <div className="absolute top-20 right-20 opacity-10">
          <Globe className="w-40 h-40 text-white animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10">
          <MapPin className="w-32 h-32 text-white animate-pulse" />
        </div>
        
        {/* Lignes de temps animées */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
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

      {/* Header avec effet parallaxe */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Chrono-Carto
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-white/80 hover:text-white font-medium transition-colors duration-200">
                Connexion
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                S'inscrire
              </Link>
            </div>

            {/* Menu mobile */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-white/80 hover:text-amber-300 font-medium">
                Fonctionnalités
              </a>
              <a href="#testimonials" className="block text-white/80 hover:text-amber-300 font-medium">
                Témoignages
              </a>
              <Link href="/login" className="block w-full text-left text-white/80 hover:text-white font-medium">
                Connexion
              </Link>
              <Link href="/register" className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium">
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section avec animations */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-8 pb-8">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Maîtrisez l'
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Histoire
              </span>
              <br />
              Explorez la
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Géographie
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              La plateforme d'apprentissage nouvelle génération qui transforme vos cours d'histoire-géographie en aventures passionnantes, entièrement gratuite
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register" className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-0 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-center">
            <div className="text-white/90 text-lg italic mb-3 transition-all duration-500">
              "{quotes[currentQuote].text}"
            </div>
            <div className="text-amber-300 font-medium">
              — {quotes[currentQuote].author}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section améliorée */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Une expérience d'apprentissage
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> révolutionnaire</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Découvrez nos outils innovants conçus pour transformer votre façon d'apprendre l'histoire et la géographie, entièrement gratuitement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cours Interactifs */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-amber-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Cartes Interactives
              </h3>
              <p className="text-white/80 mb-6 text-center">
                Explorez l'histoire et la géographie à travers des cartes dynamiques et des chronologies immersives
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Cartes historiques animées</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Timeline interactive</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Zoom sur les événements clés</span>
                </div>
              </div>
            </div>

            {/* Suivi Personnalisé */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                IA Pédagogique
              </h3>
              <p className="text-white/80 mb-6 text-center">
                Un assistant intelligent qui s'adapte à votre rythme et identifie vos points forts et faibles
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Recommandations personnalisées</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Analyse des difficultés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Parcours adaptatif</span>
                </div>
              </div>
            </div>

            {/* Préparation Examens */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400/30 to-violet-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Préparation Complète
              </h3>
              <p className="text-white/80 mb-6 text-center">
                Entraînez-vous avec des simulations d'examen et préparez votre Grand Oral avec confiance
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Sujets type Bac corrigés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Coaching Grand Oral</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white/80">Fiches méthodologiques</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à révolutionner vos révisions ?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Rejoignez des milliers d'élèves qui ont déjà transformé leur façon d'apprendre l'histoire-géographie, entièrement gratuitement
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register" className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              Découvrir les fonctionnalités
            </button>
          </div>
          
          <div className="mt-8 text-white/60">
            <p>✨ 100% gratuit • 🚫 Sans abonnement ni paiement • 📚 Accès illimité</p>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-slate-950 text-white py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Chrono-Carto</span>
              </div>
              <p className="text-white/60 mb-6 max-w-md">
                L'avenir de l'éducation en histoire-géographie. Transformez votre façon d'apprendre avec nos outils innovants et notre pédagogie adaptative, entièrement gratuitement.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg text-white">Matières</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> Histoire
                </a></li>
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors flex items-center">
                  <Globe className="w-4 h-4 mr-2" /> Géographie
                </a></li>
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" /> EMC
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg text-white">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors">Contact</a></li>
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors">Communauté</a></li>
                <li><a href="#" className="text-white/60 hover:text-amber-300 transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 Chrono-Carto. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-amber-300 text-sm transition-colors">Confidentialité</a>
              <a href="#" className="text-white/60 hover:text-amber-300 text-sm transition-colors">CGU</a>
              <a href="#" className="text-white/60 hover:text-amber-300 text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;