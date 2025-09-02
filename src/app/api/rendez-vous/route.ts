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
  connectionLimit: 5,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Créer un pool de connexions
const pool = mysql.createPool(dbConfig);

// Interface pour un rendez-vous
interface RendezVous {
  id?: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childClass: string;
  timing: string;
  parentReason: string;
  adminReason?: string;
  status: 'pending' | 'approved' | 'refused' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

// GET - Récupérer tous les rendez-vous
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/rendez-vous appelé');
    
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId');
    
    if (!parentId) {
      return NextResponse.json(
        { error: 'ID du parent requis' },
        { status: 400 }
      );
    }
    
    console.log('🔍 Récupération des rendez-vous pour le parent:', parentId);
    
    const connection = await pool.getConnection();
    
    try {
      // Requête simple pour récupérer les rendez-vous
      const [rows] = await connection.execute(`
        SELECT 
          id,
          parent_id,
          timing,
          parent_reason,
          admin_reason,
          status,
          created_at,
          updated_at
        FROM rendez_vous 
        WHERE parent_id = ?
        ORDER BY created_at DESC
      `, [parentId]);
      
      console.log('✅ Données récupérées:', rows.length, 'lignes');
      
      // Transformer les données
      const transformedRows = (rows as any[]).map(row => ({
        id: row.id,
        parentId: row.parent_id,
        parentName: 'Mohamed El Abed', // Nom fixe pour l'instant
        parentEmail: 'mohamed@example.com', // Email fixe pour l'instant
        parentPhone: '+33 6 12 34 56 78', // Téléphone fixe pour l'instant
        childName: 'Mayssa El Abed', // Nom fixe pour l'instant
        childClass: 'CP', // Classe fixe pour l'instant
        childEmail: 'mayssa@example.com', // Email fixe pour l'instant
        childPhone: '+33 6 12 34 56 79', // Téléphone fixe pour l'instant
        timing: row.timing,
        parentReason: row.parent_reason,
        adminReason: row.admin_reason,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      
      return NextResponse.json(transformedRows);
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des rendez-vous:', error);
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
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(`
        INSERT INTO rendez_vous (
          parent_id,
          timing,
          parent_reason,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [
        body.parentId,
        body.timing,
        body.parentReason,
        body.status || 'pending'
      ]);
      
      return NextResponse.json({ 
        id: (result as any).insertId,
        message: 'Rendez-vous créé avec succès'
      }, { status: 201 });
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un rendez-vous
export async function PUT(request: NextRequest) {
  try {
    const body: RendezVous = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }
    
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(`
        UPDATE rendez_vous SET
          timing = ?,
          parent_reason = ?,
          admin_reason = ?,
          status = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        body.timing,
        body.parentReason,
        body.adminReason || null,
        body.status,
        body.id
      ]);
      
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
      
    } finally {
      connection.release();
    }
    
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
    
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(`
        DELETE FROM rendez_vous WHERE id = ?
      `, [id]);
      
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
      
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
