import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    console.log('🔍 Debug - Inspection de la structure de la table users...');

    // Vérifier la structure de la table users
    const [structureRows] = await connection.execute('DESCRIBE users');
    console.log('🔍 Debug - Structure de la table users:', structureRows);

    // Vérifier les colonnes de vérification
    const [verificationColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'chrono_carto' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME LIKE '%verif%'
    `);
    console.log('🔍 Debug - Colonnes de vérification:', verificationColumns);

    // Vérifier un utilisateur avec un token
    const [usersWithTokens] = await connection.execute(`
      SELECT id, email, verification_token, email_verification_code_expiry, email_verified 
      FROM users 
      WHERE verification_token IS NOT NULL 
      LIMIT 5
    `);
    console.log('🔍 Debug - Utilisateurs avec tokens:', usersWithTokens);

    // Vérifier la structure des données
    const [sampleUser] = await connection.execute(`
      SELECT * FROM users WHERE verification_token IS NOT NULL LIMIT 1
    `);
    console.log('🔍 Debug - Exemple d\'utilisateur complet:', sampleUser);

    await connection.end();

    return NextResponse.json({
      success: true,
      tableStructure: structureRows,
      verificationColumns: verificationColumns,
      usersWithTokens: usersWithTokens,
      sampleUser: sampleUser
    });

  } catch (error) {
    console.error('❌ Debug - Erreur lors de l\'inspection:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
