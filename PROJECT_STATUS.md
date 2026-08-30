# État du projet — Caméra Chasse Pro

Ce fichier sert de mise en contexte rapide (pour toi, ou pour une nouvelle session Claude Code sur
une autre machine). Pour l'installation pas-à-pas, voir [README.md](README.md).

## Où en est le projet

- ✅ **Code** : boutique e-commerce Next.js + Firebase, admin complet (produits, commandes,
  thème/couleurs, contenu, SEO, réglages Shopify). Poussé sur ce dépôt, branche `main`.
- ✅ **Firebase** : projet `camera-chasse-pro` créé (plan Spark, gratuit). Firestore activé,
  règles de sécurité (`firestore.rules`) publiées. Authentification e-mail/mot de passe activée.
- ✅ **Compte admin** : créé (`tlorand73@gmail.com`), document `admins/{uid}` présent dans
  Firestore, connexion sur `/admin/login` fonctionnelle.
- ⏳ **Cloudinary** (hébergement des photos produits) : **pas encore configuré**. Tant que ce n'est
  pas fait, l'ajout de photos dans l'admin reste désactivé. Voir README section "Configurer
  Cloudinary".
- ⏳ Pas encore de vrais produits/commandes en base (seulement les données de démonstration
  utilisées quand Firestore est vide).
- ⏳ Pas encore déployé en ligne (Vercel recommandé, pas encore fait).

## Décisions techniques importantes

- **Pas de Firebase Storage** : depuis le 3 février 2026, Google exige le plan payant Blaze pour
  Storage. Comme on veut rester 100% gratuit, les photos passent par **Cloudinary** (gratuit, sans
  carte bancaire) à la place.
- **Pas de clé de service Firebase Admin** : tout passe par le SDK client, sécurisé par les règles
  Firestore (`admins/{uid}` n'est modifiable que depuis la console Firebase, jamais depuis l'app —
  volontaire, pour éviter qu'un compte s'auto-attribue les droits admin).
- **Pas de paiement en ligne pour l'instant** (Stripe, etc.) — la commande est enregistrée dans
  Firestore avec le statut "nouvelle", à connecter à un prestataire de paiement plus tard.
- **Shopify pas encore branché** — page de réglages admin prête (domaine + jeton), mais suivi de
  commande/étiquettes gérés manuellement dans `/admin/orders` en attendant.

## Pour reprendre le projet sur une nouvelle machine

1. `git clone` ce dépôt, puis `npm install`.
2. Recréer `.env.local` à partir de `.env.local.example` (ce fichier n'est **pas** dans le dépôt,
   volontairement — il contient la config de connexion à ton projet Firebase/Cloudinary) :
   - Config Firebase : console Firebase → ⚙️ Paramètres du projet → Général → "Vos applications"
   - Config Cloudinary : cloudinary.com → Dashboard (Cloud name) + Settings → Upload (preset)
3. `npm run dev` pour lancer en local.

Le compte admin et les données restent dans Firebase/Firestore (dans le cloud) : pas besoin de les
recréer, ils sont accessibles depuis n'importe quelle machine une fois `.env.local` en place.
