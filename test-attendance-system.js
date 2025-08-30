const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAttendanceSystem() {
  console.log('🔍 Test du Système de Présence et Paiements\n');

  try {
    // 1. Tester l'API de présence
    console.log('1️⃣ Test de l\'API /api/attendance...');
    const today = new Date().toISOString().split('T')[0];
    const attendanceResponse = await fetch(`http://localhost:3000/api/attendance?date=${today}`);
    
    if (!attendanceResponse.ok) {
      throw new Error(`Erreur HTTP: ${attendanceResponse.status} ${attendanceResponse.statusText}`);
    }
    
    const attendanceData = await attendanceResponse.json();
    console.log('✅ Liste de présence récupérée avec succès');
    console.log(`   Date: ${attendanceData.date}`);
    console.log(`   Total étudiants: ${attendanceData.summary.totalStudents}`);
    console.log(`   Présents: ${attendanceData.summary.presentCount}`);
    console.log(`   Absents: ${attendanceData.summary.absentCount}`);
    
    // 2. Tester l'API de paiements pour l'étudiant 68
    console.log('\n2️⃣ Test de l\'API /api/payments...');
    const paymentsResponse = await fetch('http://localhost:3000/api/payments?studentId=68');
    
    if (!paymentsResponse.ok) {
      throw new Error(`Erreur HTTP: ${paymentsResponse.status} ${paymentsResponse.statusText}`);
    }
    
    const paymentsData = await paymentsResponse.json();
    console.log('✅ Informations de paiement récupérées avec succès');
    console.log(`   Étudiant: ${paymentsData.fullName}`);
    console.log(`   Séances payées: ${paymentsData.paidSessions}`);
    console.log(`   Séances non payées: ${paymentsData.unpaidSessions}`);
    console.log(`   Solde: ${paymentsData.balance}`);
    
    // 3. Tester le marquage de présence
    console.log('\n3️⃣ Test du marquage de présence...');
    const markAttendanceResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 68,
        date: today,
        isPresent: true
      }),
    });
    
    if (!markAttendanceResponse.ok) {
      throw new Error(`Erreur HTTP: ${markAttendanceResponse.status} ${markAttendanceResponse.statusText}`);
    }
    
    const markAttendanceData = await markAttendanceResponse.json();
    console.log('✅ Présence marquée avec succès');
    console.log(`   Message: ${markAttendanceData.message}`);
    
    // 4. Vérifier que les séances non payées ont été incrémentées
    console.log('\n4️⃣ Vérification de l\'incrémentation des séances...');
    const updatedPaymentsResponse = await fetch('http://localhost:3000/api/payments?studentId=68');
    const updatedPaymentsData = await updatedPaymentsResponse.json();
    console.log('✅ Séances mises à jour');
    console.log(`   Nouvelles séances non payées: ${updatedPaymentsData.unpaidSessions}`);
    
    // 5. Tester le marquage de paiement
    console.log('\n5️⃣ Test du marquage de paiement...');
    const markPaymentResponse = await fetch('http://localhost:3000/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 68,
        paidSessions: 2
      }),
    });
    
    if (!markPaymentResponse.ok) {
      throw new Error(`Erreur HTTP: ${markPaymentResponse.status} ${markPaymentResponse.statusText}`);
    }
    
    const markPaymentData = await markPaymentResponse.json();
    console.log('✅ Paiement enregistré avec succès');
    console.log(`   Message: ${markPaymentData.message}`);
    
    // 6. Vérifier les données finales
    console.log('\n6️⃣ Vérification des données finales...');
    const finalPaymentsResponse = await fetch('http://localhost:3000/api/payments?studentId=68');
    const finalPaymentsData = await finalPaymentsResponse.json();
    console.log('✅ Données finales récupérées');
    console.log(`   Séances payées: ${finalPaymentsData.paidSessions}`);
    console.log(`   Séances non payées: ${finalPaymentsData.unpaidSessions}`);
    console.log(`   Solde final: ${finalPaymentsData.balance}`);
    
    console.log('\n✅ Test du système terminé avec succès !');
    console.log('\n🎯 Maintenant vous pouvez tester les interfaces :');
    console.log('   Admin Dashboard - Présence: http://localhost:3000/dashboard/admin?tab=attendance');
    console.log('   Parent Dashboard - Paiements: http://localhost:3000/dashboard/parent?tab=payments');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testAttendanceSystem();
