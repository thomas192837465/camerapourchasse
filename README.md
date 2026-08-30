# Caméra Chasse Pro

Boutique e-commerce (Next.js + Firebase) avec espace admin : produits (photos multiples,
taille unique imposée), thème/couleurs, contenu, SEO, commandes, et réglages Shopify (à connecter
plus tard).

## 1. Lancer le projet en local

```bash
npm install
npm run dev
```

Le site fonctionne dès maintenant avec des données de démonstration, même sans Firebase configuré
(vous verrez un bandeau "Firebase n'est pas encore configuré" sur les pages qui en ont besoin :
admin, commande).

## 2. Configurer Firebase (à faire une seule fois — reste 100% gratuit, plan Spark)

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com) et créez un projet.
2. **Firestore Database** → Créer une base → mode production → choisissez une région (ex. `eur3`).
3. **Authentication** → Sign-in method → activez **E-mail/Mot de passe**.
4. **Paramètres du projet** (⚙️) → onglet **Général** → section "Vos applications" → **Ajouter une
   application Web** → copiez l'objet de configuration.
5. Dupliquez `.env.local.example` en `.env.local` et collez les valeurs :

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

6. **Règles de sécurité** : dans Firestore → onglet Règles, collez le contenu de
   [`firestore.rules`](firestore.rules) → Publier. (Ces règles font que la lecture du catalogue est
   publique, mais que seul un administrateur peut écrire.)

> ℹ️ On n'utilise pas **Firebase Storage** : depuis février 2026, Google exige le plan payant Blaze
> (carte bancaire) pour l'activer. Les photos produits passent par **Cloudinary** (gratuit, sans
> carte), voir étape suivante.

## 2bis. Configurer Cloudinary (gratuit, pour les photos produits)

1. Créez un compte gratuit sur [cloudinary.com](https://cloudinary.com) (aucune carte requise).
2. Sur le tableau de bord, notez le **Cloud name** affiché en haut.
3. **Settings** (⚙️) → onglet **Upload** → section "Upload presets" → **Add upload preset**.
4. Mettez **Signing Mode** sur **Unsigned** → donnez-lui un nom (ex. `camera-chasse-pro`) →
   **Save**.
5. Ajoutez dans `.env.local` :

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=camera-chasse-pro
```

6. Redémarrez `npm run dev`.

> Note : retirer une photo d'un produit dans l'admin la retire du produit, mais ne la supprime pas
> du compte Cloudinary (la suppression à distance nécessite une requête signée côté serveur, non
> mise en place ici). Le quota gratuit Cloudinary est largement suffisant pour une boutique ; vous
> pouvez nettoyer les fichiers inutilisés de temps en temps depuis le Media Library de Cloudinary.

## 3. Créer votre compte admin

Firebase ne permet pas de créer le tout premier compte depuis le site (pour éviter que n'importe
qui s'auto-déclare admin). Deux étapes rapides dans la console Firebase :

1. **Authentication** → **Users** → **Add user** → renseignez votre e-mail et un mot de passe.
2. Copiez l'**UID** généré pour cet utilisateur.
3. **Firestore Database** → **Start collection** → nommez-la `admins` → l'ID du document = l'UID
   copié → ajoutez un champ `email` (string) avec votre e-mail → Enregistrer.
4. Allez sur `/admin/login` et connectez-vous.

## 4. Importer les produits de démonstration (optionnel)

Une fois votre compte admin créé (étape 3), vous pouvez importer les catégories/produits utilisés
comme exemple :

```bash
ADMIN_EMAIL=vous@exemple.com ADMIN_PASSWORD=votre-mot-de-passe npm run seed
```

Vous pouvez ensuite les modifier ou les supprimer depuis `/admin/products`.

## 5. Ce qui est déjà fonctionnel

- Vitrine (accueil, catalogue avec filtres, fiche produit, panier, commande) — design identique au
  template d'origine, conservé dans `legacy-static-mockup/` pour référence.
- Admin : CRUD produits (photos multiples recadrées automatiquement à une taille unique
  configurable), commandes (statut + transporteur + n° de suivi saisis manuellement), réglages
  Thème (couleurs), Contenu (textes de la page d'accueil), SEO, et Shopify (formulaire prêt, non
  connecté).
- SEO : un seul `<h1>` par page, balises meta par page/produit, JSON-LD produit, `sitemap.xml` et
  `robots.txt` générés automatiquement.

## 6. Ce qui reste à brancher plus tard

- **Paiement en ligne** : la commande est aujourd'hui enregistrée dans Firestore sans paiement
  intégré (mention "paiement à réception / par virement" affichée au client). Un moyen de paiement
  (Stripe, etc.) pourra être ajouté quand vous aurez choisi votre prestataire.
- **Shopify** : la page Admin → Réglages → Shopify stocke le domaine et le jeton API, mais la
  synchronisation automatique des commandes/étiquettes/suivi n'est pas encore active — elle sera
  ajoutée une fois votre boutique Shopify créée.
- **Déploiement** : ce projet est prêt à être déployé sur Vercel (ou tout hébergeur Next.js) ;
  pensez à renseigner les mêmes variables `NEXT_PUBLIC_FIREBASE_*` dans les réglages
  d'environnement de l'hébergeur.
