import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/colors';

export default function CarteBadge({ badge }) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    carte: {
      alignItems: 'center',
      width: 100,
      marginRight: spacing.md,
    },
    iconeBox: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
      marginBottom: 8,
      position: 'relative',
    },
    iconeBoxDebloque: {
      borderColor: '#F59E0B',
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    nom: {
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
    },
    nomDebloque: { color: colors.textPrimary },
    nomBloque: { color: colors.textMuted },
    lock: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 2,
    },
    miniProgression: {
      width: '100%',
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      overflow: 'hidden',
      marginTop: 6,
    },
    miniProgressionFill: {
      height: '100%',
      borderRadius: 2,
    },
  }), [colors]);

  const debloque = badge.debloque;

  return (
    <View style={styles.carte}>
      <View
        style={[
          styles.iconeBox,
          debloque && styles.iconeBoxDebloque,
          {
            backgroundColor: debloque
              ? `${badge.couleur}20`
              : colors.backgroundAlt,
          },
        ]}
      >
        <Ionicons
          name={badge.icone}
          size={32}
          color={debloque ? badge.couleur : colors.textMuted}
        />
        {!debloque && (
          <View style={styles.lock}>
            <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
          </View>
        )}
      </View>

      <Text
        style={[
          styles.nom,
          debloque ? styles.nomDebloque : styles.nomBloque,
        ]}
        numberOfLines={2}
      >
        {badge.nom}
      </Text>

      {!debloque && (
        <View style={styles.miniProgression}>
          <View
            style={[
              styles.miniProgressionFill,
              {
                width: `${badge.progression}%`,
                backgroundColor: badge.couleur,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}