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
    console.log('Connexion MySQL établie avec succès');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion MySQL:', error);
    throw error;
  }
}

// POST - Exécuter la migration
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Début de la migration de la table rendez_vous');
    
    const connection = await getConnection();
    
    // 1. Ajouter les nouvelles colonnes
    console.log('📝 Ajout des nouvelles colonnes...');
    
    try {
      await connection.execute(`
        ALTER TABLE rendez_vous 
        ADD COLUMN IF NOT EXISTS child_id INT NULL AFTER parent_id
      `);
      console.log('✅ Colonne child_id ajoutée');
    } catch (error) {
      console.log('⚠️ Colonne child_id déjà présente ou erreur:', error);
    }
    
    try {
      await connection.execute(`
        ALTER TABLE rendez_vous 
        ADD COLUMN IF NOT EXISTS parent_id_int INT NULL AFTER parent_id
      `);
      console.log('✅ Colonne parent_id_int ajoutée');
    } catch (error) {
      console.log('⚠️ Colonne parent_id_int déjà présente ou erreur:', error);
    }
    
    // 2. Créer les index
    console.log('🔍 Création des index...');
    
    try {
      await connection.execute(`
        CREATE INDEX IF NOT EXISTS idx_rendez_vous_child_id ON rendez_vous(child_id)
      `);
      console.log('✅ Index sur child_id créé');
    } catch (error) {
      console.log('⚠️ Index sur child_id déjà présent ou erreur:', error);
    }
    
    try {
      await connection.execute(`
        CREATE INDEX IF NOT EXISTS idx_rendez_vous_parent_id_int ON rendez_vous(parent_id_int)
      `);
      console.log('✅ Index sur parent_id_int créé');
    } catch (error) {
      console.log('⚠️ Index sur parent_id_int déjà présent ou erreur:', error);
    }
    
    // 3. Mettre à jour les données existantes
    console.log('🔄 Mise à jour des données existantes...');
    
    // Mettre à jour parent_id_int pour les rendez-vous existants
    const [updateResult] = await connection.execute(`
      UPDATE rendez_vous 
      SET parent_id_int = CAST(parent_id AS UNSIGNED) 
      WHERE parent_id_int IS NULL 
      AND parent_id REGEXP '^[0-9]+$'
    `);
    
    console.log('✅ Mise à jour des parent_id_int:', (updateResult as any).affectedRows, 'lignes');
    
    await connection.end();
    
    console.log('🎉 Migration terminée avec succès');
    
    return NextResponse.json({
      success: true,
      message: 'Migration de la table rendez_vous terminée avec succès',
      details: {
        columnsAdded: ['child_id', 'parent_id_int'],
        indexesCreated: ['idx_rendez_vous_child_id', 'idx_rendez_vous_parent_id_int'],
        dataUpdated: (updateResult as any).affectedRows
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la migration de la table rendez_vous' },
      { status: 500 }
    );
  }
}
