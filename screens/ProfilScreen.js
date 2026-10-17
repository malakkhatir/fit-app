import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Switch, Alert, TextInput, Image, Modal,
  KeyboardAvoidingView, Platform, // ⚠️ Zidna hadou bach l'clavier mayghttich l'boutons
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSeances } from '../context/SeancesContext';
import GrilleBadges from '../components/GrilleBadges';
import {
  programmerRappelsPersonnalises,
  annulerRappels,
  chargerPreferencesNotifs,
} from '../utils/notifications';
import { radius, spacing, shadow } from '../theme/colors';

// Mapping Jours: index (0=Lundi...6=Dimanche) → Expo weekday (1=Dim, 2=Lun...7=Sam)
const JOURS_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const JOURS_EXPO = [2, 3, 4, 5, 6, 7, 1];
const JOURS_NOMS = { 1: 'Dim', 2: 'Lun', 3: 'Mar', 4: 'Mer', 5: 'Jeu', 6: 'Ven', 7: 'Sam' };

function formatterJours(jours) {
  if (!jours || jours.length === 0) return '';
  return jours.map((j) => JOURS_NOMS[j]).join(', ');
}

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
  const { utilisateur, deconnecter, mettreAJourProfil, mettreAJourPhoto } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const { favoris, exercices, badges, statsBadges } = useSeances();

  // State Profile
  const [edition, setEdition] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [objectif, setObjectif] = useState('3');
  const [poids, setPoids] = useState('70');
  const [taille, setTaille] = useState('170');
  const [age, setAge] = useState('25');
  const [sexe, setSexe] = useState('Femme');

  // State Notifications
  const [notifActive, setNotifActive] = useState(false);
  const [notifHeure, setNotifHeure] = useState('18');
  const [notifMinute, setNotifMinute] = useState('00');
  const [notifJours, setNotifJours] = useState([]);
  const [modalNotifVisible, setModalNotifVisible] = useState(false);

  // Chargi préférences
  useEffect(() => {
    async function load() {
      const prefs = await chargerPreferencesNotifs();
      setNotifActive(prefs.active);
      setNotifHeure(String(prefs.heure).padStart(2, '0'));
      setNotifMinute(String(prefs.minute).padStart(2, '0'));
      setNotifJours(prefs.jours);
    }
    load();
  }, []);

  // Exercices favoris
  const exercicesFavoris = useMemo(() => {
    return favoris
      .map((id) => exercices.find((e) => Number(e.id) === Number(id)))
      .filter(Boolean);
  }, [favoris, exercices]);

  // Synchro champs
  useEffect(() => {
    if (utilisateur) {
      setPrenom(utilisateur.prenom ?? '');
      setObjectif(String(utilisateur.objectifHebdo ?? 3));
      setPoids(String(utilisateur.poids ?? 70));
      setTaille(String(utilisateur.taille ?? 170));
      setAge(String(utilisateur.age ?? 25));
      setSexe(utilisateur.sexe ?? 'Femme');
    }
  }, [utilisateur]);

  const styles = useMemo(() => StyleSheet.create({
    ecran: { flex: 1, backgroundColor: colors.background },
    contenu: { padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },

    profilEntete: { alignItems: 'center', marginBottom: spacing.xxl },
    avatarContainer: { position: 'relative', marginBottom: spacing.md },
    avatar: {
      width: 90, height: 90, borderRadius: 45,
      backgroundColor: colors.primaryLight,
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    },
    imageAvatar: { width: 90, height: 90, borderRadius: 45 },
    cameraIcon: {
      position: 'absolute', bottom: 0, right: 0,
      backgroundColor: colors.primary,
      width: 30, height: 30, borderRadius: 15,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 3, borderColor: colors.background,
    },
    nom: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
    email: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },

    statsRapides: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      ...shadow.sm,
    },
    statRapide: { flex: 1, alignItems: 'center' },
    statRapideValeur: { fontSize: 20, fontWeight: '900', color: colors.primary },
    statRapideLabel: {
      fontSize: 11, color: colors.textSecondary,
      marginTop: 4, fontWeight: '600', textAlign: 'center',
    },
    statRapideSeparateur: {
      width: 1, backgroundColor: colors.border, marginVertical: spacing.xs,
    },

    section: { marginBottom: spacing.xl },
    sectionTitre: {
      fontSize: 13, fontWeight: '700', color: colors.textMuted,
      marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5,
    },

    boutonEditer: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: spacing.sm, paddingVertical: 14,
      borderRadius: radius.md,
      borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed',
    },
    texteEditer: { color: colors.primary, fontWeight: '700', fontSize: 14 },

    carte: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg },
    label: {
      fontSize: 13, color: colors.textSecondary,
      marginBottom: 6, fontWeight: '600',
    },
    input: {
      backgroundColor: colors.backgroundAlt, borderRadius: radius.sm,
      padding: 12, marginBottom: spacing.md,
      color: colors.textPrimary, fontSize: 14,
    },
    choixSexeContainer: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    choixSexe: {
      flex: 1, paddingVertical: 12, borderRadius: radius.sm,
      alignItems: 'center', backgroundColor: colors.backgroundAlt,
    },
    choixSexeActif: { backgroundColor: colors.primaryLight },
    choixSexeTexte: { color: colors.textSecondary, fontWeight: '600' },
    choixSexeTexteActif: { color: colors.primary, fontWeight: '800' },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    bouton: {
      flex: 1, paddingVertical: 14, borderRadius: radius.sm,
      alignItems: 'center', backgroundColor: colors.primary,
    },
    boutonAnnuler: { backgroundColor: colors.backgroundAlt },
    texteAnnuler: { color: colors.textSecondary, fontWeight: '700' },
    texteValider: { color: colors.white, fontWeight: '700' },

    badgesContainer: { marginBottom: spacing.xl },
    badgesHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: spacing.sm,
    },
    badgesCompteur: { fontSize: 12, color: '#F59E0B', fontWeight: '700' },
    badgesGrille: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },

    favorisContainer: { marginBottom: spacing.xl },
    favorisHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: spacing.sm,
    },
    favorisCompteur: { fontSize: 12, color: colors.primary, fontWeight: '700' },
    favorisVide: {
      backgroundColor: colors.card, borderRadius: radius.md,
      padding: spacing.lg, alignItems: 'center',
      borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border,
    },
    favorisVideTexte: {
      color: colors.textMuted, fontSize: 13,
      textAlign: 'center', marginTop: spacing.sm, lineHeight: 18,
    },
    carteFavori: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderRadius: radius.md,
      padding: spacing.sm, marginBottom: spacing.sm,
      ...shadow.sm,
    },
    imageFavori: {
      width: 56, height: 56, borderRadius: radius.sm,
      marginRight: spacing.md, backgroundColor: colors.primaryLight,
    },
    imageFavoriPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    infosFavori: { flex: 1 },
    nomFavori: {
      fontSize: 14, fontWeight: '700',
      color: colors.textPrimary, marginBottom: 2,
    },
    detailFavori: { fontSize: 11, color: colors.textSecondary },

    boutonDeconnexion: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: spacing.sm, paddingVertical: 16, borderRadius: radius.md,
      backgroundColor: colors.dangerLight, marginTop: spacing.md,
    },
    texteDeconnexion: { color: colors.danger, fontWeight: '700', fontSize: 14 },

    // ========== MODAL NOTIFS ==========
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: radius.xl,
      padding: spacing.xl,
      width: '100%',
      maxWidth: 400,
      maxHeight: '85%', // ⚠️ Zidna hadi bach l'clavier mayfrech l'Modal
    },
    modalTitre: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.textPrimary,
      marginBottom: 4,
      textAlign: 'center',
    },
    modalSousTitre: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    modalLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    timeInputContainer: { alignItems: 'center' },
    timeInput: {
      backgroundColor: colors.card,
      borderRadius: radius.md,
      width: 90,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      fontSize: 32,
      fontWeight: '900',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    timeSep: {
      fontSize: 36,
      fontWeight: '900',
      color: colors.textMuted,
      marginBottom: 22,
    },
    timeLabel: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 6,
      fontWeight: '600',
    },
    joursRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    jourButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    jourButtonActif: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    jourTexte: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.textSecondary,
    },
    jourTexteActif: {
      color: '#FFFFFF',
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    modalBouton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    modalBoutonAnnuler: {
      backgroundColor: colors.backgroundAlt,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalBoutonValider: {
      backgroundColor: colors.primary,
    },
    modalTexteAnnuler: {
      color: colors.textSecondary,
      fontWeight: '700',
      fontSize: 14,
    },
    modalTexteValider: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 14,
    },
  }), [colors]);

  async function changerPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', 'On a besoin d\'accéder à tes photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0].uri) {
      try {
        await mettreAJourPhoto(result.assets[0].uri);
        Alert.alert('Succès', 'Photo de profil mise à jour !');
      } catch (e) {
        Alert.alert('Erreur', e.message);
      }
    }
  }

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
        poids: parseFloat(poids) || 70,
        taille: parseInt(taille, 10) || 170,
        age: parseInt(age, 10) || 25,
        sexe: sexe,
      });
      setEdition(false);
      Alert.alert('Profil mis à jour', 'Tes informations ont été enregistrées.');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  }

  function ouvrirModalNotif() {
    setModalNotifVisible(true);
  }

  function toggleJour(expoDay) {
    setNotifJours((prev) =>
      prev.includes(expoDay)
        ? prev.filter((j) => j !== expoDay)
        : [...prev, expoDay]
    );
  }

  async function sauvegarderNotif() {
    const h = parseInt(notifHeure, 10);
    const m = parseInt(notifMinute, 10);
    if (isNaN(h) || h < 0 || h > 23) {
      Alert.alert('Heure invalide', 'Choisis une heure entre 00 et 23.');
      return;
    }
    if (isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Minutes invalides', 'Choisis entre 00 et 59.');
      return;
    }
    if (notifJours.length === 0) {
      Alert.alert('Aucun jour', 'Khtar 3la l\'9el nhar wa7ed.');
      return;
    }

    const ok = await programmerRappelsPersonnalises(h, m, notifJours);
    if (ok) {
      setNotifActive(true);
      setModalNotifVisible(false);
      Alert.alert('Rappels activés', `Tun programme: ${formatterJours(notifJours)} à ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  async function desactiverNotifs() {
    await annulerRappels();
    setNotifActive(false);
    setNotifJours([]);
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

  const sousTitreNotif = notifActive && notifJours.length > 0
    ? `Activé — ${formatterJours(notifJours)} à ${notifHeure}:${notifMinute}`
    : 'Désactivé';

  return (
    <>
      <ScrollView
        style={styles.ecran}
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        <View style={styles.profilEntete}>
          <TouchableOpacity style={styles.avatarContainer} onPress={changerPhoto}>
            <View style={styles.avatar}>
              {utilisateur?.photoUrl ? (
                <Image
                  source={{ uri: utilisateur.photoUrl }}
                  style={styles.imageAvatar}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={40} color={colors.primary} />
              )}
            </View>
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.nom}>{utilisateur?.prenom || 'Invité'}</Text>
          <Text style={styles.email}>{utilisateur?.email ?? 'email@exemple.com'}</Text>
        </View>

        <View style={styles.statsRapides}>
          <View style={styles.statRapide}>
            <Text style={styles.statRapideValeur}>{favoris.length}</Text>
            <Text style={styles.statRapideLabel}>Favoris</Text>
          </View>
          <View style={styles.statRapideSeparateur} />
          <View style={styles.statRapide}>
            <Text style={styles.statRapideValeur}>
              {statsBadges?.nombreDebloques ?? 0}
            </Text>
            <Text style={styles.statRapideLabel}>Badges</Text>
          </View>
          <View style={styles.statRapideSeparateur} />
          <View style={styles.statRapide}>
            <Text style={styles.statRapideValeur}>
              🔥 {statsBadges?.streak ?? 0}
            </Text>
            <Text style={styles.statRapideLabel}>Jours</Text>
          </View>
        </View>

        <View style={styles.badgesContainer}>
          <View style={styles.badgesHeader}>
            <Text style={styles.sectionTitre}>Mes badges</Text>
            {statsBadges && (
              <Text style={styles.badgesCompteur}>
                {statsBadges.nombreDebloques} / {statsBadges.totalBadges} débloqués
              </Text>
            )}
          </View>
          <View style={styles.badgesGrille}>
            <GrilleBadges badges={badges} />
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Mes informations</Text>

          {!edition ? (
            <TouchableOpacity style={styles.boutonEditer} onPress={() => setEdition(true)}>
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

              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                value={poids}
                onChangeText={setPoids}
                keyboardType="decimal-pad"
                placeholder="70"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Taille (cm)</Text>
              <TextInput
                style={styles.input}
                value={taille}
                onChangeText={setTaille}
                keyboardType="number-pad"
                placeholder="170"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Âge</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                placeholder="25"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>Sexe</Text>
              <View style={styles.choixSexeContainer}>
                {['Femme', 'Homme'].map((s) => {
                  const actif = sexe === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[styles.choixSexe, actif && styles.choixSexeActif]}
                      onPress={() => setSexe(s)}
                    >
                      <Text style={[styles.choixSexeTexte, actif && styles.choixSexeTexteActif]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

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
            titre="Rappel Séance"
            sousTitre={sousTitreNotif}
            onPress={ouvrirModalNotif}
            right={
              <Switch
                value={notifActive}
                onValueChange={(val) => {
                  if (val) {
                    ouvrirModalNotif();
                  } else {
                    desactiverNotifs();
                  }
                }}
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

        <View style={styles.section}>
          <LigneParametre colors={colors} icone="help-circle-outline" titre="Aide" />
          <LigneParametre colors={colors} icone="information-circle-outline" titre="À propos" />
        </View>

        <TouchableOpacity
          style={styles.boutonDeconnexion}
          onPress={confirmerDeconnexion}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.texteDeconnexion}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ============================================
          MODAL : Configuration des rappels
          ============================================ */}
      <Modal
        visible={modalNotifVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNotifVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitre}>Rappel Séance</Text>
              <Text style={styles.modalSousTitre}>
                Choisis l'heure et les jours dial l'entraînement
              </Text>

              <Text style={styles.modalLabel}>Heure</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={notifHeure}
                    onChangeText={setNotifHeure}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                  />
                  <Text style={styles.timeLabel}>Heure</Text>
                </View>
                <Text style={styles.timeSep}>:</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={notifMinute}
                    onChangeText={setNotifMinute}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                  />
                  <Text style={styles.timeLabel}>Minutes</Text>
                </View>
              </View>

              <Text style={styles.modalLabel}>Jours</Text>
              <View style={styles.joursRow}>
                {JOURS_LABELS.map((label, idx) => {
                  const expoDay = JOURS_EXPO[idx];
                  const actif = notifJours.includes(expoDay);
                  return (
                    <TouchableOpacity
                      key={label + idx}
                      style={[styles.jourButton, actif && styles.jourButtonActif]}
                      onPress={() => toggleJour(expoDay)}
                    >
                      <Text style={[styles.jourTexte, actif && styles.jourTexteActif]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBouton, styles.modalBoutonAnnuler]}
                  onPress={() => setModalNotifVisible(false)}
                >
                  <Text style={styles.modalTexteAnnuler}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBouton, styles.modalBoutonValider]}
                  onPress={sauvegarderNotif}
                >
                  <Text style={styles.modalTexteValider}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}