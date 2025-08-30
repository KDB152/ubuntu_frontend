# Gestion des Rendez-vous - Chrono-Carto

## Vue d'ensemble

La fonctionnalité de gestion des rendez-vous permet aux administrateurs de gérer les demandes de rendez-vous soumises par les parents. Chaque rendez-vous est enregistré en base de données avec toutes ses caractéristiques.

## Fonctionnalités

### 1. **Gestion complète des rendez-vous**
- ✅ **Voir tous les rendez-vous** avec filtres et recherche
- ✅ **Approuver/Refuser** les demandes avec notes
- ✅ **Supprimer** les rendez-vous avec raison
- ✅ **Voir les détails** complets de chaque rendez-vous

### 2. **Caractéristiques des rendez-vous en base de données**

Chaque rendez-vous contient les informations suivantes :

#### **Informations du parent**
- `parent_id` - Identifiant unique du parent
- `parent_name` - Nom complet du parent
- `parent_email` - Adresse email du parent
- `parent_phone` - Numéro de téléphone du parent

#### **Informations de l'enfant**
- `child_name` - Nom de l'enfant
- `child_class` - Classe de l'enfant

#### **Détails du rendez-vous**
- `subject` - Sujet du rendez-vous
- `description` - Description détaillée
- `preferred_date` - Date souhaitée
- `preferred_time` - Heure souhaitée
- `duration` - Durée en minutes
- `meeting_type` - Type de rendez-vous (`in_person`, `video_call`, `phone_call`)
- `location` - Lieu (optionnel, pour les rendez-vous en personne)

#### **Gestion de l'urgence et du statut**
- `urgency` - Niveau d'urgence (`low`, `medium`, `high`, `urgent`)
- `status` - Statut du rendez-vous (`pending`, `approved`, `rejected`, `completed`, `cancelled`)

#### **Réponse de l'administrateur**
- `admin_notes` - Notes de l'administrateur
- `admin_response` - Réponse (`approved` ou `rejected`)
- `admin_response_date` - Date de la réponse
- `admin_id` - Identifiant de l'administrateur
- `admin_name` - Nom de l'administrateur

#### **Timestamps**
- `created_at` - Date de création
- `updated_at` - Date de dernière modification

## Installation et configuration

### 1. **Créer la table en base de données**

Exécutez le script SQL `database/meetings_table.sql` dans votre base de données PostgreSQL :

```sql
-- Le script crée automatiquement :
-- - La table `meetings` avec toutes les colonnes nécessaires
-- - La table `meeting_deletion_logs` pour tracer les suppressions
-- - Les index pour optimiser les performances
-- - Les contraintes de validation
-- - Les données de test
```

### 2. **API Routes**

Les API routes suivantes sont disponibles :

#### **GET /api/meetings**
- Récupère tous les rendez-vous
- Triés par date de création décroissante

#### **POST /api/meetings**
- Crée un nouveau rendez-vous
- Tous les champs requis doivent être fournis

#### **PUT /api/meetings**
- Met à jour un rendez-vous existant
- L'ID du rendez-vous est requis

#### **DELETE /api/meetings/[id]**
- Supprime un rendez-vous par ID
- Enregistre la suppression dans les logs

#### **GET /api/meetings/[id]**
- Récupère un rendez-vous spécifique par ID

### 3. **Interface utilisateur**

L'interface est accessible via le dashboard administrateur :
- **Onglet "Rendez-vous"** dans le menu de navigation
- **Actions rapides** dans le dashboard principal
- **Notifications** pour les nouvelles demandes

## Utilisation

### **Pour les administrateurs**

1. **Accéder à la gestion des rendez-vous**
   - Connectez-vous en tant qu'administrateur
   - Cliquez sur l'onglet "Rendez-vous" dans le menu

2. **Filtrer et rechercher**
   - Utilisez la barre de recherche pour trouver des rendez-vous
   - Filtrez par statut (En attente, Approuvé, Refusé, etc.)
   - Filtrez par niveau d'urgence

3. **Gérer les demandes**
   - **Voir les détails** : Cliquez sur l'icône œil
   - **Approuver** : Cliquez sur l'icône verte ✓
   - **Refuser** : Cliquez sur l'icône rouge ✗
   - **Supprimer** : Cliquez sur l'icône poubelle 🗑️

4. **Ajouter des notes**
   - Lors de l'approbation/refus, vous pouvez ajouter une note
   - Lors de la suppression, vous pouvez indiquer la raison

### **Pour les parents**

1. **Soumettre une demande**
   - Accédez au dashboard parent
   - Cliquez sur "Planifier RDV"
   - Remplissez le formulaire avec toutes les informations

2. **Suivre le statut**
   - Consultez l'onglet "Rendez-vous" pour voir le statut
   - Recevez des notifications lors des changements de statut

## Sécurité et validation

### **Contraintes de base de données**
- Validation des types de rendez-vous (`in_person`, `video_call`, `phone_call`)
- Validation des niveaux d'urgence (`low`, `medium`, `high`, `urgent`)
- Validation des statuts (`pending`, `approved`, `rejected`, `completed`, `cancelled`)
- Contrainte sur la durée (doit être > 0)

### **Logs de suppression**
- Toutes les suppressions sont enregistrées dans `meeting_deletion_logs`
- Inclut la raison de suppression et l'administrateur responsable
- Permet l'audit et la traçabilité

### **Gestion des erreurs**
- Fallback vers des données simulées en cas d'erreur API
- Messages d'erreur explicites pour l'utilisateur
- Validation côté client et serveur

## Maintenance

### **Nettoyage des données**
- Les rendez-vous supprimés sont conservés dans les logs
- Possibilité d'archiver les anciens rendez-vous

### **Performance**
- Index sur les colonnes fréquemment utilisées
- Pagination possible pour de grandes quantités de données
- Mise en cache des requêtes fréquentes

### **Sauvegarde**
- Sauvegarde régulière de la table `meetings`
- Sauvegarde des logs de suppression
- Récupération possible en cas de problème

## Support

Pour toute question ou problème :
1. Consultez les logs de la console pour les erreurs
2. Vérifiez la connectivité à la base de données
3. Assurez-vous que les tables sont créées correctement
4. Contactez l'équipe de développement si nécessaire
