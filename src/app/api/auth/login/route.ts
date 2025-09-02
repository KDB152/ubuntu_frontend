import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Debug - Tentative de connexion pour:', email);
    console.log('🔍 Debug - Données reçues:', { email, password: password ? '***' : 'MANQUANT' });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
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
      // Vérifier les identifiants avec password_hash et role
      const [users] = await connection.execute(
        'SELECT id, email, password_hash, email_verified, role FROM users WHERE email = ?',
        [email]
      );

      if (!Array.isArray(users) || users.length === 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      const user = users[0] as any;
      console.log('✅ Debug - Utilisateur trouvé:', { 
        id: user.id, 
        email: user.email, 
        verified: user.email_verified,
        role: user.role
      });

      // Vérifier le mot de passe avec password_hash
      console.log('🔐 Debug - Vérification du mot de passe...');
      console.log('🔐 Debug - Mot de passe reçu:', password ? '***' : 'MANQUANT');
      console.log('🔐 Debug - Hash stocké en base:', user.password_hash ? 'PRÉSENT' : 'MANQUANT');
      console.log('🔐 Debug - Type du hash:', typeof user.password_hash);
      
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      console.log('🔐 Debug - Résultat de la comparaison:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Debug - Mot de passe invalide');
        await connection.end();
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      console.log('✅ Debug - Mot de passe valide');

      // Vérifier si l'email est vérifié
      if (user.email_verified !== 1) {
        console.log('⚠️ Debug - Email non vérifié, envoi de l\'email de vérification...');
        
        // Générer directement le token de vérification (solution temporaire)
        let verificationToken: string;
        let expiresAt: Date;
        
        try {
          console.log('🔑 Debug - Génération directe du token de vérification...');
          
          // Importer crypto pour générer le token
          const crypto = require('crypto');
          verificationToken = crypto.randomBytes(32).toString('hex');
          expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
          
          // Sauvegarder le token en base (utiliser verification_token qui est varchar(255))
          await connection.execute(
            'UPDATE users SET verification_token = ?, email_verification_code_expiry = ? WHERE id = ?',
            [verificationToken, expiresAt, user.id]
          );
          
          console.log('✅ Debug - Token généré et sauvegardé:', {
            token: verificationToken,
            expiresAt: expiresAt,
            userId: user.id
          });
          
          // Envoyer l'email de vérification
          console.log('📧 Debug - Envoi de l\'email de vérification...');
          try {
            const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
            const emailResult = await sendVerificationEmail(
              user.email,
              verificationLink,
              user.first_name || user.last_name
            );
            
            console.log('✅ Debug - Email envoyé avec succès:', emailResult);
            console.log('🔗 Debug - LIEN DE VÉRIFICATION DIRECT:', verificationLink);
            console.log('📧 Debug - Copiez ce lien et ouvrez-le dans votre navigateur pour vérifier votre email');
            
          } catch (emailError) {
            console.log('⚠️ Debug - Erreur lors de l\'envoi de l\'email:', emailError);
            // On continue même si l'email échoue
          }
          
        } catch (tokenError) {
          console.log('⚠️ Debug - Erreur lors de la génération du token:', tokenError);
          await connection.end();
          return NextResponse.json(
            { error: 'Erreur lors de la génération du token de vérification' },
            { status: 500 }
          );
        }

        await connection.end();
        
        // Rediriger vers la page de vérification d'email
        return NextResponse.json({
          success: false,
          requiresVerification: true,
          message: 'Votre email doit être vérifié avant de pouvoir vous connecter. Un email de vérification a été envoyé à votre adresse.',
          redirectUrl: `/email-verification-required?email=${encodeURIComponent(user.email)}&userId=${user.id}`
        }, { status: 200 });
      }

      await connection.end();

      // Email vérifié, connexion réussie
      console.log('✅ Debug - Connexion réussie, email vérifié');
      
      return NextResponse.json({
        success: true,
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          role: user.role, // Utiliser le vrai rôle de la base
          emailVerified: true
        }
      });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
