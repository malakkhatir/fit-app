import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Switch, Alert, TextInput, Image, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSeances } from '../context/SeancesContext';
import { radius, spacing, shadow } from '../theme/colors';

function LigneParametre({ icone, titre, sousTitre, onPress, right, colors }) {
  const styles = useMemo(() => StyleSheet.create({
    ligne: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.md,
      borderRadius: radius.md,
      marginBottom: spacing.sm,
    },
    iconeLigne: {
      width: 40,
      height: 40,
      borderRadius: radius.sm,
      backgroundColor: colors.backgroundAlt,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    infosLigne: { flex: 1 },
    titreLigne: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
    sousTitreLigne: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  }), [colors]);

  return (
    <TouchableOpacity
      style={styles.ligne}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.iconeLigne}>
        <Ionicons name={icone} size={20} color={colors.textSecondary} />
      </View>

      <View style={styles.infosLigne}>
        <Text style={styles.titreLigne}>{titre}</Text>
        {sousTitre ? <Text style={styles.sousTitreLigne}>{sousTitre}</Text> : null}
      </View>

      {right !== undefined ? (
        right
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfilScreen({ navigation }) {
  const { utilisateur, deconnecter, mettreAJourProfil } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const { favoris, exercices } = useSeances();

  const [notifications, setNotifications] = useState(true);
  const [edition, setEdition] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [objectif, setObjectif] = useState('3');

  // Exercices favoris (trouve les infos dial kol id)
  const exercicesFavoris = useMemo(() => {
    return favoris
      .map((id) => exercices.find((e) => Number(e.id) === Number(id)))
      .filter(Boolean);
  }, [favoris, exercices]);

  // Synchro l'champ m3a l'user
  useEffect(() => {
    if (utilisateur) {
      setPrenom(utilisateur.prenom ?? '');
      setObjectif(String(utilisateur.objectifHebdo ?? 3));
    }
  }, [utilisateur]);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    contenu: { padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },

    profilEntete: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    nom: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
    email: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },

    // Stats rapides
    statsRapides: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      ...shadow.sm,
    },
    statRapide: {
      flex: 1,
      alignItems: 'center',
    },
    statRapideValeur: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.primary,
    },
    statRapideLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
      fontWeight: '600',
    },
    statRapideSeparateur: {
      width: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },

    section: { marginBottom: spacing.xl },
    sectionTitre: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textMuted,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    boutonEditer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: 14,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderStyle: 'dashed',
    },
    texteEditer: { color: colors.primary, fontWeight: '700', fontSize: 14 },

    carte: {
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.lg,
    },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '600',
    },
    input: {
      backgroundColor: colors.backgroundAlt,
      borderRadius: radius.sm,
      padding: 12,
      marginBottom: spacing.md,
      color: colors.textPrimary,
      fontSize: 14,
    },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    bouton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: radius.sm,
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    boutonAnnuler: { backgroundColor: colors.backgroundAlt },
    texteAnnuler: { color: colors.textSecondary, fontWeight: '700' },
    texteValider: { color: colors.white, fontWeight: '700' },

    // ===== FAVORIS =====
    favorisContainer: {
      marginBottom: spacing.xl,
    },
    favorisHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    favorisCompteur: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '700',
    },
    favorisVide: {
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.border,
    },
    favorisVideTexte: {
      color: colors.textMuted,
      fontSize: 13,
      textAlign: 'center',
      marginTop: spacing.sm,
      lineHeight: 18,
    },
    carteFavori: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.sm,
      marginBottom: spacing.sm,
      ...shadow.sm,
    },
    imageFavori: {
      width: 56,
      height: 56,
      borderRadius: radius.sm,
      marginRight: spacing.md,
      backgroundColor: colors.primaryLight,
    },
    imageFavoriPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    infosFavori: { flex: 1 },
    nomFavori: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    detailFavori: {
      fontSize: 11,
      color: colors.textSecondary,
    },

    boutonDeconnexion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: 16,
      borderRadius: radius.md,
      backgroundColor: colors.dangerLight,
      marginTop: spacing.md,
    },
    texteDeconnexion: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  }), [colors]);

  async function sauvegarder() {
    const prenomNet = prenom.trim();
    if (!prenomNet) {
      Alert.alert('Prénom obligatoire', 'Kteb smitek mn fadlek.');
      return;
    }
    try {
      await mettreAJourProfil({
        prenom: prenomNet,
        objectifHebdo: parseInt(objectif, 10) || 3,
      });
      setEdition(false);
      Alert.alert('Profil mis à jour', 'Tes informations ont été enregistrées.');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  }

  function confirmerDeconnexion() {
    Alert.alert(
      'Se déconnecter',
      'Tu devras te reconnecter pour accéder à tes séances.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: deconnecter },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.ecran}
      contentContainerStyle={styles.contenu}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Avatar + infos */}
      <View style={styles.profilEntete}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={styles.nom}>{utilisateur?.prenom || 'Invité'}</Text>
        <Text style={styles.email}>{utilisateur?.email ?? 'email@exemple.com'}</Text>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsRapides}>
        <View style={styles.statRapide}>
          <Text style={styles.statRapideValeur}>{favoris.length}</Text>
          <Text style={styles.statRapideLabel}>Favoris</Text>
        </View>
        <View style={styles.statRapideSeparateur} />
        <View style={styles.statRapide}>
          <Text style={styles.statRapideValeur}>{utilisateur?.objectifHebdo ?? 3}</Text>
          <Text style={styles.statRapideLabel}>Objectif/sem.</Text>
        </View>
        <View style={styles.statRapideSeparateur} />
        <View style={styles.statRapide}>
          <Text style={styles.statRapideValeur}>🔥</Text>
          <Text style={styles.statRapideLabel}>Actif</Text>
        </View>
      </View>

      {/* ========== FAVORIS ========== */}
      <View style={styles.favorisContainer}>
        <View style={styles.favorisHeader}>
          <Text style={styles.sectionTitre}>Mes favoris</Text>
          {favoris.length > 0 && (
            <Text style={styles.favorisCompteur}>
              {favoris.length} exercice{favoris.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {exercicesFavoris.length === 0 ? (
          <View style={styles.favorisVide}>
            <Ionicons name="heart-outline" size={36} color={colors.textMuted} />
            <Text style={styles.favorisVideTexte}>
              Aucun favori pour le moment.{'\n'}
              Clique sur le ❤️ d'un exercice pour l'ajouter ici.
            </Text>
          </View>
        ) : (
          exercicesFavoris.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              style={styles.carteFavori}
              onPress={() => navigation.navigate('DetailExercice', { exercice: ex })}
              activeOpacity={0.85}
            >
              {ex.imageUrl ? (
                <Image
                  source={{ uri: ex.imageUrl }}
                  style={styles.imageFavori}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.imageFavori, styles.imageFavoriPlaceholder]}>
                  <Ionicons name="barbell" size={20} color={colors.primary} />
                </View>
              )}

              <View style={styles.infosFavori}>
                <Text style={styles.nomFavori} numberOfLines={1}>{ex.nom}</Text>
                <Text style={styles.detailFavori} numberOfLines={1}>
                  {ex.zone} · {ex.duree} min · {ex.niveau}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Édition du profil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Mes informations</Text>

        {!edition ? (
          <TouchableOpacity
            style={styles.boutonEditer}
            onPress={() => setEdition(true)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.texteEditer}>Modifier mes informations</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.carte}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={prenom}
              onChangeText={setPrenom}
              placeholder="Ton prénom"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Objectif hebdomadaire (séances)</Text>
            <TextInput
              style={styles.input}
              value={objectif}
              onChangeText={setObjectif}
              keyboardType="number-pad"
              placeholder="3"
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.bouton, styles.boutonAnnuler]}
                onPress={() => setEdition(false)}
              >
                <Text style={styles.texteAnnuler}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bouton} onPress={sauvegarder}>
                <Text style={styles.texteValider}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Paramètres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Paramètres</Text>

        <LigneParametre
          colors={colors}
          icone="flag-outline"
          titre="Mes objectifs"
          sousTitre={`${utilisateur?.objectifHebdo ?? 3} séances / semaine`}
          onPress={() => setEdition(true)}
        />

        <LigneParametre
          colors={colors}
          icone="notifications-outline"
          titre="Notifications"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          }
        />

        <LigneParametre
          colors={colors}
          icone={isDark ? 'moon' : 'moon-outline'}
          titre="Mode sombre"
          sousTitre={isDark ? 'Activé' : 'Désactivé'}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          }
        />

        <LigneParametre
          colors={colors}
          icone="globe-outline"
          titre="Langue"
          sousTitre="Français"
        />
      </View>

      {/* Aide */}
      <View style={styles.section}>
        <LigneParametre colors={colors} icone="help-circle-outline" titre="Aide" />
        <LigneParametre colors={colors} icone="information-circle-outline" titre="À propos" />
      </View>

      {/* Déconnexion */}
      <TouchableOpacity
        style={styles.boutonDeconnexion}
        onPress={confirmerDeconnexion}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.texteDeconnexion}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}