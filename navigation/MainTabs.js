import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import AccueilScreen from '../screens/AccueilScreen';
import ExercicesScreen from '../screens/ExercicesScreen';
import ProgrammesScreen from '../screens/ProgrammesScreen';
import ProfilScreen from '../screens/ProfilScreen';

const Tab = createBottomTabNavigator();

const ICONES = {
  Accueil: ['home', 'home-outline'],
  Exercices: ['barbell', 'barbell-outline'],
  Programmes: ['list', 'list-outline'],
  Profil: ['person', 'person-outline'],
};

export default function MainTabs() {
  const { colors, isDark } = useTheme();

  // ⚠️ screenOptions DYNAMIC (kaybdel m3a l'thème)
  const screenOptions = useMemo(() => ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarStyle: {
      backgroundColor: colors.card,        // ← KAYBDEL (byed → ghame9)
      borderTopColor: colors.border,       // ← KAYBDEL
      borderTopWidth: 1,
      height: 64,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    tabBarIcon: ({ focused, color }) => {
      const [actif, inactif] = ICONES[route.name] || ['ellipse', 'ellipse-outline'];
      return (
        <Ionicons
          name={focused ? actif : inactif}
          size={22}
          color={color}
        />
      );
    },
  }), [colors]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Accueil" component={AccueilScreen} />
      <Tab.Screen name="Exercices" component={ExercicesScreen} />
      <Tab.Screen name="Programmes" component={ProgrammesScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}
