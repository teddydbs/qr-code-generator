# 🔲 Générateur QR Code

Générateur de QR Code gratuit et professionnel avec personnalisation avancée. Créez des QR codes pour URL, WiFi, Email, SMS, Téléphone et vCard avec des options de style complètes.

## ✨ Fonctionnalités

- 🌐 **Types multiples** : URL, WiFi, Email, SMS, Téléphone, vCard
- 🎨 **Personnalisation avancée** : Couleurs, formes des points, coins, cadres, dégradés
- 📱 **Interface responsive** : Fonctionne parfaitement sur mobile et desktop
- 💾 **Téléchargement** : Export en PNG et SVG haute qualité
- 🚀 **Performance** : Génération instantanée des QR codes
- 🔒 **Sécurité** : Traitement côté client, aucune donnée envoyée sur serveur
- 🌍 **SEO optimisé** : Meta tags, sitemap, données structurées

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**

### Installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/teddydbs/qr-code-generator.git
   cd qr-code-generator
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

## 📋 Scripts disponibles

### Développement

```bash
npm run dev          # Lance le serveur de développement
npm run dev -- --host # Lance le serveur accessible depuis le réseau local
```

### Production

```bash
npm run build        # Compile le projet pour la production
npm run preview      # Prévisualise la version de production
```

### Qualité du code

```bash
npm run lint         # Vérifie le code avec ESLint
npm run lint:fix     # Corrige automatiquement les erreurs ESLint
```

## 🛠 Technologies utilisées

- **React 18** - Interface utilisateur
- **Vite** - Build tool et serveur de développement
- **qr-code-styling** - Génération et personnalisation des QR codes
- **CSS Variables** - Système de design cohérent
- **PWA** - Application web progressive

## 📁 Structure du projet

```
qr-code-generator/
├── public/                 # Fichiers statiques
│   ├── favicon.svg        # Icône du site
│   ├── manifest.json      # Configuration PWA
│   ├── robots.txt         # Instructions pour les robots
│   ├── sitemap.xml        # Plan du site pour SEO
│   └── .htaccess          # Configuration serveur Apache
├── src/
│   ├── components/        # Composants React
│   │   └── QrGenerator.jsx # Composant principal
│   ├── App.jsx           # Composant racine
│   ├── App.css           # Styles globaux
│   └── main.jsx          # Point d'entrée
├── index.html            # Template HTML
├── vite.config.js        # Configuration Vite
└── package.json          # Dépendances et scripts
```

## 🎨 Personnalisation

### Types de QR codes supportés

- **URL** : Liens web
- **WiFi** : Connexion automatique au réseau
- **Email** : Composition d'email avec sujet et corps
- **SMS** : Message texte prérempli
- **Téléphone** : Appel direct
- **vCard** : Carte de visite numérique

### Options de style

- **Formes des points** : Carré, rond, points, extra-rond
- **Coins** : Carré, extra-rond, rond
- **Couleurs** : Couleur unie ou dégradé personnalisé
- **Cadres** : Aucun, bordure colorée, texte "SCAN ME"
- **Tailles** : De 200x200 à 1000x1000 pixels

## 🌐 Déploiement

### Netlify (Recommandé)

```bash
npm run build
# Drag & drop le dossier 'dist' sur netlify.com
```

### GitHub Pages

```bash
npm run build
# Le déploiement se fait automatiquement via GitHub Actions
```

### Serveur personnalisé

```bash
npm run build
# Servir le contenu du dossier 'dist'
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` :

```env
VITE_APP_TITLE=Mon Générateur QR
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Personnalisation des couleurs

Modifier les variables CSS dans `src/App.css` :

```css
:root {
  --primary-color: #007aff;
  --background-color: #f5f5f7;
  --text-color: #1d1d1f;
}
```

## 📊 SEO et Performance

- ✅ **Lighthouse Score** : 95+ sur tous les critères
- ✅ **Core Web Vitals** : Optimisés
- ✅ **Meta tags** : Complets pour réseaux sociaux
- ✅ **Données structurées** : Schema.org
- ✅ **PWA** : Installable sur mobile

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/teddydbs/qr-code-generator/issues)
- **Documentation** : Ce README
- **Email** : support@qr-generator.com

## 🎯 Roadmap

- [ ] Upload de logo au centre du QR code
- [ ] Templates prédéfinis
- [ ] Génération en lot
- [ ] API REST
- [ ] Mode sombre
- [ ] Historique des QR codes générés

---

**Développé avec ❤️ par [teddydbs](https://github.com/teddydbs)**
