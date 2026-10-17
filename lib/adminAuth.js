// Vérifie qu'un jeton Firebase Auth envoyé par le navigateur appelant est valide ET que son
// titulaire est bien un admin — sans firebase-admin (pas de compte de service configuré ici).
// "accounts:lookup" valide l'authenticité/l'expiration du jeton et renvoie l'UID ; la lecture de
// admins/{uid} avec ce même jeton n'aboutit que si la règle Firestore l'autorise (donc seulement
// si ce uid est bien admin) — voir firestore.rules. Partagé par toutes les routes API admin qui
// agissent au nom de l'appelant plutôt qu'avec des identifiants stockés (ex: app/api/admin/broadcast,
// app/api/admin/messages/send).
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function verifyAdmin(idToken) {
  if (!idToken) return null;
  const lookupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!lookupRes.ok) return null;
  const lookupData = await lookupRes.json();
  const uid = lookupData.users?.[0]?.localId;
  if (!uid) return null;

  const adminRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins/${uid}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return adminRes.status === 200 ? uid : null;
}
