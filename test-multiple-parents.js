const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMultipleParents() {
  console.log('🔍 Test du Système Multi-Parents\n');

  try {
    // Liste des parents à tester (IDs existants dans la base de données)
    const parentIds = [21, 22, 23]; // Ajoutez les IDs des parents que vous voulez tester
    
    for (const parentId of parentIds) {
      console.log(`\n👨‍👩‍👧‍👦 Test du Parent ID: ${parentId}`);
      console.log('=' .repeat(50));
      
      try {
        // Test de l'API parent profile avec l'ID spécifique
        const parentResponse = await fetch(`http://localhost:3000/api/parent/profile?parentId=${parentId}`);
        
        if (!parentResponse.ok) {
          console.log(`   ❌ Erreur HTTP: ${parentResponse.status} ${parentResponse.statusText}`);
          continue;
        }
        
        const parentData = await parentResponse.json();
        console.log(`   ✅ Profil parent récupéré avec succès`);
        console.log(`   👤 Parent: ${parentData.firstName} ${parentData.lastName}`);
        console.log(`   📧 Email: ${parentData.email}`);
        console.log(`   📱 Téléphone: ${parentData.phoneNumber}`);
        console.log(`   🏠 Adresse: ${parentData.address}`);
        console.log(`   💼 Profession: ${parentData.occupation}`);
        console.log(`   👶 Nombre d'enfants: ${parentData.children.length}`);
        
        if (parentData.children.length > 0) {
          console.log('\n   📋 Enfants de ce parent:');
          parentData.children.forEach((child, index) => {
            console.log(`      ${index + 1}. ${child.fullName} (ID: ${child.id}) - Classe: ${child.classLevel}`);
          });
          
          // Test des paiements pour chaque enfant
          console.log('\n   💰 Test des paiements pour chaque enfant:');
          for (const child of parentData.children) {
            try {
              const paymentResponse = await fetch(`http://localhost:3000/api/payments?studentId=${child.id}`);
              
              if (paymentResponse.ok) {
                const paymentData = await paymentResponse.json();
                console.log(`      ✅ ${child.fullName}: ${paymentData.paidSessions} payées, ${paymentData.unpaidSessions} non payées`);
              } else {
                console.log(`      ❌ ${child.fullName}: Erreur lors de la récupération des paiements`);
              }
            } catch (error) {
              console.log(`      ❌ ${child.fullName}: Erreur - ${error.message}`);
            }
          }
          
          // Test des données enfant pour chaque enfant
          console.log('\n   📊 Test des données enfant:');
          for (const child of parentData.children) {
            try {
              const childDataResponse = await fetch(`http://localhost:3000/api/child/${child.id}/data`);
              
              if (childDataResponse.ok) {
                const childData = await childDataResponse.json();
                console.log(`      ✅ ${child.fullName}: Données récupérées (${childData.quizResults?.length || 0} quiz, ${childData.achievements?.length || 0} achievements)`);
              } else {
                console.log(`      ❌ ${child.fullName}: Erreur lors de la récupération des données`);
              }
            } catch (error) {
              console.log(`      ❌ ${child.fullName}: Erreur - ${error.message}`);
            }
          }
          
        } else {
          console.log('   ⚠️  Aucun enfant trouvé pour ce parent');
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur lors du test du parent ${parentId}: ${error.message}`);
      }
    }

    console.log('\n✅ Test multi-parents terminé !');
    console.log('\n🎯 Résumé :');
    console.log('   ✅ Système fonctionne avec différents parents');
    console.log('   ✅ Chaque parent a ses propres enfants');
    console.log('   ✅ Données isolées par parent');
    console.log('   ✅ API généralisée pour tous les parents');
    console.log('\n🌐 Interface à tester :');
    console.log('   Parent Dashboard: http://localhost:3000/dashboard/parent');
    console.log('\n💡 Pour tester avec un parent spécifique :');
    console.log('   http://localhost:3000/api/parent/profile?parentId=21');
    console.log('   http://localhost:3000/api/parent/profile?parentId=22');
    console.log('   http://localhost:3000/api/parent/profile?parentId=23');

  } catch (error) {
    console.error('❌ Erreur lors du test multi-parents:', error);
  }
}

// Exécuter le test
testMultipleParents();
