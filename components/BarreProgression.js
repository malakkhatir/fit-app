import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';

export default function BarreProgression({
  valeur = 0,
  libelle,
  couleur = colors.primary,
  hauteur = 8,
  afficherPourcentage = false,
}) {
  const pourcentage = Math.max(0, Math.min(valeur, 100));

  return (
    <View style={styles.conteneur}>
      {libelle || afficherPourcentage ? (
        <View style={styles.entete}>
          {libelle ? <Text style={styles.libelle}>{libelle}</Text> : <View />}
          {afficherPourcentage ? (
            <Text style={styles.valeur}>{Math.round(pourcentage)}%</Text>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.fond, { height: hauteur }]}>
        <View
          style={[
            styles.remplissage,
            { width: `${pourcentage}%`, backgroundColor: couleur, height: hauteur },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { width: '100%' },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  libelle: { color: colors.textSecondary, fontSize: 13 },
  valeur: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  fond: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.round,
    overflow: 'hidden',
  },
  remplissage: {
    borderRadius: radius.round,
  },
});