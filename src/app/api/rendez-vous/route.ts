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

// Interface pour un rendez-vous
interface RendezVous {
  id?: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childClass: string;
  timing: string; // Date et heure du rendez-vous
  parentReason: string; // Raison du parent
  adminReason?: string; // Raison de l'admin
  status: 'pending' | 'approved' | 'refused' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

// Fonction pour créer une connexion à la base de données
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connexion MySQL établie avec succès');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion MySQL:', error);
    throw error;
  }
}

// GET - Récupérer tous les rendez-vous
export async function GET() {
  try {
    console.log('GET /api/rendez-vous appelé');
    
    const connection = await getConnection();
    
    const [rows] = await connection.execute(`
      SELECT * FROM rendez_vous 
      ORDER BY created_at DESC
    `);
    
    await connection.end();
    
    console.log('Données récupérées de la base:', rows.length, 'lignes');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau rendez-vous
export async function POST(request: NextRequest) {
  try {
    const body: RendezVous = await request.json();
    const connection = await getConnection();
    
    const [result] = await connection.execute(`
      INSERT INTO rendez_vous (
        parent_id,
        parent_name,
        parent_email,
        parent_phone,
        child_name,
        child_class,
        timing,
        parent_reason,
        admin_reason,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.parentId,
      body.parentName,
      body.parentEmail,
      body.parentPhone,
      body.childName,
      body.childClass,
      body.timing,
      body.parentReason,
      body.adminReason || null,
      body.status || 'pending'
    ]);
    
    await connection.end();
    
    return NextResponse.json({ 
      id: (result as any).insertId,
      message: 'Rendez-vous créé avec succès'
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un rendez-vous existant (pour approuver/refuser)
export async function PUT(request: NextRequest) {
  try {
    const body: RendezVous = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(`
      UPDATE rendez_vous SET
        parent_id = ?,
        parent_name = ?,
        parent_email = ?,
        parent_phone = ?,
        child_name = ?,
        child_class = ?,
        timing = ?,
        parent_reason = ?,
        admin_reason = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      body.parentId,
      body.parentName,
      body.parentEmail,
      body.parentPhone,
      body.childName,
      body.childClass,
      body.timing,
      body.parentReason,
      body.adminReason || null,
      body.status,
      body.id
    ]);
    
    await connection.end();
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Rendez-vous mis à jour avec succès',
      id: body.id
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un rendez-vous
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Vérifier si le rendez-vous existe avant de le supprimer
    const [existingRows] = await connection.execute(`
      SELECT id FROM rendez_vous WHERE id = ?
    `, [id]);
    
    if ((existingRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le rendez-vous
    const [result] = await connection.execute(`
      DELETE FROM rendez_vous WHERE id = ?
    `, [id]);
    
    await connection.end();
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du rendez-vous' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Rendez-vous supprimé avec succès',
      id: id
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
