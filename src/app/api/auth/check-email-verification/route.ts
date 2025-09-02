import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    console.log('🔍 Debug - Vérification du statut d\'email pour l\'utilisateur:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    try {
      // Vérifier le statut de l'email
      const [users] = await connection.execute(
        'SELECT id, email, email_verified FROM users WHERE id = ?',
        [userId]
      );

      if (!Array.isArray(users) || users.length === 0) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      const user = users[0] as any;
      console.log('✅ Debug - Statut de l\'email:', { 
        userId: user.id, 
        email: user.email, 
        verified: user.email_verified 
      });

      await connection.end();

      return NextResponse.json({
        success: true,
        verified: user.email_verified === 1,
        email: user.email,
        userId: user.id
      });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du statut' },
      { status: 500 }
    );
  }
}
