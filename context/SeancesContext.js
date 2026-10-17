import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken } from '../services/api';

const SeancesContext = createContext(null);

export function SeancesProvider({ children }) {
  const [seances, setSeances] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [progressions, setProgressions] = useState({});
  const [favoris, setFavoris] = useState([]);
  const [badges, setBadges] = useState([]);
  const [statsBadges, setStatsBadges] = useState(null);
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

        // 5) Badges
        try {
          const data = await api.getBadges();
          setBadges(data.badges || []);
          setStatsBadges(data.stats || null);
          console.log('>>> [SeancesContext] Badges chargés:', data.badges?.length);
        } catch (e) {
          console.log('>>> [SeancesContext] Badges échoué:', e.message);
          setBadges([]);
          setStatsBadges(null);
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
      rechargerBadges().catch(() => {});
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
      rechargerBadges().catch(() => {});
    } catch (e) {
      setSeances(sauvegarde);
      throw e;
    }
  }

  async function viderHistorique() {
    const ids = seances.map((s) => s.id);
    setSeances([]);
    setProgressions({}); // 🆕 Nmse7o l'progressions (l'khadar)
    
    try {
      await Promise.all(ids.map((id) => api.deleteSession(id)));
      
      // 🆕 Nmse7o l'progressions dial ga3 les programmes f l'backend
      await Promise.all(programmes.map((p) => api.resetProgramProgress(p.id)));
      
      rechargerBadges().catch(() => {});
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

    setFavoris((prev) =>
      dejaFavori ? prev.filter((f) => f !== id) : [...prev, id]
    );

    try {
      if (dejaFavori) {
        await api.removeFavorite(id);
      } else {
        await api.addFavorite(id);
      }
      rechargerBadges().catch(() => {});
    } catch (e) {
      setFavoris((prev) =>
        dejaFavori ? [...prev, id] : prev.filter((f) => f !== id)
      );
      throw e;
    }
  }

  // ============================================
  // BADGES
  // ============================================
  async function rechargerBadges() {
    try {
      const data = await api.getBadges();
      setBadges(data.badges || []);
      setStatsBadges(data.stats || null);
      return data;
    } catch (e) {
      console.log('>>> Erreur rechargement badges:', e.message);
      throw e;
    }
  }

  // ============================================
  // PROGRAMMES PERSONNALISÉS (NOUVEAU)
  // ============================================
  async function ajouterProgrammePerso(titre, exercicesIds) {
    try {
      const result = await api.createCustomProgram({ titre, exercicesIds });
      // Recharge les programmes bach yban l'jdid
      const progs = await api.getPrograms();
      setProgrammes(progs || []);
      return result;
    } catch (e) {
      console.log('>>> Erreur ajout programme perso:', e.message);
      throw e;
    }
  }
    async function modifierProgrammePerso(id, titre, exercicesIds) {
    try {
      await api.updateCustomProgram(id, { titre, exercicesIds });
      const progs = await api.getPrograms();
      setProgrammes(progs || []);
      return { success: true };
    } catch (e) {
      console.log('>>> Erreur modif programme perso:', e.message);
      throw e;
    }
  }

  async function supprimerProgrammePerso(id) {
    try {
      await api.deleteCustomProgram(id);
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.log('>>> Erreur suppression programme perso:', e.message);
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
        badges,
        statsBadges,
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
        rechargerBadges,
        ajouterProgrammePerso,     
        supprimerProgrammePerso,
        modifierProgrammePerso,     
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
