/** Adresse canonique d'une fiche produit : /produits/{slug}. La catégorie n'en fait plus partie,
 * pour qu'un produit puisse être rangé dans plusieurs catégories (voir extraCategoryIds) et
 * qu'un changement de catégorie ne change pas son adresse. */
export function productPath(product) {
  return `/produits/${product.slug}`;
}

/** Toutes les catégories d'un produit : la principale (fil d'Ariane) puis les secondaires. */
export function productCategoryIds(product) {
  return [product.categoryId, ...(product.extraCategoryIds || [])].filter(Boolean);
}
