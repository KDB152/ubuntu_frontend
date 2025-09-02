import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    console.log('🧪 Debug - Test de l\'API de login...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    try {
      // Test simple : compter les utilisateurs
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const userCount = (users[0] as any).count;
      
      // Test : vérifier la structure de la table users
      const [columns] = await connection.execute('DESCRIBE users');
      
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'API de login fonctionne correctement',
        database: 'Connecté à chrono_carto',
        userCount: userCount,
        tableStructure: columns.map((col: any) => col.Field)
      });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error: any) {
    console.error('❌ Debug - Erreur lors du test:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Erreur lors du test de l\'API'
    }, { status: 500 });
  }
}
