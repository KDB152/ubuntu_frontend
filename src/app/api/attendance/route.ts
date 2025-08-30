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

// Fonction pour créer une connexion à la base de données
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Erreur de connexion MySQL:', error);
    throw error;
  }
}

// Fonction pour synchroniser la table paiement avec les données de students
async function syncPaymentTable(connection: any, studentId: number) {
  try {
    // Récupérer les données actuelles de l'étudiant
    const [studentData] = await connection.execute(`
      SELECT paid_sessions, unpaid_sessions
      FROM students
      WHERE id = ?
    `, [studentId]);

    if (studentData.length === 0) {
      console.log(`⚠️ Étudiant ${studentId} non trouvé`);
      return;
    }

    const student = studentData[0];
    const totalSessions = (student.paid_sessions || 0) + (student.unpaid_sessions || 0);

    // Récupérer l'ID du parent associé (peut être NULL)
    const [parentRelation] = await connection.execute(`
      SELECT ps.parent_id
      FROM parent_student ps
      WHERE ps.student_id = ?
      LIMIT 1
    `, [studentId]);

    const parentId = parentRelation.length > 0 ? parentRelation[0].parent_id : null;

    // Vérifier si un enregistrement de paiement existe
    const [existingPayment] = await connection.execute(`
      SELECT id, prix_seance, montant_paye
      FROM paiement
      WHERE student_id = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))
    `, [studentId, parentId, parentId]);

    if (existingPayment.length > 0) {
      // Mettre à jour l'enregistrement existant avec la logique correcte
      const payment = existingPayment[0];
      const unpaidSessions = student.unpaid_sessions || 0;
      const paidSessions = student.paid_sessions || 0;
      const newMontantTotal = totalSessions * payment.prix_seance;
      const newMontantPaye = paidSessions * payment.prix_seance;  // Séances payées × prix
      const newMontantRestant = unpaidSessions * payment.prix_seance;  // Séances non payées × prix

      await connection.execute(`
        UPDATE paiement 
        SET 
          seances_total = ?,
          seances_non_payees = ?,
          seances_payees = ?,
          montant_total = ?,
          montant_paye = ?,
          montant_restant = ?,
          date_modification = CURRENT_TIMESTAMP
        WHERE student_id = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))
      `, [totalSessions, unpaidSessions, paidSessions, newMontantTotal, newMontantPaye, newMontantRestant, studentId, parentId, parentId]);

      console.log(`✅ Paiement synchronisé pour étudiant ${studentId}`);
    } else {
      // Créer un nouvel enregistrement avec la logique correcte
      const unpaidSessions = student.unpaid_sessions || 0;
      const paidSessions = student.paid_sessions || 0;
      const prixSeance = 50.00; // Prix par défaut
      const montantTotal = totalSessions * prixSeance;
      const montantPaye = paidSessions * prixSeance;  // Séances payées × prix
      const montantRestant = unpaidSessions * prixSeance;  // Séances non payées × prix

      await connection.execute(`
        INSERT INTO paiement (
          student_id, 
          parent_id, 
          seances_total, 
          seances_non_payees, 
          seances_payees,
          montant_total,
          montant_paye,
          montant_restant,
          prix_seance,
          statut,
          date_derniere_presence
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente', CURDATE())
      `, [studentId, parentId, totalSessions, unpaidSessions, paidSessions, montantTotal, montantPaye, montantRestant, prixSeance]);

      console.log(`✅ Nouveau paiement créé pour étudiant ${studentId}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la synchronisation du paiement pour l'étudiant ${studentId}:`, error);
  }
}

// GET - Récupérer la liste des étudiants pour la présence
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const nameFilter = searchParams.get('name');
    
    const connection = await getConnection();
    
    // Requête simple pour récupérer tous les étudiants
    let query = `
      SELECT 
        s.id as student_id,
        u.first_name,
        u.last_name,
        u.email,
        s.class_level,
        COALESCE(s.paid_sessions, 0) as paid_sessions,
        COALESCE(s.unpaid_sessions, 0) as unpaid_sessions,
        u.is_active,
        u.created_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.role = 'student'
    `;
    
    const params: any[] = [];
    
    // Filtre par classe
    if (classFilter && classFilter !== 'Tous') {
      query += ` AND s.class_level = ?`;
      params.push(classFilter);
    }
    
    // Filtre par nom
    if (nameFilter) {
      query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
      const searchTerm = `%${nameFilter}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY s.id DESC`;
    
    const [rows] = await connection.execute(query, params);
    await connection.end();
    
    console.log(`✅ Liste des étudiants récupérée: ${(rows as any[]).length} étudiants`);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de la liste des étudiants' },
      { status: 500 }
    );
  }
}

// POST - Marquer la présence d'un étudiant
export async function POST(request: NextRequest) {
  try {
    const { studentId, date, isPresent } = await request.json();
    
    const connection = await getConnection();
    
    // Créer la table attendance si elle n'existe pas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        session_date DATE NOT NULL,
        is_present BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE KEY unique_student_date (student_id, session_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Mettre à jour ou insérer la présence
    await connection.execute(`
      INSERT INTO attendance (student_id, session_date, is_present)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        is_present = VALUES(is_present),
        updated_at = CURRENT_TIMESTAMP
    `, [studentId, date, isPresent]);
    
    // Si l'étudiant est marqué présent, incrémenter les séances non payées et gérer la table paiement
    if (isPresent) {
      await connection.execute(`
        UPDATE students 
        SET unpaid_sessions = COALESCE(unpaid_sessions, 0) + 1
        WHERE id = ?
      `, [studentId]);

      // Récupérer l'ID du parent associé à cet étudiant (peut être NULL)
      console.log(`🔍 Recherche du parent pour l'étudiant ${studentId}...`);
      const [parentRelation] = await connection.execute(`
        SELECT ps.parent_id
        FROM parent_student ps
        WHERE ps.student_id = ?
        LIMIT 1
      `, [studentId]);

      console.log(`📋 Relations trouvées:`, parentRelation);

      // Déterminer l'ID du parent (NULL si aucun parent trouvé)
      const parentId = parentRelation.length > 0 ? parentRelation[0].parent_id : null;
      
      if (parentId) {
        console.log(`✅ Parent trouvé: ID ${parentId}`);
      } else {
        console.log(`⚠️ Aucun parent trouvé pour l'étudiant ${studentId} - Création avec parent_id NULL`);
      }

      // Vérifier si un enregistrement de paiement existe déjà
      const [existingPayment] = await connection.execute(`
        SELECT id, seances_total, seances_non_payees, prix_seance, montant_paye
        FROM paiement
        WHERE student_id = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))
      `, [studentId, parentId, parentId]);

      if (existingPayment.length > 0) {
        // Mettre à jour l'enregistrement existant
        const payment = existingPayment[0];
        const newSeancesTotal = payment.seances_total + 1;
        const newSeancesNonPayees = payment.seances_non_payees + 1;
        const newMontantTotal = newSeancesTotal * payment.prix_seance;
        const newMontantRestant = newMontantTotal - payment.montant_paye;

        await connection.execute(`
          UPDATE paiement 
          SET 
            seances_total = ?,
            seances_non_payees = ?,
            montant_total = ?,
            montant_restant = ?,
            date_derniere_presence = ?,
            date_modification = CURRENT_TIMESTAMP
          WHERE student_id = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))
        `, [newSeancesTotal, newSeancesNonPayees, newMontantTotal, newMontantRestant, date, studentId, parentId, parentId]);

        console.log(`✅ Paiement mis à jour pour étudiant ${studentId} ${parentId ? `et parent ${parentId}` : '(sans parent)'}`);
      } else {
        // Créer un nouvel enregistrement
        await connection.execute(`
          INSERT INTO paiement (
            student_id, 
            parent_id, 
            seances_total, 
            seances_non_payees, 
            seances_payees,
            montant_total,
            montant_paye,
            montant_restant,
            prix_seance,
            statut,
            date_derniere_presence
          ) VALUES (?, ?, 1, 1, 0, 50.00, 0.00, 50.00, 50.00, 'en_attente', ?)
        `, [studentId, parentId, date]);

        console.log(`✅ Nouveau paiement créé pour étudiant ${studentId} ${parentId ? `et parent ${parentId}` : '(sans parent)'}`);
      }
    }
    
    await connection.end();
    
    return NextResponse.json({ 
      message: `Présence ${isPresent ? 'marquée' : 'démarquée'} avec succès`,
      success: true 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la présence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la présence' },
      { status: 500 }
    );
  }
}

// PUT - Actions administratives sur les paiements
export async function PUT(request: NextRequest) {
  try {
    const { studentId, action, sessions, paidSessions, unpaidSessions } = await request.json();
    
    const connection = await getConnection();
    
    let message = '';
    
    switch (action) {
      case 'add_unpaid':
        if (!sessions || sessions <= 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET unpaid_sessions = COALESCE(unpaid_sessions, 0) + ?
          WHERE id = ?
        `, [sessions, studentId]);
        
        // Synchroniser avec la table paiement
        await syncPaymentTable(connection, studentId);
        message = `${sessions} séance(s) non payée(s) ajoutée(s)`;
        break;
        
      case 'remove_unpaid':
        if (!sessions || sessions <= 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET unpaid_sessions = GREATEST(0, COALESCE(unpaid_sessions, 0) - ?)
          WHERE id = ?
        `, [sessions, studentId]);
        
        // Synchroniser avec la table paiement
        await syncPaymentTable(connection, studentId);
        message = `${sessions} séance(s) non payée(s) retirée(s)`;
        break;
        
      case 'add_paid':
        if (!sessions || sessions <= 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET paid_sessions = COALESCE(paid_sessions, 0) + ?
          WHERE id = ?
        `, [sessions, studentId]);
        
        // Synchroniser avec la table paiement
        await syncPaymentTable(connection, studentId);
        message = `${sessions} séance(s) payée(s) ajoutée(s)`;
        break;
        
      case 'remove_paid':
        if (!sessions || sessions <= 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET paid_sessions = GREATEST(0, COALESCE(paid_sessions, 0) - ?)
          WHERE id = ?
        `, [sessions, studentId]);
        
        // Synchroniser avec la table paiement
        await syncPaymentTable(connection, studentId);
        message = `${sessions} séance(s) payée(s) retirée(s)`;
        break;
        
      case 'set_paid_sessions':
        if (paidSessions === undefined || paidSessions < 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances payées invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET paid_sessions = ?
          WHERE id = ?
        `, [paidSessions, studentId]);
        message = `Séances payées définies à ${paidSessions}`;
        break;
        
      case 'set_unpaid_sessions':
        if (unpaidSessions === undefined || unpaidSessions < 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances non payées invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET unpaid_sessions = ?
          WHERE id = ?
        `, [unpaidSessions, studentId]);
        message = `Séances non payées définies à ${unpaidSessions}`;
        break;
        
      case 'set_both_sessions':
        if (paidSessions === undefined || paidSessions < 0 || unpaidSessions === undefined || unpaidSessions < 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE students
          SET paid_sessions = ?, unpaid_sessions = ?
          WHERE id = ?
        `, [paidSessions, unpaidSessions, studentId]);
        
        // Synchroniser avec la table paiement
        await syncPaymentTable(connection, studentId);
        message = `Séances payées: ${paidSessions}, Séances non payées: ${unpaidSessions}`;
        break;
        
      default:
        await connection.end();
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }
    
    await connection.end();
    
    return NextResponse.json({ 
      message,
      success: true 
    });
  } catch (error) {
    console.error('Erreur lors de l\'action administrative:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'action administrative' },
      { status: 500 }
    );
  }
}
