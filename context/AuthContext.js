import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken, getToken, API_URL } from '../services/api';

const AuthContext = createContext(null);
const CLE_USER = 'fitapp_user';

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargementAuth, setChargementAuth] = useState(true);

  // ============================================
  // RESTAURATION DE SESSION
  // ============================================
  useEffect(() => {
    async function restaurer() {
      try {
        const token = await getToken();
        const userTexte = await AsyncStorage.getItem(CLE_USER);
        
        if (token && userTexte) {
          try {
            await api.getSessions(); // Test dial token
            setUtilisateur(JSON.parse(userTexte));
          } catch (err) {
            // Token invalide → nettoyage
            console.log('>>> Token invalide, déconnexion auto');
            await setToken(null);
            await AsyncStorage.removeItem(CLE_USER);
            setUtilisateur(null);
          }
        }
      } catch (e) {
        console.log('Erreur restauration', e);
      } finally {
        setChargementAuth(false);
      }
    }
    restaurer();
  }, []);

  // ============================================
  // SAUVEGARDE SESSION
  // ============================================
  async function sauvegarderSession(token, user) {
    await setToken(token);
    await AsyncStorage.setItem(CLE_USER, JSON.stringify(user));
    setUtilisateur(user);
  }

  // ============================================
  // INSCRIPTION
  // ============================================
  async function inscrire({ prenom, email, motDePasse }) {
    const { token, user } = await api.register({ prenom, email, motDePasse });
    await sauvegarderSession(token, user);
  }

  // ============================================
  // CONNEXION
  // ============================================
  async function connecter({ email, motDePasse }) {
    const { token, user } = await api.login({ email, motDePasse });
    await sauvegarderSession(token, user);
  }

  // ============================================
  // DÉCONNEXION
  // ============================================
  async function deconnecter() {
    try {
      await api.logout();
    } catch (e) {
      console.log('Logout serveur échoué', e);
    }
    await setToken(null);
    await AsyncStorage.removeItem(CLE_USER);
    setUtilisateur(null);
  }

  // ============================================
  // MISE À JOUR PROFIL (prenom + objectif)
  // ============================================
  async function mettreAJourProfil({ prenom, objectifHebdo, poids, targetWeight, taille, age, sexe }) {
    if (!prenom || prenom.trim() === '') throw new Error('Prénom obligatoire');
    const user = await api.updateProfile({ 
      prenom: prenom.trim(), objectifHebdo, poids, targetWeight, taille, age, sexe 
    });
    await AsyncStorage.setItem(CLE_USER, JSON.stringify(user));
    setUtilisateur(user);
    return user;
  }

  // ============================================
  // MISE À JOUR PHOTO DE PROFIL
  // ============================================
  async function mettreAJourPhoto(imageUri) {
    const result = await api.uploadAvatar(imageUri);
    
    // Construire l'URL complète ila kanet relative
    let fullUrl = result.photoUrl;
    if (fullUrl && !fullUrl.startsWith('http')) {
      // API_URL fih /api f l'akhir, 7aydoha bach nzido uploads/
      const baseUrl = API_URL.replace('/api', '');
      fullUrl = `${baseUrl}/${fullUrl}`;
    }

    const userMisAJour = { 
      ...utilisateur, 
      photoUrl: fullUrl 
    };
    
    await AsyncStorage.setItem(CLE_USER, JSON.stringify(userMisAJour));
    setUtilisateur(userMisAJour);
    return result;
  }

  return (
    <AuthContext.Provider value={{
      utilisateur,
      chargementAuth,
      inscrire,
      connecter,
      deconnecter,
      mettreAJourProfil,
      mettreAJourPhoto,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être dans <AuthProvider>');
  return ctx;
}
