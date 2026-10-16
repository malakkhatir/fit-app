export function debutDeSemaine(reference = new Date()) {
  const date = new Date(reference);
  date.setHours(0, 0, 0, 0);
  const jour = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - jour);
  return date;
}

export function seancesDeLaSemaine(seances, reference = new Date()) {
  const debut = debutDeSemaine(reference);
  return seances.filter((s) => new Date(s.date) >= debut);
}

export function calculerStatistiques(seances, objectifHebdo = 3) {
  const nombreSeances = seances.length;
  const minutesTotales = seances.reduce((t, s) => t + s.minutes, 0);

  const semaine = seancesDeLaSemaine(seances);
  const seancesSemaine = semaine.length;
  const minutesSemaine = semaine.reduce((t, s) => t + s.minutes, 0);

  const progression = Math.min(seancesSemaine / objectifHebdo, 1) * 100;

  return { nombreSeances, minutesTotales, seancesSemaine, minutesSemaine, progression };
}

export function formaterDate(iso) {
  const d = new Date(iso);
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
}

export function formaterHeure(iso) {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// Regroupe les séances par semaine (pour le graphique)
export function seancesParSemaine(seances, nombreSemaines = 5) {
  const semaines = [];
  const maintenant = new Date();

  for (let i = nombreSemaines - 1; i >= 0; i--) {
    const ref = new Date(maintenant);
    ref.setDate(ref.getDate() - i * 7);
    const debut = debutDeSemaine(ref);
    const fin = new Date(debut);
    fin.setDate(fin.getDate() + 7);

    const dansSemaine = seances.filter((s) => {
      const d = new Date(s.date);
      return d >= debut && d < fin;
    });

    semaines.push({
      label: `S${nombreSemaines - i}`,
      count: dansSemaine.length,
      minutes: dansSemaine.reduce((t, s) => t + s.minutes, 0),
    });
  }
  return semaines;
}