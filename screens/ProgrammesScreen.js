import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import CarteProgramme from '../components/CarteProgramme';
import { FadeInView, SlideUpView } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

// Hado homa les valeurs li kaynin f l'base de données (b l'français)
const PUBLICS = ['Tous', 'Filles', 'Garçons'];
const NIVEAUX = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];
const OBJECTIFS = ['Tous', 'Fessiers', 'Abdos', 'Cuisses', 'Mobilité', 'Cardio', 'Force', 'Masse'];

export default function ProgrammesScreen({ navigation }) {
  const { programmes, chargement, supprimerProgrammePerso } = useSeances();
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  
  const [niveau, setNiveau] = useState('Tous');
  const [publicFiltre, setPublicFiltre] = useState('Tous');
  const [objectif, setObjectif] = useState('Tous');

  const liste = useMemo(() => {
    return programmes.filter((p) => {
      // Hna kan9arno l'valeur dial l'base de données m3a l'state (li howa b l'français dima)
      const nivOk = niveau === 'Tous' || p.niveau === niveau;
      const pubOk = publicFiltre === 'Tous' || p.public === publicFiltre;
      const objOk = objectif === 'Tous' || p.objectif === objectif;
      return nivOk && pubOk && objOk;
    });
  }, [programmes, niveau, publicFiltre, objectif]);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' },
    titre: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
    compteur: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    boutonAjouter: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    filtreTitre: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: spacing.lg, marginBottom: 6, marginTop: 4 },
    filtresContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm },
    filtre: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    filtreActif: { backgroundColor: colors.primary, borderColor: colors.primary },
    filtreTexte: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    filtreTexteActif: { color: colors.white },
    resultats: { fontSize: 12, color: colors.textMuted, paddingHorizontal: spacing.lg, marginBottom: spacing.sm, fontWeight: '600' },
    liste: { paddingHorizontal: spacing.lg, paddingBottom: 30 },
    videContainer: { alignItems: 'center', paddingVertical: 60 },
    vide: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.md, fontSize: 14, fontWeight: '600' },
    carteWrapper: { position: 'relative' },
    boutonSupprimer: { position: 'absolute', top: 10, right: 10, backgroundColor: colors.dangerLight, padding: 8, borderRadius: 20, zIndex: 10 },
  }), [colors]);

  function confirmerSuppression(programme) {
    Alert.alert('Supprimer le programme', `Bghiti tmse7 "${programme.titre}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { try { await supprimerProgrammePerso(programme.id); } catch (e) { Alert.alert('Erreur', e.message); } } },
    ]);
  }

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FadeInView>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titre}>{t('programs')}</Text>
            <Text style={styles.compteur}>{programmes.length} {t('available')}</Text>
          </View>
          <TouchableOpacity style={styles.boutonAjouter} onPress={() => navigation.navigate('CreateProgramme')} activeOpacity={0.8}>
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </FadeInView>

      <Text style={styles.filtreTitre}>{t('public')}</Text>
      <View style={styles.filtresContainer}>
        {PUBLICS.map((p) => {
          const actif = publicFiltre === p;
          return (
            <TouchableOpacity key={p} style={[styles.filtre, actif && styles.filtreActif]} onPress={() => setPublicFiltre(p)} activeOpacity={0.8}>
              {p === 'Filles' && <Ionicons name="female" size={13} color={actif ? colors.white : colors.textSecondary} />}
              {p === 'Garçons' && <Ionicons name="male" size={13} color={actif ? colors.white : colors.textSecondary} />}
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>{t(p)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filtreTitre}>{t('level')}</Text>
      <View style={styles.filtresContainer}>
        {NIVEAUX.map((n) => {
          const actif = niveau === n;
          return (
            <TouchableOpacity key={n} style={[styles.filtre, actif && styles.filtreActif]} onPress={() => setNiveau(n)} activeOpacity={0.8}>
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>{t(n)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filtreTitre}>{t('objective')}</Text>
      <View style={styles.filtresContainer}>
        {OBJECTIFS.map((o) => {
          const actif = objectif === o;
          return (
            <TouchableOpacity key={o} style={[styles.filtre, actif && styles.filtreActif]} onPress={() => setObjectif(o)} activeOpacity={0.8}>
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>{t(o)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.resultats}>{liste.length} {t('results')}</Text>

      <FlatList
        data={liste}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SlideUpView delay={Math.min(index * 50, 400)}>
            <View style={styles.carteWrapper}>
              <CarteProgramme programme={item} onPress={() => navigation.navigate('DetailProgramme', { programme: item })} />
              {item.isCustom && (
                <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row', gap: 6, zIndex: 10 }}>
                  <TouchableOpacity style={[styles.boutonSupprimer, { backgroundColor: colors.primaryLight, position: 'relative', top: 0, right: 0 }]} onPress={() => navigation.navigate('CreateProgramme', { programme: item })} activeOpacity={0.7}>
                    <Ionicons name="pencil" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.boutonSupprimer, { position: 'relative', top: 0, right: 0 }]} onPress={() => confirmerSuppression(item)} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </SlideUpView>
        )}
        ListEmptyComponent={<View style={styles.videContainer}><Ionicons name="fitness-outline" size={48} color={colors.textMuted} /><Text style={styles.vide}>{chargement ? 'Loading...' : t('noPrograms')}</Text></View>}
      />
    </View>
  );
}
