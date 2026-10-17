import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Kifach tban l'notification mnin tji
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const CLE_NOTIF_TIME = 'notif_time';
const CLE_NOTIF_DAYS = 'notif_days';

// Tleb l'permission
export async function demanderPermission() {
    if (!Device.isDevice) {
        alert('Khass telephone 7a9iqi (machi simulateur) bach tkhdem.');
        return false;
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    let final = existing;
    if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        final = status;
    }
    if (final !== 'granted') {
        alert('Permission refusée ! Khass t-activi les notifications f les paramètres.');
        return false;
    }
    return true;
}

// Programmi rappels bach yjjiw f des jours w wa9t mkhassas
// jours = [1..7]  (1=Dimanche, 2=Lundi, ..., 7=Samedi) — convention Expo
export async function programmerRappelsPersonnalises(heure, minute, jours) {
  const ok = await demanderPermission();
  if (!ok) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!jours || jours.length === 0) {
    await AsyncStorage.removeItem(CLE_NOTIF_TIME);
    await AsyncStorage.removeItem(CLE_NOTIF_DAYS);
    console.log('❌ Aucun jour sélectionné');
    return true;
  }

  // Android Channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rappel-seance', {
      name: 'Rappel Séance',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563EB',
    });
  }

  for (const jour of jours) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "C'est l'heure de s'entraîner ! 💪",
        body: "N'oublie pas ta séance d'entraînement aujourd'hui. Prêt à atteindre tes objectifs ?",
        sound: true,
      },
      trigger: {
        type: 'calendar',
        hour: heure,
        minute: minute,
        weekday: jour,
        repeats: true,
      },
    });
  }

  await AsyncStorage.setItem(CLE_NOTIF_TIME, JSON.stringify({ heure, minute }));
  await AsyncStorage.setItem(CLE_NOTIF_DAYS, JSON.stringify(jours));

  console.log(`✅ Rappels programmés: ${jours.length} jour(s) à ${heure}:${String(minute).padStart(2, '0')}`);
  return true;
}

// 7yed kolchi
export async function annulerRappels() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(CLE_NOTIF_TIME);
    await AsyncStorage.removeItem(CLE_NOTIF_DAYS);
    console.log('❌ Rappels annulés');
}

// Chargi préférences mn AsyncStorage
export async function chargerPreferencesNotifs() {
    const time = await AsyncStorage.getItem(CLE_NOTIF_TIME);
    const days = await AsyncStorage.getItem(CLE_NOTIF_DAYS);

    if (time && days) {
        const t = JSON.parse(time);
        const d = JSON.parse(days);
        return {
            heure: t.heure,
            minute: t.minute,
            jours: d,
            active: d.length > 0,
        };
    }
    return { heure: 18, minute: 0, jours: [], active: false };
}