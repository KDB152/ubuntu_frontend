# Configuration de la Base de Données - Chrono-Carto

## Vue d'ensemble

Ce guide explique comment configurer la base de données pour la fonctionnalité de gestion des rendez-vous.

## Options de Configuration

### 1. **Vercel Postgres (Recommandé pour la production)**

Si vous utilisez Vercel pour le déploiement :

1. **Créer une base de données Vercel Postgres** :
   - Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
   - Créez un nouveau projet ou utilisez un projet existant
   - Ajoutez une base de données Postgres depuis l'onglet "Storage"

2. **Configurer les variables d'environnement** :
   - Dans votre projet Vercel, allez dans "Settings" > "Environment Variables"
   - Ajoutez les variables suivantes (automatiquement fournies par Vercel) :
     ```
     POSTGRES_URL
     POSTGRES_HOST
     POSTGRES_DATABASE
     POSTGRES_USERNAME
     POSTGRES_PASSWORD
     POSTGRES_PORT
     ```

3. **Créer les tables** :
   - Exécutez le script SQL `database/meetings_table.sql` dans votre base de données Vercel
   - Vous pouvez utiliser l'interface SQL de Vercel ou un client PostgreSQL

### 2. **PostgreSQL Local (Pour le développement)**

Pour le développement local :

1. **Installer PostgreSQL** :
   - [Télécharger PostgreSQL](https://www.postgresql.org/download/)
   - Ou utiliser Docker : `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Créer la base de données** :
   ```sql
   CREATE DATABASE chrono_carto;
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env.local` dans le dossier `chrono-carto-frontend` :
   ```
   POSTGRES_URL="postgresql://postgres:password@localhost:5432/chrono_carto"
   POSTGRES_HOST="localhost"
   POSTGRES_DATABASE="chrono_carto"
   POSTGRES_USERNAME="postgres"
   POSTGRES_PASSWORD="password"
   POSTGRES_PORT="5432"
   ```

4. **Créer les tables** :
   ```bash
   psql -h localhost -U postgres -d chrono_carto -f database/meetings_table.sql
   ```

### 3. **Mode Simulation (Sans base de données)**

Si vous ne voulez pas configurer de base de données :

- L'application fonctionnera avec des données simulées
- Les fonctionnalités CRUD seront simulées (pas de persistance)
- Utile pour tester l'interface utilisateur

## Installation des Dépendances

Assurez-vous que `@vercel/postgres` est installé :

```bash
npm install @vercel/postgres
```

## Structure des Tables

### Table `meetings`

```sql
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    parent_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    child_class VARCHAR(100) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    meeting_type VARCHAR(20) NOT NULL CHECK (meeting_type IN ('in_person', 'video_call', 'phone_call')),
    location VARCHAR(500),
    urgency VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    admin_notes TEXT,
    admin_response VARCHAR(20) CHECK (admin_response IN ('approved', 'rejected')),
    admin_response_date TIMESTAMP,
    admin_id VARCHAR(255),
    admin_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `meeting_deletion_logs`

```sql
CREATE TABLE meeting_deletion_logs (
    id SERIAL PRIMARY KEY,
    meeting_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    reason TEXT,
    deleted_by VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

Une fois configuré, les endpoints suivants seront disponibles :

- `GET /api/meetings` - Récupérer tous les rendez-vous
- `POST /api/meetings` - Créer un nouveau rendez-vous
- `PUT /api/meetings` - Mettre à jour un rendez-vous
- `DELETE /api/meetings/[id]` - Supprimer un rendez-vous
- `GET /api/meetings/[id]` - Récupérer un rendez-vous spécifique

## Test de la Configuration

1. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Tester l'API** :
   ```bash
   curl http://localhost:3000/api/meetings
   ```

3. **Vérifier les logs** :
   - Si la base de données est configurée : vous verrez les données réelles
   - Si non configurée : vous verrez les données simulées

## Dépannage

### Erreur "Module not found: Can't resolve '@vercel/postgres'"

```bash
npm install @vercel/postgres
```

### Erreur de connexion à la base de données

1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez les variables d'environnement
3. Testez la connexion : `psql -h localhost -U postgres -d chrono_carto`

### Erreur "Table does not exist"

Exécutez le script SQL pour créer les tables :
```bash
psql -h localhost -U postgres -d chrono_carto -f database/meetings_table.sql
```

## Sécurité

- Ne committez jamais les fichiers `.env.local` dans Git
- Utilisez des mots de passe forts pour la base de données
- Limitez les accès à la base de données en production
- Utilisez des connexions SSL en production

## Support

Pour toute question :
1. Vérifiez les logs de la console
2. Testez la connexion à la base de données
3. Vérifiez les variables d'environnement
4. Consultez la documentation de Vercel Postgres
