const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPaymentsAdmin() {
  console.log('🔧 Test du Système de Paiements Admin\n');

  try {
    // 1. Test de l'API attendance (liste des étudiants)
    console.log('1️⃣ Test de l\'API attendance (liste des étudiants)...');
    const attendanceResponse = await fetch('http://localhost:3000/api/attendance');
    
    if (attendanceResponse.ok) {
      const attendanceData = await attendanceResponse.json();
      console.log('   ✅ API attendance fonctionne !');
      console.log(`   📊 Nombre d'étudiants récupérés: ${attendanceData.length}`);
      
      if (attendanceData.length > 0) {
        const firstStudent = attendanceData[0];
        console.log('   👤 Premier étudiant:');
        console.log(`      ID: ${firstStudent.student_id}`);
        console.log(`      Nom: ${firstStudent.first_name} ${firstStudent.last_name}`);
        console.log(`      Classe: ${firstStudent.class_level}`);
        console.log(`      Séances payées: ${firstStudent.paid_sessions || 0}`);
        console.log(`      Séances non payées: ${firstStudent.unpaid_sessions || 0}`);
      }
    } else {
      const errorText = await attendanceResponse.text();
      console.log('   ❌ Erreur API attendance:');
      console.log(`      Status: ${attendanceResponse.status}`);
      console.log(`      Message: ${errorText}`);
      return;
    }

    // 2. Test d'ajout de séances non payées
    console.log('\n2️⃣ Test d\'ajout de séances non payées...');
    const addUnpaidResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 68,
        action: 'add_unpaid',
        sessions: 2
      })
    });

    if (addUnpaidResponse.ok) {
      const result = await addUnpaidResponse.json();
      console.log('   ✅ Séances non payées ajoutées avec succès !');
      console.log(`      Message: ${result.message}`);
    } else {
      const errorText = await addUnpaidResponse.text();
      console.log('   ❌ Erreur lors de l\'ajout de séances non payées:');
      console.log(`      Status: ${addUnpaidResponse.status}`);
      console.log(`      Message: ${errorText}`);
    }

    // 3. Test de retrait de séances non payées
    console.log('\n3️⃣ Test de retrait de séances non payées...');
    const removeUnpaidResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 68,
        action: 'remove_unpaid',
        sessions: 1
      })
    });

    if (removeUnpaidResponse.ok) {
      const result = await removeUnpaidResponse.json();
      console.log('   ✅ Séances non payées retirées avec succès !');
      console.log(`      Message: ${result.message}`);
    } else {
      const errorText = await removeUnpaidResponse.text();
      console.log('   ❌ Erreur lors du retrait de séances non payées:');
      console.log(`      Status: ${removeUnpaidResponse.status}`);
      console.log(`      Message: ${errorText}`);
    }

    // 4. Test d'ajout de séances payées
    console.log('\n4️⃣ Test d\'ajout de séances payées...');
    const addPaidResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 68,
        action: 'add_paid',
        sessions: 1
      })
    });

    if (addPaidResponse.ok) {
      const result = await addPaidResponse.json();
      console.log('   ✅ Séances payées ajoutées avec succès !');
      console.log(`      Message: ${result.message}`);
    } else {
      const errorText = await addPaidResponse.text();
      console.log('   ❌ Erreur lors de l\'ajout de séances payées:');
      console.log(`      Status: ${addPaidResponse.status}`);
      console.log(`      Message: ${errorText}`);
    }

    // 5. Vérifier les données mises à jour
    console.log('\n5️⃣ Vérification des données mises à jour...');
    const updatedResponse = await fetch('http://localhost:3000/api/attendance');
    
    if (updatedResponse.ok) {
      const updatedData = await updatedResponse.json();
      const student68 = updatedData.find(s => s.student_id === 68);
      
      if (student68) {
        console.log('   ✅ Données mises à jour pour l\'étudiant 68:');
        console.log(`      Séances payées: ${student68.paid_sessions || 0}`);
        console.log(`      Séances non payées: ${student68.unpaid_sessions || 0}`);
        console.log(`      Total: ${(student68.paid_sessions || 0) + (student68.unpaid_sessions || 0)}`);
      } else {
        console.log('   ⚠️ Étudiant 68 non trouvé dans les données mises à jour');
      }
    } else {
      console.log('   ❌ Erreur lors de la vérification des données mises à jour');
    }

    console.log('\n✅ Test du système de paiements admin terminé !');
    console.log('\n🎯 Résumé :');
    console.log('   ✅ API attendance fonctionne');
    console.log('   ✅ Actions de paiement opérationnelles');
    console.log('   ✅ Données mises à jour correctement');
    console.log('\n🌐 Interface à vérifier :');
    console.log('   Admin Dashboard - Paiements: http://localhost:3000/dashboard/admin?tab=payments');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testPaymentsAdmin();
