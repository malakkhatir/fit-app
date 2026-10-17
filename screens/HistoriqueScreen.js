import React, { useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { formaterDate, formaterHeure } from '../utils/stats';
import { FadeInView, SlideUpView } from '../components/AnimatedWrapper';
import { radius, spacing } from '../theme/colors';

export default function HistoriqueScreen({ navigation }) {
  const { seances, supprimerSeance, viderHistorique } = useSeances();
  const { colors, isDark } = useTheme();

  function confirmerSuppression(id) {
    Alert.alert(
      'Supprimer cette séance ?',
      'Cette action est définitive.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => supprimerSeance(id) },
      ]
    );
  }

  function confirmerVidage() {
    if (seances.length === 0) return;
    Alert.alert(
      'Vider tout l’historique ?',
      'Toutes tes séances seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: viderHistorique },
      ]
    );
  }

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    entete: {
      flexDirection: 'row', alignItems: 'center',
      paddingTop: 60, paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md, gap: spacing.md,
    },
    boutonRetour: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center', justifyContent: 'center',
    },
    titre: { flex: 1, fontSize: 24, fontWeight: '900', color: colors.textPrimary },
    toutEffacer: { color: colors.danger, fontWeight: '700', fontSize: 13 },
    liste: { paddingHorizontal: spacing.lg, paddingBottom: 30 },
    ligne: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderRadius: radius.lg,
      padding: spacing.md, marginBottom: spacing.sm,
    },
    icone: {
      width: 48, height: 48, borderRadius: radius.md,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
      marginRight: spacing.md,
    },
    infos: { flex: 1 },
    date: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
    nom: {
      fontSize: 15, fontWeight: '800',
      color: colors.textPrimary, marginBottom: 2,
    },
    detail: { fontSize: 12, color: colors.textSecondary },
    vide: {
      alignItems: 'center', paddingVertical: 60, paddingHorizontal: spacing.xl,
    },
    videTexte: {
      color: colors.textPrimary, fontWeight: '700',
      fontSize: 15, marginTop: spacing.md,
    },
    videDetail: {
      color: colors.textSecondary, fontSize: 13,
      marginTop: 6, textAlign: 'center',
    },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FadeInView>
        <View style={styles.entete}>
          <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.titre}>Historique</Text>
          {seances.length > 0 && (
            <TouchableOpacity onPress={confirmerVidage}>
              <Text style={styles.toutEffacer}>Tout effacer</Text>
            </TouchableOpacity>
          )}
        </View>
      </FadeInView>

      <FlatList
        data={seances}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SlideUpView delay={Math.min(index * 40, 400)}>
            <TouchableOpacity
              style={styles.ligne}
              onLongPress={() => confirmerSuppression(item.id)}
              activeOpacity={0.85}
            >
              <View style={styles.icone}>
                <Ionicons name="barbell" size={22} color="#FFFFFF" />
              </View>

              <View style={styles.infos}>
                <Text style={styles.date}>{formaterDate(item.date)}</Text>
                <Text style={styles.nom}>{item.nomProgramme}</Text>
                <Text style={styles.detail}>
                  {item.minutes} min · {formaterHeure(item.date)}
                </Text>
              </View>

              <Ionicons name="checkmark-circle" size={26} color="#22C55E" />
            </TouchableOpacity>
          </SlideUpView>
        )}
        ListEmptyComponent={
          <View style={styles.vide}>
            <Ionicons name="time-outline" size={48} color={colors.textMuted} />
            <Text style={styles.videTexte}>Aucune séance enregistrée.</Text>
            <Text style={styles.videDetail}>
              Termine un programme pour la voir apparaître ici.
            </Text>
          </View>
        }
      />
    </View>
  );
}
