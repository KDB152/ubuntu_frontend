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

// GET - Récupérer les paiements pour un parent spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const userId = searchParams.get('userId'); // ID du user parent pour les cas où parentId n'est pas fourni

    const connection = await getConnection();

    let finalParentId = parentId;

    // Si parentId n'est pas fourni mais userId l'est, trouver le parentId
    if (!parentId && userId) {
      const [parentData] = await connection.execute(`
        SELECT id FROM parents WHERE user_id = ?
      `, [userId]);

      if ((parentData as any).length > 0) {
        finalParentId = (parentData as any)[0].id;
      } else {
        await connection.end();
        return NextResponse.json(
          { error: 'Parent non trouvé' },
          { status: 404 }
        );
      }
    }

    if (!finalParentId) {
      await connection.end();
      return NextResponse.json(
        { error: 'ID parent requis' },
        { status: 400 }
      );
    }

    // Récupérer tous les paiements pour ce parent
    const [payments] = await connection.execute(`
      SELECT p.*, 
             s_user.first_name as student_first_name,
             s_user.last_name as student_last_name,
             s.class_level,
             p_user.first_name as parent_first_name,
             p_user.last_name as parent_last_name
      FROM paiement p
      JOIN students s ON p.student_id = s.id
      JOIN users s_user ON s.user_id = s_user.id
      LEFT JOIN parents parent ON p.parent_id = parent.id
      LEFT JOIN users p_user ON parent.user_id = p_user.id
      WHERE p.parent_id = ? OR (p.parent_id IS NULL AND EXISTS (
        SELECT 1 FROM parent_student ps 
        WHERE ps.parent_id = ? AND ps.student_id = p.student_id
      ))
      ORDER BY p.date_modification DESC, p.student_id
    `, [finalParentId, finalParentId]);

    // Calculer les statistiques
    const stats = {
      totalPayments: (payments as any).length,
      totalAmount: (payments as any).reduce((sum: number, p: any) => sum + parseFloat(p.montant_total || 0), 0),
      totalPaid: (payments as any).reduce((sum: number, p: any) => sum + parseFloat(p.montant_paye || 0), 0),
      totalRemaining: (payments as any).reduce((sum: number, p: any) => sum + parseFloat(p.montant_restant || 0), 0),
      totalSessions: (payments as any).reduce((sum: number, p: any) => sum + (p.seances_total || 0), 0),
      totalUnpaidSessions: (payments as any).reduce((sum: number, p: any) => sum + (p.seances_non_payees || 0), 0),
      totalPaidSessions: (payments as any).reduce((sum: number, p: any) => sum + (p.seances_payees || 0), 0)
    };

    await connection.end();

    return NextResponse.json({
      payments,
      stats,
      parentId: finalParentId
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    );
  }
}