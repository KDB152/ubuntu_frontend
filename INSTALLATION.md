# Guide d'installation - Chrono-Carto Frontend

## 🚀 Installation rapide

### Étape 1: Prérequis
Assurez-vous d'avoir installé :
- **Node.js 18+** : [Télécharger Node.js](https://nodejs.org/)
- **npm** (inclus avec Node.js) ou **yarn**

### Étape 2: Installation des dépendances
```bash
cd chrono-carto-frontend
npm install
```

### Étape 3: Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Modifier .env.local avec vos paramètres
nano .env.local
```

### Étape 4: Démarrage
```bash
npm run dev
```

L'application sera accessible sur : http://localhost:3000

## 📋 Configuration détaillée

### Variables d'environnement (.env.local)
```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# URL de l'application frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Nom de l'application
NEXT_PUBLIC_APP_NAME=Chrono-Carto

# Description
NEXT_PUBLIC_APP_DESCRIPTION=Plateforme pédagogique Histoire-Géographie
```

## 🔧 Scripts disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Build de production
npm run build

# Démarrer en mode production
npm run start

# Vérification du code
npm run lint

# Vérification TypeScript
npm run type-check
```

## 🌐 Pages disponibles

Une fois l'application démarrée, vous pouvez accéder à :

- **Page d'accueil** : http://localhost:3000
- **Connexion** : http://localhost:3000/login
- **Inscription** : http://localhost:3000/register
- **Mot de passe oublié** : http://localhost:3000/forgot-password

## 🧪 Comptes de test

Pour tester les fonctionnalités d'authentification :

```
Élève :
- Email: student@demo.com
- Mot de passe: password123

Parent :
- Email: parent@demo.com
- Mot de passe: password123

Administrateur :
- Email: admin@demo.com
- Mot de passe: password123
```

## 🔗 Connexion avec le backend

Pour que l'authentification fonctionne complètement, vous devez :

1. **Démarrer le backend** sur le port 3001
2. **Vérifier l'URL de l'API** dans `.env.local`
3. **Tester la connexion** via les pages d'authentification

## 🎨 Personnalisation

### Couleurs
Modifiez les couleurs dans `tailwind.config.js` :
```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Bleu principal
    600: '#0284c7',
    // ...
  }
}
```

### Logo
Remplacez le logo dans `public/logo.png`

### Styles
Modifiez les styles globaux dans `src/app/globals.css`

## 🚨 Résolution des problèmes

### Erreur de port
Si le port 3000 est occupé :
```bash
npm run dev -- -p 3001
```

### Erreurs de dépendances
```bash
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreurs TypeScript
```bash
# Vérifier les types
npm run type-check

# Redémarrer le serveur de développement
npm run dev
```

## 📱 Test sur mobile

Pour tester sur mobile dans le même réseau :
1. Trouvez votre IP locale : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Accédez à : `http://VOTRE_IP:3000`

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Build local
```bash
npm run build
npm run start
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que Node.js 18+ est installé
2. Assurez-vous que le port 3000 est libre
3. Vérifiez les logs dans la console
4. Contactez le support technique

---

✅ **Installation terminée !** Votre frontend Chrono-Carto est prêt à l'emploi.

