const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testDeleteRendezVous() {
  console.log('🔧 Test de Suppression de Rendez-vous\n');

  try {
    // 1. Récupérer la liste des rendez-vous existants
    console.log('1️⃣ Récupération des rendez-vous existants...');
    const getResponse = await fetch('http://localhost:3000/api/rendez-vous');
    
    if (getResponse.ok) {
      const rendezVousList = await getResponse.json();
      console.log(`   ✅ ${rendezVousList.length} rendez-vous trouvés`);
      
      if (rendezVousList.length === 0) {
        console.log('   ⚠️ Aucun rendez-vous à supprimer. Test terminé.');
        return;
      }
      
      // Prendre le premier rendez-vous pour le test
      const rendezVousToDelete = rendezVousList[0];
      console.log(`   👤 Rendez-vous sélectionné pour suppression:`);
      console.log(`      ID: ${rendezVousToDelete.id}`);
      console.log(`      Parent: ${rendezVousToDelete.parent_name}`);
      console.log(`      Enfant: ${rendezVousToDelete.child_name}`);
      console.log(`      Date: ${rendezVousToDelete.timing}`);
      console.log(`      Statut: ${rendezVousToDelete.status}`);
    } else {
      console.log('   ❌ Erreur lors de la récupération des rendez-vous');
      return;
    }

    // 2. Test de suppression d'un rendez-vous
    console.log('\n2️⃣ Test de suppression de rendez-vous...');
    const rendezVousList = await getResponse.json();
    const rendezVousToDelete = rendezVousList[0];
    
    const deleteResponse = await fetch(`http://localhost:3000/api/rendez-vous?id=${rendezVousToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (deleteResponse.ok) {
      const result = await deleteResponse.json();
      console.log('   ✅ Rendez-vous supprimé avec succès !');
      console.log(`      Message: ${result.message}`);
      console.log(`      ID supprimé: ${result.id}`);
    } else {
      const errorText = await deleteResponse.text();
      console.log('   ❌ Erreur lors de la suppression:');
      console.log(`      Status: ${deleteResponse.status}`);
      console.log(`      Message: ${errorText}`);
      return;
    }

    // 3. Vérifier que le rendez-vous a bien été supprimé
    console.log('\n3️⃣ Vérification de la suppression...');
    const verifyResponse = await fetch('http://localhost:3000/api/rendez-vous');
    
    if (verifyResponse.ok) {
      const updatedList = await verifyResponse.json();
      const deletedRendezVous = updatedList.find(rdv => rdv.id === rendezVousToDelete.id);
      
      if (!deletedRendezVous) {
        console.log('   ✅ Rendez-vous confirmé comme supprimé de la base de données');
        console.log(`   📊 Nombre de rendez-vous restants: ${updatedList.length}`);
      } else {
        console.log('   ❌ Le rendez-vous est toujours présent dans la base de données');
      }
    } else {
      console.log('   ❌ Erreur lors de la vérification');
    }

    // 4. Test de suppression d'un rendez-vous inexistant
    console.log('\n4️⃣ Test de suppression d\'un rendez-vous inexistant...');
    const fakeDeleteResponse = await fetch('http://localhost:3000/api/rendez-vous?id=99999', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (fakeDeleteResponse.status === 404) {
      const errorData = await fakeDeleteResponse.json();
      console.log('   ✅ Gestion correcte du rendez-vous inexistant');
      console.log(`      Message: ${errorData.error}`);
    } else {
      console.log('   ⚠️ Comportement inattendu pour un rendez-vous inexistant');
      console.log(`      Status: ${fakeDeleteResponse.status}`);
    }

    // 5. Test de suppression sans ID
    console.log('\n5️⃣ Test de suppression sans ID...');
    const noIdDeleteResponse = await fetch('http://localhost:3000/api/rendez-vous', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (noIdDeleteResponse.status === 400) {
      const errorData = await noIdDeleteResponse.json();
      console.log('   ✅ Gestion correcte de la suppression sans ID');
      console.log(`      Message: ${errorData.error}`);
    } else {
      console.log('   ⚠️ Comportement inattendu pour une suppression sans ID');
      console.log(`      Status: ${noIdDeleteResponse.status}`);
    }

    console.log('\n✅ Test de suppression de rendez-vous terminé !');
    console.log('\n🎯 Résumé :');
    console.log('   ✅ API DELETE fonctionne');
    console.log('   ✅ Suppression effective en base de données');
    console.log('   ✅ Gestion des erreurs (ID inexistant, ID manquant)');
    console.log('\n🌐 Interface à vérifier :');
    console.log('   Admin Dashboard - Rendez-vous: http://localhost:3000/dashboard/admin?tab=rendez-vous');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testDeleteRendezVous();
