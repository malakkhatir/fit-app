import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REMPLACE par ton IP locale (trouvée avec `ipconfig`)
export const API_URL = 'http://192.168.11.204/fitapp-backend/api';

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

  // ⚠️ Bloc wa7ed bo7do — ILA 401 → nettoyage + erreur
  if (!reponse.ok) {
    // Token mchi valide → kat-sse7b mn AsyncStorage
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
    request(`/programs.php${niveau ? `?niveau=${encodeURIComponent(niveau)}` : ''}`),

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
};