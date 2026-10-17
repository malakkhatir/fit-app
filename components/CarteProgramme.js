import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/colors';

export default function CarteProgramme({ programme, onPress }) {
  const { colors, isDark } = useTheme();
  const hasImage = !!programme.imageUrl;
  const nombreEx = programme.exercicesIds?.length ?? 0;

  const niveauStyle = (niveau) => {
    if (niveau === 'Débutant') {
      return {
        couleur: isDark ? '#4ADE80' : '#22C55E',
        fond: isDark ? '#14532D' : '#DCFCE7',
      };
    }
    if (niveau === 'Intermédiaire') {
      return {
        couleur: isDark ? '#FBBF24' : '#F59E0B',
        fond: isDark ? '#78350F' : '#FEF3C7',
      };
    }
    return {
      couleur: isDark ? '#F87171' : '#EF4444',
      fond: isDark ? '#7F1D1D' : '#FEE2E2',
    };
  };

  const niv = niveauStyle(programme.niveau);

  const styles = useMemo(() => StyleSheet.create({
    carte: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.sm,
      marginBottom: spacing.md,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    imageContainer: { position: 'relative', marginRight: spacing.md },
    image: { width: 90, height: 90, borderRadius: radius.md },
    badgeNiveau: {
      position: 'absolute',
      bottom: 4,
      left: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    badgeNiveauTexte: { fontSize: 9, fontWeight: '800' },
    
    // 🆕 Badge "Personnalisé"
    badgePerso: {
      position: 'absolute',
      top: 4,
      left: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: '#F59E0B',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    badgePersoTexte: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },

    infos: { flex: 1, paddingRight: spacing.sm },
    titre: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    detail: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
    description: { fontSize: 11, color: colors.textMuted, lineHeight: 15 },
  }), [colors, isDark]);

  return (
    <TouchableOpacity style={styles.carte} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        {hasImage ? (
          <Image source={{ uri: programme.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="barbell" size={30} color={colors.primary} />
          </View>
        )}

        {/* 🆕 Badge "Perso" */}
        {programme.isCustom && (
          <View style={styles.badgePerso}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
            <Text style={styles.badgePersoTexte}>Perso</Text>
          </View>
        )}

        <View style={[styles.badgeNiveau, { backgroundColor: niv.fond }]}>
          <Text style={[styles.badgeNiveauTexte, { color: niv.couleur }]}>
            {programme.niveau}
          </Text>
        </View>
      </View>

      <View style={styles.infos}>
        <Text style={styles.titre} numberOfLines={1}>{programme.titre}</Text>
        <Text style={styles.detail} numberOfLines={1}>
          {nombreEx} séances · {programme.duree} min
        </Text>
        {programme.description ? (
          <Text style={styles.description} numberOfLines={2}>{programme.description}</Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
