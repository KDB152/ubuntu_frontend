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

// Mettre à jour un paiement spécifique
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;
    const body = await request.json();
    
    console.log('🔄 Mise à jour du paiement:', paymentId, body);
    
    const connection = await getConnection();
    
    // Récupérer les données actuelles du paiement
    const [currentRows] = await connection.execute(
      'SELECT * FROM paiement WHERE id = ?',
      [paymentId]
    );
    
    if ((currentRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Paiement non trouvé' },
        { status: 404 }
      );
    }
    
    const currentPayment = (currentRows as any[])[0];
    
    // Calculer les nouvelles valeurs
    const seances_payees = body.seances_payees || currentPayment.seances_payees;
    const seances_non_payees = body.seances_non_payees || currentPayment.seances_non_payees;
    const seances_total = seances_payees + seances_non_payees;
    const prix_seance = currentPayment.prix_seance || 40; // Prix par défaut
    const montant_total = seances_total * prix_seance;
    const montant_paye = seances_payees * prix_seance;
    const montant_restant = seances_non_payees * prix_seance;
    
    // Déterminer le nouveau statut
    let statut = 'en_attente';
    if (seances_non_payees === 0) {
      statut = 'paye';
    } else if (seances_payees > 0) {
      statut = 'partiel';
    }
    
    // Mettre à jour le paiement dans la base de données
    await connection.execute(`
      UPDATE paiement 
      SET 
        seances_total = ?,
        seances_payees = ?,
        seances_non_payees = ?,
        montant_total = ?,
        montant_paye = ?,
        montant_restant = ?,
        statut = ?,
        date_modification = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      seances_total,
      seances_payees,
      seances_non_payees,
      montant_total,
      montant_paye,
      montant_restant,
      statut,
      paymentId
    ]);
    
    await connection.end();
    
    console.log('✅ Paiement mis à jour avec succès:', {
      id: paymentId,
      seances_total,
      seances_payees,
      seances_non_payees,
      montant_total,
      montant_paye,
      montant_restant,
      statut
    });
    
    return NextResponse.json({
      message: 'Paiement mis à jour avec succès',
      updatedPayment: {
        id: paymentId,
        seances_total,
        seances_payees,
        seances_non_payees,
        montant_total,
        montant_paye,
        montant_restant,
        statut
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    );
  }
}

// Récupérer un paiement spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;
    
    const connection = await getConnection();
    
    const [rows] = await connection.execute(`
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
    `, [paymentId]);
    
    await connection.end();
    
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Paiement non trouvé' },
        { status: 404 }
      );
    }
    
    const payment = (rows as any[])[0];
    
    return NextResponse.json(payment);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du paiement' },
      { status: 500 }
    );
  }
}