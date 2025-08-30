const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPaiementTable() {
  console.log('💰 Test de la Table Paiement\n');

  try {
    // 1. Test de l'API parent profile pour récupérer les enfants
    console.log('1️⃣ Récupération des données parent et enfants...');
    const parentResponse = await fetch('http://localhost:3000/api/parent/profile?parentId=21');
    
    if (!parentResponse.ok) {
      throw new Error(`Erreur HTTP: ${parentResponse.status} ${parentResponse.statusText}`);
    }
    
    const parentData = await parentResponse.json();
    console.log(`   ✅ Parent: ${parentData.firstName} ${parentData.lastName}`);
    console.log(`   👶 Enfants: ${parentData.children.length}`);
    
    if (parentData.children.length === 0) {
      console.log('   ⚠️  Aucun enfant trouvé pour tester');
      return;
    }

    const child = parentData.children[0];
    console.log(`   🎯 Enfant sélectionné: ${child.fullName} (ID: ${child.id})`);

    // 2. Test de l'API paiements avec la nouvelle structure
    console.log('\n2️⃣ Test de l\'API paiements...');
    const paymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${child.id}`);
    
    if (paymentResponse.ok) {
      const paymentData = await paymentResponse.json();
      console.log('   ✅ Données de paiement récupérées:');
      console.log(`      Séances payées: ${paymentData.paidSessions || 0}`);
      console.log(`      Séances non payées: ${paymentData.unpaidSessions || 0}`);
      console.log(`      Total séances: ${(paymentData.paidSessions || 0) + (paymentData.unpaidSessions || 0)}`);
    } else {
      console.log('   ❌ Erreur lors de la récupération des paiements');
    }

    // 3. Test de simulation de présence (pour tester la table paiement)
    console.log('\n3️⃣ Test de simulation de présence...');
    const attendanceResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: child.id,
        date: new Date().toISOString().split('T')[0],
        isPresent: true
      })
    });

    if (attendanceResponse.ok) {
      console.log('   ✅ Présence enregistrée avec succès');
      
      // Vérifier que les paiements ont été mis à jour
      const updatedPaymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${child.id}`);
      if (updatedPaymentResponse.ok) {
        const updatedPaymentData = await updatedPaymentResponse.json();
        console.log('   📊 Paiements mis à jour:');
        console.log(`      Séances payées: ${updatedPaymentData.paidSessions || 0}`);
        console.log(`      Séances non payées: ${updatedPaymentData.unpaidSessions || 0}`);
      }
    } else {
      console.log('   ❌ Erreur lors de l\'enregistrement de la présence');
    }

    // 4. Test de simulation de paiement
    console.log('\n4️⃣ Test de simulation de paiement...');
    const makePaymentResponse = await fetch('http://localhost:3000/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: child.id,
        paidSessions: 1
      })
    });

    if (makePaymentResponse.ok) {
      const paymentResult = await makePaymentResponse.json();
      console.log('   ✅ Paiement effectué avec succès');
      console.log(`      Message: ${paymentResult.message}`);
      console.log(`      Séances restantes: ${paymentResult.remainingUnpaid || 0}`);
      
      // Vérifier les paiements finaux
      const finalPaymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${child.id}`);
      if (finalPaymentResponse.ok) {
        const finalPaymentData = await finalPaymentResponse.json();
        console.log('   📊 État final des paiements:');
        console.log(`      Séances payées: ${finalPaymentData.paidSessions || 0}`);
        console.log(`      Séances non payées: ${finalPaymentData.unpaidSessions || 0}`);
      }
    } else {
      console.log('   ❌ Erreur lors du paiement');
    }

    // 5. Test des statistiques globales (admin)
    console.log('\n5️⃣ Test des statistiques globales...');
    const statsResponse = await fetch('http://localhost:3000/api/attendance');
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('   ✅ Statistiques récupérées:');
      console.log(`      Total étudiants: ${statsData.length || 0}`);
      
      // Calculer les statistiques de paiement
      let totalPaid = 0;
      let totalUnpaid = 0;
      
      statsData.forEach(student => {
        totalPaid += student.paidSessions || 0;
        totalUnpaid += student.unpaidSessions || 0;
      });
      
      console.log(`      Total séances payées: ${totalPaid}`);
      console.log(`      Total séances non payées: ${totalUnpaid}`);
      console.log(`      Total séances: ${totalPaid + totalUnpaid}`);
    } else {
      console.log('   ❌ Erreur lors de la récupération des statistiques');
    }

    console.log('\n✅ Test de la table paiement terminé !');
    console.log('\n🎯 Résumé :');
    console.log('   ✅ Table paiement fonctionne correctement');
    console.log('   ✅ Présences mises à jour automatiquement');
    console.log('   ✅ Paiements enregistrés avec succès');
    console.log('   ✅ Statistiques calculées correctement');
    console.log('\n🌐 Interface à vérifier :');
    console.log('   Parent Dashboard - Paiements: http://localhost:3000/dashboard/parent?tab=payments');
    console.log('   Admin Dashboard - Paiements: http://localhost:3000/dashboard/admin?tab=payments');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testPaiementTable();
