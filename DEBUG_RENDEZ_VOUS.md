# Guide de Débogage - Rendez-vous Admin Dashboard

## Problème Signalé
"NN LE RENDEZ VOUS AJOUTE PAR LE PARENT N'A PAS ETE AJOUTE DANS LA BASE DE DONNEES NI DANS L ADMIN DASHBOARD"

## État Actuel
✅ **API MySQL configurée** : L'API `/api/rendez-vous` utilise maintenant MySQL
✅ **Composant configuré** : `RendezVousManagementTab` est correctement intégré
✅ **Navigation active** : L'onglet "Rendez-vous" est disponible dans le dashboard admin
✅ **Package MySQL installé** : `mysql2` est installé et configuré

## Configuration Requise

### 1. Variables d'Environnement
Créez un fichier `.env.local` dans le dossier `chrono-carto-frontend` :

```env
# Configuration MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=chrono_carto
DB_PORT=3306
```

### 2. Base de Données
Assurez-vous que vous avez :
- ✅ Créé la base de données `chrono_carto`
- ✅ Créé les tables `rendez_vous` et `rendez_vous_deletion_logs`
- ✅ Inséré des données de test

## Étapes de Débogage

### 1. Vérifier la Configuration
1. Vérifiez que le fichier `.env.local` existe avec les bonnes informations
2. Vérifiez que MySQL est en cours d'exécution
3. Vérifiez que la base de données `chrono_carto` existe

### 2. Vérifier l'URL d'accès
Assurez-vous d'accéder à la bonne URL :
```
http://localhost:3000/dashboard/admin?tab=rendez-vous
```

### 3. Vérifier la Console du Navigateur
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Rechargez la page
4. Vérifiez s'il y a des erreurs JavaScript

### 4. Vérifier l'Onglet Réseau
1. Dans les outils de développement, allez dans l'onglet "Réseau"
2. Rechargez la page
3. Cherchez l'appel à `/api/rendez-vous`
4. Vérifiez le statut de la requête (doit être 200 OK)

### 5. Vérifier les Logs du Serveur
Dans la console où `npm run dev` est en cours d'exécution, vous devriez voir :
```
GET /api/rendez-vous appelé
Connexion MySQL établie avec succès
Données récupérées de la base: X lignes
```

### 6. Test Direct de l'API
Testez directement l'API dans votre navigateur :
```
http://localhost:3000/api/rendez-vous
```
Vous devriez voir un JSON avec les données de votre base de données.

### 7. Vider le Cache du Navigateur
1. Appuyez sur Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)
2. Ou videz le cache dans les paramètres du navigateur

## Erreurs Courantes

### Erreur de Connexion MySQL
```
Erreur de connexion MySQL: ECONNREFUSED
```
**Solution** : Vérifiez que MySQL est en cours d'exécution et que les informations de connexion sont correctes.

### Erreur de Table
```
ER_NO_SUCH_TABLE: Table 'chrono_carto.rendez_vous' doesn't exist
```
**Solution** : Créez les tables avec le script SQL fourni dans `DATABASE_CONFIG.md`.

### Erreur d'Authentification
```
ER_ACCESS_DENIED_ERROR: Access denied for user
```
**Solution** : Vérifiez le nom d'utilisateur et le mot de passe dans `.env.local`.

## Fonctionnalités Disponibles

Le dashboard admin permet maintenant de :
- ✅ Voir tous les rendez-vous depuis la base de données MySQL
- ✅ Approuver un rendez-vous avec une note (sauvegardé en base)
- ✅ Refuser un rendez-vous avec une raison (sauvegardé en base)
- ✅ Supprimer un rendez-vous avec une raison (supprimé de la base + log)
- ✅ Voir les détails complets de chaque rendez-vous

## Prochaines Étapes
1. **Fonctionnalité Parent** : Implémenter la création de rendez-vous côté parent
2. **Notifications** : Ajouter des notifications pour les nouveaux rendez-vous
3. **Interface Parent** : Créer l'interface pour que les parents puissent créer des rendez-vous

## Contact
Si le problème persiste après ces vérifications, fournissez :
- Les erreurs de la console du navigateur
- Le statut de la requête `/api/rendez-vous`
- Les logs du serveur Next.js
- Les erreurs MySQL dans les logs du serveur
