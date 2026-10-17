import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { radius, spacing } from '../theme/colors';

export default function AProposScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
    boutonRetour: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    titre: { fontSize: 24, fontWeight: '900', color: colors.textPrimary },
    contenu: { padding: spacing.lg, alignItems: 'center' },
    logo: { width: 80, height: 80, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
    appName: { fontSize: 24, fontWeight: '900', color: colors.primary, marginBottom: 4 },
    version: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xl },
    texte: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
    footer: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xl },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titre}>{t('about')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contenu}>
        <View style={styles.logo}><Ionicons name="barbell" size={40} color={colors.primary} /></View>
        <Text style={styles.appName}>FitApp</Text>
        <Text style={styles.version}>{t('version')}</Text>
        <Text style={styles.texte}>{t('aboutText')}</Text>
        <Text style={styles.footer}>{t('allRights')}</Text>
      </ScrollView>
    </View>
  );
}
