import { useState, useEffect } from 'react';

interface RealStats {
  totalUsers: number;
  totalStudents: number;
  totalParents: number;
  totalQuizzes: number;
  totalMessages: number;
  unreadMessages: number;
  completedQuizzes: number;
  averageScore: number;
  userConversations: number;
  userUnreadMessages: number;
}

export const useRealStats = () => {
  const [stats, setStats] = useState<RealStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalParents: 0,
    totalQuizzes: 0,
    totalMessages: 0,
    unreadMessages: 0,
    completedQuizzes: 0,
    averageScore: 0,
    userConversations: 0,
    userUnreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRealStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.11:3001';
      
      // Récupérer l'utilisateur connecté
      const userDetails = localStorage.getItem('userDetails');
      const currentUser = userDetails ? JSON.parse(userDetails) : null;
      const currentUserId = currentUser?.id;
      
      // 1. Récupérer tous les étudiants
      const studentsResponse = await fetch(`${API_BASE}/admin/students`);
      let totalStudents = 0;
      
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        const students = studentsData.items || [];
        totalStudents = students.length;
      }

      // 2. Récupérer tous les parents
      const parentsResponse = await fetch(`${API_BASE}/admin/parents`);
      let totalParents = 0;
      
      if (parentsResponse.ok) {
        const parentsData = await parentsResponse.json();
        const parents = parentsData.items || [];
        totalParents = parents.length;
      }

      // 3. Calculer le total des utilisateurs (étudiants + parents)
      const totalUsers = totalStudents + totalParents;

      // 2. Récupérer tous les quiz
      const quizzesResponse = await fetch(`${API_BASE}/quizzes`);
      let totalQuizzes = 0;
      let quizzes: any[] = [];
      
      if (quizzesResponse.ok) {
        const quizzesData = await quizzesResponse.json();
        quizzes = quizzesData.items || [];
        totalQuizzes = quizzes.length;
      }

      // 3. Récupérer les conversations de l'utilisateur connecté
      let userConversations = 0;
      let userUnreadMessages = 0;
      let totalMessages = 0;
      
      if (currentUserId) {
        try {
          // Récupérer les conversations de l'utilisateur
          const conversationsResponse = await fetch(`${API_BASE}/messaging/conversations?userId=${currentUserId}`);
          if (conversationsResponse.ok) {
            const conversations = await conversationsResponse.json();
            userConversations = conversations.length;
            
            // Pour chaque conversation, récupérer les messages non lus
            for (const conversation of conversations) {
              try {
                const messagesResponse = await fetch(`${API_BASE}/messaging/conversations/${conversation.id}/messages`);
                if (messagesResponse.ok) {
                  const messages = await messagesResponse.json();
                  totalMessages += messages.length;
                  
                  // Compter les messages non lus (pas envoyés par l'utilisateur actuel)
                  const unreadCount = messages.filter((m: any) => 
                    !m.is_read && m.sender_id !== currentUserId
                  ).length;
                  userUnreadMessages += unreadCount;
                }
              } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des conversations:', error);
        }
      }

      // 4. Récupérer les tentatives de quiz
      let totalAttempts = 0;
      let averageScore = 0;
      
      if (totalQuizzes > 0) {
        let totalScore = 0;
        let scoreCount = 0;
        
        for (const quiz of quizzes) {
          try {
            const attemptsResponse = await fetch(`${API_BASE}/quizzes/${quiz.id}/attempts`);
            if (attemptsResponse.ok) {
              const attempts = await attemptsResponse.json();
              totalAttempts += attempts.length;
              
              attempts.forEach((attempt: any) => {
                if (attempt.percentage !== undefined) {
                  totalScore += attempt.percentage;
                  scoreCount++;
                }
              });
            }
          } catch (error) {
            // Ignore les erreurs
          }
        }
        
        averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
      }

      setStats({
        totalUsers,
        totalStudents,
        totalParents,
        totalQuizzes,
        totalMessages,
        unreadMessages: userUnreadMessages, // Messages non lus de l'utilisateur connecté
        completedQuizzes: totalAttempts,
        averageScore,
        userConversations,
        userUnreadMessages
      });
      
    } catch (error) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: loadRealStats
  };
};
