import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import CarteExercice from '../components/CarteExercice';
import { FadeInView, SlideUpView } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

const CATEGORIES = ['Tous', 'Cardio', 'Renforcement', 'Mobilité'];
const ZONES = ['Toutes', 'Abdos', 'Fessiers', 'Cuisses', 'Hanches', 'Haut du corps', 'Dos'];
const NIVEAUX = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

export default function ExercicesScreen({ navigation }) {
  const { exercices, favoris, chargement, erreur } = useSeances();
  const { colors, isDark } = useTheme();
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('Tous');
  const [zone, setZone] = useState('Toutes');
  const [niveau, setNiveau] = useState('Tous');
  const [voirFavoris, setVoirFavoris] = useState(false);

  useEffect(() => {
    console.log('=== [ExercicesScreen] ===');
    console.log('nombre exercices:', exercices.length);
    console.log('favoris:', favoris.length);
  }, [exercices, favoris]);

  const listeFiltree = useMemo(() => {
    return exercices.filter((ex) => {
      const nomOk = ex.nom.toLowerCase().includes(recherche.trim().toLowerCase());
      const catOk = categorie === 'Tous' || ex.categorie === categorie;
      const zoneOk = zone === 'Toutes' || ex.zone === zone;
      const nivOk = niveau === 'Tous' || ex.niveau === niveau;
      const favOk = !voirFavoris || favoris.includes(Number(ex.id));
      return nomOk && catOk && zoneOk && nivOk && favOk;
    });
  }, [exercices, recherche, categorie, zone, niveau, voirFavoris, favoris]);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: 60,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
    },
    titre: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
    compteur: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    champRecherche: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputRecherche: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: spacing.sm,
      color: colors.textPrimary,
      fontSize: 14,
    },
    boutonFavoris: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.round,
      alignSelf: 'flex-start',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
    },
    filtreTitre: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: spacing.lg,
      marginBottom: 6,
      marginTop: 4,
    },
    filtresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    filtre: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.round,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filtreActif: { backgroundColor: colors.primary, borderColor: colors.primary },
    filtreTexte: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    filtreTexteActif: { color: colors.white },
    resultats: {
      fontSize: 12,
      color: colors.textMuted,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      fontWeight: '600',
    },
    liste: { paddingHorizontal: spacing.lg, paddingBottom: 30 },
    vide: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: spacing.xl,
    },
    videTexte: {
      color: colors.textSecondary,
      marginTop: spacing.md,
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '600',
    },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FadeInView>
        <View style={styles.header}>
          <Text style={styles.titre}>Exercices</Text>
          <Text style={styles.compteur}>
            {exercices.length} exercice{exercices.length > 1 ? 's' : ''} disponible
            {exercices.length > 1 ? 's' : ''}
          </Text>
        </View>
      </FadeInView>

      {/* Recherche */}
      <View style={styles.champRecherche}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.inputRecherche}
          placeholder="Rechercher un exercice..."
          placeholderTextColor={colors.textMuted}
          value={recherche}
          onChangeText={setRecherche}
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => setRecherche('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Bouton Favoris */}
      <TouchableOpacity
        style={[
          styles.boutonFavoris,
          {
            backgroundColor: voirFavoris ? colors.danger : colors.card,
            borderColor: voirFavoris ? colors.danger : colors.border,
          },
        ]}
        onPress={() => setVoirFavoris((v) => !v)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={voirFavoris ? 'heart' : 'heart-outline'}
          size={16}
          color={voirFavoris ? '#FFFFFF' : colors.textSecondary}
        />
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: voirFavoris ? '#FFFFFF' : colors.textSecondary,
          }}
        >
          Favoris ({favoris.length})
        </Text>
      </TouchableOpacity>

      {/* Filtres Catégorie */}
      <Text style={styles.filtreTitre}>Catégorie</Text>
      <View style={styles.filtresContainer}>
        {CATEGORIES.map((cat) => {
          const actif = categorie === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filtre, actif && styles.filtreActif]}
              onPress={() => setCategorie(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filtres Zone */}
      <Text style={styles.filtreTitre}>Zone du corps</Text>
      <View style={styles.filtresContainer}>
        {ZONES.map((z) => {
          const actif = zone === z;
          return (
            <TouchableOpacity
              key={z}
              style={[styles.filtre, actif && styles.filtreActif]}
              onPress={() => setZone(z)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filtreTexte, actif && styles.filtreTexteActif]}>
                {z}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filtres Niveau */}
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

      <Text style={styles.resultats}>
        {listeFiltree.length} résultat{listeFiltree.length > 1 ? 's' : ''}
      </Text>

      <FlatList
        data={listeFiltree}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SlideUpView delay={Math.min(index * 40, 400)}>
            <CarteExercice
              exercice={item}
              onPress={() => navigation.navigate('DetailExercice', { exercice: item })}
            />
          </SlideUpView>
        )}
        ListEmptyComponent={
          <View style={styles.vide}>
            {chargement ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.videTexte}>Chargement...</Text>
              </>
            ) : erreur ? (
              <>
                <Ionicons name="alert-circle" size={48} color={colors.danger} />
                <Text style={[styles.videTexte, { color: colors.danger }]}>
                  ❌ {erreur}
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name={voirFavoris ? 'heart-outline' : 'search-outline'}
                  size={48}
                  color={colors.textMuted}
                />
                <Text style={styles.videTexte}>
                  {voirFavoris ? 'Aucun favori pour le moment.' : 'Aucun exercice trouvé.'}
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}