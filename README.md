# 🏋️ FitApp — Application Mobile

> Application mobile de fitness développée avec **React Native** et **Expo**, permettant de suivre des programmes sportifs, consulter les exercices et enregistrer les séances réalisées.

🔗 **Backend (API REST)** : [github.com/malakkhatir/fitapp-backend](https://github.com/malakkhatir/fitapp-backend)

---

## ✨ Fonctionnalités

- 🔐 **Authentification** — Inscription, connexion, déconnexion et auto-logout
- 🏋️ **Catalogue d'exercices** — 60 exercices illustrés (abdos, fessiers, cuisses, hanches, mobilité, cardio)
- 📋 **Programmes sportifs** — 20 programmes standards + création de programmes personnalisés
- 👫 **Programmes ciblés** — Contenus adaptés aux femmes et aux hommes
- ⏱️ **Minuteur intégré** — Avec signal sonore et vibration
- 📊 **Graphiques de progression** — BarChart, LineChart et CircularProgress
- 🌙 **Mode sombre** — Interface optimisée pour un confort visuel prolongé
- 🌍 **Internationalisation** — Traduction complète en français et en anglais
- 🎬 **Animations fluides** — FadeIn, SlideUp, ScaleIn et Press
- ⭐ **Favoris** — Enregistrement des exercices préférés
- 💬 **Commentaires** — Publication et consultation de commentaires sur les exercices
- 🏆 **Badges & achievements** — 10 badges débloqués selon l'activité
- 📸 **Photo de profil** — Upload sécurisé vers le backend
- 📊 **Suivi santé** — IMC, calories, poids, taille et objectif de poids
- 🔔 **Rappels** — Notifications pour ne pas manquer les entraînements
- 🎯 **Progression verrouillée** — Un exercice doit être terminé pour débloquer le suivant

---

## 🛠️ Stack technique

| Technologie | Rôle |
|---|---|
| **React Native** 0.86 | Framework principal |
| **Expo** SDK 57 | Outils de développement et de build |
| **React Navigation** 7 | Navigation (Stack + Bottom Tabs) |
| **react-native-svg** | Rendu des graphiques |
| **expo-audio** | Son du minuteur |
| **expo-notifications** | Notifications et rappels |
| **expo-image-picker** | Sélection de la photo de profil |
| **AsyncStorage** | Persistance locale (session, thème) |
| **Fetch API** | Communication avec le backend |

---

## 📁 Architecture du projet

```text
fit-app/
├── App.js                        # Point d'entrée + Providers
├── assets/                       # Images et icônes
├── components/                   # Composants réutilisables
│   ├── CarteExercice.js
│   ├── CarteProgramme.js
│   ├── BarreProgression.js
│   ├── CircularProgress.js
│   ├── BarChart.js
│   ├── LineChart.js
│   ├── GrilleBadges.js
│   ├── CarteBadge.js
│   ├── ChampFormulaire.js
│   └── AnimatedWrapper.js
├── context/                      # États globaux (Context API)
│   ├── AuthContext.js            # Gestion de la connexion
│   ├── SeancesContext.js         # Exercices, programmes, séances
│   ├── ThemeContext.js           # Mode sombre
│   └── LanguageContext.js        # Traductions
├── navigation/                   # Configuration de la navigation
│   ├── AuthStack.js
│   └── MainTabs.js
├── screens/                      # Écrans de l'application
│   ├── SplashScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── AccueilScreen.js
│   ├── ExercicesScreen.js
│   ├── DetailExerciceScreen.js
│   ├── ProgrammesScreen.js
│   ├── DetailProgrammeScreen.js
│   ├── ProgressionScreen.js
│   ├── HistoriqueScreen.js
│   ├── ProfilScreen.js
│   ├── CreateProgrammeScreen.js
│   ├── AideScreen.js
│   └── AProposScreen.js
├── services/
│   └── api.js                    # Appels HTTP vers le backend
├── theme/
│   └── colors.js                 # Couleurs, radius, spacing, ombres
└── utils/
    ├── notifications.js          # Logique des rappels
    ├── stats.js                  # Calculs (IMC, calories, streak…)
    └── translations.js           # Textes FR / EN
```

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS)
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL) — pour le backend
- [Expo Go](https://expo.dev/go) installé sur le téléphone

### Étape 1 — Cloner le projet

```bash
git clone https://github.com/malakkhatir/fit-app.git
cd fit-app
npm install
```

### Étape 2 — Configurer l'URL de l'API

Ouvrir le fichier `services/api.js` et remplacer l'adresse IP par celle de votre machine (obtenue via `ipconfig` sous Windows ou `ifconfig` sous macOS/Linux) :

```javascript
// Remplacer par l'IP locale de votre machine
export const API_URL = 'http://192.168.1.42/fitapp-backend/api';
```

> ⚠️ **Important** : le téléphone et l'ordinateur doivent être connectés au **même réseau Wi-Fi**.

### Étape 3 — Lancer l'application

```bash
npx expo start
```

Scanner le QR code affiché dans le terminal avec **Expo Go** (Android ou iOS).

---

## 🧪 Tester l'application

1. **Inscription** — Créer un nouveau compte.
2. **Accueil** — Vérifier l'affichage des statistiques personnelles.
3. **Exercices** — Tester la recherche et les filtres (catégorie, zone, niveau).
4. **Programmes** — Ouvrir un programme et terminer le premier exercice pour vérifier le déblocage du suivant.
5. **Profil** — Modifier le poids, la taille et l'objectif. Activer le mode sombre et les rappels.

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Consulter le fichier [LICENSE](LICENSE) pour plus d'informations.

---

## 👤 Auteur

**Malak Khatir**

- GitHub : [@malakkhatir](https://github.com/malakkhatir)
