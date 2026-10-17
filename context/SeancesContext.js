import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken } from '../services/api';

const SeancesContext = createContext(null);

export function SeancesProvider({ children }) {
  const [seances, setSeances] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [progressions, setProgressions] = useState({});
  const [favoris, setFavoris] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // ============================================
  // CHARGEMENT INITIAL
  // ============================================
  useEffect(() => {
    async function chargerTout() {
      try {
        setErreur(null);

        const token = await getToken();
        if (!token) {
          console.log('>>> [SeancesContext] Pas de token, skip API');
          setChargement(false);
          return;
        }

        console.log('>>> [SeancesContext] Début chargement');

        // 1) Exercices + programmes
        const [exos, progs] = await Promise.all([
          api.getExercises(),
          api.getPrograms(),
        ]);
        setExercices(exos || []);
        setProgrammes(progs || []);
        console.log('>>> [SeancesContext] Exercices reçus:', exos?.length);
        console.log('>>> [SeancesContext] Programmes reçus:', progs?.length);

        // 2) Séances
        try {
          const sess = await api.getSessions();
          setSeances(sess || []);
          console.log('>>> [SeancesContext] Séances reçues:', sess?.length);
        } catch (e) {
          console.log('>>> [SeancesContext] Sessions échoué:', e.message);
          setSeances([]);
        }

        // 3) Progression programmes
        try {
          const resultats = await Promise.all(
            (progs || []).map(async (p) => {
              try {
                const res = await api.getProgramProgress(p.id);
                return { id: p.id, sessions: res.completedSessions || [] };
              } catch (e) {
                return { id: p.id, sessions: [] };
              }
            })
          );
          const mapProgression = {};
          resultats.forEach((r) => { mapProgression[r.id] = r.sessions; });
          setProgressions(mapProgression);
          console.log('>>> [SeancesContext] Progressions chargées');
        } catch (e) {
          console.log('>>> [SeancesContext] Progressions échoué:', e.message);
          setProgressions({});
        }

        // 4) Favoris
        try {
          const favs = await api.getFavorites();
          setFavoris((favs || []).map((f) => Number(f.id)));
          console.log('>>> [SeancesContext] Favoris chargés:', favs?.length);
        } catch (e) {
          console.log('>>> [SeancesContext] Favoris échoué:', e.message);
          setFavoris([]);
        }
      } catch (e) {
        console.log('>>> [SeancesContext] ERREUR:', e.message);
        setErreur(e.message);
      } finally {
        setChargement(false);
        console.log('>>> [SeancesContext] Chargement terminé');
      }
    }
    chargerTout();
  }, []);

  // ============================================
  // SÉANCES
  // ============================================
  async function terminerSeance(programme) {
    const tempId = `temp-${Date.now()}`;
    const optimiste = {
      id: tempId,
      programmeId: programme.id,
      nomProgramme: programme.titre,
      date: new Date().toISOString(),
      minutes: programme.duree,
    };
    setSeances((prev) => [optimiste, ...prev]);

    try {
      const reelle = await api.addSession({
        programmeId: programme.id,
        nomProgramme: programme.titre,
        minutes: programme.duree,
      });
      setSeances((prev) => prev.map((s) => (s.id === tempId ? reelle : s)));
    } catch (e) {
      setSeances((prev) => prev.filter((s) => s.id !== tempId));
      throw e;
    }
  }

  async function supprimerSeance(id) {
    const sauvegarde = seances;
    setSeances((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.deleteSession(id);
    } catch (e) {
      setSeances(sauvegarde);
      throw e;
    }
  }

  async function viderHistorique() {
    const ids = seances.map((s) => s.id);
    setSeances([]);
    try {
      await Promise.all(ids.map((id) => api.deleteSession(id)));
    } catch (e) {
      const serveur = await api.getSessions();
      setSeances(serveur);
      throw e;
    }
  }

  // ============================================
  // PROGRESSION PROGRAMMES
  // ============================================
  async function marquerSessionTerminee(programId, sessionIndex) {
    try {
      await api.markSessionDone(programId, sessionIndex);
      setProgressions((prev) => {
        const actuelles = prev[programId] || [];
        if (actuelles.includes(sessionIndex)) return prev;
        return {
          ...prev,
          [programId]: [...actuelles, sessionIndex].sort((a, b) => a - b),
        };
      });
      console.log(`>>> Session ${sessionIndex} terminée pour programme ${programId}`);
    } catch (e) {
      console.log('>>> Erreur marquage session:', e.message);
      throw e;
    }
  }

  async function resetProgramme(programId) {
    try {
      await api.resetProgramProgress(programId);
      setProgressions((prev) => ({ ...prev, [programId]: [] }));
    } catch (e) {
      console.log('>>> Erreur reset programme:', e.message);
      throw e;
    }
  }

  function getProgressionProgramme(programId, nombreTotal) {
    const sessions = progressions[programId] || [];
    const nombreTermines = sessions.length;
    const pourcentage = nombreTotal > 0 ? (nombreTermines / nombreTotal) * 100 : 0;
    const estTermine = nombreTotal > 0 && nombreTermines >= nombreTotal;
    const indexActuel = nombreTermines < nombreTotal ? nombreTermines : -1;
    return { sessionsTerminees: sessions, nombreTermines, pourcentage, estTermine, indexActuel };
  }

  // ============================================
  // FAVORIS
  // ============================================
  function estFavori(exerciseId) {
    return favoris.includes(Number(exerciseId));
  }

  async function toggleFavori(exerciseId) {
    const id = Number(exerciseId);
    const dejaFavori = favoris.includes(id);

    // Optimistic update
    setFavoris((prev) =>
      dejaFavori ? prev.filter((f) => f !== id) : [...prev, id]
    );

    try {
      if (dejaFavori) {
        await api.removeFavorite(id);
      } else {
        await api.addFavorite(id);
      }
    } catch (e) {
      // Rollback
      setFavoris((prev) =>
        dejaFavori ? [...prev, id] : prev.filter((f) => f !== id)
      );
      throw e;
    }
  }

  // ============================================
  // PROVIDER
  // ============================================
  return (
    <SeancesContext.Provider
      value={{
        seances,
        exercices,
        programmes,
        progressions,
        favoris,
        chargement,
        erreur,
        terminerSeance,
        supprimerSeance,
        viderHistorique,
        marquerSessionTerminee,
        resetProgramme,
        getProgressionProgramme,
        estFavori,
        toggleFavori,
      }}
    >
      {children}
    </SeancesContext.Provider>
  );
}

export function useSeances() {
  const ctx = useContext(SeancesContext);
  if (!ctx) throw new Error('useSeances doit être dans <SeancesProvider>');
  return ctx;
}