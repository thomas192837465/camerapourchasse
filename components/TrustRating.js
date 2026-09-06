import { StarIcon } from "./Icons";

const LABELS = [
  { min: 4.5, label: "Excellent" },
  { min: 3.5, label: "Très bien" },
  { min: 2.5, label: "Bien" },
  { min: 1.5, label: "Correct" },
  { min: 0, label: "Moyen" },
];

// Note affichée en avis clients vérifiés du site — inspirée visuellement des étoiles vertes
// popularisées par les plateformes d'avis, sans en revendiquer le label (ce ne sont pas des
// avis certifiés par un tiers, seulement ceux collectés directement par le site).
export default function TrustRating({ average = 0, count, showLabel = true, size = "md" }) {
  const rounded = Math.round(average);
  const label = LABELS.find((l) => average >= l.min)?.label || "Moyen";

  return (
    <div className={`trust-rating trust-rating-${size}`}>
      <span className="trust-rating-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`trust-star${n <= rounded ? " filled" : ""}`}>
            <StarIcon />
          </span>
        ))}
      </span>
      {showLabel && typeof count === "number" ? (
        count > 0 ? (
          <>
            <strong className="trust-rating-label">{label}</strong>
            <span className="trust-rating-count">
              {average.toFixed(1)}/5 · {count} avis
            </span>
          </>
        ) : (
          <span className="trust-rating-count">Aucun avis pour le moment</span>
        )
      ) : null}
    </div>
  );
}
