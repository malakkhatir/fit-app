import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, setThemeColors } from '../theme/colors';

const ThemeContext = createContext(null);
const CLE_THEME = 'fitapp_theme';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [chargementTheme, setChargementTheme] = useState(true);

  // Charger préférence
  useEffect(() => {
    async function charger() {
      try {
        const saved = await AsyncStorage.getItem(CLE_THEME);
        const sombre = saved === 'dark';
        setIsDark(sombre);
        setThemeColors(sombre);
      } catch (e) {
        console.log('Erreur chargement thème', e);
      } finally {
        setChargementTheme(false);
      }
    }
    charger();
  }, []);

  async function toggleTheme() {
    const nouveau = !isDark;
    setIsDark(nouveau);
    setThemeColors(nouveau);
    try {
      await AsyncStorage.setItem(CLE_THEME, nouveau ? 'dark' : 'light');
    } catch (e) {
      console.log('Erreur sauvegarde thème', e);
    }
  }

  const themeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        colors: themeColors,
        chargementTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être dans <ThemeProvider>');
  return ctx;
}