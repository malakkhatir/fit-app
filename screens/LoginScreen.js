import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  TextInput, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SlideUpView, ScaleInView, AnimatedPressable } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const { connecter } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !motDePasse) {
      Alert.alert('Champs vides', 'Remplis tous les champs.');
      return;
    }
    setChargement(true);
    try {
      await connecter({ email, motDePasse });
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setChargement(false);
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: '#000' },
    background: { flex: 1 },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    keyboardView: { flex: 1 },
    contenu: {
      flexGrow: 1, padding: spacing.xxl,
      justifyContent: 'center', paddingTop: 60,
    },
    logoContainer: { alignItems: 'center', marginBottom: spacing.xxl },
    logoIcon: {
      width: 64, height: 64, borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    titre: { fontSize: 40, fontWeight: '900', letterSpacing: -1 },
    titreBlanc: { color: '#FFFFFF' },
    titreBleu: { color: colors.primary },
    sousTitre: {
      fontSize: 14, color: 'rgba(255,255,255,0.8)',
      marginTop: 12, textAlign: 'center', lineHeight: 20,
    },
    formulaire: { width: '100%' },
    champ: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: radius.md, paddingHorizontal: spacing.md,
      marginBottom: spacing.md, height: 56,
    },
    input: {
      flex: 1, paddingVertical: 14, paddingLeft: 10,
      color: '#0F172A', fontSize: 15,
    },
    bouton: {
      backgroundColor: colors.primary,
      paddingVertical: 18, borderRadius: radius.md, alignItems: 'center',
      marginTop: spacing.sm,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    boutonDesactive: { opacity: 0.7 },
    texteBouton: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
    lienContainer: { marginTop: spacing.xl, alignItems: 'center' },
    lienTexte: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    oubliContainer: { marginTop: spacing.lg, alignItems: 'center' },
    oubliTexte: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
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
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.contenu}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ScaleInView delay={100}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Ionicons name="barbell" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.titre}>
                  <Text style={styles.titreBlanc}>Fit</Text>
                  <Text style={styles.titreBleu}>App</Text>
                </Text>
                <Text style={styles.sousTitre}>
                  Connecte-toi pour accéder{'\n'}à ton espace personnel
                </Text>
              </View>
            </ScaleInView>

            <SlideUpView delay={300}>
              <View style={styles.formulaire}>
                <View style={styles.champ}>
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.champ}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#94A3B8"
                    value={motDePasse}
                    onChangeText={setMotDePasse}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <AnimatedPressable
                  style={[styles.bouton, chargement && styles.boutonDesactive]}
                  onPress={handleLogin}
                  disabled={chargement}
                >
                  <Text style={styles.texteBouton}>
                    {chargement ? 'Connexion...' : 'Se connecter'}
                  </Text>
                </AnimatedPressable>

                <TouchableOpacity
                  style={styles.lienContainer}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.lienTexte}>Créer un compte</Text>
                </TouchableOpacity>
              </View>
            </SlideUpView>

            <TouchableOpacity style={styles.oubliContainer}>
              <Text style={styles.oubliTexte}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
