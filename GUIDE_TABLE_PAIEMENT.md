# 💰 Guide - Table "paiement" Centralisée

## 🎯 **Objectif**

Créer une table centralisée "paiement" qui contient toutes les informations de paiement des étudiants avec :
- ID de l'étudiant
- ID du parent
- Nombre de séances total (présences)
- Nombre de séances non payées

## 📋 **Structure de la Table**

### **Colonnes Principales**
```sql
CREATE TABLE paiement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,           -- ID de l'étudiant
    parent_id INT NOT NULL,            -- ID du parent
    seances_total INT DEFAULT 0,       -- Nombre total de séances (présences)
    seances_non_payees INT DEFAULT 0,  -- Nombre de séances non payées
    seances_payees INT DEFAULT 0,      -- Nombre de séances payées
    montant_total DECIMAL(10,2),       -- Montant total des séances
    montant_paye DECIMAL(10,2),        -- Montant payé
    montant_restant DECIMAL(10,2),     -- Montant restant à payer
    prix_seance DECIMAL(10,2) DEFAULT 50.00, -- Prix par séance
    statut ENUM('en_attente', 'partiel', 'paye', 'en_retard'),
    date_derniere_presence DATE,
    date_dernier_paiement DATE,
    date_creation TIMESTAMP,
    date_modification TIMESTAMP
);
```

## 🔧 **Fonctionnalités Automatiques**

### **1. Mise à Jour Automatique lors de Présence**
```sql
-- Quand un étudiant est marqué présent, la table se met à jour automatiquement
CALL UpdatePaiementOnPresence(student_id, parent_id, date_presence);
```

### **2. Enregistrement de Paiement**
```sql
-- Pour enregistrer un paiement
CALL EnregistrerPaiement(student_id, parent_id, seances_payees, montant_paye);
```

### **3. Calculs Automatiques**
- **Montant total** = séances_total × prix_seance
- **Montant payé** = séances_payees × prix_seance
- **Montant restant** = séances_non_payees × prix_seance

## 📊 **Statuts de Paiement**

| Statut | Description | Condition |
|--------|-------------|-----------|
| `en_attente` | Paiement en attente | Séances non payées > 2 |
| `partiel` | Paiement partiel | Séances non payées ≤ 2 |
| `paye` | Paiement complet | Séances non payées = 0 |
| `en_retard` | Paiement en retard | Séances non payées > 5 |

## 🎯 **Utilisation dans l'Application**

### **1. Récupérer les Paiements d'un Parent**
```sql
SELECT * FROM vue_paiements WHERE parent_id = ?;
```

### **2. Récupérer les Paiements d'un Étudiant**
```sql
SELECT * FROM vue_paiements WHERE student_id = ?;
```

### **3. Récupérer les Paiements en Retard**
```sql
SELECT * FROM vue_paiements WHERE statut = 'en_retard';
```

### **4. Statistiques Globales**
```sql
SELECT 
    COUNT(*) as total_etudiants,
    SUM(seances_total) as total_seances,
    SUM(seances_non_payees) as total_non_payees,
    SUM(montant_restant) as total_restant
FROM vue_paiements;
```

## 🚀 **Intégration avec l'API**

### **1. Modifier l'API Paiements**
```typescript
// Dans /api/payments/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  
  const connection = await getConnection();
  
  // Utiliser la nouvelle table paiement
  const [rows] = await connection.execute(`
    SELECT 
      p.student_id,
      p.seances_total,
      p.seances_payees,
      p.seances_non_payees,
      p.montant_total,
      p.montant_paye,
      p.montant_restant,
      p.statut,
      CONCAT(u.first_name, ' ', u.last_name) as fullName
    FROM paiement p
    JOIN students s ON p.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.student_id = ?
  `, [studentId]);
  
  await connection.end();
  return NextResponse.json(rows[0]);
}
```

### **2. Modifier l'API Parent Profile**
```typescript
// Dans /api/parent/profile/route.ts
// Ajouter les informations de paiement pour chaque enfant
const children = (childrenRows as any[]).map(child => {
  // Récupérer les paiements de l'enfant
  const [paiementRows] = await connection.execute(`
    SELECT seances_total, seances_payees, seances_non_payees, statut
    FROM paiement 
    WHERE student_id = ? AND parent_id = ?
  `, [child.id, parentId]);
  
  return {
    ...child,
    paiements: paiementRows[0] || null
  };
});
```

## 📈 **Avantages de la Nouvelle Table**

### **1. Centralisation**
- ✅ Toutes les données de paiement dans une seule table
- ✅ Cohérence des données garantie
- ✅ Facilité de maintenance

### **2. Automatisation**
- ✅ Mise à jour automatique lors des présences
- ✅ Calculs automatiques des montants
- ✅ Gestion automatique des statuts

### **3. Performance**
- ✅ Index optimisés pour les requêtes fréquentes
- ✅ Vue pré-calculée pour les consultations
- ✅ Triggers pour maintenir la cohérence

### **4. Flexibilité**
- ✅ Prix par séance configurable
- ✅ Statuts personnalisables
- ✅ Historique complet des paiements

## 🔄 **Migration des Données Existantes**

### **1. Exécuter le Script SQL**
```bash
mysql -u root -p chrono_carto < create-paiement-table.sql
```

### **2. Vérifier la Migration**
```sql
-- Vérifier que les données ont été migrées
SELECT * FROM vue_paiements;

-- Comparer avec les anciennes données
SELECT 
    s.id,
    s.paid_sessions as ancien_paye,
    s.unpaid_sessions as ancien_non_paye,
    p.seances_payees as nouveau_paye,
    p.seances_non_payees as nouveau_non_paye
FROM students s
LEFT JOIN paiement p ON s.id = p.student_id;
```

## 🎯 **Exemples d'Utilisation**

### **1. Dashboard Parent**
```sql
-- Récupérer tous les paiements d'un parent
SELECT 
    nom_etudiant,
    seances_total,
    seances_payees,
    seances_non_payees,
    montant_restant,
    statut
FROM vue_paiements 
WHERE parent_id = ?;
```

### **2. Dashboard Admin**
```sql
-- Récupérer tous les paiements en retard
SELECT 
    nom_etudiant,
    nom_parent,
    seances_non_payees,
    montant_restant,
    date_derniere_presence
FROM vue_paiements 
WHERE statut = 'en_retard'
ORDER BY montant_restant DESC;
```

### **3. Rapports Financiers**
```sql
-- Statistiques mensuelles
SELECT 
    DATE_FORMAT(date_dernier_paiement, '%Y-%m') as mois,
    COUNT(*) as nombre_paiements,
    SUM(montant_paye) as total_encaisse,
    AVG(montant_paye) as moyenne_paiement
FROM paiement 
WHERE date_dernier_paiement IS NOT NULL
GROUP BY DATE_FORMAT(date_dernier_paiement, '%Y-%m');
```

## ✅ **Résultat Final**

**La table "paiement" centralise maintenant toutes les informations de paiement :**

- ✅ **ID étudiant et parent** : Liaison claire
- ✅ **Séances totales** : Basées sur les présences
- ✅ **Séances non payées** : Calculées automatiquement
- ✅ **Montants** : Calculés selon le prix par séance
- ✅ **Statuts** : Mis à jour automatiquement
- ✅ **Historique** : Dates de présence et paiements

**Le système de paiement est maintenant complet et centralisé !** 💰✨
