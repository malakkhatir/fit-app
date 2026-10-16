import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken } from '../services/api';

const SeancesContext = createContext(null);

export function SeancesProvider({ children }) {
  const [seances, setSeances] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [progressions, setProgressions] = useState({});

  // ============================================
  // CHARGEMENT INITIAL
  // ============================================
  useEffect(() => {
    async function chargerTout() {
      try {
        setErreur(null);

        // Jbed l'token l'awwel
        const token = await getToken();

        // Ila ma kaynch token → skip API
        if (!token) {
          console.log('>>> [SeancesContext] Pas de token, skip API');
          setChargement(false);
          return;
        }

        console.log('>>> [SeancesContext] Début chargement');

        // 1) Charger exercices + programmes en parallèle
        const [exos, progs] = await Promise.all([
          api.getExercises(),
          api.getPrograms(),
        ]);

        setExercices(exos || []);
        setProgrammes(progs || []);

        console.log('>>> [SeancesContext] Exercices reçus:', exos?.length);
        console.log('>>> [SeancesContext] Programmes reçus:', progs?.length);

        // 2) Charger les séances de l'historique (séparé pour ne pas casser le reste)
        try {
          const sess = await api.getSessions();
          setSeances(sess || []);
          console.log('>>> [SeancesContext] Séances reçues:', sess?.length);
        } catch (e) {
          console.log('>>> [SeancesContext] Sessions échoué:', e.message);
          setSeances([]);
        }

        // 3) Charger la progression pour chaque programme
        try {
          const resultats = await Promise.all(
            (progs || []).map(async (p) => {
              try {
                const res = await api.getProgramProgress(p.id);
                return { id: p.id, sessions: res.completedSessions || [] };
              } catch (e) {
                console.log(`>>> Progression programme ${p.id} échoué:`, e.message);
                return { id: p.id, sessions: [] };
              }
            })
          );

          const mapProgression = {};
          resultats.forEach((r) => {
            mapProgression[r.id] = r.sessions;
          });
          setProgressions(mapProgression);
          console.log('>>> [SeancesContext] Progressions chargées');
        } catch (e) {
          console.log('>>> [SeancesContext] Progressions échoué:', e.message);
          setProgressions({});
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
  // TERMINER UNE SÉANCE (historique)
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

  // ============================================
  // SUPPRIMER UNE SÉANCE
  // ============================================
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

  // ============================================
  // VIDER L'HISTORIQUE
  // ============================================
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
  // 🆕 MARQUER UNE SESSION DE PROGRAMME COMME TERMINÉE
  // ============================================
  async function marquerSessionTerminee(programId, sessionIndex) {
    try {
      await api.markSessionDone(programId, sessionIndex);

      setProgressions((prev) => {
        const sessionsActuelles = prev[programId] || [];
        // Éviter les doublons
        if (sessionsActuelles.includes(sessionIndex)) {
          return prev;
        }
        return {
          ...prev,
          [programId]: [...sessionsActuelles, sessionIndex].sort((a, b) => a - b),
        };
      });

      console.log(`>>> Session ${sessionIndex} terminée pour programme ${programId}`);
    } catch (e) {
      console.log('>>> Erreur marquage session:', e.message);
      throw e;
    }
  }

  // ============================================
  // 🆕 RÉINITIALISER LA PROGRESSION D'UN PROGRAMME
  // ============================================
  async function resetProgramme(programId) {
    try {
      await api.resetProgramProgress(programId);

      setProgressions((prev) => ({
        ...prev,
        [programId]: [],
      }));

      console.log(`>>> Progression réinitialisée pour programme ${programId}`);
    } catch (e) {
      console.log('>>> Erreur reset programme:', e.message);
      throw e;
    }
  }

  // ============================================
  // 🆕 HELPERS (calculer l'état d'un programme)
  // ============================================
  function getProgressionProgramme(programId, nombreTotal) {
    const sessions = progressions[programId] || [];
    const nombreTermines = sessions.length;
    const pourcentage = nombreTotal > 0
      ? (nombreTermines / nombreTotal) * 100
      : 0;
    const estTermine = nombreTotal > 0 && nombreTermines >= nombreTotal;
    const indexActuel = nombreTermines < nombreTotal ? nombreTermines : -1;

    return {
      sessionsTerminees: sessions,
      nombreTermines,
      pourcentage,
      estTermine,
      indexActuel,
    };
  }

  // ============================================
  // PROVIDER
  // ============================================
  return (
    <SeancesContext.Provider
      value={{
        // Données
        seances,
        exercices,
        programmes,
        progressions,
        // État de chargement
        chargement,
        erreur,
        // Actions
        terminerSeance,
        supprimerSeance,
        viderHistorique,
        marquerSessionTerminee,
        resetProgramme,
        // Helpers
        getProgressionProgramme,
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