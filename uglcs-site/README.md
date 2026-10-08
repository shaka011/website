# UGLC-SC — Site officiel / Official website

## ⚠️ Déploiement sur Vercel — lisez ceci d'abord

Si vous avez vu une erreur "404 NOT_FOUND", c'est presque toujours parce que
le dossier a été déposé avec un niveau de dossier en trop. Vercel a besoin
que `index.html` soit visible **immédiatement** quand on ouvre le dossier —
pas caché dans un sous-dossier.

**Étapes correctes :**
1. Décompressez (dézippez) le fichier `uglcs-site.zip` sur votre ordinateur.
2. Ouvrez le dossier obtenu. Vous devez voir directement `index.html`,
   `assets`, `robots.txt`, etc. — **pas** un autre dossier à l'intérieur.
3. Sur vercel.com → "Add New Project", glissez **ce dossier-là** (celui où
   `index.html` est visible tout de suite).
4. Si Vercel vous propose un champ "Root Directory" pendant l'import et que
   vous voyez un dossier à l'intérieur d'un dossier, indiquez le nom du
   sous-dossier qui contient `index.html` dans ce champ.


Site statique, sans base de données ni serveur à gérer. 40 pages réelles
(20 par langue), en français (racine) et anglais (`/en`).

## Mettre le site en ligne (Vercel, gratuit)

1. Allez sur vercel.com → "Add New Project".
2. Glissez-déposez **tout le dossier** `uglcs` (celui qui contient `index.html`,
   `assets/`, `robots.txt`, `sitemap.xml`) — ne renommez rien, ne sortez aucun
   fichier du dossier.
3. Vercel détecte automatiquement un site statique : aucune configuration
   n'est nécessaire. Cliquez "Deploy".
4. Une fois en ligne, remplacez le domaine par `uglcs.org` dans les
   réglages du projet Vercel ("Domains").

## Formulaires : contact et candidature

**Aucun serveur n'est requis pour l'instant.** Les deux formulaires
préparent un message, que la personne envoie elle-même par e-mail à
`contact@uglcs.org` (l'application e-mail du visiteur s'ouvre déjà
pré-remplie). C'est fiable et gratuit, mais cela suppose que le visiteur
ait une messagerie configurée sur son appareil.

**Pour un envoi automatique et silencieux** (sans ouvrir l'application
e-mail du visiteur), il faut brancher un petit service gratuit comme
Formspree ou Resend : une fois le compte créé, collez l'URL fournie dans
`assets/js/site.js`, tout en haut de `index.html` (variable
`UGLCS_CFG.endpoint`). Dites-le-moi quand vous êtes prêt·e, je peux le
faire avec vous en cinq minutes.

## Ce qui est déjà fait

- **40 pages réelles**, chacune avec sa propre adresse (`/masters.html`,
  `/en/admission.html`, etc.) — bon pour Google, contrairement à un site
  "tout sur une page".
- **Contenu réel**, vérifié sur l'ancien site (historique depuis 2005,
  gouvernance, facultés, masters, écoles doctorales, partenariats
  internationaux) — pas de texte inventé.
- **Candidature en ligne** en 5 étapes, avec sauvegarde automatique du
  brouillon dans le navigateur (si la personne ferme l'onglet par erreur,
  rien n'est perdu).
- **Français / Anglais**, bascule instantanée, chaque page a sa jumelle
  dans l'autre langue.
- **Thème clair / sombre** avec bouton lune, effet de vague au clic.
- **Menu mobile** : deux barres qui se transforment en croix ; toucher
  n'importe où en dehors du menu le referme.
- **Référencement (SEO)** : `sitemap.xml`, `robots.txt`, données
  structurées Google (fiche établissement), balises bilingues correctes.
- **Élément 3D** dans l'en-tête d'accueil, chargé uniquement sur
  ordinateur avec une bonne connexion (jamais sur mobile, pour ne pas
  ralentir le site).

## Remplacer une image ou un texte

Chaque page est un fichier `.html` que vous pouvez ouvrir avec le Bloc-
notes (ou demander à Claude de le faire). Les images viennent pour
l'instant de l'ancien site (`uglcs.org/uglcsimg/...`) comme demandé ; le
jour où vous aurez de nouvelles photos, donnez-les-moi et je les
remplace partout d'un coup.
