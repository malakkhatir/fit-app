import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/colors';

export default function ChampFormulaire({
  label,
  valeur,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  sombre = false,
}) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    conteneur: { marginBottom: spacing.lg },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '600',
    },
    labelSombre: { color: 'rgba(255,255,255,0.7)' },
    champ: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    champSombre: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'transparent',
    },
    icone: { marginRight: spacing.sm },
    input: {
      flex: 1,
      paddingVertical: 14,
      color: colors.textPrimary,
      fontSize: 15,
    },
    inputSombre: { color: '#0F172A' },
  }), [colors]);

  return (
    <View style={styles.conteneur}>
      {label ? (
        <Text style={[styles.label, sombre && styles.labelSombre]}>{label}</Text>
      ) : null}

      <View style={[styles.champ, sombre && styles.champSombre]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={sombre ? '#94A3B8' : colors.textSecondary}
            style={styles.icone}
          />
        ) : null}

        <TextInput
          style={[styles.input, sombre && styles.inputSombre]}
          value={valeur}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={sombre ? '#94A3B8' : colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
