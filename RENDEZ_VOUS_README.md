# Gestion des Rendez-vous - Chrono-Carto

## Vue d'ensemble

La fonctionnalité de gestion des rendez-vous permet aux administrateurs de gérer les demandes de rendez-vous soumises par les parents. Chaque rendez-vous est enregistré en base de données avec une structure simplifiée.

## Structure de la Base de Données

### Table `rendez_vous`

```sql
CREATE TABLE rendez_vous (
    id SERIAL PRIMARY KEY,
    parent_id VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    child_class VARCHAR(100) NOT NULL,
    timing TIMESTAMP NOT NULL, -- Date et heure du rendez-vous
    parent_reason TEXT NOT NULL, -- Raison du parent pour le rendez-vous
    admin_reason TEXT, -- Raison de l'admin (acceptation/refus)
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'refused', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Caractéristiques principales

- **id** : Identifiant unique du rendez-vous
- **parent_id** : Identifiant du parent
- **parent_name** : Nom du parent
- **parent_email** : Email du parent
- **parent_phone** : Téléphone du parent
- **child_name** : Nom de l'enfant
- **child_class** : Classe de l'enfant
- **timing** : Date et heure du rendez-vous demandé
- **parent_reason** : Raison du parent pour demander le rendez-vous
- **admin_reason** : Raison de l'administrateur (optionnel)
- **status** : Statut du rendez-vous (pending, approved, refused, cancelled)

## Fonctionnalités

### 1. **Gestion complète des rendez-vous**
- ✅ **Voir tous les rendez-vous** avec filtres et recherche
- ✅ **Approuver/Refuser** les demandes avec notes
- ✅ **Supprimer** les rendez-vous avec raison
- ✅ **Voir les détails** complets de chaque rendez-vous

### 2. **Actions de l'administrateur**
- **Approuver** : Accepter le rendez-vous avec une note optionnelle
- **Refuser** : Refuser le rendez-vous avec une raison
- **Supprimer** : Supprimer définitivement le rendez-vous
- **Voir les détails** : Consulter toutes les informations

### 3. **Filtres et recherche**
- Recherche par nom de parent, nom d'enfant, ou raison
- Filtrage par statut (En attente, Approuvé, Refusé, Annulé)
- Statistiques en temps réel

## API Endpoints

### **GET /api/rendez-vous**
- Récupère tous les rendez-vous
- Triés par date de création décroissante

### **POST /api/rendez-vous**
- Crée un nouveau rendez-vous
- Tous les champs requis doivent être fournis

### **PUT /api/rendez-vous**
- Met à jour un rendez-vous existant (pour approuver/refuser)
- L'ID du rendez-vous est requis

### **DELETE /api/rendez-vous/[id]**
- Supprime un rendez-vous par ID
- Enregistre la suppression dans les logs

### **GET /api/rendez-vous/[id]**
- Récupère un rendez-vous spécifique par ID

## Interface Utilisateur

### **Dashboard Admin**
- **Onglet "Rendez-vous"** dans le menu de navigation
- **Liste des rendez-vous** avec statuts colorés
- **Actions rapides** : Approuver (✓), Refuser (✗), Supprimer (🗑️)
- **Modals de confirmation** pour chaque action

### **Fonctionnalités de l'interface**
1. **Recherche et filtres** en haut de page
2. **Liste des rendez-vous** avec informations essentielles
3. **Actions contextuelles** selon le statut
4. **Modals détaillés** pour chaque action
5. **Notifications visuelles** des statuts

## Workflow d'utilisation

### **Pour l'administrateur**

1. **Accéder à la gestion**
   - Se connecter en tant qu'administrateur
   - Cliquer sur l'onglet "Rendez-vous"

2. **Consulter les demandes**
   - Voir la liste des rendez-vous en attente
   - Utiliser les filtres pour organiser la vue
   - Rechercher des rendez-vous spécifiques

3. **Traiter les demandes**
   - **Approuver** : Cliquer sur ✓, ajouter une note optionnelle
   - **Refuser** : Cliquer sur ✗, indiquer la raison
   - **Supprimer** : Cliquer sur 🗑️, confirmer avec raison

4. **Suivre les statuts**
   - Voir les rendez-vous approuvés/refusés
   - Consulter les raisons données
   - Gérer l'historique complet

### **Pour les parents**

1. **Soumettre une demande**
   - Accéder au dashboard parent
   - Remplir le formulaire de rendez-vous
   - Indiquer la raison et la date souhaitée

2. **Suivre le statut**
   - Consulter l'onglet "Rendez-vous"
   - Voir si la demande est approuvée/refusée
   - Lire la réponse de l'administrateur

## Installation et Configuration

### 1. **Créer la table en base de données**

Exécutez le script SQL `database/rendez_vous_table.sql` :

```bash
psql -h localhost -U postgres -d chrono_carto -f database/rendez_vous_table.sql
```

### 2. **Configurer les variables d'environnement**

Créer un fichier `.env.local` :

```
POSTGRES_URL="postgresql://username:password@host:port/database"
```

### 3. **Tester l'API**

```bash
# Tester la récupération des rendez-vous
curl http://localhost:3000/api/rendez-vous

# Tester la création d'un rendez-vous
curl -X POST http://localhost:3000/api/rendez-vous \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": "parent1",
    "parentName": "Marie Dupont",
    "parentEmail": "marie@example.com",
    "parentPhone": "06 12 34 56 78",
    "childName": "Lucas Dupont",
    "childClass": "4ème A",
    "timing": "2024-12-25 14:00:00",
    "parentReason": "Discussion sur les progrès"
  }'
```

## Sécurité et Validation

### **Contraintes de base de données**
- Validation des statuts (`pending`, `approved`, `refused`, `cancelled`)
- Contraintes sur les champs obligatoires
- Index pour optimiser les performances

### **Logs de suppression**
- Toutes les suppressions sont enregistrées
- Inclut la raison et l'administrateur responsable
- Permet l'audit et la traçabilité

### **Gestion des erreurs**
- Fallback vers des données simulées en cas d'erreur API
- Messages d'erreur explicites
- Validation côté client et serveur

## Avantages de cette structure

### **Simplicité**
- Structure de données claire et directe
- Champs essentiels uniquement
- Interface utilisateur intuitive

### **Flexibilité**
- Statuts multiples pour gérer tous les cas
- Raisons optionnelles pour l'administrateur
- Système de logs pour la traçabilité

### **Performance**
- Index optimisés sur les colonnes importantes
- Requêtes SQL efficaces
- Interface responsive et rapide

## Support et Maintenance

### **Dépannage courant**
1. Vérifier la connexion à la base de données
2. Contrôler les variables d'environnement
3. Consulter les logs de la console
4. Tester les endpoints API

### **Maintenance**
- Sauvegarde régulière de la table `rendez_vous`
- Nettoyage des anciens logs de suppression
- Mise à jour des index si nécessaire

## Conclusion

Cette fonctionnalité de gestion des rendez-vous offre une solution complète et simple pour gérer les demandes de rendez-vous des parents. L'interface est intuitive, les actions sont claires, et le système est robuste avec une gestion d'erreurs appropriée.
