import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/colors';

export default function LineChart({ data = [], height = 200, couleur }) {
  const { colors } = useTheme();
  const couleurFinale = couleur || colors.primary;

  const styles = useMemo(() => StyleSheet.create({
    conteneur: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.lg,
    },
    vide: { alignItems: 'center', paddingVertical: 40 },
    videTexte: { color: colors.textMuted, fontSize: 13 },
  }), [colors]);

  if (!data || data.length < 2) {
    return (
      <View style={styles.conteneur}>
        <View style={styles.vide}>
          <Text style={styles.videTexte}>
            Pas assez de données pour afficher le graphique
          </Text>
        </View>
      </View>
    );
  }

  const largeur = 300;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 30;
  const largeurUtile = largeur - paddingLeft - paddingRight;
  const hauteurUtile = height - paddingTop - paddingBottom;

  const maxValeur = Math.max(...data.map((d) => d.valeur), 1);

  const points = data.map((d, i) => {
    const x = paddingLeft + (i * largeurUtile) / (data.length - 1);
    const y = paddingTop + hauteurUtile - (d.valeur / maxValeur) * hauteurUtile;
    return { x, y, ...d };
  });

  const chemin = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const cheminAire =
    `${chemin} L ${points[points.length - 1].x} ${paddingTop + hauteurUtile} ` +
    `L ${points[0].x} ${paddingTop + hauteurUtile} Z`;

  return (
    <View style={styles.conteneur}>
      <Svg width="100%" height={height} viewBox={`0 0 ${largeur} ${height}`}>
        <Defs>
          <LinearGradient id="gradAire" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={couleurFinale} stopOpacity="0.4" />
            <Stop offset="1" stopColor={couleurFinale} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + hauteurUtile * ratio;
          const valeur = Math.round(maxValeur * (1 - ratio));
          return (
            <React.Fragment key={i}>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={largeur - paddingRight}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <SvgText x={paddingLeft - 6} y={y + 4} fill={colors.textMuted} fontSize="9" textAnchor="end">
                {valeur}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Path d={cheminAire} fill="url(#gradAire)" />
        <Path
          d={chemin}
          stroke={couleurFinale}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={5} fill={colors.card} stroke={couleurFinale} strokeWidth={3} />
            <SvgText x={p.x} y={height - 8} fill={colors.textMuted} fontSize="9" textAnchor="middle">
              {p.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}