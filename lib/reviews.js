// Note moyenne calculée à partir des avis réels — jamais saisie à la main, pour ne jamais
// afficher un chiffre qui ne correspond pas aux avis effectivement publiés.
export function computeRating(reviews) {
  const valid = (reviews || []).filter((r) => r && r.rating);
  if (!valid.length) return { average: 0, count: 0 };
  const total = valid.reduce((sum, r) => sum + Number(r.rating), 0);
  return { average: Math.round((total / valid.length) * 10) / 10, count: valid.length };
}
