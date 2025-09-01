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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = parseInt(params.id);
    const body = await request.json();
    
    const { statut, montant_paye, montant_restant, seances_payees, seances_non_payees } = body;

    const connection = await getConnection();
    
    // Mettre à jour le paiement
    const query = `
      UPDATE paiement 
      SET 
        statut = ?,
        montant_paye = ?,
        montant_restant = ?,
        seances_payees = ?,
        seances_non_payees = ?,
        date_dernier_paiement = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      statut,
      montant_paye || 0,
      montant_restant || 0,
      seances_payees || 0,
      seances_non_payees || 0,
      paymentId
    ]);
    
    await connection.end();
    
    console.log(`✅ Paiement ${paymentId} mis à jour avec succès`);
    
    return NextResponse.json({ 
      message: 'Paiement mis à jour avec succès',
      updated: true 
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = parseInt(params.id);
    
    const connection = await getConnection();
    
    // Récupérer les détails du paiement
    const query = `
      SELECT 
        p.*,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        s.class_level,
        parent_user.first_name as parent_first_name,
        parent_user.last_name as parent_last_name
      FROM paiement p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN parents par ON p.parent_id = par.id
      LEFT JOIN users parent_user ON par.user_id = parent_user.id
      WHERE p.id = ?
    `;
    
    const [rows] = await connection.execute(query, [paymentId]);
    await connection.end();
    
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Paiement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json((rows as any[])[0]);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du paiement' },
      { status: 500 }
    );
  }
}
