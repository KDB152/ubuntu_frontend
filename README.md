# Chrono-Carto Frontend

Plateforme pédagogique moderne dédiée aux élèves préparant le bac français en Histoire-Géographie.

## 🚀 Fonctionnalités

### Authentification
- ✅ **Connexion** - Interface moderne avec validation en temps réel
- ✅ **Inscription** - Formulaire complet pour élèves et parents
- ✅ **Mot de passe oublié** - Système de récupération par email
- 🔐 **Sécurité** - Validation côté client et serveur

### Design & UX
- 🎨 **Design moderne** - Interface élégante avec Tailwind CSS
- 📱 **Responsive** - Compatible mobile, tablette et desktop
- ⚡ **Animations fluides** - Transitions et micro-interactions
- 🌈 **Thème cohérent** - Palette de couleurs éducative

## 🛠️ Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Composants personnalisés
- **Icons**: Lucide React
- **TypeScript**: Support complet
- **Validation**: Validation personnalisée
- **State Management**: React hooks

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd chrono-carto-frontend
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Modifier `.env.local` avec vos configurations :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🏗️ Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Groupe de routes d'authentification
│   │   ├── login/         # Page de connexion
│   │   ├── register/      # Page d'inscription
│   │   └── forgot-password/ # Page mot de passe oublié
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   │   ├── button.tsx    # Bouton personnalisé
│   │   ├── input.tsx     # Champ de saisie
│   │   ├── card.tsx      # Carte
│   │   └── toast.tsx     # Notifications
│   └── auth/             # Composants d'authentification
│       ├── login-form.tsx
│       ├── register-form.tsx
│       └── forgot-password-form.tsx
├── lib/                  # Utilitaires et configuration
│   ├── api.ts           # Client API
│   ├── validations.ts   # Règles de validation
│   ├── utils.ts         # Fonctions utilitaires
│   └── constants.ts     # Constantes de l'application
└── types/               # Types TypeScript
    └── auth.ts          # Types d'authentification
```

## 🎨 Composants UI

### Button
```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Se connecter
</Button>
```

**Variantes**: `primary`, `secondary`, `outline`, `ghost`, `danger`
**Tailles**: `sm`, `md`, `lg`, `xl`

### Input
```tsx
<Input
  label="Email"
  type="email"
  leftIcon={<Mail />}
  error="Message d'erreur"
  required
/>
```

### Card
```tsx
<Card variant="elevated" hover>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardBody>
    Contenu
  </CardBody>
</Card>
```

### Toast
```tsx
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Succès',
  message: 'Opération réussie'
});
```

## 🔧 Configuration

### Tailwind CSS
Le projet utilise une configuration Tailwind personnalisée avec :
- Palette de couleurs éducative
- Animations personnalisées
- Composants utilitaires
- Responsive design

### Variables CSS
```css
:root {
  --primary-50: #f0f9ff;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  /* ... */
}
```

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm run start

# Linting
npm run lint

# Vérification TypeScript
npm run type-check
```

## 📱 Pages disponibles

### Authentification
- `/login` - Connexion utilisateur
- `/register` - Inscription (élève/parent)
- `/forgot-password` - Récupération mot de passe

### Fonctionnalités
- **Validation en temps réel** - Feedback immédiat
- **Messages d'erreur contextuels** - Aide à la saisie
- **Responsive design** - Adaptation mobile
- **Accessibilité** - Support clavier et lecteurs d'écran

## 🎯 Comptes de démonstration

Pour tester l'application :

```
Élève:
- Email: student@demo.com
- Mot de passe: password123

Parent:
- Email: parent@demo.com  
- Mot de passe: password123

Admin:
- Email: admin@demo.com
- Mot de passe: password123
```

## 🔐 Sécurité

- **Validation côté client** - Vérification immédiate
- **Sanitisation des entrées** - Protection XSS
- **Gestion des tokens** - JWT sécurisé
- **HTTPS recommandé** - En production

## 🌐 API Integration

Le frontend communique avec l'API backend via :
- **Axios** - Client HTTP
- **Intercepteurs** - Gestion automatique des tokens
- **Gestion d'erreurs** - Feedback utilisateur
- **Types TypeScript** - Sécurité des données

## 📊 Performance

- **Code splitting** - Chargement optimisé
- **Images optimisées** - Next.js Image
- **Lazy loading** - Composants à la demande
- **Bundle analysis** - Optimisation taille

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Conventions

### Code Style
- **ESLint** - Règles de code
- **Prettier** - Formatage automatique
- **TypeScript** - Typage strict
- **Naming** - camelCase pour variables, PascalCase pour composants

### Git
- **Commits conventionnels** - feat:, fix:, docs:, etc.
- **Branches** - feature/, bugfix/, hotfix/
- **Pull Requests** - Description détaillée

## 📞 Support

- **Email**: support@chronocarto.fr
- **Documentation**: [docs.chronocarto.fr](https://docs.chronocarto.fr)
- **Issues**: GitHub Issues

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Chrono-Carto** - Plateforme pédagogique moderne pour la réussite en Histoire-Géographie 🎓

