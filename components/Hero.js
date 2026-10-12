import Link from "next/link";
import Image from "next/image";
import { CameraIcon, StarIcon } from "./Icons";

/**
 * Hero de la page d'accueil — bande sombre plein écran.
 *  - Avec une photo terrain (Admin → Contenu → "Photo terrain plein écran") : la photo occupe
 *    toute la largeur, le texte se pose dessus à gauche avec un dégradé pour la lisibilité.
 *  - Sans photo terrain : fond anthracite texturé + photo produit (heroImage) à droite.
 * Dans le titre, la partie après " : " passe en vert lime sur une nouvelle ligne (le H1 reste
 * une seule phrase pour Google, seul le rendu visuel change).
 */
function HeroTitle({ text = "" }) {
  const idx = text.indexOf(":");
  if (idx === -1) return <h1>{text}</h1>;
  const before = text.slice(0, idx).trim();
  const after = text.slice(idx + 1).trim();
  return (
    <h1>
      {before}
      <span className="sr-only"> : </span>
      <span className="hero-title-accent">{after}</span>
    </h1>
  );
}

export default function Hero({ content, rating }) {
  const bgImage = content.heroBackgroundImage?.url;
  const productImage = content.heroImage?.url;

  return (
    <section className={`hero-v3${bgImage ? " hero-v3-photo" : ""}`}>
      {bgImage ? (
        <Image
          className="hero-v3-bg"
          src={bgImage}
          alt={content.heroBackgroundImage?.alt || ""}
          fill
          sizes="100vw"
          priority
        />
      ) : (
        <span className="hero-v3-topo" aria-hidden="true" />
      )}
      <span className="hero-v3-shade" aria-hidden="true" />

      <div className="container hero-v3-inner">
        <div className="hero-v3-content">
          {content.homeBadge ? (
            <p className="fr-badge">
              <span className="fr-flag" aria-hidden="true" />
              {content.homeBadge}
            </p>
          ) : null}
          {content.heroEyebrow ? <p className="eyebrow">{content.heroEyebrow}</p> : null}
          <HeroTitle text={content.homeHeroTitle || content.heroTitle} />
          {content.homeHeroSubtitle || content.heroSubtitle ? (
            <p className="hero-v3-sub">{content.homeHeroSubtitle || content.heroSubtitle}</p>
          ) : null}

          <div className="hero-v3-actions">
            <Link href="/produits" className="btn btn-accent btn-lg">
              {content.homeHeroButton || content.heroButtonText}
            </Link>
            {content.heroSecondaryText ? (
              <Link href={content.heroSecondaryHref || "/produits"} className="btn btn-ghost-light btn-lg">
                {content.heroSecondaryText}
              </Link>
            ) : null}
          </div>

          {rating?.count ? (
            <p className="hero-v3-proof">
              <span className="hero-v3-stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} />
                ))}
              </span>
              <strong>{rating.average.toFixed(1).replace(".", ",")}/5</strong>
              <span>· {rating.count} avis clients vérifiés</span>
            </p>
          ) : null}
        </div>

        {!bgImage ? (
          <div className="hero-v3-product">
            {productImage ? (
              <Image
                src={productImage}
                alt={content.heroImage?.alt || content.heroTitle}
                fill
                sizes="(max-width: 960px) 90vw, 520px"
                style={{ objectFit: "contain" }}
                priority
              />
            ) : (
              <span className="hero-v2-media-placeholder">
                <CameraIcon />
              </span>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
