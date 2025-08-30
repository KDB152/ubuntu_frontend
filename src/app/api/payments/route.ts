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

// GET - Récupérer les informations de paiement d'un étudiant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'ID de l\'étudiant requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Récupérer les informations de paiement depuis la table paiement
    const [rows] = await connection.execute(`
      SELECT 
        p.student_id,
        p.parent_id,
        CONCAT(u.first_name, ' ', u.last_name) as fullName,
        u.email,
        s.class_level,
        COALESCE(p.seances_total, 0) as seances_total,
        COALESCE(p.seances_payees, 0) as seances_payees,
        COALESCE(p.seances_non_payees, 0) as seances_non_payees,
        COALESCE(p.montant_total, 0.00) as montant_total,
        COALESCE(p.montant_paye, 0.00) as montant_paye,
        COALESCE(p.montant_restant, 0.00) as montant_restant,
        COALESCE(p.prix_seance, 50.00) as prix_seance,
        p.statut,
        p.date_derniere_presence,
        p.date_dernier_paiement
      FROM paiement p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE p.student_id = ?
    `, [studentId]);
    
    await connection.end();
    
    if ((rows as any[]).length === 0) {
      // Si aucun enregistrement dans la table paiement, retourner des valeurs par défaut
      const [studentRows] = await connection.execute(`
        SELECT 
          s.id as student_id,
          CONCAT(u.first_name, ' ', u.last_name) as fullName,
          u.email,
          s.class_level,
          COALESCE(s.paid_sessions, 0) as paid_sessions,
          COALESCE(s.unpaid_sessions, 0) as unpaid_sessions
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?
      `, [studentId]);
      
      if ((studentRows as any[]).length > 0) {
        const student = (studentRows as any[])[0];
        return NextResponse.json({
          studentId: student.student_id,
          fullName: student.fullName,
          email: student.email,
          classLevel: student.class_level,
          seancesTotal: student.paid_sessions + student.unpaid_sessions,
          seancesPayees: student.paid_sessions,
          seancesNonPayees: student.unpaid_sessions,
          montantTotal: (student.paid_sessions + student.unpaid_sessions) * 50.00,
          montantPaye: student.paid_sessions * 50.00,
          montantRestant: student.unpaid_sessions * 50.00,
          prixSeance: 50.00,
          statut: student.unpaid_sessions === 0 ? 'paye' : 
                  student.unpaid_sessions <= 2 ? 'partiel' : 
                  student.unpaid_sessions > 5 ? 'en_retard' : 'en_attente'
        });
      }
      
      return NextResponse.json(
        { error: 'Étudiant non trouvé' },
        { status: 404 }
      );
    }
    
    const paiement = (rows as any[])[0];
    
    return NextResponse.json({
      studentId: paiement.student_id,
      parentId: paiement.parent_id,
      fullName: paiement.fullName,
      email: paiement.email,
      classLevel: paiement.class_level,
      seancesTotal: paiement.seances_total,
      seancesPayees: paiement.seances_payees,
      seancesNonPayees: paiement.seances_non_payees,
      montantTotal: paiement.montant_total,
      montantPaye: paiement.montant_paye,
      montantRestant: paiement.montant_restant,
      prixSeance: paiement.prix_seance,
      statut: paiement.statut,
      dateDernierePresence: paiement.date_derniere_presence,
      dateDernierPaiement: paiement.date_dernier_paiement
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    );
  }
}

// POST - Marquer des séances comme payées
export async function POST(request: NextRequest) {
  try {
    const { studentId, paidSessions } = await request.json();
    
    if (!studentId || !paidSessions || paidSessions <= 0) {
      return NextResponse.json(
        { error: 'ID de l\'étudiant et nombre de séances payées requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Vérifier le nombre de séances non payées actuelles
    const [currentRows] = await connection.execute(`
      SELECT seances_non_payees, montant_restant, prix_seance
      FROM paiement 
      WHERE student_id = ?
    `, [studentId]);
    
    if ((currentRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Aucun enregistrement de paiement trouvé pour cet étudiant' },
        { status: 404 }
      );
    }
    
    const current = (currentRows as any[])[0];
    const currentUnpaidSessions = current.seances_non_payees || 0;
    
    if (paidSessions > currentUnpaidSessions) {
      await connection.end();
      return NextResponse.json(
        { error: `Nombre de séances payées (${paidSessions}) supérieur aux séances non payées disponibles (${currentUnpaidSessions})` },
        { status: 400 }
      );
    }
    
    // Mettre à jour les paiements
    await connection.execute(`
      UPDATE paiement
      SET 
        seances_payees = seances_payees + ?,
        seances_non_payees = GREATEST(0, seances_non_payees - ?),
        montant_paye = montant_paye + (? * prix_seance),
        montant_restant = GREATEST(0, montant_restant - (? * prix_seance)),
        date_dernier_paiement = CURRENT_DATE,
        date_modification = CURRENT_TIMESTAMP,
        statut = CASE 
          WHEN (seances_non_payees - ?) = 0 THEN 'paye'
          WHEN (seances_non_payees - ?) <= 2 THEN 'partiel'
          ELSE 'en_attente'
        END
      WHERE student_id = ?
    `, [paidSessions, paidSessions, paidSessions, paidSessions, paidSessions, paidSessions, studentId]);
    
    // Mettre à jour la table students pour compatibilité
    await connection.execute(`
      UPDATE students
      SET 
        paid_sessions = paid_sessions + ?,
        unpaid_sessions = GREATEST(0, unpaid_sessions - ?)
      WHERE id = ?
    `, [paidSessions, paidSessions, studentId]);
    
    await connection.end();
    
    const remainingUnpaid = currentUnpaidSessions - paidSessions;
    
    return NextResponse.json({
      message: `${paidSessions} séance(s) marquée(s) comme payée(s)`,
      success: true,
      remainingUnpaid,
      montantPaye: paidSessions * (current.prix_seance || 50.00)
    });
    
  } catch (error) {
    console.error('Erreur lors du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du paiement' },
      { status: 500 }
    );
  }
}

// PUT - Actions administratives sur les paiements
export async function PUT(request: NextRequest) {
  try {
    const { studentId, action, sessions } = await request.json();
    
    if (!studentId || !action) {
      return NextResponse.json(
        { error: 'ID de l\'étudiant et action requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    let message = '';
    
    switch (action) {
      case 'reset_paid':
        await connection.execute(`
          UPDATE paiement
          SET seances_payees = 0, montant_paye = 0, date_modification = CURRENT_TIMESTAMP
          WHERE student_id = ?
        `, [studentId]);
        message = 'Séances payées réinitialisées';
        break;
        
      case 'reset_unpaid':
        await connection.execute(`
          UPDATE paiement
          SET seances_non_payees = 0, montant_restant = 0, date_modification = CURRENT_TIMESTAMP
          WHERE student_id = ?
        `, [studentId]);
        message = 'Séances non payées réinitialisées';
        break;
        
      case 'add_unpaid':
        if (!sessions || sessions <= 0) {
          await connection.end();
          return NextResponse.json(
            { error: 'Nombre de séances invalide' },
            { status: 400 }
          );
        }
        await connection.execute(`
          UPDATE paiement
          SET 
            seances_total = seances_total + ?,
            seances_non_payees = seances_non_payees + ?,
            montant_total = montant_total + (? * prix_seance),
            montant_restant = montant_restant + (? * prix_seance),
            date_modification = CURRENT_TIMESTAMP
          WHERE student_id = ?
        `, [sessions, sessions, sessions, sessions, studentId]);
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
          UPDATE paiement
          SET 
            seances_non_payees = GREATEST(0, seances_non_payees - ?),
            montant_restant = GREATEST(0, montant_restant - (? * prix_seance)),
            date_modification = CURRENT_TIMESTAMP
          WHERE student_id = ?
        `, [sessions, sessions, studentId]);
        message = `${sessions} séance(s) non payée(s) retirée(s)`;
        break;
        
      default:
        await connection.end();
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }
    
    // Mettre à jour le statut
    await connection.execute(`
      UPDATE paiement 
      SET statut = CASE 
        WHEN seances_non_payees = 0 THEN 'paye'
        WHEN seances_non_payees <= 2 THEN 'partiel'
        WHEN seances_non_payees > 5 THEN 'en_retard'
        ELSE 'en_attente'
      END
      WHERE student_id = ?
    `, [studentId]);
    
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
