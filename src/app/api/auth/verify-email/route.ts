// src/app/api/auth/verify-email/route.ts (VERSION CORRIGÉE)
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    console.log('🔍 Debug - Vérification d\'email avec token:', token);

    if (!token) {
      return NextResponse.json(
        { error: 'Token de vérification requis' },
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
      // Vérifier le token et récupérer les informations utilisateur
      const [users] = await connection.execute(
        'SELECT id, email, verification_token, email_verification_code_expiry, email_verified FROM users WHERE verification_token = ?',
        [token]
      );

      console.log('🔍 Debug - Résultat de la recherche du token:', users);

      if (!Array.isArray(users) || users.length === 0) {
        console.log('❌ Debug - Token non trouvé en base');
        await connection.end();
        return NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 400 }
        );
      }

      const userData = users[0] as any;
      console.log('✅ Debug - Token trouvé pour utilisateur:', {
        id: userData.id,
        email: userData.email,
        token: userData.verification_token,
        expiry: userData.email_verification_code_expiry,
        verified: userData.email_verified
      });

      // Vérifier si l'email est déjà vérifié
      if (userData.email_verified === 1) {
        console.log('⚠️ Debug - Email déjà vérifié');
        await connection.end();
        return NextResponse.json(
          { error: 'Email déjà vérifié' },
          { status: 400 }
        );
      }

      // Vérifier si la date d'expiration est valide
      if (userData.email_verification_code_expiry) {
        const expiryDate = new Date(userData.email_verification_code_expiry);
        const now = new Date();
        
        console.log('🔍 Debug - Vérification de la date d\'expiration:', {
          expiryDate: expiryDate,
          now: now,
          expiryTimestamp: expiryDate.getTime(),
          nowTimestamp: now.getTime(),
          isExpired: expiryDate < now
        });

        if (expiryDate < now) {
          console.log('❌ Debug - Token expiré');
          await connection.end();
          return NextResponse.json(
            { error: 'Token expiré' },
            { status: 400 }
          );
        }
      } else {
        console.log('⚠️ Debug - Pas de date d\'expiration, on continue');
      }

      console.log('✅ Debug - Token valide, marquage de l\'email comme vérifié...');

      // Marquer l'email comme vérifié et nettoyer les tokens
      const updateResult = await connection.execute(
        'UPDATE users SET email_verified = 1, verification_token = NULL, email_verification_code_expiry = NULL WHERE id = ?',
        [userData.id]
      );

      console.log('✅ Debug - Résultat de la mise à jour:', updateResult);
      console.log('✅ Debug - Email marqué comme vérifié avec succès');

      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Email vérifié avec succès ! Votre compte est maintenant actif.',
        userId: userData.id,
        email: userData.email
      });

    } catch (dbError) {
      console.error('❌ Debug - Erreur base de données:', dbError);
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('❌ Debug - Erreur générale lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}