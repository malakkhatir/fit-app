import React, { useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SlideUpView, ScaleInView, AnimatedPressable } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: '#000' },
    background: { flex: 1, justifyContent: 'space-between' },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    contenu: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    logoContainer: { alignItems: 'center' },
    logoIcon: {
      width: 70, height: 70, borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    titre: { fontSize: 52, fontWeight: '900', letterSpacing: -1.5 },
    titreBlanc: { color: '#FFFFFF' },
    titreBleu: { color: colors.primary },
    slogan: {
      fontSize: 15, color: 'rgba(255,255,255,0.85)',
      marginTop: 8, textAlign: 'center',
    },
    actions: { padding: spacing.xl, paddingBottom: 40, gap: spacing.md },
    boutonPrincipal: {
      backgroundColor: colors.primary,
      paddingVertical: 18, borderRadius: radius.md, alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    texteBoutonPrincipal: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
    boutonLien: { paddingVertical: 12, alignItems: 'center' },
    texteLien: {
      color: '#FFFFFF', fontSize: 15, fontWeight: '600',
      textDecorationLine: 'underline',
    },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/gym-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.contenu}>
          <ScaleInView delay={200}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="barbell" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.titre}>
                <Text style={styles.titreBlanc}>Fit</Text>
                <Text style={styles.titreBleu}>App</Text>
              </Text>
              <Text style={styles.slogan}>Ton objectif, notre priorité</Text>
            </View>
          </ScaleInView>
        </View>

        <SlideUpView delay={600} style={styles.actions}>
          <AnimatedPressable
            style={styles.boutonPrincipal}
            onPress={() => navigation?.navigate('Auth', { screen: 'Register' })}
          >
            <Text style={styles.texteBoutonPrincipal}>Commencer</Text>
          </AnimatedPressable>

          <TouchableOpacity
            style={styles.boutonLien}
            onPress={() => navigation?.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={styles.texteLien}>Se connecter</Text>
          </TouchableOpacity>
        </SlideUpView>
      </ImageBackground>
    </View>
  );
}