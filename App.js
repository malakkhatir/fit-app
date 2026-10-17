import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SeancesProvider } from './context/SeancesContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import SplashScreen from './screens/SplashScreen';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';
import DetailExerciceScreen from './screens/DetailExerciceScreen';
import DetailProgrammeScreen from './screens/DetailProgrammeScreen';
import ProgressionScreen from './screens/ProgressionScreen';
import HistoriqueScreen from './screens/HistoriqueScreen';
import CreateProgrammeScreen from './screens/CreateProgrammeScreen';
import AideScreen from './screens/AideScreen';
import AProposScreen from './screens/AProposScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

function AppConnecte() {
  return (
    <SeancesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetailExercice" component={DetailExerciceScreen} />
        <Stack.Screen name="DetailProgramme" component={DetailProgrammeScreen} />
        <Stack.Screen name="Progression" component={ProgressionScreen} />
        <Stack.Screen name="Historique" component={HistoriqueScreen} />
        <Stack.Screen name="CreateProgramme" component={CreateProgrammeScreen} />
        <Stack.Screen name="Aide" component={AideScreen} />
        <Stack.Screen name="APropos" component={AProposScreen} />
      </Stack.Navigator>
    </SeancesProvider>
  );
}

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
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
