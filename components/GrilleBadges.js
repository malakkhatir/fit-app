import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import CarteBadge from './CarteBadge';
import { spacing } from '../theme/colors';

export default function GrilleBadges({ badges }) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    conteneur: { paddingVertical: spacing.sm },
    vide: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    videTexte: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: spacing.sm,
      fontStyle: 'italic',
    },
  }), [colors]);

  if (!badges || badges.length === 0) {
    return (
      <View style={styles.vide}>
        <Ionicons name="ribbon-outline" size={36} color={colors.textMuted} />
        <Text style={styles.videTexte}>Aucun badge pour le moment.</Text>
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={badges}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.conteneur}
      renderItem={({ item }) => <CarteBadge badge={item} />}
    />
  );
}
