import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { calculerStatistiques } from '../utils/stats';
import CarteExercice from '../components/CarteExercice';
import {
  FadeInView, SlideUpView, ScaleInView, AnimatedPressable,
} from '../components/AnimatedWrapper';
import { radius, spacing, shadow } from '../theme/colors';

export default function AccueilScreen({ navigation }) {
  const { utilisateur } = useAuth();
  const { exercices, seances } = useSeances();
  const { colors, isDark } = useTheme();

  const objectif = utilisateur?.objectifHebdo ?? 3;
  const stats = calculerStatistiques(seances, objectif);
  const populaires = exercices.slice(0, 2);

  // ============================================
  // CALCULS SANTÉ
  // ============================================
  const poids = utilisateur?.poids ?? 70;
  const taille = utilisateur?.taille ?? 170;
  
  // IMC = Poids / (Taille en mètres)²
  const imc = (poids / Math.pow(taille / 100, 2)).toFixed(1);
  
  let imcStatut = 'Normal';
  let imcCouleur = isDark ? '#4ADE80' : '#22C55E';
  let imcFond = isDark ? '#14532D' : '#DCFCE7';
  
  if (imc < 18.5) {
    imcStatut = 'Maigreur';
    imcCouleur = colors.warning;
    imcFond = isDark ? '#78350F' : '#FEF3C7';
  } else if (imc >= 25) {
    imcStatut = 'Surpoids';
    imcCouleur = colors.danger;
    imcFond = isDark ? '#7F1D1D' : '#FEE2E2';
  }

  // Calories = Minutes * MET (6.5) * Poids / 60
  const calories = Math.round((stats.minutesTotales * 6.5 * poids) / 60);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    contenu: { padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },

    entete: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    bonjour: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    sousTitre: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: radius.round,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },

    carteObjectif: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      ...shadow.md,
    },
    carteObjectifLabel: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 13,
      marginBottom: 6,
    },
    carteObjectifValeur: {
      color: colors.white,
      fontSize: 36,
      fontWeight: '900',
      lineHeight: 40,
    },
    carteObjectifTotal: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 22,
      fontWeight: '700',
    },
    carteObjectifDetail: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 13,
      marginTop: 4,
    },
    cercle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 4,
      borderColor: 'rgba(255,255,255,0.3)',
      borderTopColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cercleTexte: { color: colors.white, fontWeight: '800', fontSize: 15 },

    // ===== SANTÉ =====
    sectionSante: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    santeCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: 'center',
      ...shadow.sm,
    },
    santeIcone: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundAlt,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    santeValeur: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.textPrimary,
    },
    santeLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 4,
      fontWeight: '600',
      textAlign: 'center',
    },
    santeBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginTop: 4,
    },
    santeBadgeTexte: { fontSize: 9, fontWeight: '700' },

    // ===== CARTES RACCOURCIS =====
    grille: { gap: spacing.md, marginBottom: spacing.xl },
    rangee: { flexDirection: 'row', gap: spacing.md },
    carteAction: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radius.lg,
      minHeight: 130,
      ...shadow.sm,
    },
    iconeAction: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    titreAction: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    detailAction: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
    },

    sectionEntete: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitre: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    voirTout: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '700',
    },
    grilleExercices: { flexDirection: 'row', gap: spacing.md },
  }), [colors, isDark, imcCouleur, imcFond]);

  return (
    <ScrollView
      style={styles.ecran}
      contentContainerStyle={styles.contenu}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* En-tête */}
      <FadeInView delay={0}>
        <View style={styles.entete}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bonjour}>
              Bonjour, {utilisateur?.prenom || 'Invité'} !
            </Text>
            <Text style={styles.sousTitre}>Prêt à atteindre tes objectifs ?</Text>
          </View>
          
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Profil')}
          >
            {utilisateur?.photoUrl ? (
              <Image
                source={{ uri: utilisateur.photoUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </FadeInView>

      {/* Carte objectif */}
      <ScaleInView delay={100}>
        <View style={styles.carteObjectif}>
          <View style={{ flex: 1 }}>
            <Text style={styles.carteObjectifLabel}>Objectif de la semaine</Text>
            <Text style={styles.carteObjectifValeur}>
              {stats.seancesSemaine}{' '}
              <Text style={styles.carteObjectifTotal}>/ {objectif}</Text>
            </Text>
            <Text style={styles.carteObjectifDetail}>séances réalisées</Text>
          </View>

          <View style={styles.cercle}>
            <Text style={styles.cercleTexte}>
              {Math.round(stats.progression)}%
            </Text>
          </View>
        </View>
      </ScaleInView>

      {/* ============ SECTION SANTÉ ============ */}
      <SlideUpView delay={150}>
        <View style={styles.sectionSante}>
          {/* Poids */}
          <View style={styles.santeCard}>
            <View style={styles.santeIcone}>
              <Ionicons name="scale-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.santeValeur}>{poids} kg</Text>
            <Text style={styles.santeLabel}>Poids</Text>
          </View>

          {/* IMC */}
          <View style={styles.santeCard}>
            <View style={styles.santeIcone}>
              <Ionicons name="fitness-outline" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.santeValeur}>{imc}</Text>
            <Text style={styles.santeLabel}>IMC</Text>
            <View style={[styles.santeBadge, { backgroundColor: imcFond }]}>
              <Text style={[styles.santeBadgeTexte, { color: imcCouleur }]}>
                {imcStatut}
              </Text>
            </View>
          </View>

          {/* Calories */}
          <View style={styles.santeCard}>
            <View style={styles.santeIcone}>
              <Ionicons name="flame-outline" size={18} color="#EF4444" />
            </View>
            <Text style={styles.santeValeur}>{calories}</Text>
            <Text style={styles.santeLabel}>Calories</Text>
          </View>
        </View>
      </SlideUpView>

      {/* 4 cartes b SlideUp */}
      <View style={styles.grille}>
        <View style={styles.rangee}>
          <SlideUpView delay={200} style={{ flex: 1 }}>
            <AnimatedPressable
              style={[styles.carteAction, { backgroundColor: colors.primaryLight }]}
              onPress={() => navigation.navigate('Exercices')}
            >
              <View style={[styles.iconeAction, { backgroundColor: colors.primary }]}>
                <Ionicons name="barbell" size={20} color={colors.white} />
              </View>
              <Text style={styles.titreAction}>Exercices</Text>
              <Text style={styles.detailAction}>Découvre et entraîne-toi</Text>
            </AnimatedPressable>
          </SlideUpView>

          <SlideUpView delay={300} style={{ flex: 1 }}>
            <AnimatedPressable
              style={[styles.carteAction, { backgroundColor: colors.orangeLight }]}
              onPress={() => navigation.navigate('Programmes')}
            >
              <View style={[styles.iconeAction, { backgroundColor: colors.orange }]}>
                <Ionicons name="list" size={20} color={colors.white} />
              </View>
              <Text style={styles.titreAction}>Programmes</Text>
              <Text style={styles.detailAction}>Des plans adaptés à toi</Text>
            </AnimatedPressable>
          </SlideUpView>
        </View>

        <View style={styles.rangee}>
          <SlideUpView delay={400} style={{ flex: 1 }}>
            <AnimatedPressable
              style={[styles.carteAction, { backgroundColor: colors.greenLight }]}
              onPress={() => navigation.navigate('Progression')}
            >
              <View style={[styles.iconeAction, { backgroundColor: colors.green }]}>
                <Ionicons name="trending-up" size={20} color={colors.white} />
              </View>
              <Text style={styles.titreAction}>Progression</Text>
              <Text style={styles.detailAction}>Suis tes résultats</Text>
            </AnimatedPressable>
          </SlideUpView>

          <SlideUpView delay={500} style={{ flex: 1 }}>
            <AnimatedPressable
              style={[styles.carteAction, { backgroundColor: colors.purpleLight }]}
              onPress={() => navigation.navigate('Historique')}
            >
              <View style={[styles.iconeAction, { backgroundColor: colors.purple }]}>
                <Ionicons name="time" size={20} color={colors.white} />
              </View>
              <Text style={styles.titreAction}>Mon historique</Text>
              <Text style={styles.detailAction}>Tes séances passées</Text>
            </AnimatedPressable>
          </SlideUpView>
        </View>
      </View>

      {/* Exercices populaires */}
      <FadeInView delay={600}>
        <View style={styles.sectionEntete}>
          <Text style={styles.sectionTitre}>Exercices populaires</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Exercices')}>
            <Text style={styles.voirTout}>Voir tout</Text>
          </TouchableOpacity>
        </View>
      </FadeInView>

      <View style={styles.grilleExercices}>
        {populaires.map((ex, index) => (
          <SlideUpView key={ex.id} delay={700 + index * 100} style={{ flex: 1 }}>
            <CarteExercice
              exercice={ex}
              variante="grille"
              onPress={() => navigation.navigate('DetailExercice', { exercice: ex })}
            />
          </SlideUpView>
        ))}
      </View>
    </ScrollView>
  );
}