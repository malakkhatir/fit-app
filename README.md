# 🏋️ FitApp

Application mobile de fitness développée avec **React Native** et **Expo**.

## 📱 Fonctionnalités

- 🔐 Authentification (inscription, connexion, déconnexion)
- 🏋️ **60 exercices** (abdos, fessiers, cuisses, hanches, mobilité...)
- 📋 **20 programmes** (Débutant, Intermédiaire, Avancé)
- 👫 Programmes pour **Filles** et **Garçons**
- ⏱️ Minuteur avec son et vibration
- 📊 Graphiques de progression (BarChart, LineChart, CircularProgress)
- 🌙 **Mode sombre**
- 🎬 Animations fluides
- 💾 Sauvegarde de l'historique en ligne (MySQL)

## 🛠️ Technologies

### Frontend
- **React Native** 0.86
- **Expo** SDK 57
- **React Navigation** 7
- **react-native-svg** (graphiques)
- **expo-audio** (son du minuteur)
- **AsyncStorage** (session)

### Backend
- **PHP** 8.2
- **MySQL** (via XAMPP)
- **Apache**
- API REST (JSON)

## 🚀 Installation

### Prérequis
- Node.js LTS
- XAMPP (Apache + MySQL)
- Expo Go sur ton téléphone

### Frontend
```bash
git clone https://github.com/malakkhatir/fit-app.git
cd fit-app
npm install
npx expo start