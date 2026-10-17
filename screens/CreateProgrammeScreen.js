import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeances } from '../context/SeancesContext';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/colors';

export default function CreateProgrammeScreen({ route, navigation }) {
  const { exercices, ajouterProgrammePerso, modifierProgrammePerso } = useSeances();
  const { colors, isDark } = useTheme();

  // Ila wselna b paramètre "programme" mn l'écran dial l'liste, ya3ni 7na f l'modification
  const programmeAEditer = route.params?.programme;
  const isEditing = !!programmeAEditer;

  const [titre, setTitre] = useState(programmeAEditer ? programmeAEditer.titre : '');
  const [selection, setSelection] = useState(
    programmeAEditer ? programmeAEditer.exercicesIds.map(id => Number(id)) : []
  );
  const [chargement, setChargement] = useState(false);

  const toggleSelection = (id) => {
    setSelection(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const dureeTotale = useMemo(() => {
    return exercices
      .filter(ex => selection.includes(Number(ex.id)))
      .reduce((total, ex) => total + ex.duree, 0);
  }, [selection, exercices]);

  async function handleSave() {
    if (!titre.trim()) {
      Alert.alert('Titre manquant', 'Kteb smiya dial l\'programme dialek.');
      return;
    }
    if (selection.length === 0) {
      Alert.alert('Aucun exercice', 'Khtar 3la l\'9el exercice wa7ed.');
      return;
    }

    setChargement(true);
    try {
      if (isEditing) {
        await modifierProgrammePerso(programmeAEditer.id, titre, selection);
        Alert.alert('Succès', 'Programme mis à jour !');
      } else {
        await ajouterProgrammePerso(titre, selection);
        Alert.alert('Succès', 'Programme créé avec succès !');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setChargement(false);
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', paddingTop: 60,
      paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md,
    },
    boutonRetour: {
      width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
      alignItems: 'center', justifyContent: 'center',
    },
    titrePage: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
    contenu: { padding: spacing.lg, paddingBottom: 40 },
    label: { fontSize: 13, color: colors.textSecondary, fontWeight: '700', marginBottom: 6 },
    input: {
      backgroundColor: colors.card, borderRadius: radius.md, padding: 16,
      color: colors.textPrimary, fontSize: 16, marginBottom: spacing.xl,
      borderWidth: 1, borderColor: colors.border,
    },
    infoDuree: {
      flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md,
    },
    texteDuree: { fontSize: 14, color: colors.primary, fontWeight: '700' },
    exoCard: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
      padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm,
      borderWidth: 2, borderColor: 'transparent',
    },
    exoCardActif: { borderColor: colors.primary },
    checkbox: {
      width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.textMuted,
      alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
    },
    checkboxActif: { backgroundColor: colors.primary, borderColor: colors.primary },
    exoNom: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    exoDetail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    boutonSauvegarder: {
      backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.md,
      alignItems: 'center', marginTop: spacing.xl,
    },
    texteBouton: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  }), [colors]);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titrePage}>
          {isEditing ? 'Modifier le programme' : 'Créer un programme'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contenu}>
        <Text style={styles.label}>Nom du programme</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Mon Full Body du lundi"
          placeholderTextColor={colors.textMuted}
          value={titre}
          onChangeText={setTitre}
        />

        <View style={styles.infoDuree}>
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <Text style={styles.texteDuree}>Durée estimée : {dureeTotale} min</Text>
        </View>

        <Text style={styles.label}>Choisis tes exercices ({selection.length} sélectionnés)</Text>
        
        {exercices.map((ex) => {
          const actif = selection.includes(Number(ex.id));
          return (
            <TouchableOpacity
              key={ex.id}
              style={[styles.exoCard, actif && styles.exoCardActif]}
              onPress={() => toggleSelection(Number(ex.id))}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, actif && styles.checkboxActif]}>
                {actif && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exoNom}>{ex.nom}</Text>
                <Text style={styles.exoDetail}>{ex.zone} · {ex.duree} min · {ex.niveau}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.boutonSauvegarder} onPress={handleSave} disabled={chargement}>
          {chargement ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.texteBouton}>
              {isEditing ? 'Enregistrer les modifications' : 'Enregistrer le programme'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
