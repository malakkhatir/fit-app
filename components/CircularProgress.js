import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

export default function CircularProgress({
  taille = 200,
  epaisseur = 14,
  valeur = 0,
  max = 100,
  couleur,
  couleurFond,
  children,
  afficherPourcentage = true,
}) {
  const { colors } = useTheme();
  const couleurFinale = couleur || colors.primary;
  const couleurFondFinale = couleurFond || colors.primaryLight;

  const pourcentage = Math.max(0, Math.min(valeur / max, 1));
  const rayon = (taille - epaisseur) / 2;
  const circonference = 2 * Math.PI * rayon;
  const offset = circonference * (1 - pourcentage);

  const styles = useMemo(() => StyleSheet.create({
    conteneur: {
      width: taille,
      height: taille,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contenu: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pourcentage: {
      fontSize: taille * 0.22,
      fontWeight: '900',
      color: colors.textPrimary,
    },
    maxTexte: {
      fontSize: taille * 0.1,
      color: colors.textMuted,
      fontWeight: '600',
      marginTop: 4,
    },
  }), [colors, taille]);

  return (
    <View style={styles.conteneur}>
      <Svg width={taille} height={taille}>
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleurFondFinale}
          strokeWidth={epaisseur}
          fill="none"
        />
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleurFinale}
          strokeWidth={epaisseur}
          fill="none"
          strokeDasharray={circonference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
        />
      </Svg>

      <View style={styles.contenu}>
        {children ? (
          children
        ) : afficherPourcentage ? (
          <>
            <Text style={styles.pourcentage}>{Math.round(pourcentage * 100)}%</Text>
            <Text style={styles.maxTexte}>{valeur} / {max}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}