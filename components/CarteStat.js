import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

export default function CarteStat({
  icone,
  titre,
  sousTitre,
  couleur = colors.primary,
  couleurFond = colors.primaryLight,
  onPress,
  taille = 'normal', // 'normal' | 'petit'
}) {
  const Conteneur = onPress ? TouchableOpacity : View;

  return (
    <Conteneur
      style={[styles.carte, taille === 'petit' && styles.cartePetit]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconeBox, { backgroundColor: couleurFond }]}>
        <Ionicons name={icone} size={22} color={couleur} />
      </View>

      <Text style={styles.titre}>{titre}</Text>
      {sousTitre ? <Text style={styles.sousTitre}>{sousTitre}</Text> : null}
    </Conteneur>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flex: 1,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cartePetit: { minHeight: 100 },
  iconeBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  titre: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sousTitre: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});