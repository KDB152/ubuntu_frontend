# 🔧 Configuration de la Table Attendance

## 🚨 Problème Identifié

L'erreur indique que la table `attendance` n'existe pas dans la base de données :
```
Table 'chrono_carto.attendance' doesn't exist
```

## ✅ Solution

### **1. Exécuter le Script SQL**

Connectez-vous à votre base de données MySQL et exécutez le script suivant :

```sql
-- Créer la table de présence
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  session_date DATE NOT NULL,
  is_present BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_date (student_id, session_date)
);

-- Ajouter les colonnes pour les séances payées/non payées dans la table students
ALTER TABLE students 
ADD COLUMN paid_sessions INT DEFAULT 0,
ADD COLUMN unpaid_sessions INT DEFAULT 0;

-- Créer un index pour optimiser les requêtes de présence
CREATE INDEX idx_attendance_student_date ON attendance(student_id, session_date);
CREATE INDEX idx_attendance_date ON attendance(session_date);

-- Insérer quelques données de test pour aujourd'hui
INSERT INTO attendance (student_id, session_date, is_present) VALUES
(68, CURDATE(), FALSE),
(69, CURDATE(), FALSE),
(70, CURDATE(), FALSE)
ON DUPLICATE KEY UPDATE is_present = VALUES(is_present);
```

### **2. Méthodes d'Exécution**

#### **Option A : phpMyAdmin**
1. Ouvrez phpMyAdmin
2. Sélectionnez la base de données `chrono_carto`
3. Allez dans l'onglet "SQL"
4. Copiez-collez le script ci-dessus
5. Cliquez sur "Exécuter"

#### **Option B : Ligne de Commande MySQL**
```bash
# Si vous avez MySQL dans le PATH
mysql -u root -p chrono_carto < create-attendance-table.sql

# Ou connectez-vous et exécutez manuellement
mysql -u root -p
USE chrono_carto;
# Puis copiez-collez le script SQL
```

#### **Option C : Workbench ou autre client MySQL**
1. Connectez-vous à votre base de données
2. Sélectionnez la base `chrono_carto`
3. Exécutez le script SQL

### **3. Vérification**

Après l'exécution, vérifiez que la table a été créée :

```sql
-- Vérifier que la table existe
SHOW TABLES LIKE 'attendance';

-- Vérifier la structure
DESCRIBE attendance;

-- Vérifier les colonnes ajoutées à students
DESCRIBE students;
```

### **4. Test du Système**

Une fois la table créée, testez le système :

```bash
# Tester l'API
node test-attendance-final.js

# Ou accéder à l'interface
# http://localhost:3000/dashboard/admin?tab=attendance
```

## 🎯 Résultat Attendu

Après l'exécution du script :
- ✅ **Table `attendance`** créée avec la structure correcte
- ✅ **Colonnes `paid_sessions` et `unpaid_sessions`** ajoutées à la table `students`
- ✅ **Index** créés pour optimiser les performances
- ✅ **Données de test** insérées pour aujourd'hui

## 🚀 Prochaines Étapes

1. **Exécutez le script SQL** selon votre méthode préférée
2. **Redémarrez le serveur** si nécessaire : `npm run dev`
3. **Testez l'interface** : `http://localhost:3000/dashboard/admin?tab=attendance`
4. **Vérifiez que tout fonctionne** correctement

**Une fois la table créée, le système de présence fonctionnera parfaitement !** 🎉
