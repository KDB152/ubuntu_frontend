const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkAttendanceTable() {
  console.log('🔍 Vérification de la Table Attendance\n');

  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('1️⃣ Test de l\'API /api/attendance...');
    const response = await fetch(`http://localhost:3000/api/attendance?date=${today}`);
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Table attendance existe et fonctionne !');
      console.log(`   Date: ${data.date}`);
      console.log(`   Total étudiants: ${data.summary.totalStudents}`);
      console.log(`   Présents: ${data.summary.presentCount}`);
      console.log(`   Absents: ${data.summary.absentCount}`);
      
      if (data.attendanceList && data.attendanceList.length > 0) {
        console.log('\n📋 Étudiants trouvés:');
        data.attendanceList.forEach((student, index) => {
          console.log(`   ${index + 1}. ${student.fullName} - ${student.classLevel}`);
        });
      }
      
      console.log('\n🎉 Système de présence prêt à utiliser !');
      console.log('🌐 Interface: http://localhost:3000/dashboard/admin?tab=attendance');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur détectée:');
      console.log('   Status:', response.status);
      console.log('   Message:', errorText);
      
      if (errorText.includes("Table 'chrono_carto.attendance' doesn't exist")) {
        console.log('\n🔧 SOLUTION:');
        console.log('   La table attendance n\'existe pas.');
        console.log('   Veuillez exécuter le script SQL dans setup-attendance.md');
        console.log('   ou utiliser phpMyAdmin pour créer la table.');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n🔧 Vérifiez que :');
    console.log('   1. Le serveur Next.js est démarré (npm run dev)');
    console.log('   2. La base de données MySQL est accessible');
    console.log('   3. La table attendance existe (voir setup-attendance.md)');
  }
}

// Exécuter la vérification
checkAttendanceTable();
