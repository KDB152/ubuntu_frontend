import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuration de la base de données MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chrono_carto',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// GET - Tester la connexion et afficher la structure de la table
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test de la table rendez_vous');
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion MySQL établie');
    
    // Vérifier la structure de la table
    const [structureRows] = await connection.execute('DESCRIBE rendez_vous');
    console.log('📋 Structure de la table:', structureRows);
    
    // Compter le nombre de rendez-vous
    const [countRows] = await connection.execute('SELECT COUNT(*) as total FROM rendez_vous');
    const total = (countRows as any[])[0]?.total || 0;
    console.log('📊 Nombre total de rendez-vous:', total);
    
    // Afficher quelques exemples
    const [sampleRows] = await connection.execute('SELECT * FROM rendez_vous LIMIT 3');
    console.log('📝 Exemples de données:', sampleRows);
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: 'Test de la table rendez_vous réussi',
      data: {
        structure: structureRows,
        totalCount: total,
        samples: sampleRows
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de la table rendez_vous', details: error },
      { status: 500 }
    );
  }
}
