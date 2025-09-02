# Configuration des Paramètres de Sécurité

## 🚀 Fonctionnalités Implémentées

### ✅ Changement de Mot de Passe
- **Validation complète** des champs (mot de passe actuel, nouveau, confirmation)
- **Hachage sécurisé** avec bcrypt (salt rounds: 10)
- **Vérification** du mot de passe actuel avant modification
- **Mise à jour** en temps réel dans la base de données

### ✅ Changement d'Email
- **Validation** du format d'email
- **Vérification** d'unicité (pas de doublon)
- **Marquage automatique** comme non vérifié après changement
- **Mise à jour** en temps réel dans la base de données

## 🔧 Configuration Requise

### 1. Variables d'Environnement
Créez un fichier `.env.local` à la racine du projet :

```bash
# Configuration de la base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=chrono_carto

# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Installation des Dépendances
```bash
npm install bcryptjs @types/bcryptjs mysql2
```

## 📁 Structure des Fichiers

### API Routes
- `src/app/api/auth/change-password/route.ts` - Changement de mot de passe
- `src/app/api/auth/change-email/route.ts` - Changement d'email

### Composants
- `src/components/SecuritySettings.tsx` - Composant réutilisable pour tous les dashboards

### Dashboards
- **Student Dashboard** : `src/app/dashboard/student/ProfileTab.tsx`
- **Parent Dashboard** : `src/app/dashboard/parent/SettingsTab.tsx`
- **Admin Dashboard** : `src/app/dashboard/admin/SettingsTab.tsx`

## 🎯 Utilisation

### Dans les Dashboards
Le composant `SecuritySettings` est automatiquement intégré dans tous les dashboards :

```tsx
import SecuritySettings from '@/components/SecuritySettings';

// Dans le composant
<SecuritySettings 
  userId={userId}
  currentEmail={userEmail}
/>
```

### Fonctionnalités Disponibles
1. **Changement de mot de passe** avec validation complète
2. **Changement d'email** avec vérification d'unicité
3. **Interface utilisateur** cohérente sur tous les dashboards
4. **Messages de succès/erreur** en temps réel
5. **Validation** côté client et serveur

## 🔒 Sécurité

### Hachage des Mots de Passe
- Utilisation de **bcrypt** avec 10 rounds de salt
- **Vérification** du mot de passe actuel avant modification
- **Validation** de la complexité du nouveau mot de passe

### Validation des Emails
- **Format** d'email vérifié côté client et serveur
- **Unicité** vérifiée dans la base de données
- **Marquage** automatique comme non vérifié

## 🚨 Dépannage

### Erreurs Courantes
1. **Connexion à la base de données** : Vérifiez les variables d'environnement
2. **Module bcryptjs** : Assurez-vous qu'il est installé
3. **Permissions** : Vérifiez les droits d'accès à la base de données

### Logs de Debug
Les erreurs sont automatiquement loggées dans la console du serveur et du navigateur.

## 📝 Notes Importantes

- **Tous les dashboards** utilisent le même composant `SecuritySettings`
- **Les modifications** sont appliquées immédiatement en base de données
- **L'email** est automatiquement marqué comme non vérifié après changement
- **La sécurité** est gérée côté serveur avec validation côté client
