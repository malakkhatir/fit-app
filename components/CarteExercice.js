import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/colors';

const ZONE_STYLE = {
  'Abdos':         { icone: 'body',       couleur: '#EF4444',  fondLight: '#FEE2E2', fondDark: '#7F1D1D' },
  'Fessiers':      { icone: 'heart',      couleur: '#F97316',  fondLight: '#FFEDD5', fondDark: '#7C2D12' },
  'Cuisses':       { icone: 'walk',       couleur: '#10B981',  fondLight: '#D1FAE5', fondDark: '#064E3B' },
  'Hanches':       { icone: 'body',       couleur: '#8B5CF6',  fondLight: '#EDE9FE', fondDark: '#4C1D95' },
  'Haut du corps': { icone: 'barbell',    couleur: '#2563EB',  fondLight: '#DBEAFE', fondDark: '#1E3A5F' },
  'Dos':           { icone: 'body',       couleur: '#2563EB',  fondLight: '#DBEAFE', fondDark: '#1E3A5F' },
  'Épaules':       { icone: 'barbell',    couleur: '#F97316',  fondLight: '#FFEDD5', fondDark: '#7C2D12' },
  'Corps entier':  { icone: 'fitness',    couleur: '#2563EB',  fondLight: '#DBEAFE', fondDark: '#1E3A5F' },
};

function stylePour(zone, isDark) {
  const s = ZONE_STYLE[zone] || ZONE_STYLE['Corps entier'];
  return {
    icone: s.icone,
    couleur: s.couleur,
    fond: isDark ? s.fondDark : s.fondLight,
  };
}

function niveauStyle(niveau, isDark) {
  if (niveau === 'Débutant') {
    return { couleur: isDark ? '#4ADE80' : '#22C55E', fond: isDark ? '#14532D' : '#DCFCE7' };
  }
  if (niveau === 'Intermédiaire') {
    return { couleur: isDark ? '#FBBF24' : '#F59E0B', fond: isDark ? '#78350F' : '#FEF3C7' };
  }
  return { couleur: isDark ? '#F87171' : '#EF4444', fond: isDark ? '#7F1D1D' : '#FEE2E2' };
}

export default function CarteExercice({ exercice, onPress, variante = 'ligne' }) {
  const { colors, isDark } = useTheme();
  const [imageError, setImageError] = useState(false);

  const style = stylePour(exercice.zone, isDark);
  const niv = niveauStyle(exercice.niveau, isDark);
  const hasImage = !!exercice.imageUrl;

  const styles = useMemo(() => StyleSheet.create({
    ligne: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.sm,
      marginBottom: spacing.sm,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    imageLigne: { width: 64, height: 64, borderRadius: radius.md, marginRight: spacing.md },
    infosLigne: { flex: 1, paddingRight: spacing.sm },
    nomLigne: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
    detailLigne: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
    niveauBadgeLigne: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.sm },
    niveauBadgeLigneTexte: { fontSize: 10, fontWeight: '700' },

    carteGrille: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.sm,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    imageGrilleContainer: { position: 'relative', marginBottom: spacing.sm },
    imageGrille: { width: '100%', height: 110, borderRadius: radius.md },
    niveauBadge: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
    niveauBadgeTexte: { fontSize: 9, fontWeight: '800' },
    nomGrille: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
    catGrille: { fontSize: 11, color: colors.textSecondary },
  }), [colors]);

  if (variante === 'grille') {
    return (
      <TouchableOpacity style={styles.carteGrille} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.imageGrilleContainer}>
          {hasImage && !imageError ? (
            <Image 
              source={{ uri: exercice.imageUrl }} 
              style={styles.imageGrille} 
              resizeMode="cover" 
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.imageGrille, { backgroundColor: style.fond, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name={style.icone} size={40} color={style.couleur} />
            </View>
          )}
          <View style={[styles.niveauBadge, { backgroundColor: niv.fond }]}>
            <Text style={[styles.niveauBadgeTexte, { color: niv.couleur }]}>
              {exercice.niveau}
            </Text>
          </View>
        </View>
        <Text style={styles.nomGrille} numberOfLines={1}>{exercice.nom}</Text>
        <Text style={styles.catGrille} numberOfLines={1}>{exercice.zone}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.ligne} onPress={onPress} activeOpacity={0.85}>
      {hasImage && !imageError ? (
        <Image 
          source={{ uri: exercice.imageUrl }} 
          style={styles.imageLigne} 
          resizeMode="cover" 
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.imageLigne, { backgroundColor: style.fond, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name={style.icone} size={22} color={style.couleur} />
        </View>
      )}

      <View style={styles.infosLigne}>
        <Text style={styles.nomLigne} numberOfLines={1}>{exercice.nom}</Text>
        <Text style={styles.detailLigne} numberOfLines={1}>
          {exercice.zone} · {exercice.duree} min
        </Text>
        <View style={[styles.niveauBadgeLigne, { backgroundColor: niv.fond }]}>
          <Text style={[styles.niveauBadgeLigneTexte, { color: niv.couleur }]}>
            {exercice.niveau}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
