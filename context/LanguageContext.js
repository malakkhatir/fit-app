import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../utils/translations';

const LanguageContext = createContext(null);
const CLE_LANGUE = 'fitapp_language';

export function LanguageProvider({ children }) {
  const [langue, setLangue] = useState('fr');

  useEffect(() => {
    async function loadLangue() {
      try {
        const saved = await AsyncStorage.getItem(CLE_LANGUE);
        if (saved === 'fr' || saved === 'en') setLangue(saved);
      } catch (e) {
        console.log('Erreur chargement langue:', e);
      }
    }
    loadLangue();
  }, []);

  async function changerLangue(nouvelleLangue) {
    setLangue(nouvelleLangue);
    try {
      await AsyncStorage.setItem(CLE_LANGUE, nouvelleLangue);
    } catch (e) {
      console.log('Erreur sauvegarde langue:', e);
    }
  }

  function t(key) {
    // Protection: ila translations wla langue machi mawjoudin, nrj3o l'key
    if (!translations || !translations[langue]) return key;
    const value = translations[langue][key];
    return value !== undefined ? value : key;
  }

  return (
    <LanguageContext.Provider value={{ langue, changerLangue, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage doit être dans <LanguageProvider>');
  return ctx;
}
