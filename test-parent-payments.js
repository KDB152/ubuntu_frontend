const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testParentPayments() {
  console.log('🔍 Diagnostic des Paiements Parent Dashboard\n');

  try {
    // 1. Test de l'API parent profile pour voir les enfants disponibles
    console.log('1️⃣ Test de l\'API parent profile...');
    const parentResponse = await fetch('http://localhost:3000/api/parent/profile');
    
    if (!parentResponse.ok) {
      const errorText = await parentResponse.text();
      console.log('Erreur détaillée:', errorText);
      throw new Error(`Erreur HTTP: ${parentResponse.status} ${parentResponse.statusText}`);
    }
    
    const parentData = await parentResponse.json();
    console.log('✅ Profil parent récupéré avec succès');
    console.log(`   Parent: ${parentData.firstName} ${parentData.lastName}`);
    console.log(`   Email: ${parentData.email}`);
    console.log(`   Nombre d'enfants: ${parentData.children.length}`);
    
    if (parentData.children.length > 0) {
      console.log('\n📋 Enfants disponibles:');
      parentData.children.forEach((child, index) => {
        console.log(`   ${index + 1}. ${child.fullName} (ID: ${child.id}) - Classe: ${child.classLevel}`);
      });
      
      // 2. Test des paiements pour chaque enfant
      console.log('\n2️⃣ Test des paiements pour chaque enfant...');
      for (const child of parentData.children) {
        console.log(`\n   Test pour ${child.fullName} (ID: ${child.id})...`);
        
        const paymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${child.id}`);
        
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          console.log(`   ✅ Paiements trouvés:`);
          console.log(`      Séances payées: ${paymentData.paidSessions}`);
          console.log(`      Séances non payées: ${paymentData.unpaidSessions}`);
          console.log(`      Total séances: ${paymentData.totalSessions}`);
          console.log(`      Solde: ${paymentData.balance}`);
        } else {
          const errorData = await paymentResponse.json();
          console.log(`   ❌ Erreur: ${errorData.error}`);
        }
      }
      
      // 3. Test de l'API attendance pour voir si les enfants sont dans la liste de présence
      console.log('\n3️⃣ Test de l\'API attendance...');
      const attendanceResponse = await fetch('http://localhost:3000/api/attendance?date=' + new Date().toISOString().split('T')[0]);
      
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        console.log(`   ✅ Liste de présence récupérée`);
        console.log(`   Total étudiants: ${attendanceData.summary.totalStudents}`);
        
        // Vérifier si les enfants du parent sont dans la liste
        const parentChildrenIds = parentData.children.map(child => child.id);
        const attendanceChildrenIds = attendanceData.attendanceList.map(student => student.studentId);
        
        console.log('\n   🔍 Vérification de correspondance:');
        console.log(`   IDs des enfants du parent: [${parentChildrenIds.join(', ')}]`);
        console.log(`   IDs des étudiants en présence: [${attendanceChildrenIds.join(', ')}]`);
        
        const matchingChildren = parentChildrenIds.filter(id => attendanceChildrenIds.includes(parseInt(id)));
        console.log(`   Enfants trouvés dans la liste de présence: [${matchingChildren.join(', ')}]`);
        
        if (matchingChildren.length === 0) {
          console.log('   ⚠️  Aucun enfant du parent trouvé dans la liste de présence !');
          console.log('   💡 Cela explique pourquoi les paiements ne s\'affichent pas.');
        }
      } else {
        console.log('   ❌ Erreur lors de la récupération de la liste de présence');
      }
      
    } else {
      console.log('   ⚠️  Aucun enfant trouvé pour ce parent');
    }

    console.log('\n✅ Diagnostic terminé !');
    console.log('\n🎯 Problèmes potentiels identifiés :');
    console.log('   1. Les enfants du parent ne sont pas dans la liste de présence');
    console.log('   2. Incompatibilité entre les IDs (string vs number)');
    console.log('   3. Données de paiement manquantes dans la base de données');
    console.log('\n🌐 Interface à vérifier :');
    console.log('   Parent Dashboard: http://localhost:3000/dashboard/parent?tab=payments');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

// Exécuter le diagnostic
testParentPayments();
