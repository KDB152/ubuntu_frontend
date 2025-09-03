# Guide d'Utilisation : Groupes Cibles pour les Quizzes

## 🎯 Vue d'ensemble

Cette fonctionnalité vous permet de contrôler précisément quels groupes d'étudiants peuvent tenter un quiz spécifique. Par exemple, vous pouvez créer un quiz uniquement pour "Terminale groupe 1" et restreindre l'accès aux autres groupes.

## ✨ Fonctionnalités Principales

### 1. **Sélection de Groupes Cibles**
- Choisissez un ou plusieurs groupes lors de la création d'un quiz
- Modifiez les groupes cibles à tout moment
- Les groupes disponibles sont prédéfinis selon votre structure

### 2. **Groupes Disponibles**
- **Terminale** : Groupe 1, Groupe 2, Groupe 3, Groupe 4
- **1ère** : Groupe 1, Groupe 2, Groupe 3

### 3. **Comportement par Défaut**
- Si aucun groupe n'est sélectionné → **Tous les étudiants peuvent tenter le quiz**
- Si des groupes sont sélectionnés → **Seuls les étudiants de ces groupes peuvent tenter le quiz**

## 🚀 Comment Utiliser

### **Créer un Quiz avec Groupes Cibles**

1. **Accédez au Dashboard Admin**
   - Connectez-vous en tant qu'administrateur
   - Allez dans la section "Gestion des quiz"

2. **Cliquez sur "Créer un quiz"**
   - Remplissez les informations de base (titre, description, matière, niveau)
   - Configurez les paramètres (durée, note de passage, etc.)

3. **Sélectionnez les Groupes Cibles**
   - Dans la section "Groupes cibles", cochez les groupes concernés
   - Vous pouvez sélectionner plusieurs groupes si nécessaire
   - Laissez vide si vous voulez que tous les étudiants puissent tenter le quiz

4. **Sauvegardez le Quiz**
   - Cliquez sur "Créer le quiz"
   - Le quiz sera créé avec les restrictions de groupes

### **Modifier les Groupes Cibles d'un Quiz Existant**

1. **Trouvez le Quiz**
   - Dans la liste des quizzes, localisez celui à modifier
   - Cliquez sur l'icône "Modifier" (crayon)

2. **Modifiez les Groupes**
   - Dans le formulaire d'édition, modifiez la sélection des groupes
   - Ajoutez ou retirez des groupes selon vos besoins

3. **Sauvegardez les Modifications**
   - Cliquez sur "Sauvegarder"
   - Les changements seront appliqués immédiatement

## 📊 Visualisation des Groupes Cibles

### **Dans la Liste des Quizzes**
- Chaque quiz affiche ses groupes cibles sous forme de badges verts
- Les badges sont visibles sous la section "Groupes cibles"
- Si aucun groupe n'est spécifié, cette section n'apparaît pas

### **Exemples d'Affichage**
```
📚 Quiz Histoire - Révolution française
   Matière: Histoire • Niveau: Terminale
   Groupes cibles: [Terminale groupe 1] [Terminale groupe 2]
```

## 🔒 Sécurité et Contrôle d'Accès

### **Vérification Automatique**
- Le système vérifie automatiquement l'appartenance au groupe
- Les étudiants non autorisés ne peuvent pas tenter le quiz
- Un message d'erreur explicite est affiché

### **Côté Serveur**
- La vérification se fait côté serveur (impossible à contourner)
- Chaque tentative est validée avant traitement

## 💡 Cas d'Usage Recommandés

### **1. Quiz Spécifiques par Groupe**
```
Quiz: "Contrôle Histoire - Chapitre 5"
Groupes: Terminale groupe 1 uniquement
Raison: Progression différente entre groupes
```

### **2. Quiz de Remise à Niveau**
```
Quiz: "Rattrapage Mathématiques"
Groupes: 1ère groupe 2, 1ère groupe 3
Raison: Groupes ayant des difficultés similaires
```

### **3. Quiz de Préparation aux Examens**
```
Quiz: "Bac Blanc - Histoire"
Groupes: Tous les groupes de Terminale
Raison: Préparation commune pour tous
```

## ⚠️ Points d'Attention

### **1. Gestion des Étudiants**
- Assurez-vous que les étudiants sont bien assignés aux bons groupes
- Vérifiez régulièrement les affectations de groupes

### **2. Modification des Groupes**
- Les changements de groupes cibles sont appliqués immédiatement
- Les étudiants en cours de quiz ne sont pas affectés

### **3. Historique des Tentatives**
- Les tentatives passées ne sont pas supprimées lors des changements
- Conservez un historique des modifications pour la traçabilité

## 🔧 Dépannage

### **Problème : Un étudiant ne peut pas tenter un quiz**
**Solutions possibles :**
1. Vérifiez que l'étudiant appartient au bon groupe
2. Confirmez que le quiz est publié
3. Vérifiez les groupes cibles du quiz

### **Problème : Les groupes cibles ne s'affichent pas**
**Solutions possibles :**
1. Actualisez la page
2. Vérifiez que le quiz a bien des groupes cibles
3. Contactez l'équipe technique

### **Problème : Impossible de modifier les groupes**
**Solutions possibles :**
1. Vérifiez vos permissions d'administrateur
2. Assurez-vous que le quiz n'est pas en cours d'utilisation
3. Essayez de modifier un quiz à la fois

## 📞 Support

Si vous rencontrez des problèmes ou avez des questions :
- Consultez la documentation technique
- Contactez l'équipe de support
- Vérifiez les logs d'erreur dans la console

---

**Note :** Cette fonctionnalité est en constante évolution. Les mises à jour apporteront de nouvelles fonctionnalités et améliorations.
