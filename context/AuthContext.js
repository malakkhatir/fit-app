import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken, getToken } from '../services/api';

const AuthContext = createContext(null);
const CLE_USER = 'fitapp_user';

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargementAuth, setChargementAuth] = useState(true);

// F l'useEffect dial restaurer :
useEffect(() => {
  async function restaurer() {
    try {
      const token = await getToken();
      const userTexte = await AsyncStorage.getItem(CLE_USER);
      if (token && userTexte) {
        // ✅ Verifi token m3a backend
        try {
          await api.getSessions();     // test
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

  async function sauvegarderSession(token, user) {
    await setToken(token);
    await AsyncStorage.setItem(CLE_USER, JSON.stringify(user));
    setUtilisateur(user);
  }

  async function inscrire({ prenom, email, motDePasse }) {
    const { token, user } = await api.register({ prenom, email, motDePasse });
    await sauvegarderSession(token, user);
  }

  async function connecter({ email, motDePasse }) {
    const { token, user } = await api.login({ email, motDePasse });
    await sauvegarderSession(token, user);
  }

  async function deconnecter() {
    try { await api.logout(); } catch (e) { console.log('Logout serveur échoué', e); }
    await setToken(null);
    await AsyncStorage.removeItem(CLE_USER);
    setUtilisateur(null);
  }

async function mettreAJourProfil({ prenom, objectifHebdo }) {
  // ⚠️ REFUS ila prénom kawi
  if (!prenom || prenom.trim() === '') {
    throw new Error('Prénom obligatoire');
  }

  const user = await api.updateProfile({
    prenom: prenom.trim(),
    objectifHebdo,
  });
  await AsyncStorage.setItem(CLE_USER, JSON.stringify(user));
  setUtilisateur(user);
  return user;
}

  return (
    <AuthContext.Provider value={{
      utilisateur, chargementAuth, inscrire, connecter, deconnecter, mettreAJourProfil,
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