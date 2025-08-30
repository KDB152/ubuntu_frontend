# Configuration de la Base de Données MySQL

## Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les informations suivantes :

```env
# Configuration MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=chrono_carto
DB_PORT=3306
```

## Étapes de Configuration

### 1. Créer le fichier .env.local
Dans le dossier `chrono-carto-frontend`, créez un fichier `.env.local` avec vos informations de base de données.

### 2. Vérifier les Tables
Assurez-vous que vous avez bien créé les tables suivantes dans votre base de données MySQL :

```sql
-- Table des Rendez-vous
CREATE TABLE IF NOT EXISTS rendez_vous (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    child_class VARCHAR(100) NOT NULL,
    timing DATETIME NOT NULL,
    parent_reason TEXT NOT NULL,
    admin_reason TEXT,
    status ENUM('pending','approved','refused','cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des logs de suppression
CREATE TABLE IF NOT EXISTS rendez_vous_deletion_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rendez_vous_id INT NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    parent_reason TEXT NOT NULL,
    admin_reason TEXT,
    deleted_by VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Insérer des Données de Test
Vous pouvez insérer des données de test avec cette requête :

```sql
INSERT INTO rendez_vous (
    parent_id,
    parent_name,
    parent_email,
    parent_phone,
    child_name,
    child_class,
    timing,
    parent_reason,
    status
) VALUES 
(
    'parent1',
    'Marie Dupont',
    'marie.dupont@email.com',
    '06 12 34 56 78',
    'Lucas Dupont',
    '4ème A',
    '2024-12-25 14:00:00',
    'Mon fils a des difficultés à se concentrer en classe et semble avoir des problèmes avec certains camarades. J''aimerais discuter de la situation avec vous.',
    'pending'
),
(
    'parent2',
    'Jean Martin',
    'jean.martin@email.com',
    '06 98 76 54 32',
    'Emma Martin',
    '6ème B',
    '2024-12-26 16:00:00',
    'Je souhaite faire le point sur les progrès de ma fille et discuter de ses résultats récents.',
    'pending'
);
```

### 4. Redémarrer le Serveur
Après avoir créé le fichier `.env.local`, redémarrez votre serveur de développement :

```bash
npm run dev
```

## Test de Connexion

Pour tester si la connexion fonctionne, vous pouvez :

1. Aller sur `http://localhost:3000/api/rendez-vous`
2. Vérifier les logs dans la console du serveur
3. Vérifier que les données de votre base de données s'affichent

## Dépannage

### Erreur de Connexion
Si vous avez une erreur de connexion, vérifiez :
- Les informations de connexion dans `.env.local`
- Que MySQL est en cours d'exécution
- Que la base de données `chrono_carto` existe
- Que l'utilisateur a les permissions nécessaires

### Erreur de Table
Si vous avez une erreur de table, vérifiez :
- Que les tables `rendez_vous` et `rendez_vous_deletion_logs` existent
- Que la structure des tables correspond au schéma ci-dessus
