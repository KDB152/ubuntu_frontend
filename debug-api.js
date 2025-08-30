const mysql = require('mysql2/promise');

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

async function debugAPI() {
  console.log('🔍 Diagnostic des APIs\n');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie');

    // 1. Vérifier les étudiants
    console.log('\n1️⃣ Vérification des étudiants...');
    const [students] = await connection.execute(`
      SELECT 
        s.id,
        s.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        s.class_level
      FROM students s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.id
    `);
    
    console.log(`   📊 Nombre d'étudiants: ${students.length}`);
    students.forEach(student => {
      console.log(`      - ID: ${student.id}, Nom: ${student.first_name} ${student.last_name}, Rôle: ${student.role}, Classe: ${student.class_level}`);
    });

    // 2. Vérifier les parents
    console.log('\n2️⃣ Vérification des parents...');
    const [parents] = await connection.execute(`
      SELECT 
        p.id,
        p.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.role
      FROM parents p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id
    `);
    
    console.log(`   📊 Nombre de parents: ${parents.length}`);
    parents.forEach(parent => {
      console.log(`      - ID: ${parent.id}, Nom: ${parent.first_name} ${parent.last_name}, Rôle: ${parent.role}`);
    });

    // 3. Vérifier les relations parent_student
    console.log('\n3️⃣ Vérification des relations parent-étudiant...');
    const [parentStudent] = await connection.execute(`
      SELECT 
        ps.student_id,
        ps.parent_id,
        CONCAT(u_student.first_name, ' ', u_student.last_name) as student_name,
        CONCAT(u_parent.first_name, ' ', u_parent.last_name) as parent_name
      FROM parent_student ps
      JOIN students s ON ps.student_id = s.id
      JOIN users u_student ON s.user_id = u_student.id
      JOIN parents p ON ps.parent_id = p.id
      JOIN users u_parent ON p.user_id = u_parent.id
      ORDER BY ps.student_id
    `);
    
    console.log(`   📊 Nombre de relations: ${parentStudent.length}`);
    parentStudent.forEach(rel => {
      console.log(`      - Étudiant: ${rel.student_name} (ID: ${rel.student_id}) -> Parent: ${rel.parent_name} (ID: ${rel.parent_id})`);
    });

    // 4. Tester la requête de l'API attendance
    console.log('\n4️⃣ Test de la requête API attendance...');
    try {
      const today = new Date().toISOString().split('T')[0];
      const [attendanceData] = await connection.execute(`
        SELECT 
          s.id as student_id,
          u.first_name,
          u.last_name,
          u.email,
          s.class_level,
          COALESCE(s.paid_sessions, 0) as paid_sessions,
          COALESCE(s.unpaid_sessions, 0) as unpaid_sessions,
          a.is_present,
          a.session_date,
          p.seances_total,
          p.seances_payees,
          p.seances_non_payees,
          p.montant_total,
          p.montant_paye,
          p.montant_restant,
          p.statut
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN attendance a ON s.id = a.student_id AND a.session_date = ?
        LEFT JOIN paiement p ON s.id = p.student_id
        WHERE u.role = 'student'
        ORDER BY s.id DESC
      `, [today]);
      
      console.log(`   ✅ Requête API attendance réussie: ${attendanceData.length} étudiants`);
      if (attendanceData.length > 0) {
        const first = attendanceData[0];
        console.log(`   👤 Premier étudiant: ${first.first_name} ${first.last_name}`);
        console.log(`      Présent: ${first.is_present ? 'Oui' : 'Non'}`);
        console.log(`      Séances payées: ${first.seances_payees || 0}`);
        console.log(`      Séances non payées: ${first.seances_non_payees || 0}`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur requête API attendance: ${error.message}`);
    }

    // 5. Tester la requête de l'API payments
    console.log('\n5️⃣ Test de la requête API payments...');
    try {
      const [paymentsData] = await connection.execute(`
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
      `, [68]);
      
      if (paymentsData.length > 0) {
        console.log(`   ✅ Requête API payments réussie pour l'étudiant 68`);
        const payment = paymentsData[0];
        console.log(`   👤 Étudiant: ${payment.fullName}`);
        console.log(`      Séances totales: ${payment.seances_total}`);
        console.log(`      Séances payées: ${payment.seances_payees}`);
        console.log(`      Séances non payées: ${payment.seances_non_payees}`);
        console.log(`      Montant restant: ${payment.montant_restant} €`);
      } else {
        console.log(`   ⚠️ Aucune donnée de paiement trouvée pour l'étudiant 68`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur requête API payments: ${error.message}`);
    }

    // 6. Vérifier les tables attendance et paiement
    console.log('\n6️⃣ Vérification des tables attendance et paiement...');
    
    const [attendanceCount] = await connection.execute('SELECT COUNT(*) as count FROM attendance');
    console.log(`   📊 Nombre d'enregistrements attendance: ${attendanceCount[0].count}`);
    
    const [paiementCount] = await connection.execute('SELECT COUNT(*) as count FROM paiement');
    console.log(`   📊 Nombre d'enregistrements paiement: ${paiementCount[0].count}`);

    console.log('\n✅ Diagnostic terminé !');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

// Exécuter le diagnostic
debugAPI();
