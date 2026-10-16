import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SeancesProvider } from './context/SeancesContext';
import { ThemeProvider } from './context/ThemeContext';

import SplashScreen from './screens/SplashScreen';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';
import DetailExerciceScreen from './screens/DetailExerciceScreen';
import DetailProgrammeScreen from './screens/DetailProgrammeScreen';
import ProgressionScreen from './screens/ProgressionScreen';
import HistoriqueScreen from './screens/HistoriqueScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

// ✅ CONNECTÉ → SeancesProvider khddam hna bo7do
function AppConnecte() {
  return (
    <SeancesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetailExercice" component={DetailExerciceScreen} />
        <Stack.Screen name="DetailProgramme" component={DetailProgrammeScreen} />
        <Stack.Screen name="Progression" component={ProgressionScreen} />
        <Stack.Screen name="Historique" component={HistoriqueScreen} />
      </Stack.Navigator>
    </SeancesProvider>
  );
}

// ❌ PAS CONNECTÉ → BLA SeancesProvider
function AppNonConnecte() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
}

function RootStack() {
  const { utilisateur, chargementAuth } = useAuth();

  if (chargementAuth) return <LoadingScreen />;

  return utilisateur ? <AppConnecte /> : <AppNonConnecte />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}