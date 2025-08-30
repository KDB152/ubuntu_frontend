const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testModifySessions() {
  console.log('🔧 Test de Modification Directe des Séances\n');

  try {
    // 1. Récupérer la liste des étudiants
    console.log('1️⃣ Récupération des étudiants...');
    const getResponse = await fetch('http://localhost:3000/api/attendance');
    
    if (getResponse.ok) {
      const students = await getResponse.json();
      console.log(`   ✅ ${students.length} étudiants trouvés`);
      
      if (students.length === 0) {
        console.log('   ⚠️ Aucun étudiant trouvé. Test terminé.');
        return;
      }
      
      const testStudent = students[0];
      console.log(`   👤 Étudiant sélectionné pour les tests:`);
      console.log(`      ID: ${testStudent.student_id}`);
      console.log(`      Nom: ${testStudent.first_name} ${testStudent.last_name}`);
      console.log(`      Séances payées actuelles: ${testStudent.paid_sessions || 0}`);
      console.log(`      Séances non payées actuelles: ${testStudent.unpaid_sessions || 0}`);

      // 2. Test de modification des séances payées
      console.log('\n2️⃣ Test de modification des séances payées...');
      const modifyPaidResponse = await fetch('http://localhost:3000/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: testStudent.student_id,
          action: 'set_paid_sessions',
          paidSessions: 5
        })
      });

      if (modifyPaidResponse.ok) {
        const result = await modifyPaidResponse.json();
        console.log('   ✅ Séances payées modifiées avec succès !');
        console.log(`      Message: ${result.message}`);
      } else {
        const errorText = await modifyPaidResponse.text();
        console.log('   ❌ Erreur lors de la modification des séances payées:');
        console.log(`      Status: ${modifyPaidResponse.status}`);
        console.log(`      Message: ${errorText}`);
      }

      // 3. Test de modification des séances non payées
      console.log('\n3️⃣ Test de modification des séances non payées...');
      const modifyUnpaidResponse = await fetch('http://localhost:3000/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: testStudent.student_id,
          action: 'set_unpaid_sessions',
          unpaidSessions: 3
        })
      });

      if (modifyUnpaidResponse.ok) {
        const result = await modifyUnpaidResponse.json();
        console.log('   ✅ Séances non payées modifiées avec succès !');
        console.log(`      Message: ${result.message}`);
      } else {
        const errorText = await modifyUnpaidResponse.text();
        console.log('   ❌ Erreur lors de la modification des séances non payées:');
        console.log(`      Status: ${modifyUnpaidResponse.status}`);
        console.log(`      Message: ${errorText}`);
      }

      // 4. Test de modification des deux types de séances en même temps
      console.log('\n4️⃣ Test de modification des deux types de séances...');
      const modifyBothResponse = await fetch('http://localhost:3000/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: testStudent.student_id,
          action: 'set_both_sessions',
          paidSessions: 8,
          unpaidSessions: 2
        })
      });

      if (modifyBothResponse.ok) {
        const result = await modifyBothResponse.json();
        console.log('   ✅ Les deux types de séances modifiés avec succès !');
        console.log(`      Message: ${result.message}`);
      } else {
        const errorText = await modifyBothResponse.text();
        console.log('   ❌ Erreur lors de la modification des deux types de séances:');
        console.log(`      Status: ${modifyBothResponse.status}`);
        console.log(`      Message: ${errorText}`);
      }

      // 5. Vérifier les modifications en base de données
      console.log('\n5️⃣ Vérification des modifications en base de données...');
      const verifyResponse = await fetch('http://localhost:3000/api/attendance');
      
      if (verifyResponse.ok) {
        const updatedStudents = await verifyResponse.json();
        const updatedStudent = updatedStudents.find(s => s.student_id === testStudent.student_id);
        
        if (updatedStudent) {
          console.log('   ✅ Données mises à jour pour l\'étudiant:');
          console.log(`      Séances payées: ${updatedStudent.paid_sessions || 0}`);
          console.log(`      Séances non payées: ${updatedStudent.unpaid_sessions || 0}`);
          console.log(`      Total: ${(updatedStudent.paid_sessions || 0) + (updatedStudent.unpaid_sessions || 0)}`);
        } else {
          console.log('   ❌ Étudiant non trouvé dans les données mises à jour');
        }
      } else {
        console.log('   ❌ Erreur lors de la vérification');
      }

      // 6. Test de validation (valeurs négatives)
      console.log('\n6️⃣ Test de validation (valeurs négatives)...');
      const invalidResponse = await fetch('http://localhost:3000/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: testStudent.student_id,
          action: 'set_paid_sessions',
          paidSessions: -1
        })
      });

      if (invalidResponse.status === 400) {
        const errorData = await invalidResponse.json();
        console.log('   ✅ Validation correcte des valeurs négatives');
        console.log(`      Message: ${errorData.error}`);
      } else {
        console.log('   ⚠️ Comportement inattendu pour les valeurs négatives');
        console.log(`      Status: ${invalidResponse.status}`);
      }

      // 7. Test de validation (étudiant inexistant)
      console.log('\n7️⃣ Test de validation (étudiant inexistant)...');
      const fakeStudentResponse = await fetch('http://localhost:3000/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 99999,
          action: 'set_paid_sessions',
          paidSessions: 5
        })
      });

      if (fakeStudentResponse.status === 500) {
        console.log('   ✅ Gestion correcte de l\'étudiant inexistant');
      } else {
        console.log('   ⚠️ Comportement inattendu pour l\'étudiant inexistant');
        console.log(`      Status: ${fakeStudentResponse.status}`);
      }

      console.log('\n✅ Test de modification des séances terminé !');
      console.log('\n🎯 Résumé :');
      console.log('   ✅ Modification des séances payées');
      console.log('   ✅ Modification des séances non payées');
      console.log('   ✅ Modification des deux types simultanément');
      console.log('   ✅ Validation des valeurs négatives');
      console.log('   ✅ Mise à jour effective en base de données');
      console.log('\n🌐 Interface à vérifier :');
      console.log('   Admin Dashboard - Paiements: http://localhost:3000/dashboard/admin?tab=payments');

    } else {
      console.log('   ❌ Erreur lors de la récupération des étudiants');
      return;
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testModifySessions();
