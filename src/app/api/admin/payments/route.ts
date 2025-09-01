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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const statusFilter = searchParams.get('status');
    const searchQuery = searchParams.get('search');

    const connection = await getConnection();
    
    // Requête de base pour récupérer les paiements avec montant_total calculé automatiquement
    let query = `
      SELECT 
        p.id,
        p.student_id,
        p.parent_id,
        COALESCE(p.seances_total, 0) as seances_total,
        COALESCE(p.seances_non_payees, 0) as seances_non_payees,
        COALESCE(p.seances_payees, 0) as seances_payees,
        (COALESCE(p.montant_paye, 0) + COALESCE(p.montant_restant, 0)) as montant_total,
        COALESCE(p.montant_paye, 0) as montant_paye,
        COALESCE(p.montant_restant, 0) as montant_restant,
        COALESCE(p.prix_seance, 50) as prix_seance,
        COALESCE(p.statut, 'en_attente') as statut,
        p.date_derniere_presence,
        p.date_dernier_paiement,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        COALESCE(s.class_level, 'Non spécifié') as class_level,
        parent_user.first_name as parent_first_name,
        parent_user.last_name as parent_last_name,
        COALESCE(p.date_creation, CURRENT_TIMESTAMP) as date_creation
      FROM paiement p
      JOIN students s ON p.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN parents par ON p.parent_id = par.id
      LEFT JOIN users parent_user ON par.user_id = parent_user.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
         // Filtre par classe
     if (classFilter && classFilter !== 'Total') {
       query += ` AND s.class_level = ?`;
       params.push(classFilter);
     }
    
    // Filtre par statut
    if (statusFilter && statusFilter !== 'Tous') {
      query += ` AND p.statut = ?`;
      params.push(statusFilter);
    }
    
    // Filtre par recherche
    if (searchQuery) {
             query += ` AND (
         u.first_name LIKE ? OR 
         u.last_name LIKE ? OR 
         s.class_level LIKE ? OR
         parent_user.first_name LIKE ? OR
         parent_user.last_name LIKE ?
       )`;
      const searchTerm = `%${searchQuery}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY p.id DESC`;
    
         const [rows] = await connection.execute(query, params);
     await connection.end();
     
     console.log(`✅ Paiements récupérés: ${(rows as any[]).length} paiements`);
     
     // Convertir les montants de chaînes en nombres
     const processedRows = (rows as any[]).map(row => ({
       ...row,
       montant_total: parseFloat(row.montant_total) || 0,
       montant_paye: parseFloat(row.montant_paye) || 0,
       montant_restant: parseFloat(row.montant_restant) || 0,
       seances_total: parseInt(row.seances_total) || 0,
       seances_payees: parseInt(row.seances_payees) || 0,
       seances_non_payees: parseInt(row.seances_non_payees) || 0,
       prix_seance: parseFloat(row.prix_seance) || 50
     }));
     
     // Log des données pour déboguer
     if (processedRows.length > 0) {
       console.log('Exemple de données reçues:', {
         student: `${processedRows[0].student_first_name} ${processedRows[0].student_last_name}`,
         parent: `${processedRows[0].parent_first_name} ${processedRows[0].parent_last_name}`,
         parent_id: processedRows[0].parent_id,
         student_id: processedRows[0].student_id,
         montants: {
           total: processedRows[0].montant_total,
           paye: processedRows[0].montant_paye,
           restant: processedRows[0].montant_restant
         }
       });
     }
     
     return NextResponse.json(processedRows);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des paiements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implémenter la logique de création de paiement
    // Cette méthode doit créer un nouvel enregistrement dans la table paiement
    
    return NextResponse.json(
      { message: 'Paiement créé avec succès', id: Date.now() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implémenter la logique de mise à jour de paiement
    // Cette méthode doit mettre à jour un enregistrement existant dans la table paiement
    
    return NextResponse.json(
      { message: 'Paiement mis à jour avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    );
  }
}
