import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideUpView, ScaleInView } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

export default function DetailProgrammeScreen({ route, navigation }) {
  const { programme } = route.params;
  const { exercices, progressions, marquerSessionTerminee, terminerSeance } = useSeances();
  const { colors, isDark } = useTheme();
  const [enregistrement, setEnregistrement] = useState(false);

  const listeExercices = programme.exercicesIds
    .map((id) => exercices.find((e) => String(e.id) === String(id)))
    .filter(Boolean);

  const sessionsTerminees = progressions?.[programme.id] || [];
  const nombreTotal = listeExercices.length;
  const nombreTermines = sessionsTerminees.length;
  const indexActuel = sessionsTerminees.length;
  const progression = nombreTotal > 0 ? (nombreTermines / nombreTotal) * 100 : 0;

  async function handleTerminerSession(index) {
    setEnregistrement(true);
    try {
      await marquerSessionTerminee(programme.id, index);
      await terminerSeance({
        id: programme.id,
        titre: `${programme.titre} - Séance ${index + 1}`,
        duree: listeExercices[index]?.duree || programme.duree,
      });
      Alert.alert(
        'Bravo ! 🎉',
        `Séance ${index + 1} terminée ! ${
          index + 1 < nombreTotal
            ? 'La séance suivante est débloquée.'
            : 'Tu as terminé tout le programme !'
        }`
      );
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setEnregistrement(false);
    }
  }

  function handleCommencer(index) {
    const ex = listeExercices[index];
    if (!ex) return;
    navigation.navigate('DetailExercice', {
      exercice: ex,
      session: { index, programme },
    });
  }

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    headerContainer: {
      height: 260, position: 'relative',
      backgroundColor: colors.navy, overflow: 'hidden',
    },
    headerBg: { width: '100%', height: '100%' },
    headerPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    headerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    boutonRond: {
      position: 'absolute', top: 50,
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
    },
    niveauBadge: {
      position: 'absolute', top: 50, right: 20,
      paddingHorizontal: spacing.md, paddingVertical: 6,
      borderRadius: radius.round,
    },
    niveauBadgeTexte: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
    headerTitreContainer: {
      position: 'absolute', bottom: 30, left: 20, right: 20,
    },
    headerTitre: {
      fontSize: 30, fontWeight: '900', color: '#FFFFFF',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    contenu: {
      padding: spacing.lg, marginTop: -spacing.xl,
      backgroundColor: colors.background,
      borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
      paddingBottom: 40,
    },
    infos: {
      flexDirection: 'row', gap: spacing.lg,
      marginBottom: spacing.lg, marginTop: spacing.sm,
    },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoTexte: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
    descriptionBox: {
      backgroundColor: colors.card, borderRadius: radius.lg,
      padding: spacing.lg, marginBottom: spacing.lg,
    },
    descriptionTitre: {
      fontWeight: '800', color: colors.textPrimary,
      marginBottom: 6, fontSize: 14,
    },
    descriptionTexte: {
      color: colors.textSecondary, lineHeight: 20, fontSize: 13,
    },
    progressBox: {
      backgroundColor: colors.card, borderRadius: radius.lg,
      padding: spacing.lg, marginBottom: spacing.lg,
    },
    progressHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: spacing.sm,
    },
    progressHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    progressLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
    progressValue: { color: colors.primary, fontSize: 15, fontWeight: '800' },
    progressBarFond: {
      height: 10, backgroundColor: colors.primaryLight,
      borderRadius: radius.round, overflow: 'hidden',
    },
    progressBarRemplissage: {
      height: '100%', backgroundColor: colors.primary,
      borderRadius: radius.round,
    },
    progressPourcentage: {
      marginTop: spacing.sm, textAlign: 'right',
      color: colors.primary, fontSize: 12, fontWeight: '700',
    },
    section: {
      fontSize: 17, fontWeight: '800', color: colors.textPrimary,
      marginBottom: spacing.md, marginTop: spacing.sm,
    },
    seanceCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderRadius: radius.lg,
      padding: spacing.md, marginBottom: spacing.sm,
    },
    seanceTerminee: {
      backgroundColor: isDark ? '#14532D' : '#DCFCE7',
      opacity: 0.85,
    },
    seanceActuelle: { borderWidth: 2, borderColor: colors.primary },
    seanceBloquee: { opacity: 0.55 },
    seanceImage: {
      width: 56, height: 56, borderRadius: radius.md,
      marginRight: spacing.md,
    },
    seanceImagePlaceholder: {
      backgroundColor: colors.primaryLight,
      alignItems: 'center', justifyContent: 'center',
    },
    seanceInfos: { flex: 1 },
    seanceHeader: {
      flexDirection: 'row', alignItems: 'center',
      marginBottom: 4, gap: 8,
    },
    seanceNumero: {
      width: 24, height: 24, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
    },
    seanceNumeroTexte: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
    seanceTitre: {
      flex: 1, fontWeight: '700',
      color: colors.textPrimary, fontSize: 14,
    },
    seanceDetail: {
      color: colors.textSecondary, fontSize: 12, marginLeft: 32,
    },
    seanceBloqueTexte: {
      color: colors.textMuted, fontSize: 11,
      marginTop: 4, marginLeft: 32, fontStyle: 'italic',
    },
    actionsSeance: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    boutonPlay: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    boutonCheck: {
      width: 44, height: 44,
      alignItems: 'center', justifyContent: 'center',
    },
    felicitation: {
      alignItems: 'center', padding: spacing.xl,
      backgroundColor: isDark ? '#78350F' : '#FEF3C7',
      borderRadius: radius.lg, marginTop: spacing.lg,
    },
    felicitationTitre: {
      fontSize: 20, fontWeight: '900',
      color: colors.textPrimary, marginTop: spacing.md,
    },
    felicitationTexte: {
      color: colors.textSecondary, textAlign: 'center',
      marginTop: 8, fontSize: 14, lineHeight: 20,
    },
  }), [colors, isDark]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {programme.imageUrl ? (
            <Image source={{ uri: programme.imageUrl }} style={styles.headerBg} resizeMode="cover" />
          ) : (
            <View style={[styles.headerBg, styles.headerPlaceholder]}>
              <Ionicons name={programme.icone || 'barbell'} size={70} color="rgba(255,255,255,0.4)" />
            </View>
          )}
          <View style={styles.headerOverlay} />

          <TouchableOpacity
            style={[styles.boutonRond, { left: 20 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View
            style={[
              styles.niveauBadge,
              {
                backgroundColor:
                  programme.niveau === 'Débutant' ? '#22C55E' :
                  programme.niveau === 'Intermédiaire' ? '#F59E0B' : '#EF4444',
              },
            ]}
          >
            <Text style={styles.niveauBadgeTexte}>{programme.niveau}</Text>
          </View>

          <View style={styles.headerTitreContainer}>
            <Text style={styles.headerTitre}>{programme.titre}</Text>
          </View>
        </View>

        <View style={styles.contenu}>
          <SlideUpView delay={100}>
            <View style={styles.infos}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <Text style={styles.infoTexte}>{programme.duree} min / séance</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="fitness-outline" size={18} color={colors.primary} />
                <Text style={styles.infoTexte}>{nombreTotal} séances</Text>
              </View>
            </View>
          </SlideUpView>

          {programme.description ? (
            <SlideUpView delay={150}>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitre}>Description</Text>
                <Text style={styles.descriptionTexte}>{programme.description}</Text>
              </View>
            </SlideUpView>
          ) : null}

          <SlideUpView delay={200}>
            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <View style={styles.progressHeaderLeft}>
                  <Ionicons name="trending-up" size={18} color={colors.primary} />
                  <Text style={styles.progressLabel}>Ta progression</Text>
                </View>
                <Text style={styles.progressValue}>
                  {nombreTermines} / {nombreTotal}
                </Text>
              </View>
              <View style={styles.progressBarFond}>
                <View style={[styles.progressBarRemplissage, { width: `${progression}%` }]} />
              </View>
              <Text style={styles.progressPourcentage}>
                {Math.round(progression)}% complété
              </Text>
            </View>
          </SlideUpView>

          <Text style={styles.section}>Séances du programme</Text>

          {listeExercices.map((ex, i) => {
            const estTermine = sessionsTerminees.includes(i);
            const estActuel = i === indexActuel && !estTermine;
            const estBloque = i > indexActuel && !estTermine;

            return (
              <SlideUpView key={ex.id} delay={Math.min(i * 80, 500)}>
                <View
                  style={[
                    styles.seanceCard,
                    estTermine && styles.seanceTerminee,
                    estActuel && styles.seanceActuelle,
                    estBloque && styles.seanceBloquee,
                  ]}
                >
                  {ex.imageUrl ? (
                    <Image source={{ uri: ex.imageUrl }} style={styles.seanceImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.seanceImage, styles.seanceImagePlaceholder]}>
                      <Ionicons name="barbell" size={20} color={colors.primary} />
                    </View>
                  )}

                  <View style={styles.seanceInfos}>
                    <View style={styles.seanceHeader}>
                      <View
                        style={[
                          styles.seanceNumero,
                          estTermine && { backgroundColor: '#22C55E' },
                          estActuel && { backgroundColor: colors.primary },
                          estBloque && { backgroundColor: colors.textMuted },
                        ]}
                      >
                        {estTermine ? (
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        ) : estBloque ? (
                          <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
                        ) : (
                          <Text style={styles.seanceNumeroTexte}>{i + 1}</Text>
                        )}
                      </View>

                      <Text
                        style={[styles.seanceTitre, estBloque && { color: colors.textMuted }]}
                        numberOfLines={1}
                      >
                        Séance {i + 1} : {ex.nom}
                      </Text>
                    </View>

                    <Text style={styles.seanceDetail}>
                      {ex.duree} min · {ex.repetitions}
                    </Text>

                    {estBloque && (
                      <Text style={styles.seanceBloqueTexte}>
                        🔒 Termine la séance précédente pour débloquer
                      </Text>
                    )}
                  </View>

                  {estActuel && (
                    <View style={styles.actionsSeance}>
                      <TouchableOpacity style={styles.boutonPlay} onPress={() => handleCommencer(i)}>
                        <Ionicons name="play" size={16} color="#FFFFFF" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.boutonCheck}
                        onPress={() => handleTerminerSession(i)}
                        disabled={enregistrement}
                      >
                        {enregistrement ? (
                          <ActivityIndicator size="small" color="#22C55E" />
                        ) : (
                          <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </SlideUpView>
            );
          })}

          {nombreTotal > 0 && nombreTermines === nombreTotal && (
            <ScaleInView delay={200}>
              <View style={styles.felicitation}>
                <Ionicons name="trophy" size={56} color="#F59E0B" />
                <Text style={styles.felicitationTitre}>Programme terminé !</Text>
                <Text style={styles.felicitationTexte}>
                  Tu as complété les {nombreTotal} séances. Bravo champion ! 💪
                </Text>
              </View>
            </ScaleInView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}