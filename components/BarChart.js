import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/colors';

export default function BarChart({ data = [], height = 220, couleur }) {
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

  if (!data || data.length === 0) {
    return (
      <View style={styles.conteneur}>
        <View style={styles.vide}>
          <Text style={styles.videTexte}>Aucune donnée</Text>
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
  const largeurBarre = (largeurUtile / data.length) * 0.6;
  const espacement = (largeurUtile / data.length) * 0.4;

  return (
    <View style={styles.conteneur}>
      <Svg width="100%" height={height} viewBox={`0 0 ${largeur} ${height}`}>
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
              <SvgText
                x={paddingLeft - 6}
                y={y + 4}
                fill={colors.textMuted}
                fontSize="9"
                textAnchor="end"
              >
                {valeur}
              </SvgText>
            </React.Fragment>
          );
        })}

        {data.map((d, i) => {
          const hauteurBarre = (d.valeur / maxValeur) * hauteurUtile;
          const x = paddingLeft + i * (largeurUtile / data.length) + espacement / 2;
          const y = paddingTop + hauteurUtile - hauteurBarre;

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={largeurBarre}
                height={hauteurBarre}
                fill={couleurFinale}
                rx={4}
                ry={4}
              />
              {d.valeur > 0 && (
                <SvgText
                  x={x + largeurBarre / 2}
                  y={y - 4}
                  fill={colors.textSecondary}
                  fontSize="9"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.valeur}
                </SvgText>
              )}
              <SvgText
                x={x + largeurBarre / 2}
                y={height - 8}
                fill={colors.textMuted}
                fontSize="9"
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}