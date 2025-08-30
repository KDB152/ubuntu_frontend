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
    
    // Si l'étudiant est marqué présent, incrémenter les séances non payées
    if (isPresent) {
      await connection.execute(`
        UPDATE students 
        SET unpaid_sessions = COALESCE(unpaid_sessions, 0) + 1
        WHERE id = ?
      `, [studentId]);
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
