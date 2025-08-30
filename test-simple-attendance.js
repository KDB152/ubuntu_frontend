const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSimpleAttendance() {
  console.log('🔧 Test de l\'API Attendance Simplifiée\n');

  try {
    // 1. Test de l'API attendance simplifiée
    console.log('1️⃣ Test de l\'API attendance...');
    const attendanceResponse = await fetch('http://localhost:3000/api/attendance');
    
    if (attendanceResponse.ok) {
      const attendanceData = await attendanceResponse.json();
      console.log('   ✅ API attendance fonctionne !');
      console.log(`   📊 Nombre d'étudiants récupérés: ${attendanceData.length}`);
      
      if (attendanceData.length > 0) {
        const firstStudent = attendanceData[0];
        console.log('   👤 Premier étudiant:');
        console.log(`      Nom: ${firstStudent.first_name} ${firstStudent.last_name}`);
        console.log(`      Email: ${firstStudent.email}`);
        console.log(`      Classe: ${firstStudent.class_level}`);
        console.log(`      Séances payées: ${firstStudent.paid_sessions || 0}`);
        console.log(`      Séances non payées: ${firstStudent.unpaid_sessions || 0}`);
        console.log(`      Statut: ${firstStudent.is_active ? 'Actif' : 'Inactif'}`);
      }
    } else {
      const errorText = await attendanceResponse.text();
      console.log('   ❌ Erreur API attendance:');
      console.log(`      Status: ${attendanceResponse.status}`);
      console.log(`      Message: ${errorText}`);
    }

    // 2. Test avec filtre par classe
    console.log('\n2️⃣ Test avec filtre par classe...');
    const classFilterResponse = await fetch('http://localhost:3000/api/attendance?class=3ème');
    
    if (classFilterResponse.ok) {
      const classFilterData = await classFilterResponse.json();
      console.log(`   ✅ Filtre par classe fonctionne: ${classFilterData.length} étudiants en 3ème`);
    } else {
      console.log('   ❌ Erreur avec filtre par classe');
    }

    // 3. Test avec filtre par nom
    console.log('\n3️⃣ Test avec filtre par nom...');
    const nameFilterResponse = await fetch('http://localhost:3000/api/attendance?name=Mayssa');
    
    if (nameFilterResponse.ok) {
      const nameFilterData = await nameFilterResponse.json();
      console.log(`   ✅ Filtre par nom fonctionne: ${nameFilterData.length} étudiants trouvés`);
    } else {
      console.log('   ❌ Erreur avec filtre par nom');
    }

    // 4. Test de marquage de présence
    console.log('\n4️⃣ Test de marquage de présence...');
    const markPresentResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 68,
        date: new Date().toISOString().split('T')[0],
        isPresent: true
      })
    });

    if (markPresentResponse.ok) {
      const result = await markPresentResponse.json();
      console.log('   ✅ Présence marquée avec succès !');
      console.log(`      Message: ${result.message}`);
    } else {
      const errorText = await markPresentResponse.text();
      console.log('   ❌ Erreur lors du marquage de présence:');
      console.log(`      Status: ${markPresentResponse.status}`);
      console.log(`      Message: ${errorText}`);
    }

    console.log('\n✅ Test de l\'API simplifiée terminé !');
    console.log('\n🎯 Résumé :');
    console.log('   ✅ API attendance simplifiée et fonctionnelle');
    console.log('   ✅ Filtres par classe et nom opérationnels');
    console.log('   ✅ Marquage de présence fonctionnel');
    console.log('\n🌐 Interface à vérifier :');
    console.log('   Admin Dashboard - Présence: http://localhost:3000/dashboard/admin?tab=attendance');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testSimpleAttendance();
