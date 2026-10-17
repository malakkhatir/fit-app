import AsyncStorage from '@react-native-async-storage/async-storage';

const CLE_SEANCES = 'seances_fitapp';
const CLE_PROFIL = 'profil_fitapp';

// ---------- Séances ----------
export async function chargerSeances() {
  try {
    const texte = await AsyncStorage.getItem(CLE_SEANCES);
    return texte !== null ? JSON.parse(texte) : [];
  } catch (erreur) {
    console.log('Erreur de chargement des séances', erreur);
    return [];
  }
}

export async function sauvegarderSeances(seances) {
  try {
    await AsyncStorage.setItem(CLE_SEANCES, JSON.stringify(seances));
  } catch (erreur) {
    console.log('Erreur de sauvegarde des séances', erreur);
  }
}

// ---------- Profil ----------
export async function chargerProfil() {
  try {
    const texte = await AsyncStorage.getItem(CLE_PROFIL);
    return texte !== null ? JSON.parse(texte) : null;
  } catch (erreur) {
    console.log('Erreur de chargement du profil', erreur);
    return null;
  }
}

export async function sauvegarderProfil(profil) {
  try {
    await AsyncStorage.setItem(CLE_PROFIL, JSON.stringify(profil));
  } catch (erreur) {
    console.log('Erreur de sauvegarde du profil', erreur);
  }
}
