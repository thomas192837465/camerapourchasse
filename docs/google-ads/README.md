# Suivi Google Ads — WildTrail

Installation en deux morceaux, parce que le tunnel d'achat traverse deux domaines :

| Domaine | Ce qui s'y passe | Ce qu'on y installe |
| --- | --- | --- |
| `wildtrail.fr` (Next.js) | navigation, fiches produit, panier | le tag Google + `begin_checkout` + le passage du `gclid` |
| checkout Shopify hébergé | paiement, page de remerciement | le pixel personnalisé qui déclenche la conversion d'achat |

Sans le second, aucune vente ne remonte. Sans le premier, les ventes remontent mais
ne sont rattachées à aucune campagne — ce qui revient au même côté pilotage.

---

## 1. Variables d'environnement

À ajouter dans `.env.local` et dans Vercel (Settings → Environment Variables) :

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18459825178
NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN=xxxxx.myshopify.com
# facultatif
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CONSENT_MODE=0
```

Valeurs du compte (créées le 21/09/2026) :

| | |
| --- | --- |
| ID de conversion | `AW-18459825178` |
| Étiquette « Achat (1) » | `gzdvCLvmtYAdEJqoquJE` |

Le domaine du checkout reste à relever : lancer un passage en caisse sur
wildtrail.fr et lire la barre d'adresse au moment du paiement.

Tant que `NEXT_PUBLIC_GOOGLE_ADS_ID` est absent, `GoogleTag` ne rend rien :
aucun script tiers n'est chargé et le site se comporte exactement comme avant.
C'est voulu — on peut déployer le code avant d'avoir l'identifiant.

`NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN` doit être le domaine sur lequel le client
atterrit réellement au moment de payer. Le vérifier en lançant un vrai passage
en caisse et en lisant la barre d'adresse.

## 2. Action de conversion — déjà créée

L'action « Achat (1) » existe dans le compte, configurée ainsi :

- Source : **Site Web**, événement **manuel** (déclenché par le code, pas par une URL)
- Catégorie : **Achat**, action **principale**
- Valeur : « Utiliser des valeurs différentes », extrait d'événement
- Comptage : **Toutes** (deux achats distincts = deux conversions ; les doublons
  d'un même achat sont écartés par `transaction_id`)
- Fenêtre après clic : 90 jours — un piège photo à 120 € se compare sur plusieurs semaines
- Attribution : basée sur les données

⚠️ Une **seconde** action « Achat » avait été créée automatiquement par l'assistant
de démarrage, sur l'événement « Chargement de page : www.wildtrail.fr/produits ».
Celle-là compte une vente à chaque visite de la page catalogue. Elle doit être
supprimée avant que la balise ne soit installée, sans quoi les chiffres sont faux
et l'algorithme optimise vers des visites au lieu d'achats.

## 3. Coller le pixel dans Shopify

Voir `shopify-custom-pixel.js`. Renseigner les deux constantes en haut du fichier,
puis : Admin Shopify → Paramètres → **Événements clients** → Ajouter un pixel
personnalisé → coller → autorisations Marketing + Analytics → **Connecter**.

Un pixel enregistré mais non connecté ne se déclenche jamais. C'est l'oubli classique.

## 4. Vérifier

1. Installer l'extension **Google Tag Assistant**
2. Ouvrir `https://www.wildtrail.fr/?gclid=test123`
3. Vérifier que le tag `AW-…` se déclenche sur la page d'accueil
4. Ajouter un produit au panier, cliquer sur Commander
5. Vérifier que l'URL du checkout Shopify contient bien `&_gl=` — c'est le point
   critique de toute cette installation
6. Passer une vraie commande (remboursable ensuite depuis Shopify)
7. Dans Google Ads, l'action de conversion doit passer de « Aucune conversion
   récente » à « Enregistrement des conversions » sous 3 à 24 h

Ne pas basculer la campagne en **Maximiser les conversions** avant que l'étape 7
soit validée.

---

## RGPD — mode consentement v2

Le consentement est recueilli à deux endroits, parce que le tunnel traverse
deux domaines :

| Domaine | Qui demande le consentement |
| --- | --- |
| `wildtrail.fr` | `components/ConsentBanner.js` (ce dépôt) |
| checkout Shopify | la bannière cookies native de Shopify, activée pour la France |

### Côté site

`components/ConsentBanner.js` s'affiche tant que le visiteur ne s'est pas
prononcé, et respecte trois règles qui conditionnent la validité du consentement :

- **« Tout refuser » a exactement le même poids visuel que « Tout accepter »** —
  c'est le motif de sanction le plus fréquent de la CNIL ;
- **aucune case n'est pré-cochée** dans le volet « Personnaliser » ;
- **le refus est mémorisé** (`wt_consent_v1` dans le stockage local), sinon la
  bannière reviendrait à chaque page jusqu'à l'épuisement du visiteur.

Le lien « Préférences cookies » du pied de page rouvre la bannière : le retrait
du consentement doit rester aussi simple que son octroi.

Le choix déjà exprimé est rejoué **de façon synchrone dans le script d'init de
`GoogleTag`**, pas depuis React. Attendre l'hydratation ferait partir le premier
hit en « refusé » pour un visiteur qui avait pourtant accepté.

Sans consentement publicitaire, `decorateCheckoutUrl` cesse aussi de transmettre
le `gclid` au checkout : il servirait précisément à la mesure refusée.

### Activation

```bash
NEXT_PUBLIC_CONSENT_MODE=1
```

Tant que cette variable est absente, `ConsentBanner` ne rend rien et le site se
comporte exactement comme avant — le déploiement du code est donc sans effet
tant qu'on n'a pas basculé la variable.

### Côté checkout Shopify

⚠️ **Le pixel personnalisé est réglé sur « Autorisation requise » (Marketing +
Analyse), et la bannière cookies Shopify est active pour la France.** Conséquence
directe : *le pixel ne se déclenche que pour les acheteurs qui cliquent
« Accepter »*. Une commande passée sans accepter la bannière ne remonte aucune
conversion — l'action reste « Inactive » et l'onglet « Pages Web » reste vide,
alors que l'installation est parfaitement correcte.

C'est la cause du premier test infructueux (commande GUKE02PIZ, 21/09/2026).
Tout test de validation doit donc **accepter les cookies au checkout**.

Le mode consentement v2 ne supprime pas cette perte, il la compense : Google
reçoit un signal « refusé » au lieu de rien du tout, et modélise les conversions
manquantes. Sans lui, les acheteurs qui refusent sont purement invisibles.

## Merchant Center (plus tard)

Pas d'application Shopify utilisable en headless : l'app Google & YouTube
synchronise le catalogue avec des liens pointant vers la boutique Shopify, pas
vers `wildtrail.fr`. Il faut un flux produit maison — une route
`app/flux-produits.xml/route.js` qui reprend la même source que `app/sitemap.js`.
À faire une fois le suivi d'achat validé.
