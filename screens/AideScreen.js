import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { radius, spacing } from '../theme/colors';

export default function AideScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
    boutonRetour: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    titre: { fontSize: 24, fontWeight: '900', color: colors.textPrimary },
    contenu: { padding: spacing.lg },
    section: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
    sectionTitre: { fontSize: 16, fontWeight: '800', color: colors.primary, marginBottom: spacing.sm },
    texte: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titre}>{t('help')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contenu}>
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>{t('howToUse')}</Text>
          <Text style={styles.texte}>{t('helpText')}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>{t('needMoreHelp')}</Text>
          <Text style={styles.texte}>{t('contactUs')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
