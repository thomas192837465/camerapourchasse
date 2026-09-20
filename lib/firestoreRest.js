// Petites aides pour écrire dans Firestore via son API REST avec le jeton Firebase Auth de
// l'appelant déjà vérifié (voir app/api/admin/broadcast) — évite d'avoir besoin de firebase-admin
// (pas de compte de service configuré ici) pour des routes serveur qui agissent au nom d'un admin
// authentifié plutôt qu'avec des identifiants stockés.

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

function toFirestoreValue(v) {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  return { nullValue: null };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

export async function firestoreCreateDoc(idToken, collectionPath, documentId, data) {
  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionPath}`
  );
  if (documentId) url.searchParams.set("documentId", documentId);

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  return res.ok;
}
