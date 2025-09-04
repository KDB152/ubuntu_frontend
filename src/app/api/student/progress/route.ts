import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'ID étudiant requis' },
        { status: 400 }
      );
    }

    // Utiliser l'API backend au lieu de la connexion directe à la base de données
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // Récupérer les tentatives de quiz depuis l'API backend
    const attemptsResponse = await fetch(`${backendUrl}/quizzes/attempts?student_id=${studentId}`);
    
    if (!attemptsResponse.ok) {
      throw new Error(`Erreur API backend: ${attemptsResponse.status}`);
    }
    
    const attempts = await attemptsResponse.json();
    
    // Récupérer les détails des quiz pour chaque tentative
    const quizResults = await Promise.all(
      attempts.map(async (attempt: any) => {
        try {
          const quizResponse = await fetch(`${backendUrl}/quizzes/${attempt.quiz_id}`);
          if (!quizResponse.ok) return null;
          
          const quiz = await quizResponse.json();
          
          return {
            attempt_id: attempt.id,
            quiz_id: attempt.quiz_id,
            quiz_title: quiz.title,
            subject: quiz.subject,
            score: attempt.score,
            total_points: attempt.total_points,
            percentage: attempt.percentage,
            completed_at: attempt.completed_at,
            time_spent: attempt.time_spent,
            difficulty: quiz.level
          };
        } catch (error) {
          console.error(`Erreur lors de la récupération du quiz ${attempt.quiz_id}:`, error);
          return null;
        }
      })
    );
    
    // Filtrer les résultats null
    const validResults = quizResults.filter(result => result !== null);
    
    // Organiser les résultats par matière
    const resultsBySubject: { [key: string]: any[] } = {};
    
    validResults.forEach(result => {
      const subject = result.subject;
      if (!resultsBySubject[subject]) {
        resultsBySubject[subject] = [];
      }
      resultsBySubject[subject].push(result);
    });
    
    // Prendre les 7 derniers résultats pour chaque matière
    const progressData = Object.keys(resultsBySubject).map(subject => {
      const subjectResults = resultsBySubject[subject].slice(0, 7).reverse(); // Inverser pour avoir l'ordre chronologique
      
      const scores = subjectResults.map(r => r.percentage);
      const dates = subjectResults.map(r => r.completed_at);
      
      // Calculer la tendance
      let trend = 'stable';
      let improvement = 0;
      
      if (scores.length >= 2) {
        const firstScore = scores[0];
        const lastScore = scores[scores.length - 1];
        improvement = lastScore - firstScore;
        
        if (improvement > 5) {
          trend = 'up';
        } else if (improvement < -5) {
          trend = 'down';
        }
      }
      
      // Calculer la moyenne
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
      
      // Analyser les forces et faiblesses basées sur les scores
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      if (averageScore >= 80) {
        strengths.push('Performance excellente');
      } else if (averageScore >= 60) {
        strengths.push('Performance correcte');
      }
      
      if (trend === 'up') {
        strengths.push('Progression positive');
      } else if (trend === 'down') {
        weaknesses.push('Progression négative');
      }
      
      if (scores.length > 0) {
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        
        if (maxScore - minScore > 20) {
          weaknesses.push('Inconsistance dans les résultats');
        } else {
          strengths.push('Régularité dans les performances');
        }
      }
      
      // Recommandations basées sur l'analyse
      const recommendations: string[] = [];
      
      if (averageScore < 60) {
        recommendations.push('Réviser les bases de la matière');
        recommendations.push('Demander de l\'aide supplémentaire');
      } else if (averageScore < 80) {
        recommendations.push('Approfondir les connaissances');
        recommendations.push('Pratiquer davantage');
      }
      
      if (trend === 'down') {
        recommendations.push('Identifier les difficultés récentes');
        recommendations.push('Revoir les derniers chapitres');
      }
      
      if (scores.length > 0 && Math.max(...scores) - Math.min(...scores) > 20) {
        recommendations.push('Travailler la régularité');
        recommendations.push('Établir une routine de révision');
      }
      
      return {
        subject,
        period: 'recent',
        scores,
        dates,
        averageScore,
        improvement: Math.round(improvement),
        trend,
        strengths,
        weaknesses,
        recommendations,
        totalQuizzes: subjectResults.length,
        lastQuizDate: dates.length > 0 ? dates[dates.length - 1] : null,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
        worstScore: scores.length > 0 ? Math.min(...scores) : 0
      };
    });
    
    console.log(`✅ Progression récupérée pour l'étudiant ${studentId}:`, {
      totalSubjects: progressData.length,
      subjects: progressData.map(p => ({ subject: p.subject, quizzes: p.totalQuizzes, average: p.averageScore }))
    });
    
    return NextResponse.json({
      success: true,
      data: progressData,
      studentId: parseInt(studentId)
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la progression:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de la progression' },
      { status: 500 }
    );
  }
}
