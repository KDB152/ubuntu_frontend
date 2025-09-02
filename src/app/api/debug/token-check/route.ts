import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 400 });
    }

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'chrono_carto'
    });

    console.log('🔍 Debug - Vérification du token en base:', token);

    // Vérifier si le token existe
    const [tokenRows] = await connection.execute(
      'SELECT id, email, verification_token, email_verification_code_expiry, email_verified FROM users WHERE verification_token = ?',
      [token]
    );

    console.log('🔍 Debug - Résultat de la recherche du token:', tokenRows);

    // Vérifier la structure de la table users
    const [structureRows] = await connection.execute(
      'DESCRIBE users'
    );

    console.log('🔍 Debug - Structure de la table users:', structureRows);

    // Vérifier tous les utilisateurs avec des tokens
    const [allTokens] = await connection.execute(
      'SELECT id, email, verification_token, email_verification_code_expiry, email_verified FROM users WHERE verification_token IS NOT NULL'
    );

    console.log('🔍 Debug - Tous les tokens en base:', allTokens);

    await connection.end();

    return NextResponse.json({
      success: true,
      tokenFound: Array.isArray(tokenRows) && tokenRows.length > 0,
      tokenData: tokenRows,
      tableStructure: structureRows,
      allTokens: allTokens
    });

  } catch (error) {
    console.error('❌ Debug - Erreur lors de la vérification du token:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
