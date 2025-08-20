'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Save,
  Send,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  BookOpen,
  Target,
  Star,
  Award,
  Zap,
  Heart,
  Brain,
  Lightbulb,
  HelpCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Square,
  Circle,
  Triangle,
  Diamond,
  Plus,
  Minus,
  X,
  Check,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Home,
  Settings,
  Bookmark,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Shuffle,
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  User,
  LogOut
} from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'ordering';
  question: string;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
  points: number;
  timeLimit?: number;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    alt?: string;
  };
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  duration: number;
  questions: Question[];
  totalPoints: number;
  passingScore: number;
  attempts: number;
  instructions?: string;
}

interface QuizTakeTabProps {
  quizId: string | null;
  onComplete: () => void;
}

const QuizTakeTab: React.FC<QuizTakeTabProps> = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (quizId) {
      // Simulation des données du quiz
      const mockQuiz: QuizData = {
        id: quizId,
        title: 'La Révolution française',
        description: 'Testez vos connaissances sur la Révolution française de 1789 à 1799',
        subject: 'Histoire',
        difficulty: 'medium',
        duration: 25,
        totalPoints: 150,
        passingScore: 60,
        attempts: 0,
        instructions: 'Lisez attentivement chaque question. Vous avez 25 minutes pour terminer ce quiz. Certaines questions peuvent avoir plusieurs bonnes réponses. Bonne chance !',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            question: 'En quelle année a commencé la Révolution française ?',
            options: ['1788', '1789', '1790', '1791'],
            correctAnswer: '1789',
            explanation: 'La Révolution française a commencé en 1789 avec la convocation des États généraux et la prise de la Bastille le 14 juillet.',
            points: 10,
            difficulty: 'easy',
            hint: 'C\'est l\'année de la prise de la Bastille.'
          },
          {
            id: 'q2',
            type: 'true_false',
            question: 'La Déclaration des droits de l\'homme et du citoyen a été adoptée en 1789.',
            correctAnswer: true,
            explanation: 'La Déclaration des droits de l\'homme et du citoyen a effectivement été adoptée le 26 août 1789.',
            points: 8,
            difficulty: 'easy'
          },
          {
            id: 'q3',
            type: 'multiple_choice',
            question: 'Qui était le roi de France au début de la Révolution ?',
            options: ['Louis XIV', 'Louis XV', 'Louis XVI', 'Louis XVII'],
            correctAnswer: 'Louis XVI',
            explanation: 'Louis XVI était le roi de France de 1774 à 1792, période qui englobe le début de la Révolution française.',
            points: 10,
            difficulty: 'medium',
            media: {
              type: 'image',
              url: '/images/louis-xvi.jpg',
              alt: 'Portrait de Louis XVI'
            }
          },
          {
            id: 'q4',
            type: 'short_answer',
            question: 'Quel événement du 14 juillet 1789 marque symboliquement le début de la Révolution française ?',
            correctAnswer: 'La prise de la Bastille',
            explanation: 'La prise de la Bastille le 14 juillet 1789 est considérée comme l\'événement symbolique marquant le début de la Révolution française.',
            points: 15,
            difficulty: 'medium',
            hint: 'C\'est une forteresse parisienne qui servait de prison.'
          },
          {
            id: 'q5',
            type: 'matching',
            question: 'Associez chaque personnage à son rôle pendant la Révolution française :',
            options: [
              'Maximilien Robespierre',
              'Georges Danton',
              'Jean-Paul Marat',
              'Jacques Necker'
            ],
            correctAnswer: {
              'Maximilien Robespierre': 'Leader des Jacobins',
              'Georges Danton': 'Orateur révolutionnaire',
              'Jean-Paul Marat': 'Journaliste radical',
              'Jacques Necker': 'Ministre des Finances'
            },
            explanation: 'Chaque personnage a joué un rôle spécifique dans la Révolution française.',
            points: 20,
            difficulty: 'hard'
          },
          {
            id: 'q6',
            type: 'essay',
            question: 'Expliquez en quelques phrases les principales causes de la Révolution française.',
            correctAnswer: 'Les principales causes incluent la crise financière, les inégalités sociales, l\'influence des Lumières, et la convocation des États généraux.',
            explanation: 'Une bonne réponse devrait mentionner les causes économiques, sociales, politiques et intellectuelles.',
            points: 25,
            difficulty: 'hard',
            timeLimit: 300 // 5 minutes pour cette question
          },
          {
            id: 'q7',
            type: 'ordering',
            question: 'Remettez ces événements dans l\'ordre chronologique :',
            options: [
              'Exécution de Louis XVI',
              'Prise de la Bastille',
              'Déclaration des droits de l\'homme',
              'Convocation des États généraux'
            ],
            correctAnswer: [
              'Convocation des États généraux',
              'Prise de la Bastille',
              'Déclaration des droits de l\'homme',
              'Exécution de Louis XVI'
            ],
            explanation: 'L\'ordre chronologique correct reflète la progression des événements révolutionnaires.',
            points: 18,
            difficulty: 'medium'
          },
          {
            id: 'q8',
            type: 'multiple_choice',
            question: 'Quelle était la devise de la République française adoptée pendant la Révolution ?',
            options: [
              'Liberté, Égalité, Fraternité',
              'Liberté, Justice, Vérité',
              'Égalité, Justice, Liberté',
              'Fraternité, Liberté, Justice'
            ],
            correctAnswer: 'Liberté, Égalité, Fraternité',
            explanation: 'La devise "Liberté, Égalité, Fraternité" a été adoptée pendant la Révolution française et reste la devise de la France.',
            points: 12,
            difficulty: 'easy'
          }
        ]
      };
      
      setQuiz(mockQuiz);
      setTimeRemaining(mockQuiz.duration * 60); // Convertir en secondes
    }
  }, [quizId]);

  useEffect(() => {
    if (isStarted && !isPaused && !isCompleted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isPaused, isCompleted, timeRemaining]);

  // Auto-sauvegarde
  useEffect(() => {
    if (autoSave && isStarted && Object.keys(answers).length > 0) {
      const saveTimeout = setTimeout(() => {
        console.log('Auto-sauvegarde des réponses...');
        // Ici on sauvegarderait les réponses
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [answers, autoSave, isStarted]);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setIsStarted(true);
    setShowInstructions(false);
    if (soundEnabled) {
      // Jouer un son de démarrage
      console.log('Son de démarrage');
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleFlagQuestion = () => {
    const questionId = currentQuestion.id;
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmitQuiz = () => {
    setIsCompleted(true);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calculer le score
    let score = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined) {
        // Logique de correction simplifiée
        if (JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)) {
          score += question.points;
        }
      }
    });

    console.log(`Quiz terminé ! Score: ${score}/${quiz.totalPoints}`);
    
    // Rediriger vers les résultats après un délai
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const renderQuestion = () => {
    const userAnswer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  userAnswer === option
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-blue-200 hover:border-blue-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-white/40'
                  }`}>
                    {userAnswer === option && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-4">
            {[true, false].map((option) => (
              <button
                key={option.toString()}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  userAnswer === option
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-blue-200 hover:border-blue-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-white/40'
                  }`}>
                    {userAnswer === option && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="flex-1">{option ? 'Vrai' : 'Faux'}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'short_answer':
        return (
          <div>
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Tapez votre réponse ici..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="mt-2 text-blue-300 text-sm">
              {userAnswer ? `${userAnswer.length} caractères` : '0 caractère'}
            </div>
          </div>
        );

      case 'essay':
        return (
          <div>
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Développez votre réponse ici..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              rows={8}
            />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-blue-300">
                {userAnswer ? `${userAnswer.length} caractères` : '0 caractère'}
              </span>
              {currentQuestion.timeLimit && (
                <span className="text-orange-300">
                  Temps recommandé : {Math.floor(currentQuestion.timeLimit / 60)} min
                </span>
              )}
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <p className="text-blue-200 text-sm mb-4">
              Glissez-déposez ou cliquez pour associer les éléments :
            </p>
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1 p-3 bg-white/10 rounded-lg border border-white/20">
                  {option}
                </div>
                <ArrowRight className="w-5 h-5 text-blue-300" />
                <select
                  value={userAnswer?.[option] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, {
                    ...userAnswer,
                    [option]: e.target.value
                  })}
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Choisir...</option>
                  {Object.values(currentQuestion.correctAnswer as object).map((value: any, idx) => (
                    <option key={idx} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );

      case 'ordering':
        const orderedItems = userAnswer || [...(currentQuestion.options || [])];
        return (
          <div className="space-y-4">
            <p className="text-blue-200 text-sm mb-4">
              Glissez les éléments pour les remettre dans l'ordre :
            </p>
            {orderedItems.map((item: string, index: number) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20 cursor-move"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <span className="flex-1 text-white">{item}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (index > 0) {
                        const newOrder = [...orderedItems];
                        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                        handleAnswer(currentQuestion.id, newOrder);
                      }
                    }}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-white/10 text-blue-300 hover:bg-white/20 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (index < orderedItems.length - 1) {
                        const newOrder = [...orderedItems];
                        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                        handleAnswer(currentQuestion.id, newOrder);
                      }
                    }}
                    disabled={index === orderedItems.length - 1}
                    className="p-2 rounded-lg bg-white/10 text-blue-300 hover:bg-white/20 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div>Type de question non supporté</div>;
    }
  };

  // Écran d'instructions
  if (showInstructions && !isStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-blue-200 text-lg">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-white text-2xl font-bold">{quiz.duration} min</div>
              <div className="text-blue-300 text-sm">Durée</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-white text-2xl font-bold">{quiz.questions.length}</div>
              <div className="text-blue-300 text-sm">Questions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-white text-2xl font-bold">{quiz.totalPoints}</div>
              <div className="text-blue-300 text-sm">Points</div>
            </div>
          </div>

          {quiz.instructions && (
            <div className="bg-blue-500/20 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Instructions
              </h3>
              <p className="text-blue-100">{quiz.instructions}</p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
            >
              Retour
            </button>
            <button
              onClick={handleStartQuiz}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Commencer le quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Écran de fin
  if (isCompleted) {
    const score = quiz.questions.reduce((total, question) => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)) {
        return total + question.points;
      }
      return total;
    }, 0);

    const percentage = Math.round((score / quiz.totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-orange-500 to-red-600'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <Target className="w-12 h-12 text-white" />
            )}
          </div>

          <h1 className="text-white text-3xl font-bold mb-2">
            {passed ? 'Félicitations !' : 'Quiz terminé'}
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            {passed 
              ? 'Vous avez réussi ce quiz avec brio !' 
              : 'Continuez vos efforts, vous progressez !'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6">
              <div className={`text-3xl font-bold mb-2 ${passed ? 'text-green-400' : 'text-orange-400'}`}>
                {percentage}%
              </div>
              <div className="text-blue-300 text-sm">Score final</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-white text-3xl font-bold mb-2">{score}/{quiz.totalPoints}</div>
              <div className="text-blue-300 text-sm">Points obtenus</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-white text-3xl font-bold mb-2">{answeredQuestions}/{quiz.questions.length}</div>
              <div className="text-blue-300 text-sm">Questions répondues</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Voir les résultats détaillés
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale du quiz
  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-slate-900' : ''}`}>
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header du quiz */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-white text-xl font-bold">{quiz.title}</h1>
              <span className="text-blue-300 text-sm">
                Question {currentQuestionIndex + 1} sur {quiz.questions.length}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>

              {/* Contrôles */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  title={isPaused ? 'Reprendre' : 'Pause'}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  title={fullscreen ? 'Quitter plein écran' : 'Plein écran'}
                >
                  {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          {showProgress && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 text-sm">Progression</span>
                <span className="text-white text-sm">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-full">
              {/* En-tête de la question */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{currentQuestionIndex + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {currentQuestion.difficulty === 'easy' ? 'Facile' : 
                           currentQuestion.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                        </span>
                        <span className="text-blue-300 text-sm">{currentQuestion.points} points</span>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-white text-xl font-semibold mb-4">
                    {currentQuestion.question}
                  </h2>
                </div>

                <button
                  onClick={handleFlagQuestion}
                  className={`p-2 rounded-lg transition-all ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                  title="Marquer cette question"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Média si présent */}
              {currentQuestion.media && (
                <div className="mb-6">
                  {currentQuestion.media.type === 'image' && (
                    <img
                      src={currentQuestion.media.url}
                      alt={currentQuestion.media.alt}
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Réponse */}
              <div className="mb-6">
                {renderQuestion()}
              </div>

              {/* Indice */}
              {currentQuestion.hint && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span>{showHint ? 'Masquer l\'indice' : 'Voir l\'indice'}</span>
                  </button>
                  {showHint && (
                    <div className="mt-3 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-100">{currentQuestion.hint}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Précédent</span>
                </button>

                <div className="flex items-center space-x-3">
                  {autoSave && (
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <Save className="w-4 h-4" />
                      <span>Sauvegarde auto</span>
                    </div>
                  )}
                </div>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    <Send className="w-5 h-5" />
                    <span>Terminer</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-all"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation des questions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Questions</h3>
              <div className="grid grid-cols-4 gap-2">
                {quiz.questions.map((_, index) => {
                  const isAnswered = answers[quiz.questions[index].id] !== undefined;
                  const isFlagged = flaggedQuestions.has(quiz.questions[index].id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all relative ${
                        isCurrent
                          ? 'bg-blue-500 text-white'
                          : isAnswered
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="w-3 h-3 text-red-400 absolute -top-1 -right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500/20 rounded"></div>
                  <span className="text-green-400">Répondu ({answeredQuestions})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white/20 rounded"></div>
                  <span className="text-white/60">Non répondu ({quiz.questions.length - answeredQuestions})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flag className="w-3 h-3 text-red-400" />
                  <span className="text-red-400">Marqué ({flaggedQuestions.size})</span>
                </div>
              </div>
            </div>

            {/* Paramètres */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Paramètres</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Sauvegarde auto</span>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-10 h-6 rounded-full transition-all ${
                      autoSave ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      autoSave ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Progression</span>
                  <button
                    onClick={() => setShowProgress(!showProgress)}
                    className={`w-10 h-6 rounded-full transition-all ${
                      showProgress ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      showProgress ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Son</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      soundEnabled 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Aide */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Aide
              </h3>
              <div className="space-y-2 text-sm text-blue-200">
                <p>• Utilisez les flèches pour naviguer</p>
                <p>• Marquez les questions difficiles</p>
                <p>• Vos réponses sont sauvegardées</p>
                <p>• Gérez votre temps efficacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTakeTab;

