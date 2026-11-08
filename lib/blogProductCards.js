import { productCategoryIds } from "./productUrl";
import { isInFilters } from "./categories";

// Thèmes reconnus dans un article → mots qui les identifient dans le nom ou la catégorie d'un
// produit. Sert à proposer une caméra solaire dans un article sur le solaire, une 4G dans un
// article sur les caméras connectées, etc.
const TOPICS = [
  { article: /solaire|panneau|batterie|autonomie/i, product: /solaire/i },
  { article: /4g|connect|t[ée]l[ée]phone|smartphone|appli|sim\b|à distance|direct/i, product: /4g|connect|live|direct/i },
  { article: /wi-?fi|bluetooth/i, product: /wi-?fi|bluetooth/i },
  { article: /sans abonnement|abonnement/i, product: /sans abonnement|wi-?fi|bluetooth|écran/i },
  { article: /4k|résolution|qualit[ée] d.image|vidéo/i, product: /4k/i },
  { article: /écran|débutant|pas cher|petit budget|premier prix/i, product: /écran|e20/i },
];

function articleText(post) {
  const headings = (post.blocks || [])
    .filter((b) => b.type === "heading" || b.type === "subheading")
    .map((b) => b.text)
    .join(" ");
  return `${post.title || ""} ${post.category || ""} ${headings}`;
}

/**
 * Choisit les caméras à montrer dans un article : d'abord celles cochées dans « Produits
 * recommandés » de l'article, puis celles qui collent au sujet, puis les best-sellers.
 * Les accessoires (catégorie retirée des filtres « Nos caméras ») ne sont jamais proposés
 * automatiquement.
 */
export function pickProductsForPost(post, products, categories, max) {
  const hidden = new Set(categories.filter((c) => !isInFilters(c)).map((c) => c.slug));
  const isCamera = (p) => {
    const ids = productCategoryIds(p).filter((id) => id !== "aucune");
    return !ids.length || ids.some((id) => !hidden.has(id));
  };
  const text = articleText(post);
  const topics = TOPICS.filter((t) => t.article.test(text));
  const score = (p) => {
    const hay = `${p.name} ${productCategoryIds(p).join(" ")}`;
    return (
      topics.filter((t) => t.product.test(hay)).length * 10 +
      (p.isBestSeller ? 3 : 0) +
      (p.rating?.average || 0) / 5
    );
  };

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const chosen = (post.relatedProductSlugs || []).map((s) => bySlug.get(s)).filter(Boolean);
  const rest = products
    .filter((p) => isCamera(p) && !chosen.includes(p) && !p.isPromo)
    .sort((a, b) => score(b) - score(a));
  return [...chosen, ...rest].slice(0, max);
}

/**
 * Glisse des blocs « product » dans le contenu d'un article : avant le 2e titre H2, le 4e, etc.
 * (réglable). Rien n'est ajouté si l'article contient déjà au moins un bloc « Caméra » placé à la
 * main, ou si l'insertion automatique est désactivée (réglage global ou case de l'article).
 */
export function withProductCards(post, products, categories, settings) {
  const blocks = post.blocks || [];
  const hasManual = blocks.some((b) => b.type === "product");
  if (hasManual || settings.blogProductCards === false || post.autoProductCards === false) return blocks;

  const every = Math.max(1, Number(settings.blogProductCardsEvery) || 2);
  const max = Math.max(0, Number(settings.blogProductCardsMax) || 0);
  if (!max) return blocks;

  const headingIndexes = blocks.map((b, i) => (b.type === "heading" ? i : -1)).filter((i) => i >= 0);
  // Avant le 2e H2, le 4e… (every = 2) : jamais tout en haut de l'article.
  let positions = headingIndexes.filter((i, n) => i > 0 && (n + 1) % every === 0);
  // Article sans (assez de) titres : une seule carte vers le premier tiers du texte.
  if (!positions.length && blocks.length >= 4) positions = [Math.ceil(blocks.length / 3)];
  positions = positions.slice(0, max);
  if (!positions.length) return blocks;

  const picked = pickProductsForPost(post, products, categories, positions.length);
  if (!picked.length) return blocks;

  const insertAt = new Map(positions.slice(0, picked.length).map((pos, i) => [pos, picked[i]]));
  const out = [];
  blocks.forEach((block, i) => {
    const product = insertAt.get(i);
    if (product) out.push({ id: `auto-product-${i}`, type: "product", productSlug: product.slug });
    out.push(block);
  });
  return out;
}
