import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { calculerStatistiques } from '../utils/stats';
import CarteExercice from '../components/CarteExercice';
import { FadeInView, SlideUpView, ScaleInView, AnimatedPressable } from '../components/AnimatedWrapper';
import { radius, spacing, shadow } from '../theme/colors';

export default function AccueilScreen({ navigation }) {
  const { utilisateur } = useAuth();
  const { exercices, seances } = useSeances();
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const objectif = utilisateur?.objectifHebdo ?? 3;
  const stats = calculerStatistiques(seances, objectif);
  const seancesAffichees = Math.min(stats.seancesSemaine, objectif);
  const objectifAtteint = stats.seancesSemaine >= objectif;
  
  const poids = utilisateur?.poids ?? 70;
  const taille = utilisateur?.taille ?? 170;
  const age = utilisateur?.age ?? 25;
  const sexe = utilisateur?.sexe ?? 'Femme';
  const targetWeight = utilisateur?.targetWeight;

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

  const bmr = sexe === 'Homme' 
    ? (10 * poids) + (6.25 * taille) - (5 * age) + 5 
    : (10 * poids) + (6.25 * taille) - (5 * age) - 161;
  const tdee = bmr * 1.375;
  let caloriesMakla = Math.round(tdee);
  let objectifPoidsTexte = t('maintenance');

  if (targetWeight) {
    if (targetWeight < poids) {
      caloriesMakla = Math.round(tdee - 500);
      objectifPoidsTexte = `${t('lose')} ${Math.abs(poids - targetWeight).toFixed(1)} kg`;
    } else if (targetWeight > poids) {
      caloriesMakla = Math.round(tdee + 300);
      objectifPoidsTexte = `${t('gain')} ${Math.abs(targetWeight - poids).toFixed(1)} kg`;
    }
  }

  const populaires = useMemo(() => {
    if (exercices.length === 0) return [];
    const shuffled = [...exercices].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [exercices]);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    contenu: { padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },
    entete: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
    bonjour: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
    sousTitre: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    avatar: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    
    carteObjectif: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.xl, ...shadow.md },
    carteObjectifLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 6 },
    carteObjectifValeur: { color: colors.white, fontSize: 36, fontWeight: '900', lineHeight: 40 },
    carteObjectifTotal: { color: 'rgba(255,255,255,0.6)', fontSize: 22, fontWeight: '700' },
    carteObjectifDetail: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
    cercle: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: colors.white, alignItems: 'center', justifyContent: 'center' },
    cercleTexte: { color: colors.white, fontWeight: '800', fontSize: 15 },
    cercleAtteint: { borderColor: '#FFFFFF', borderTopColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.2)' },

    sectionSante: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
    santeCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', ...shadow.sm },
    santeIcone: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.backgroundAlt, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
    santeValeur: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
    santeLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4, fontWeight: '600', textAlign: 'center' },
    santeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    santeBadgeTexte: { fontSize: 9, fontWeight: '700' },

    grille: { gap: spacing.md, marginBottom: spacing.xl },
    rangee: { flexDirection: 'row', gap: spacing.md },
    carteAction: { flex: 1, padding: spacing.lg, borderRadius: radius.lg, minHeight: 130, ...shadow.sm },
    iconeAction: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
    titreAction: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 2 },
    detailAction: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },

    sectionEntete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    sectionTitre: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
    voirTout: { fontSize: 13, color: colors.primary, fontWeight: '700' },
    grilleExercices: { flexDirection: 'row', gap: spacing.md },
  }), [colors, isDark, imcCouleur, imcFond, objectifAtteint]);

  return (
    <ScrollView style={styles.ecran} contentContainerStyle={styles.contenu} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FadeInView delay={0}>
        <View style={styles.entete}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bonjour}>{t('welcome')}, {utilisateur?.prenom || 'Champion'} !</Text>
            <Text style={styles.sousTitre}>{t('readyToAchieve')}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profil')}>
            {utilisateur?.photoUrl ? (
              <Image source={{ uri: utilisateur.photoUrl }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <Ionicons name="person" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </FadeInView>

      <ScaleInView delay={100}>
        <View style={styles.carteObjectif}>
          <View style={{ flex: 1 }}>
            <Text style={styles.carteObjectifLabel}>
              {objectifAtteint ? t('goalReached') : t('goalWeek')}
            </Text>
            <Text style={styles.carteObjectifValeur}>
              {seancesAffichees} <Text style={styles.carteObjectifTotal}>/ {objectif}</Text>
            </Text>
            <Text style={styles.carteObjectifDetail}>
              {objectifAtteint ? `${t('goalReached')} (${stats.seancesSemaine} ${t('sessionsDone')})` : t('sessionsDone')}
            </Text>
          </View>
          <View style={[styles.cercle, objectifAtteint && styles.cercleAtteint]}>
            <Text style={styles.cercleTexte}>{objectifAtteint ? '100%' : `${Math.round(stats.progression)}%`}</Text>
          </View>
        </View>
      </ScaleInView>

      <SlideUpView delay={150}>
        <View style={styles.sectionSante}>
          <TouchableOpacity style={styles.santeCard} onPress={() => navigation.navigate('Profil')} activeOpacity={0.7}>
            <View style={styles.santeIcone}><Ionicons name="scale-outline" size={18} color={colors.primary} /></View>
            <Text style={styles.santeValeur}>{poids} kg</Text>
            <Text style={styles.santeLabel}>{t('weight')} {targetWeight ? `(${targetWeight} kg)` : ''}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.santeCard} onPress={() => navigation.navigate('Profil')} activeOpacity={0.7}>
            <View style={styles.santeIcone}><Ionicons name="fitness-outline" size={18} color="#F59E0B" /></View>
            <Text style={styles.santeValeur}>{imc}</Text>
            <Text style={styles.santeLabel}>{t('bmi')}</Text>
            <View style={[styles.santeBadge, { backgroundColor: imcFond }]}>
              <Text style={[styles.santeBadgeTexte, { color: imcCouleur }]}>{imcStatut}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.santeCard} onPress={() => navigation.navigate('Profil')} activeOpacity={0.7}>
            <View style={styles.santeIcone}><Ionicons name="restaurant-outline" size={18} color="#8B5CF6" /></View>
            <Text style={styles.santeValeur}>{caloriesMakla}</Text>
            <Text style={styles.santeLabel}>{t('calories')}</Text>
            <View style={[styles.santeBadge, { backgroundColor: colors.purpleLight }]}>
              <Text style={[styles.santeBadgeTexte, { color: colors.purple }]}>{objectifPoidsTexte}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SlideUpView>

      <View style={styles.grille}>
        <View style={styles.rangee}>
          <SlideUpView delay={200} style={{ flex: 1 }}>
            <AnimatedPressable style={[styles.carteAction, { backgroundColor: colors.primaryLight }]} onPress={() => navigation.navigate('Exercices')}>
              <View style={[styles.iconeAction, { backgroundColor: colors.primary }]}><Ionicons name="barbell" size={20} color={colors.white} /></View>
              <Text style={styles.titreAction}>{t('exercises')}</Text>
              <Text style={styles.detailAction}>{t('discoverTrain')}</Text>
            </AnimatedPressable>
          </SlideUpView>
          <SlideUpView delay={300} style={{ flex: 1 }}>
            <AnimatedPressable style={[styles.carteAction, { backgroundColor: colors.orangeLight }]} onPress={() => navigation.navigate('Programmes')}>
              <View style={[styles.iconeAction, { backgroundColor: colors.orange }]}><Ionicons name="list" size={20} color={colors.white} /></View>
              <Text style={styles.titreAction}>{t('programs')}</Text>
              <Text style={styles.detailAction}>{t('plansForYou')}</Text>
            </AnimatedPressable>
          </SlideUpView>
        </View>
        <View style={styles.rangee}>
          <SlideUpView delay={400} style={{ flex: 1 }}>
            <AnimatedPressable style={[styles.carteAction, { backgroundColor: colors.greenLight }]} onPress={() => navigation.navigate('Progression')}>
              <View style={[styles.iconeAction, { backgroundColor: colors.green }]}><Ionicons name="trending-up" size={20} color={colors.white} /></View>
              <Text style={styles.titreAction}>{t('progress')}</Text>
              <Text style={styles.detailAction}>{t('trackResults')}</Text>
            </AnimatedPressable>
          </SlideUpView>
          <SlideUpView delay={500} style={{ flex: 1 }}>
            <AnimatedPressable style={[styles.carteAction, { backgroundColor: colors.purpleLight }]} onPress={() => navigation.navigate('Historique')}>
              <View style={[styles.iconeAction, { backgroundColor: colors.purple }]}><Ionicons name="time" size={20} color={colors.white} /></View>
              <Text style={styles.titreAction}>{t('history')}</Text>
              <Text style={styles.detailAction}>{t('pastSessions')}</Text>
            </AnimatedPressable>
          </SlideUpView>
        </View>
      </View>

      <FadeInView delay={600}>
        <View style={styles.sectionEntete}>
          <Text style={styles.sectionTitre}>{t('popularExercises')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Exercices')}>
            <Text style={styles.voirTout}>{t('seeAll')}</Text>
          </TouchableOpacity>
        </View>
      </FadeInView>

      <View style={styles.grilleExercices}>
        {populaires.map((ex, index) => (
          <SlideUpView key={ex.id} delay={700 + index * 100} style={{ flex: 1 }}>
            <CarteExercice exercice={ex} variante="grille" onPress={() => navigation.navigate('DetailExercice', { exercice: ex })} />
          </SlideUpView>
        ))}
      </View>
    </ScrollView>
  );
} 
