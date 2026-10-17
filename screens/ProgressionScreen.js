import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { calculerStatistiques, seancesParSemaine } from '../utils/stats';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import CircularProgress from '../components/CircularProgress';
import { FadeInView, SlideUpView, ScaleInView } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

const ONGLETS = ['Séances', 'Minutes'];

export default function ProgressionScreen({ navigation }) {
  const { utilisateur } = useAuth();
  const { seances } = useSeances();
  const { colors, isDark } = useTheme();
  const [onglet, setOnglet] = useState('Séances');

  const objectif = utilisateur?.objectifHebdo ?? 3;
  const stats = calculerStatistiques(seances, objectif);
  const semaines = seancesParSemaine(seances, 8);
  
  const donneesSemaine = semaines.map((s) => ({
    label: s.label,
    valeur: onglet === 'Minutes' ? s.minutes : s.count,
  }));

  // ============================================
  // CALCULS SANTÉ
  // ============================================
  const poids = utilisateur?.poids ?? 70;
  const taille = utilisateur?.taille ?? 170;
  
  const imc = (poids / Math.pow(taille / 100, 2)).toFixed(1);
  
  let imcStatut = 'Normal';
  let imcCouleur = isDark ? '#4ADE80' : '#22C55E';
  let imcFond = isDark ? '#14532D' : '#DCFCE7';
  
  if (imc < 18.5) {
    imcStatut = 'Maigreur';
    imcCouleur = isDark ? '#FBBF24' : '#F59E0B';
    imcFond = isDark ? '#78350F' : '#FEF3C7';
  } else if (imc >= 25) {
    imcStatut = 'Surpoids';
    imcCouleur = isDark ? '#F87171' : '#EF4444';
    imcFond = isDark ? '#7F1D1D' : '#FEE2E2';
  }

  const calories = Math.round((stats.minutesTotales * 6.5 * poids) / 60);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    contenu: { paddingBottom: 40 },
    entete: {
      flexDirection: 'row', alignItems: 'center',
      paddingTop: 60, paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg, gap: spacing.md,
    },
    boutonRetour: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center', justifyContent: 'center',
    },
    titre: { fontSize: 24, fontWeight: '900', color: colors.textPrimary },

    objectifCard: {
      backgroundColor: colors.primary,
      marginHorizontal: spacing.lg, borderRadius: radius.xl,
      padding: spacing.xl, marginBottom: spacing.lg,
      flexDirection: 'row', alignItems: 'center',
    },
    objectifInfos: { flex: 1 },
    objectifLabel: {
      color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 6,
    },
    objectifValeur: {
      color: '#FFFFFF', fontSize: 32, fontWeight: '900', lineHeight: 36,
    },
    objectifTotal: {
      color: 'rgba(255,255,255,0.6)', fontSize: 20, fontWeight: '700',
    },
    objectifDetail: {
      color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4,
    },

    onglets: {
      flexDirection: 'row', gap: spacing.sm,
      paddingHorizontal: spacing.lg, marginBottom: spacing.md,
    },
    onglet: {
      paddingHorizontal: spacing.md, paddingVertical: 8,
      borderRadius: radius.round, backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
    },
    ongletActif: { backgroundColor: colors.primary, borderColor: colors.primary },
    ongletTexte: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    ongletTexteActif: { color: '#FFFFFF' },

    sectionTitre: {
      fontSize: 16, fontWeight: '800', color: colors.textPrimary,
      paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.sm,
    },
    graphiqueWrapper: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },

    grille: {
      flexDirection: 'row', gap: spacing.md,
      marginHorizontal: spacing.lg, marginBottom: spacing.md,
    },
    statCard: {
      flex: 1, backgroundColor: colors.card,
      borderRadius: radius.lg, padding: spacing.lg,
    },
    statLabel: {
      fontSize: 12, color: colors.textSecondary,
      marginBottom: 6, fontWeight: '600',
    },
    statValeur: {
      fontSize: 24, fontWeight: '900',
      color: colors.textPrimary, marginBottom: spacing.sm,
    },
    badge: {
      alignSelf: 'flex-start', paddingHorizontal: 8,
      paddingVertical: 3, borderRadius: radius.sm,
    },
    badgeTexte: { fontSize: 11, fontWeight: '700' },

    cercleContainer: {
      alignItems: 'center', marginHorizontal: spacing.lg,
      marginBottom: spacing.lg, paddingVertical: spacing.xl,
      backgroundColor: colors.card, borderRadius: radius.lg,
    },
  }), [colors, isDark, imcCouleur, imcFond]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contenu}>
        <FadeInView>
          <View style={styles.entete}>
            <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.titre}>Progression</Text>
          </View>
        </FadeInView>

        {/* Carte objectif */}
        <ScaleInView delay={100}>
          <View style={styles.objectifCard}>
            <View style={styles.objectifInfos}>
              <Text style={styles.objectifLabel}>Objectif cette semaine</Text>
              <Text style={styles.objectifValeur}>
                {stats.seancesSemaine}{' '}
                <Text style={styles.objectifTotal}>/ {objectif}</Text>
              </Text>
              <Text style={styles.objectifDetail}>
                {stats.minutesSemaine} minutes cumulées
              </Text>
            </View>
            <CircularProgress
              taille={80} epaisseur={8}
              valeur={stats.seancesSemaine} max={objectif}
              couleur="#FFFFFF" couleurFond="rgba(255,255,255,0.3)"
              afficherPourcentage={false}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>
                {Math.round(stats.progression)}%
              </Text>
            </CircularProgress>
          </View>
        </ScaleInView>

        {/* Onglets */}
        <FadeInView delay={200}>
          <View style={styles.onglets}>
            {ONGLETS.map((o) => {
              const actif = onglet === o;
              return (
                <TouchableOpacity
                  key={o}
                  style={[styles.onglet, actif && styles.ongletActif]}
                  onPress={() => setOnglet(o)}
                >
                  <Text style={[styles.ongletTexte, actif && styles.ongletTexteActif]}>
                    {o}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeInView>

        {/* BarChart */}
        <SlideUpView delay={300}>
          <Text style={styles.sectionTitre}>
            {onglet === 'Minutes' ? 'Minutes par semaine' : 'Séances par semaine'}
          </Text>
          <View style={styles.graphiqueWrapper}>
            <BarChart data={donneesSemaine} height={220} couleur={colors.primary} />
          </View>
        </SlideUpView>

        {/* LineChart */}
        <SlideUpView delay={400}>
          <Text style={styles.sectionTitre}>Évolution</Text>
          <View style={styles.graphiqueWrapper}>
            <LineChart data={donneesSemaine} height={200} couleur={colors.success} />
          </View>
        </SlideUpView>

        {/* Cercle */}
        <ScaleInView delay={500}>
          <Text style={styles.sectionTitre}>Objectif global</Text>
          <View style={styles.cercleContainer}>
            <CircularProgress
              taille={180} epaisseur={16}
              valeur={stats.seancesSemaine} max={objectif}
              couleur={colors.primary} couleurFond={colors.primaryLight}
            />
            <Text style={{ marginTop: spacing.lg, fontWeight: '700', color: colors.textPrimary }}>
              {stats.seancesSemaine} / {objectif} séances cette semaine
            </Text>
          </View>
        </ScaleInView>

        {/* ============ SANTÉ & FORME ============ */}
        <SlideUpView delay={600}>
          <Text style={styles.sectionTitre}>Santé & Forme</Text>
          <View style={styles.grille}>
            {/* IMC */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>IMC</Text>
              <Text style={styles.statValeur}>{imc}</Text>
              <View style={[styles.badge, { backgroundColor: imcFond }]}>
                <Text style={[styles.badgeTexte, { color: imcCouleur }]}>
                  {imcStatut}
                </Text>
              </View>
            </View>

            {/* Calories */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Calories brûlées</Text>
              <Text style={styles.statValeur}>{calories}</Text>
              <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.badgeTexte, { color: colors.primary }]}>kcal</Text>
              </View>
            </View>
          </View>
        </SlideUpView>

        {/* Stats normales */}
        <SlideUpView delay={650}>
          <View style={styles.grille}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Séances totales</Text>
              <Text style={styles.statValeur}>{stats.nombreSeances}</Text>
              <View style={[styles.badge, { backgroundColor: isDark ? '#14532D' : '#DCFCE7' }]}>
                <Text style={[styles.badgeTexte, { color: isDark ? '#4ADE80' : '#22C55E' }]}>Total</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Minutes totales</Text>
              <Text style={styles.statValeur}>{stats.minutesTotales}</Text>
              <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.badgeTexte, { color: colors.primary }]}>Cumul</Text>
              </View>
            </View>
          </View>
        </SlideUpView>

        <SlideUpView delay={700}>
          <View style={styles.grille}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Cette semaine</Text>
              <Text style={styles.statValeur}>{stats.seancesSemaine}</Text>
              <View style={[styles.badge, { backgroundColor: isDark ? '#78350F' : '#FEF3C7' }]}>
                <Text style={[styles.badgeTexte, { color: isDark ? '#FBBF24' : '#F59E0B' }]}>7 jours</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Minutes / semaine</Text>
              <Text style={styles.statValeur}>{stats.minutesSemaine}</Text>
              <View style={[styles.badge, { backgroundColor: isDark ? '#4C1D95' : '#EDE9FE' }]}>
                <Text style={[styles.badgeTexte, { color: isDark ? '#A78BFA' : '#8B5CF6' }]}>7 jours</Text>
              </View>
            </View>
          </View>
        </SlideUpView>
      </ScrollView>
    </View>
  );
}