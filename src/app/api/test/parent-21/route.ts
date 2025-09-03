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

// GET - Test spécifique pour le parent ID 21
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 GET /api/test/parent-21 - Test spécifique pour le parent ID 21');
    
    const connection = await getConnection();
    
    // Test 1: Vérifier si le parent ID 21 existe
    console.log('🔍 Test 1: Vérifier l\'existence du parent ID 21...');
    const [parentTest] = await connection.execute(`
      SELECT * FROM parents WHERE id = 21
    `);
    
    // Test 2: Vérifier la table parent_student
    console.log('🔍 Test 2: Vérifier la table parent_student...');
    const [parentStudentTest] = await connection.execute(`
      SELECT * FROM parent_student WHERE parent_id = 21
    `);
    
    // Test 3: Vérifier via user_id
    console.log('🔍 Test 3: Vérifier via user_id...');
    const [parentUserTest] = await connection.execute(`
      SELECT p.*, u.* FROM parents p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = 21 OR u.id = 21
    `);
    
    // Test 4: Voir toutes les relations parent_student
    console.log('🔍 Test 4: Voir toutes les relations parent_student...');
    const [allRelations] = await connection.execute(`
      SELECT 
        ps.*,
        p.id as parent_table_id,
        p.user_id as parent_user_id,
        s.id as student_table_id,
        s.user_id as student_user_id,
        CONCAT(pu.first_name, ' ', pu.last_name) as parent_name,
        CONCAT(su.first_name, ' ', su.last_name) as student_name
      FROM parent_student ps
      LEFT JOIN parents p ON ps.parent_id = p.id
      LEFT JOIN users pu ON p.user_id = pu.id
      LEFT JOIN students s ON ps.student_id = s.id
      LEFT JOIN users su ON s.user_id = su.id
      ORDER BY ps.parent_id, ps.student_id
    `);
    
    // Test 5: Vérifier la structure des tables
    console.log('🔍 Test 5: Vérifier la structure des tables...');
    const [parentStructure] = await connection.execute(`DESCRIBE parents`);
    const [studentStructure] = await connection.execute(`DESCRIBE students`);
    const [parentStudentStructure] = await connection.execute(`DESCRIBE parent_student`);
    
    await connection.end();
    
    const testResults = {
      timestamp: new Date().toISOString(),
      parent_id_21_exists: (parentTest as any[]).length > 0,
      parent_student_relations: (parentStudentTest as any[]).length,
      parent_user_info: (parentUserTest as any[]).length > 0,
      all_relations_count: (allRelations as any[]).length,
      structures: {
        parents: parentStructure,
        students: studentStructure,
        parent_student: parentStudentStructure
      },
      details: {
        parent_test: parentTest,
        parent_student_test: parentStudentTest,
        parent_user_test: parentUserTest,
        all_relations: allRelations
      }
    };
    
    console.log('✅ Test terminé avec succès');
    console.log('📊 Résultats:', {
      parentExists: testResults.parent_id_21_exists,
      relationsFound: testResults.parent_student_relations,
      userInfoFound: testResults.parent_user_info,
      totalRelations: testResults.all_relations_count
    });
    
    return NextResponse.json(testResults);
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test', details: error },
      { status: 500 }
    );
  }
}
