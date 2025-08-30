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

async function fixDatabaseStructure() {
  console.log('🔧 Correction de la Structure de la Base de Données\n');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie');

    // 1. Vérifier la structure de la table users
    console.log('\n1️⃣ Vérification de la table users...');
    const [userColumns] = await connection.execute('DESCRIBE users');
    console.log('   Colonnes de la table users:');
    userColumns.forEach(col => {
      console.log(`      - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 2. Vérifier si la colonne role existe
    const roleColumn = userColumns.find(col => col.Field === 'role');
    if (!roleColumn) {
      console.log('   ❌ Colonne role manquante, ajout en cours...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('student', 'parent', 'admin') DEFAULT NULL
      `);
      console.log('   ✅ Colonne role ajoutée');
    } else {
      console.log('   ✅ Colonne role existe déjà');
    }

    // 3. Vérifier la structure de la table students
    console.log('\n2️⃣ Vérification de la table students...');
    const [studentColumns] = await connection.execute('DESCRIBE students');
    console.log('   Colonnes de la table students:');
    studentColumns.forEach(col => {
      console.log(`      - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 4. Vérifier les colonnes paid_sessions et unpaid_sessions
    const paidSessionsColumn = studentColumns.find(col => col.Field === 'paid_sessions');
    const unpaidSessionsColumn = studentColumns.find(col => col.Field === 'unpaid_sessions');

    if (!paidSessionsColumn) {
      console.log('   ❌ Colonne paid_sessions manquante, ajout en cours...');
      await connection.execute('ALTER TABLE students ADD COLUMN paid_sessions INT DEFAULT 0');
      console.log('   ✅ Colonne paid_sessions ajoutée');
    } else {
      console.log('   ✅ Colonne paid_sessions existe déjà');
    }

    if (!unpaidSessionsColumn) {
      console.log('   ❌ Colonne unpaid_sessions manquante, ajout en cours...');
      await connection.execute('ALTER TABLE students ADD COLUMN unpaid_sessions INT DEFAULT 0');
      console.log('   ✅ Colonne unpaid_sessions ajoutée');
    } else {
      console.log('   ✅ Colonne unpaid_sessions existe déjà');
    }

    // 5. Vérifier la table attendance
    console.log('\n3️⃣ Vérification de la table attendance...');
    try {
      const [attendanceColumns] = await connection.execute('DESCRIBE attendance');
      console.log('   ✅ Table attendance existe');
      console.log('   Colonnes de la table attendance:');
      attendanceColumns.forEach(col => {
        console.log(`      - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Table attendance manquante, création en cours...');
      await connection.execute(`
        CREATE TABLE attendance (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          session_date DATE NOT NULL,
          is_present BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          UNIQUE KEY unique_student_date (student_id, session_date),
          INDEX idx_student_id (student_id),
          INDEX idx_session_date (session_date),
          INDEX idx_is_present (is_present)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Table attendance créée');
    }

    // 6. Vérifier la table paiement
    console.log('\n4️⃣ Vérification de la table paiement...');
    try {
      const [paiementColumns] = await connection.execute('DESCRIBE paiement');
      console.log('   ✅ Table paiement existe');
      console.log('   Colonnes de la table paiement:');
      paiementColumns.forEach(col => {
        console.log(`      - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Table paiement manquante, création en cours...');
      await connection.execute(`
        CREATE TABLE paiement (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          parent_id INT NOT NULL,
          seances_total INT DEFAULT 0 COMMENT 'Nombre total de séances (présences)',
          seances_non_payees INT DEFAULT 0 COMMENT 'Nombre de séances non payées',
          seances_payees INT DEFAULT 0 COMMENT 'Nombre de séances payées',
          montant_total DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Montant total des séances',
          montant_paye DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Montant payé',
          montant_restant DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Montant restant à payer',
          prix_seance DECIMAL(10,2) DEFAULT 50.00 COMMENT 'Prix par séance (configurable)',
          statut ENUM('en_attente', 'partiel', 'paye', 'en_retard') DEFAULT 'en_attente',
          date_derniere_presence DATE NULL COMMENT 'Date de la dernière présence',
          date_dernier_paiement DATE NULL COMMENT 'Date du dernier paiement',
          date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
          INDEX idx_student_id (student_id),
          INDEX idx_parent_id (parent_id),
          INDEX idx_statut (statut),
          INDEX idx_date_derniere_presence (date_derniere_presence),
          UNIQUE KEY unique_student_parent (student_id, parent_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Table paiement créée');
    }

    // 7. Mettre à jour les rôles
    console.log('\n5️⃣ Mise à jour des rôles...');
    
    // Mettre à jour les rôles pour les étudiants
    const [studentUpdateResult] = await connection.execute(`
      UPDATE users u
      JOIN students s ON u.id = s.user_id
      SET u.role = 'student'
      WHERE u.role IS NULL OR u.role = ''
    `);
    console.log(`   ✅ ${studentUpdateResult.affectedRows} rôles étudiants mis à jour`);

    // Mettre à jour les rôles pour les parents
    const [parentUpdateResult] = await connection.execute(`
      UPDATE users u
      JOIN parents p ON u.id = p.user_id
      SET u.role = 'parent'
      WHERE u.role IS NULL OR u.role = ''
    `);
    console.log(`   ✅ ${parentUpdateResult.affectedRows} rôles parents mis à jour`);

    // 8. Vérifier les données
    console.log('\n6️⃣ Vérification des données...');
    
    // Compter les étudiants
    const [studentCount] = await connection.execute('SELECT COUNT(*) as count FROM students');
    console.log(`   📊 Nombre d'étudiants: ${studentCount[0].count}`);

    // Compter les parents
    const [parentCount] = await connection.execute('SELECT COUNT(*) as count FROM parents');
    console.log(`   📊 Nombre de parents: ${parentCount[0].count}`);

    // Compter les utilisateurs par rôle
    const [roleCounts] = await connection.execute(`
      SELECT role, COUNT(*) as count 
      FROM users 
      WHERE role IS NOT NULL 
      GROUP BY role
    `);
    console.log('   📊 Utilisateurs par rôle:');
    roleCounts.forEach(role => {
      console.log(`      - ${role.role}: ${role.count}`);
    });

    // 9. Vérifier les relations parent_student
    const [parentStudentCount] = await connection.execute('SELECT COUNT(*) as count FROM parent_student');
    console.log(`   📊 Relations parent-étudiant: ${parentStudentCount[0].count}`);

    console.log('\n✅ Structure de la base de données corrigée avec succès !');
    console.log('\n🎯 Maintenant vous pouvez tester les APIs :');
    console.log('   - GET /api/attendance');
    console.log('   - GET /api/payments?studentId=68');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

// Exécuter la correction
fixDatabaseStructure();
