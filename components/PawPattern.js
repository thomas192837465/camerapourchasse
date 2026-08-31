/**
 * Fond en empreintes d'ours — fichier SVG fourni par l'admin (public/hero-pattern.svg), recoloré
 * dynamiquement côté serveur selon la couleur choisie (Admin > Contenu > Bannière d'accueil).
 */
export default function PawPattern({ color = "#2c5b3d", className = "" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`paw-pattern ${className}`}
      src={`/api/hero-pattern?color=${encodeURIComponent(color)}`}
      alt=""
      aria-hidden="true"
    />
  );
}
