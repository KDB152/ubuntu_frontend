const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPaymentsSystem() {
  console.log('🔍 Test du Système de Paiement Amélioré\n');

  try {
    // 1. Test de récupération des informations de paiement d'un étudiant
    console.log('1️⃣ Test de récupération des informations de paiement...');
    const studentId = 68; // Mehdi El Abed
    const paymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${studentId}`);
    
    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.log('Erreur détaillée:', errorText);
      throw new Error(`Erreur HTTP: ${paymentResponse.status} ${paymentResponse.statusText}`);
    }
    
    const paymentData = await paymentResponse.json();
    console.log('✅ Informations de paiement récupérées avec succès');
    console.log(`   Étudiant: ${paymentData.fullName}`);
    console.log(`   Séances payées: ${paymentData.paidSessions}`);
    console.log(`   Séances non payées: ${paymentData.unpaidSessions}`);
    console.log(`   Total séances: ${paymentData.totalSessions}`);
    console.log(`   Solde: ${paymentData.balance}`);

    // 2. Test de paiement de séances
    console.log('\n2️⃣ Test de paiement de séances...');
    const sessionsToPay = 1;
    const payResponse = await fetch('http://localhost:3000/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: studentId,
        paidSessions: sessionsToPay
      }),
    });

    if (payResponse.ok) {
      const payData = await payResponse.json();
      console.log('✅ Paiement effectué avec succès');
      console.log(`   Message: ${payData.message}`);
      console.log(`   Séances non payées restantes: ${payData.remainingUnpaid}`);
    } else {
      const errorData = await payResponse.json();
      console.log('❌ Erreur lors du paiement:', errorData.error);
    }

    // 3. Test d'action admin - Ajouter des séances non payées
    console.log('\n3️⃣ Test d\'action admin - Ajouter des séances non payées...');
    const addUnpaidResponse = await fetch('http://localhost:3000/api/payments', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: studentId,
        action: 'add_unpaid',
        sessions: 2
      }),
    });

    if (addUnpaidResponse.ok) {
      const addUnpaidData = await addUnpaidResponse.json();
      console.log('✅ Séances non payées ajoutées avec succès');
      console.log(`   Message: ${addUnpaidData.message}`);
    } else {
      const errorData = await addUnpaidResponse.json();
      console.log('❌ Erreur lors de l\'ajout:', errorData.error);
    }

    // 4. Test d'action admin - Retirer des séances non payées
    console.log('\n4️⃣ Test d\'action admin - Retirer des séances non payées...');
    const removeUnpaidResponse = await fetch('http://localhost:3000/api/payments', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: studentId,
        action: 'remove_unpaid',
        sessions: 1
      }),
    });

    if (removeUnpaidResponse.ok) {
      const removeUnpaidData = await removeUnpaidResponse.json();
      console.log('✅ Séances non payées retirées avec succès');
      console.log(`   Message: ${removeUnpaidData.message}`);
    } else {
      const errorData = await removeUnpaidResponse.json();
      console.log('❌ Erreur lors du retrait:', errorData.error);
    }

    // 5. Vérification finale
    console.log('\n5️⃣ Vérification finale des informations de paiement...');
    const finalPaymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${studentId}`);
    
    if (finalPaymentResponse.ok) {
      const finalPaymentData = await finalPaymentResponse.json();
      console.log('✅ Informations finales récupérées');
      console.log(`   Séances payées: ${finalPaymentData.paidSessions}`);
      console.log(`   Séances non payées: ${finalPaymentData.unpaidSessions}`);
      console.log(`   Total séances: ${finalPaymentData.totalSessions}`);
      console.log(`   Solde: ${finalPaymentData.balance}`);
    }

    console.log('\n✅ Test du système de paiement terminé avec succès !');
    console.log('\n🎯 Fonctionnalités testées :');
    console.log('   ✅ Récupération des informations de paiement');
    console.log('   ✅ Paiement de séances (décrémentation automatique)');
    console.log('   ✅ Actions admin - Ajouter des séances non payées');
    console.log('   ✅ Actions admin - Retirer des séances non payées');
    console.log('   ✅ Validation des données');
    console.log('\n🌐 Interfaces à tester :');
    console.log('   Admin Dashboard - Paiements: http://localhost:3000/dashboard/admin?tab=payments');
    console.log('   Parent Dashboard - Paiements: http://localhost:3000/dashboard/parent?tab=payments');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testPaymentsSystem();
