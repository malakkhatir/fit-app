export const exercices = [
  {
    id: '1',
    nom: 'Squats',
    categorie: 'Renforcement',
    niveau: 'Débutant',
    duree: 10,
    repetitions: '3 séries de 12',
    description: 'Exercice pour les jambes et les fessiers.',
  },
  {
    id: '2',
    nom: 'Marche rapide',
    categorie: 'Cardio',
    niveau: 'Débutant',
    duree: 20,
    repetitions: '20 minutes',
    description: 'Marcher à un rythme soutenu et confortable.',
  },
  {
    id: '3',
    nom: 'Pompes adaptées',
    categorie: 'Renforcement',
    niveau: 'Débutant',
    duree: 8,
    repetitions: '3 séries de 8',
    description: 'Adapter la variante à son niveau.',
  },
  {
    id: '4',
    nom: 'Étirements doux',
    categorie: 'Mobilité',
    niveau: 'Débutant',
    duree: 7,
    repetitions: '7 minutes',
    description: 'Mouvements doux, sans forcer.',
  },
];

// Utilitaire réutilisable partout : retrouver un exercice par son id
export function trouverExercice(id) {
  return exercices.find((exercice) => exercice.id === id);
}
