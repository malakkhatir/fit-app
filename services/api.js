import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy'; // Khass tkon 'legacy' bach ma ytla3ch warning akhor

// ⚠️ REMPLACE par ton IP locale
export const API_URL = 'http://192.168.51.52/fitapp-backend/api';

const CLE_TOKEN = 'fitapp_token';
const CLE_USER = 'fitapp_user';

export async function getToken() {
  return AsyncStorage.getItem(CLE_TOKEN);
}

export async function setToken(token) {
  if (token) await AsyncStorage.setItem(CLE_TOKEN, token);
  else await AsyncStorage.removeItem(CLE_TOKEN);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  let reponse;
  try {
    reponse = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error(
      'Impossible de joindre le serveur. Vérifie ton IP, ton Wi-Fi et XAMPP.'
    );
  }

  const texte = await reponse.text();
  let data = null;
  try {
    data = texte ? JSON.parse(texte) : null;
  } catch {
    throw new Error(`Réponse invalide du serveur (code ${reponse.status}).`);
  }

  if (!reponse.ok) {
    if (reponse.status === 401) {
      await setToken(null);
      await AsyncStorage.removeItem(CLE_USER);
    }
    throw new Error(data?.erreur || `Erreur ${reponse.status}`);
  }

  return data;
}

export const api = {
  register:      (p) => request('/register.php', { method: 'POST', body: p }),
  login:         (p) => request('/login.php',    { method: 'POST', body: p }),
  logout:        ()  => request('/logout.php',   { method: 'POST', auth: true }),
  updateProfile: (p) => request('/profile.php',  { method: 'PUT',  body: p, auth: true }),

  getExercises: (niveau) =>
    request(`/exercises.php${niveau ? `?niveau=${encodeURIComponent(niveau)}` : ''}`),
  getPrograms: (niveau) =>
    request(`/programs.php${niveau ? `?niveau=${encodeURIComponent(niveau)}` : ''}`, { auth: true }),
  getSessions:   ()   => request('/sessions.php',          { auth: true }),
  addSession:    (p)  => request('/sessions.php',          { method: 'POST',   body: p, auth: true }),
  deleteSession: (id) => request(`/sessions.php?id=${id}`, { method: 'DELETE', auth: true }),

  // PROGRESSION PROGRAMMES
  getProgramProgress: (programId) =>
    request(`/program-progress.php?programId=${programId}`, { auth: true }),
  markSessionDone: (programId, sessionIndex) =>
    request('/program-progress.php', {
      method: 'POST',
      body: { programId, sessionIndex },
      auth: true,
    }),
  resetProgramProgress: (programId) =>
    request(`/program-progress.php?programId=${programId}`, {
      method: 'DELETE',
      auth: true,
    }),

  // FAVORIS
  getFavorites:   ()   => request('/favorites.php', { auth: true }),
  addFavorite:    (id) => request('/favorites.php', { method: 'POST', body: { exerciseId: id }, auth: true }),
  removeFavorite: (id) => request(`/favorites.php?exerciseId=${id}`, { method: 'DELETE', auth: true }),

  // COMMENTAIRES
  getComments:   (exerciseId)      => request(`/comments.php?exerciseId=${exerciseId}`, { auth: true }),
  addComment:    (exerciseId, txt) => request('/comments.php', { method: 'POST', body: { exerciseId, content: txt }, auth: true }),
  deleteComment: (id)              => request(`/comments.php?id=${id}`, { method: 'DELETE', auth: true }),

  // BADGES
  getBadges: () => request('/badges.php', { auth: true }),

  // UPLOAD AVATAR (Version wa7da bo7dha - NATIVE - Sans Blob)
  uploadAvatar: async (imageUri) => {
    const token = await getToken();
    
    const uploadResult = await FileSystem.uploadAsync(
      `${API_URL}/upload-avatar.php`,
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'avatar',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const data = JSON.parse(uploadResult.body);
    
    if (uploadResult.status < 200 || uploadResult.status >= 300) {
      throw new Error(data.erreur || 'Erreur upload');
    }
    
    return data;
  },
    // Custom Programs
  createCustomProgram: (payload) => request('/custom-program.php', { method: 'POST', body: payload, auth: true }),
  deleteCustomProgram: (id) => request(`/custom-program.php?id=${id}`, { method: 'DELETE', auth: true }),
    updateCustomProgram: (id, payload) => request(`/custom-program.php?id=${id}`, { method: 'PUT', body: payload, auth: true }),
};
