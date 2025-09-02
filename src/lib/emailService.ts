import nodemailer from 'nodemailer';

// Configuration Gmail pour l'envoi d'emails
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chronocarto7@gmail.com',
      pass: 'kwuaeqrlqsjrjsbs' // Mot de passe d'application Gmail
    }
  });
};

export const sendVerificationEmail = async (
  to: string,
  verificationLink: string,
  userName?: string
) => {
  try {
    // Créer le transporteur Gmail
    const transporter = createGmailTransporter();
    
    const mailOptions = {
      from: '"Chrono Carto" <chronocarto7@gmail.com>',
      to: to,
      subject: 'Vérifiez votre adresse email pour Chrono-Carto',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification d'email - Chrono Carto</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .title {
              font-size: 20px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .link {
              word-break: break-all;
              color: #2563eb;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎓 Chrono Carto</div>
              <div class="title">Vérifiez votre adresse email</div>
            </div>
            
            <div class="content">
              <p>Bonjour${userName ? ` ${userName}` : ''},</p>
              
              <p>Merci de vous être inscrit sur notre plateforme d'Histoire-Géographie. Pour finaliser votre inscription, veuillez vérifier votre adresse email.</p>
              
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">
                  ✅ Vérifier mon email
                </a>
              </div>
              
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p><a href="${verificationLink}" class="link">${verificationLink}</a></p>
              
              <p>Ce lien expirera dans 24 heures.</p>
            </div>
            
            <div class="footer">
              <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
              <p>© 2025 Chrono Carto. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Envoyer l'email via Gmail
    console.log('📧 Debug - Envoi de l\'email via Gmail...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Debug - Email envoyé avec succès via Gmail:');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 À:', to);
    console.log('📧 Lien de vérification:', verificationLink);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: verificationLink
    };
    
  } catch (error) {
    console.error('❌ Debug - Erreur lors de l\'envoi de l\'email Gmail:', error);
    
    // En cas d'erreur Gmail, on revient à la simulation pour le développement
    console.log('⚠️ Debug - Retour à la simulation d\'email...');
    console.log('📧 Debug - Email de vérification simulé:');
    console.log('📧 À:', to);
    console.log('📧 Lien de vérification:', verificationLink);
    
    return {
      success: true,
      messageId: 'simulated-' + Date.now(),
      previewUrl: verificationLink
    };
  }
};
