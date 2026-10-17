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

export default function RegisterScreen({ navigation }) {
  const { inscrire } = useAuth();
  const { colors } = useTheme();
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleInscription() {
    if (!prenom.trim() || !email.trim() || !motDePasse || !confirmation) {
      Alert.alert('Champs vides', 'Merci de remplir tous les champs.');
      return;
    }
    if (motDePasse.length < 6) {
      Alert.alert('Mot de passe trop court', 'Utilise au moins 6 caractères.');
      return;
    }
    if (motDePasse !== confirmation) {
      Alert.alert('Mots de passe différents', 'Les deux doivent être identiques.');
      return;
    }
    setChargement(true);
    try {
      await inscrire({ prenom, email, motDePasse });
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
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    keyboardView: { flex: 1 },
    contenu: { flexGrow: 1, padding: spacing.xxl, paddingTop: 60 },
    retour: {
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    logoContainer: { alignItems: 'center', marginBottom: spacing.xl },
    logoIcon: {
      width: 64, height: 64, borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    titre: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
    titreBlanc: { color: '#FFFFFF' },
    titreBleu: { color: colors.primary },
    sousTitre: {
      fontSize: 14, color: 'rgba(255,255,255,0.8)',
      marginTop: 8, textAlign: 'center',
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
    lienTexte: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
    lienFort: { color: colors.primary, fontWeight: '700' },
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
            <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <ScaleInView delay={100}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Ionicons name="barbell" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.titre}>
                  <Text style={styles.titreBlanc}>Fit</Text>
                  <Text style={styles.titreBleu}>App</Text>
                </Text>
                <Text style={styles.sousTitre}>Rejoins-nous en 30 secondes</Text>
              </View>
            </ScaleInView>

            <SlideUpView delay={300}>
              <View style={styles.formulaire}>
                <View style={styles.champ}>
                  <Ionicons name="person-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    placeholderTextColor="#94A3B8"
                    value={prenom}
                    onChangeText={setPrenom}
                    autoCapitalize="words"
                  />
                </View>

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
                  />
                </View>

                <View style={styles.champ}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe (6 car. min.)"
                    placeholderTextColor="#94A3B8"
                    value={motDePasse}
                    onChangeText={setMotDePasse}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.champ}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor="#94A3B8"
                    value={confirmation}
                    onChangeText={setConfirmation}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <AnimatedPressable
                  style={[styles.bouton, chargement && styles.boutonDesactive]}
                  onPress={handleInscription}
                  disabled={chargement}
                >
                  <Text style={styles.texteBouton}>
                    {chargement ? 'Création...' : "S'inscrire"}
                  </Text>
                </AnimatedPressable>

                <TouchableOpacity
                  style={styles.lienContainer}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.lienTexte}>
                    Déjà un compte ? <Text style={styles.lienFort}>Se connecter</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </SlideUpView>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
