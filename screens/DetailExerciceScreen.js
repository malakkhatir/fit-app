import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Image, Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/colors';
import CircularProgress from '../components/CircularProgress';
import { SlideUpView, ScaleInView } from '../components/AnimatedWrapper';

const INSTRUCTIONS_PAR_CATEGORIE = {
  Cardio: [
    'Échauffe-toi 2 minutes à allure modérée.',
    'Maintiens un rythme régulier et confortable.',
    'Respire profondément et reste relâché.',
    'Termine par 2 minutes de récupération.',
  ],
  Renforcement: [
    'Place ton corps dans une position stable.',
    'Garde le dos droit et les abdos serrés.',
    'Descends lentement, remonte en contractant.',
    'Respire en rythme, sans bloquer.',
  ],
  Mobilité: [
    'Installe-toi dans une position confortable.',
    'Bouge doucement, sans forcer.',
    'Maintiens chaque posture 20 à 30 secondes.',
    'Respire calmement et relâche les tensions.',
  ],
};

export default function DetailExerciceScreen({ route, navigation }) {
  const { exercice } = route.params;
  const { colors, isDark } = useTheme();
  const [favori, setFavori] = useState(false);
  const [secondes, setSecondes] = useState(exercice.duree * 60);
  const [enCours, setEnCours] = useState(false);
  const [dureeInitiale, setDureeInitiale] = useState(exercice.duree * 60);
  const [vibrationActive, setVibrationActive] = useState(true);
  const [sonActive, setSonActive] = useState(true);

  const player = useAudioPlayer(
    { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' }
  );

  const instructions =
    exercice.instructions && exercice.instructions.length > 0
      ? exercice.instructions
      : INSTRUCTIONS_PAR_CATEGORIE[exercice.categorie] ||
        INSTRUCTIONS_PAR_CATEGORIE.Renforcement;

  async function jouerSon() {
    if (!sonActive || !player) return;
    try {
      player.seekTo(0);
      player.play();
    } catch (e) {
      console.log('Erreur lecture son', e);
    }
  }

  useEffect(() => {
    if (!enCours) return undefined;
    const id = setInterval(() => {
      setSecondes((s) => {
        if (s <= 1) {
          jouerSon();
          if (vibrationActive) Vibration.vibrate([0, 500, 200, 500, 200, 500]);
          return 0;
        }
        if (s <= 4 && s > 1 && vibrationActive) Vibration.vibrate(80);
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [enCours, vibrationActive, sonActive]);

  useEffect(() => {
    if (secondes === 0) setEnCours(false);
  }, [secondes]);

  function formatTemps(t) {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function demarrer() {
    if (secondes === 0) setSecondes(dureeInitiale);
    setEnCours((v) => !v);
  }

  function reset() {
    setEnCours(false);
    setSecondes(exercice.duree * 60);
    setDureeInitiale(exercice.duree * 60);
  }

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    imageContainer: {
      height: 300, position: 'relative',
      backgroundColor: colors.navy, overflow: 'hidden',
    },
    imageBg: { width: '100%', height: '100%' },
    imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    boutonRond: {
      position: 'absolute', top: 50,
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 10,
    },
    categorieBadge: {
      position: 'absolute', bottom: 20, left: 20,
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: 'rgba(37, 99, 235, 0.9)',
      paddingHorizontal: spacing.md, paddingVertical: 6,
      borderRadius: radius.round,
    },
    categorieBadgeTexte: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    contenu: {
      padding: spacing.lg, marginTop: -spacing.xl,
      backgroundColor: colors.background,
      borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
      paddingBottom: spacing.xxl,
    },
    titre: {
      fontSize: 26, fontWeight: '900',
      color: colors.textPrimary, marginBottom: spacing.md,
    },
    badges: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
    badge: {
      paddingHorizontal: spacing.md, paddingVertical: 6,
      borderRadius: radius.round,
    },
    badgeTexte: { fontSize: 12, fontWeight: '700' },
    statsRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderRadius: radius.lg,
      padding: spacing.md, marginBottom: spacing.lg,
    },
    statItem: {
      flex: 1, flexDirection: 'row',
      alignItems: 'center', justifyContent: 'center', gap: 6,
    },
    statSeparateur: { width: 1, height: 24, backgroundColor: colors.border },
    statValeur: { color: colors.textPrimary, fontWeight: '700', fontSize: 13 },
    section: {
      fontSize: 17, fontWeight: '800', color: colors.textPrimary,
      marginTop: spacing.md, marginBottom: spacing.sm,
    },
    texte: { color: colors.textSecondary, lineHeight: 22, fontSize: 14 },
    etape: {
      flexDirection: 'row', alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    numero: {
      width: 26, height: 26, borderRadius: 13,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
      marginRight: spacing.md, marginTop: 2,
    },
    numeroTexte: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
    etapeTexte: {
      flex: 1, color: colors.textSecondary,
      lineHeight: 22, fontSize: 14,
    },
    minuteur: {
      alignItems: 'center', marginTop: spacing.xxl,
      backgroundColor: colors.card, padding: spacing.xl,
      borderRadius: radius.lg,
    },
    minuteurHeader: {
      flexDirection: 'row', width: '100%',
      justifyContent: 'space-between', alignItems: 'center',
      marginBottom: spacing.md,
    },
    minuteurLabel: {
      fontSize: 13, color: colors.textMuted, fontWeight: '700',
      letterSpacing: 1, textTransform: 'uppercase',
    },
    minuteurHeaderButtons: { flexDirection: 'row', gap: 8 },
    iconeButton: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.backgroundAlt,
      alignItems: 'center', justifyContent: 'center',
    },
    minuteurTemps: {
      fontSize: 42, fontWeight: '900',
      color: colors.textPrimary, fontVariant: ['tabular-nums'],
    },
    minuteurStatus: {
      fontSize: 12, color: colors.textMuted,
      marginTop: 4, fontWeight: '600',
    },
    presets: {
      flexDirection: 'row', gap: 8,
      marginTop: spacing.lg, marginBottom: spacing.lg,
      flexWrap: 'wrap', justifyContent: 'center',
    },
    presetButton: {
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: radius.round, backgroundColor: colors.backgroundAlt,
      borderWidth: 1, borderColor: colors.border,
    },
    presetTexte: {
      fontSize: 12, fontWeight: '700', color: colors.textSecondary,
    },
    minuteurActions: {
      flexDirection: 'row', alignItems: 'center',
      gap: spacing.md, width: '100%',
    },
    boutonReset: {
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: colors.backgroundAlt,
      alignItems: 'center', justifyContent: 'center',
    },
    boutonMinuteur: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', gap: spacing.sm,
      backgroundColor: colors.primary,
      paddingVertical: 18, borderRadius: radius.md,
    },
    boutonMinuteurPause: { backgroundColor: colors.warning },
    boutonMinuteurTexte: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {exercice.imageUrl ? (
            <Image source={{ uri: exercice.imageUrl }} style={styles.imageBg} resizeMode="cover" />
          ) : (
            <View style={[styles.imageBg, styles.imagePlaceholder]}>
              <Ionicons name="barbell" size={80} color="rgba(255,255,255,0.4)" />
            </View>
          )}
          <View style={styles.imageOverlay} />

          <TouchableOpacity
            style={[styles.boutonRond, { left: 20 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boutonRond, { right: 20 }]}
            onPress={() => setFavori((f) => !f)}
          >
            <Ionicons
              name={favori ? 'heart' : 'heart-outline'}
              size={22}
              color={favori ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>

          <View style={styles.categorieBadge}>
            <Ionicons name="fitness" size={14} color="#FFFFFF" />
            <Text style={styles.categorieBadgeTexte}>{exercice.categorie}</Text>
          </View>
        </View>

        <View style={styles.contenu}>
          <SlideUpView delay={0}>
            <Text style={styles.titre}>{exercice.nom}</Text>
          </SlideUpView>

          <SlideUpView delay={80}>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.badgeTexte, { color: colors.primary }]}>
                  {exercice.categorie}
                </Text>
              </View>
              <View style={[styles.badge, {
                backgroundColor:
                  exercice.niveau === 'Débutant' ? (isDark ? '#14532D' : '#DCFCE7') :
                  exercice.niveau === 'Intermédiaire' ? (isDark ? '#78350F' : '#FEF3C7') :
                  (isDark ? '#7F1D1D' : '#FEE2E2'),
              }]}>
                <Text style={[styles.badgeTexte, {
                  color:
                    exercice.niveau === 'Débutant' ? (isDark ? '#4ADE80' : '#22C55E') :
                    exercice.niveau === 'Intermédiaire' ? (isDark ? '#FBBF24' : '#F59E0B') :
                    (isDark ? '#F87171' : '#EF4444'),
                }]}>
                  {exercice.niveau}
                </Text>
              </View>
            </View>
          </SlideUpView>

          <SlideUpView delay={150}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <Text style={styles.statValeur}>{exercice.duree} min</Text>
              </View>
              <View style={styles.statSeparateur} />
              <View style={styles.statItem}>
                <Ionicons name="repeat-outline" size={20} color={colors.primary} />
                <Text style={styles.statValeur}>{exercice.repetitions}</Text>
              </View>
            </View>
          </SlideUpView>

          <SlideUpView delay={220}>
            <Text style={styles.section}>Description</Text>
            <Text style={styles.texte}>{exercice.description}</Text>
          </SlideUpView>

          <SlideUpView delay={300}>
            <Text style={styles.section}>Instructions</Text>
            {instructions.map((etape, i) => (
              <View key={i} style={styles.etape}>
                <View style={styles.numero}>
                  <Text style={styles.numeroTexte}>{i + 1}</Text>
                </View>
                <Text style={styles.etapeTexte}>{etape}</Text>
              </View>
            ))}
          </SlideUpView>

          <ScaleInView delay={400}>
            <View style={styles.minuteur}>
              <View style={styles.minuteurHeader}>
                <Text style={styles.minuteurLabel}>Minuteur</Text>
                <View style={styles.minuteurHeaderButtons}>
                  <TouchableOpacity
                    style={styles.iconeButton}
                    onPress={() => setSonActive((s) => !s)}
                  >
                    <Ionicons
                      name={sonActive ? 'volume-high' : 'volume-mute'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconeButton}
                    onPress={() => setVibrationActive((v) => !v)}
                  >
                    <Ionicons
                      name={vibrationActive ? 'phone-portrait' : 'phone-portrait-outline'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <CircularProgress
                taille={220} epaisseur={16}
                valeur={dureeInitiale - secondes} max={dureeInitiale}
                couleur={enCours ? colors.primary : colors.textMuted}
                couleurFond={colors.primaryLight}
              >
                <Text style={styles.minuteurTemps}>{formatTemps(secondes)}</Text>
                <Text style={styles.minuteurStatus}>
                  {enCours ? 'En cours...' : secondes === 0 ? 'Terminé !' : 'Prêt'}
                </Text>
              </CircularProgress>

              <View style={styles.presets}>
                {[30, 60, 120, 300].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={styles.presetButton}
                    onPress={() => {
                      setEnCours(false);
                      setSecondes(d);
                      setDureeInitiale(d);
                    }}
                  >
                    <Text style={styles.presetTexte}>
                      {d < 60 ? `${d}s` : `${d / 60}min`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.minuteurActions}>
                <TouchableOpacity style={styles.boutonReset} onPress={reset}>
                  <Ionicons name="refresh" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.boutonMinuteur, enCours && styles.boutonMinuteurPause]}
                  onPress={demarrer}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={enCours ? 'pause' : 'play'}
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text style={styles.boutonMinuteurTexte}>
                    {enCours ? 'Pause' : secondes === 0 ? 'Recommencer' : 'Démarrer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScaleInView>
        </View>
      </ScrollView>
    </View>
  );
}