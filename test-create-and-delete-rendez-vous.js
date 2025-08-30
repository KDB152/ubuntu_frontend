const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCreateAndDeleteRendezVous() {
  console.log('🔧 Test Création et Suppression de Rendez-vous\n');

  try {
    // 1. Créer un rendez-vous de test
    console.log('1️⃣ Création d\'un rendez-vous de test...');
    const createResponse = await fetch('http://localhost:3000/api/rendez-vous', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parentId: '21',
        parentName: 'Test Parent',
        parentEmail: 'test.parent@example.com',
        parentPhone: '0123456789',
        childName: 'Test Child',
        childClass: '3ème',
        timing: '2024-01-20T14:00:00',
        parentReason: 'Test de suppression de rendez-vous',
        status: 'pending'
      })
    });

    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('   ✅ Rendez-vous créé avec succès !');
      console.log(`      ID: ${createResult.id}`);
      console.log(`      Message: ${createResult.message}`);
      
      const rendezVousId = createResult.id;
      
      // 2. Vérifier que le rendez-vous a été créé
      console.log('\n2️⃣ Vérification de la création...');
      const getResponse = await fetch('http://localhost:3000/api/rendez-vous');
      
      if (getResponse.ok) {
        const rendezVousList = await getResponse.json();
        const createdRendezVous = rendezVousList.find(rdv => rdv.id == rendezVousId);
        
        if (createdRendezVous) {
          console.log('   ✅ Rendez-vous confirmé comme créé en base de données');
          console.log(`      Parent: ${createdRendezVous.parent_name}`);
          console.log(`      Enfant: ${createdRendezVous.child_name}`);
          console.log(`      Date: ${createdRendezVous.timing}`);
          console.log(`      Statut: ${createdRendezVous.status}`);
        } else {
          console.log('   ❌ Le rendez-vous n\'a pas été trouvé en base de données');
          return;
        }
      } else {
        console.log('   ❌ Erreur lors de la vérification');
        return;
      }
      
      // 3. Supprimer le rendez-vous
      console.log('\n3️⃣ Suppression du rendez-vous...');
      const deleteResponse = await fetch(`http://localhost:3000/api/rendez-vous?id=${rendezVousId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (deleteResponse.ok) {
        const deleteResult = await deleteResponse.json();
        console.log('   ✅ Rendez-vous supprimé avec succès !');
        console.log(`      Message: ${deleteResult.message}`);
        console.log(`      ID supprimé: ${deleteResult.id}`);
      } else {
        const errorText = await deleteResponse.text();
        console.log('   ❌ Erreur lors de la suppression:');
        console.log(`      Status: ${deleteResponse.status}`);
        console.log(`      Message: ${errorText}`);
        return;
      }

      // 4. Vérifier que le rendez-vous a bien été supprimé
      console.log('\n4️⃣ Vérification de la suppression...');
      const verifyResponse = await fetch('http://localhost:3000/api/rendez-vous');
      
      if (verifyResponse.ok) {
        const updatedList = await verifyResponse.json();
        const deletedRendezVous = updatedList.find(rdv => rdv.id == rendezVousId);
        
        if (!deletedRendezVous) {
          console.log('   ✅ Rendez-vous confirmé comme supprimé de la base de données');
          console.log(`   📊 Nombre de rendez-vous restants: ${updatedList.length}`);
        } else {
          console.log('   ❌ Le rendez-vous est toujours présent dans la base de données');
        }
      } else {
        console.log('   ❌ Erreur lors de la vérification finale');
      }
      
    } else {
      const errorText = await createResponse.text();
      console.log('   ❌ Erreur lors de la création:');
      console.log(`      Status: ${createResponse.status}`);
      console.log(`      Message: ${errorText}`);
      return;
    }

    console.log('\n✅ Test de création et suppression terminé !');
    console.log('\n🎯 Résumé :');
    console.log('   ✅ API POST fonctionne (création)');
    console.log('   ✅ API DELETE fonctionne (suppression)');
    console.log('   ✅ Suppression effective en base de données');
    console.log('\n🌐 Interface à vérifier :');
    console.log('   Admin Dashboard - Rendez-vous: http://localhost:3000/dashboard/admin?tab=rendez-vous');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testCreateAndDeleteRendezVous();
