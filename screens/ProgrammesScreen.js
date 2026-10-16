import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import CarteProgramme from '../components/CarteProgramme';
import { FadeInView, SlideUpView } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

const NIVEAUX = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];
const PUBLICS = ['Tous', 'Filles', 'Garçons'];
const OBJECTIFS = ['Tous', 'Fessiers', 'Abdos', 'Cuisses', 'Mobilité', 'Cardio', 'Force', 'Masse'];

export default function ProgrammesScreen({ navigation }) {
  const { programmes, chargement } = useSeances();
  const { colors, isDark } = useTheme();
  const [niveau, setNiveau] = useState('Tous');
  const [publicFiltre, setPublicFiltre] = useState('Tous');
  const [objectif, setObjectif] = useState('Tous');

  useEffect(() => {
    console.log('=== [ProgrammesScreen] ===');
    console.log('nombre programmes:', programmes.length);
  }, [programmes]);

  const liste = useMemo(() => {
    return programmes.filter((p) => {
      const nivOk = niveau === 'Tous' || p.niveau === niveau;
      const pubOk = publicFiltre === 'Tous' || p.public === publicFiltre;
      const objOk = objectif === 'Tous' || p.objectif === objectif;
      return nivOk && pubOk && objOk;
    });
  }, [programmes, niveau, publicFiltre, objectif]);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm,
    },
    titre: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
    compteur: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    filtreTitre: {
      fontSize: 11, fontWeight: '700', color: colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.5,
      paddingHorizontal: spacing.lg, marginBottom: 6, marginTop: 4,
    },
    filtresContainer: {
      flexDirection: 'row', flexWrap: 'wrap',
      paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm,
    },
    filtre: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: radius.round, backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
    },
    filtreActif: { backgroundColor: colors.primary, borderColor: colors.primary },
    filtreTexte: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    filtreTexteActif: { color: colors.white },
    resultats: {
      fontSize: 12, color: colors.textMuted,
      paddingHorizontal: spacing.lg, marginBottom: spacing.sm, fontWeight: '600',
    },
    liste: { paddingHorizontal: spacing.lg, paddingBottom: 30 },
    videContainer: { alignItems: 'center', paddingVertical: 60 },
    vide: {
      textAlign: 'center', color: colors.textSecondary,
      marginTop: spacing.md, fontSize: 14, fontWeight: '600',
    },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FadeInView>
        <View style={styles.header}>
          <Text style={styles.titre}>Programmes</Text>
          <Text style={styles.compteur}>
            {programmes.length} programme{programmes.length > 1 ? 's' : ''} disponible
            {programmes.length > 1 ? 's' : ''}
          </Text>
        </View>
      </FadeInView>

      <Text style={styles.filtreTitre}>Public</Text>
      <View style={styles.filtresContainer}>
        {PUBLICS.map((p) => {
          const actif = publicFiltre === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.filtre, actif && styles.filtreActif]}
              onPress={() => setPublicFiltre(p)}
              activeOpacity={0.8}
            >
              {p === 'Filles' && (
                <Ionicons name="female" size={13} color={actif ? colors.white : colors.textSecondary} />
              )}
              {p === 'Garçons' && (
                <Ionicons name="male" size={13} color={actif ? colors.white : colors.textSecondary} />
              )}
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>
                {p}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filtreTitre}>Niveau</Text>
      <View style={styles.filtresContainer}>
        {NIVEAUX.map((n) => {
          const actif = niveau === n;
          return (
            <TouchableOpacity
              key={n}
              style={[styles.filtre, actif && styles.filtreActif]}
              onPress={() => setNiveau(n)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filtreTitre}>Objectif</Text>
      <View style={styles.filtresContainer}>
        {OBJECTIFS.map((o) => {
          const actif = objectif === o;
          return (
            <TouchableOpacity
              key={o}
              style={[styles.filtre, actif && styles.filtreActif]}
              onPress={() => setObjectif(o)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>
                {o}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.resultats}>
        {liste.length} résultat{liste.length > 1 ? 's' : ''}
      </Text>

      <FlatList
        data={liste}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SlideUpView delay={Math.min(index * 50, 400)}>
            <CarteProgramme
              programme={item}
              onPress={() => navigation.navigate('DetailProgramme', { programme: item })}
            />
          </SlideUpView>
        )}
        ListEmptyComponent={
          <View style={styles.videContainer}>
            <Ionicons name="fitness-outline" size={48} color={colors.textMuted} />
            <Text style={styles.vide}>
              {chargement ? 'Chargement...' : 'Aucun programme trouvé.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};