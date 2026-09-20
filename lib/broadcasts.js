import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

/** Historique des envois groupés, plus récents d'abord, avec le nombre d'ouvertures de chacun
 * (voir app/api/admin/broadcast et app/api/webhooks/resend) — réservé à l'admin. */
export async function getAllBroadcasts() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, "broadcasts"), orderBy("sentAt", "desc")));

  return Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data();
      const eventsSnap = await getDocs(query(collection(db, "emailEvents"), where("broadcastId", "==", d.id)));
      const opened = eventsSnap.docs.filter((e) => e.data().opened).length;
      return {
        id: d.id,
        subject: data.subject,
        total: data.total || 0,
        opened,
        sentAt: data.sentAt?.toDate ? data.sentAt.toDate().toISOString() : null,
      };
    })
  );
}
