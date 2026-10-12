import Link from "next/link";
import Image from "next/image";
import FaIcon from "./FaIcon";
import TrustRating from "./TrustRating";
import { StarIcon, CheckIcon, ChevronRightIcon } from "./Icons";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";
import { formatPrice, fill } from "@/lib/format";

/**
 * Sections pleine largeur sous l'achat, sur la fiche produit (structure "page de vente") :
 * chiffres clés, avis, engagements de la marque, FAQ, rappel d'achat.
 * Tout vient des vraies données du produit : rien ne s'affiche si la donnée manque.
 */

// Chiffres clés : champ "keyStats" du produit, sinon les 4 premières caractéristiques techniques.
export function ProductKeyStats({ product, T = {} }) {
  const stats = (product.keyStats || []).filter((s) => s.value && s.label);
  const items = stats.length
    ? stats
    : (product.specs || [])
        .filter((s) => s.label && s.value)
        .slice(0, 4)
        .map((s) => ({ value: s.value, label: s.label }));
  if (items.length < 2) return null;
  const shortName = product.name.split(/\s[–:-]\s|\s:\s/)[0];

  return (
    <section className="pd-stats">
      <div className="container">
        {T.statsEyebrow ? <p className="eyebrow">{T.statsEyebrow}</p> : null}
        <h2 className="pd-section-title">{fill(T.statsTitle, { produit: shortName })}</h2>
        <div className="pd-stats-grid" style={{ "--cols": Math.min(items.length, 4) }}>
          {items.slice(0, 4).map((s, i) => (
            <div className="pd-stat" key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductReviews({ product, T = {} }) {
  const reviews = (product.reviews || []).filter((r) => r.name && r.text);
  if (!reviews.length) return null;
  const rating = product.rating || { average: 0, count: 0 };
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => Math.round(r.rating || 0) === n).length,
  }));

  return (
    <section className="pd-reviews" id="avis">
      <div className="container pd-reviews-inner">
        <aside className="pd-reviews-summary">
          {T.reviewsEyebrow ? <p className="eyebrow">{T.reviewsEyebrow}</p> : null}
          <h2 className="pd-section-title">{T.reviewsTitle}</h2>
          <div className="pd-reviews-score">
            <strong>{rating.average.toFixed(1).replace(".", ",")}</strong>
            <div>
              <TrustRating average={rating.average} showLabel={false} size="lg" />
              <span>
                {rating.count} avis vérifiés
              </span>
            </div>
          </div>
          <ul className="pd-reviews-dist">
            {dist.map((d) => (
              <li key={d.n}>
                <span>
                  {d.n} <StarIcon />
                </span>
                <span className="pd-reviews-bar">
                  <span style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }} />
                </span>
                <span>{d.count}</span>
              </li>
            ))}
          </ul>
          {T.reviewsNote ? <p className="pd-reviews-note">{T.reviewsNote}</p> : null}
        </aside>

        <div className="pd-reviews-list">
          {reviews.map((r, i) => (
            <article className="pd-review" key={r.id || i}>
              <header>
                {r.avatar?.url ? (
                  <img
                    className="review-avatar-img"
                    src={cloudinaryTransform(r.avatar.url, "w_100,q_auto,f_auto")}
                    alt={`Photo de profil de ${r.name}`}
                  />
                ) : (
                  <span className="avatar">{r.name.slice(0, 2).toUpperCase()}</span>
                )}
                <div>
                  <strong>{r.name}</strong>
                  <span className="pd-review-verified">
                    <CheckIcon /> Achat vérifié
                  </span>
                </div>
                <TrustRating average={r.rating || 0} showLabel={false} size="sm" />
              </header>
              <p>{r.text}</p>
              {r.photos?.filter((p) => p.url).length ? (
                <div className="review-photos">
                  {r.photos
                    .filter((p) => p.url)
                    .map((p, pi) => (
                      <img
                        className="review-photo"
                        src={cloudinaryTransform(p.url, "w_200,q_auto,f_auto")}
                        alt={p.alt || `Photo envoyée par ${r.name} avec son avis`}
                        key={pi}
                      />
                    ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Engagements de la marque : mêmes points que la bande "Notre histoire" de l'accueil.
export function ProductBrandPromise({ points = [], T = {} }) {
  const items = points.filter((p) => p.title);
  if (!items.length) return null;
  return (
    <section className="pd-promise">
      <div className="container">
        <div className="pd-promise-head">
          {T.promiseEyebrow ? <p className="eyebrow">{T.promiseEyebrow}</p> : null}
          <h2 className="pd-section-title">{T.promiseTitle}</h2>
          {T.promiseLinkText ? (
            <Link href="/notre-histoire" className="section-link">
              {T.promiseLinkText} <ChevronRightIcon />
            </Link>
          ) : null}
        </div>
        <ul className="pd-promise-grid">
          {items.map((p, i) => (
            <li key={i}>
              <span className="pd-promise-icon">
                <FaIcon name={p.icon} />
              </span>
              <strong>{p.title}</strong>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProductFaq({ faq = [], contactEmail, T = {} }) {
  if (!faq.length) return null;
  return (
    <section className="pd-faq">
      <div className="container pd-faq-inner">
        <div className="pd-faq-head">
          {T.faqEyebrow ? <p className="eyebrow">{T.faqEyebrow}</p> : null}
          <h2 className="pd-section-title">{T.faqTitle}</h2>
          {contactEmail && T.faqContact ? (
            <p>
              {T.faqContact.split("{email}").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <div className="faq-list">
          {faq.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Rappel d'achat en bas de fiche : renvoie vers le bloc d'achat (choix de formule inclus).
export function ProductFinalCta({ product, T = {} }) {
  const image = product.images?.find((i) => i.url && i.type !== "video");
  return (
    <section className="pd-final">
      <div className="container pd-final-inner">
        {image ? (
          <div className="pd-final-media">
            <Image src={image.url} alt={image.alt || product.name} fill sizes="200px" style={{ objectFit: "contain" }} />
          </div>
        ) : null}
        <div className="pd-final-text">
          {T.finalEyebrow ? <p className="eyebrow">{T.finalEyebrow}</p> : null}
          <h2>{product.name}</h2>
          {T.finalSubline ? <p>{T.finalSubline}</p> : null}
        </div>
        <div className="pd-final-buy">
          <span className="pd-final-price">{formatPrice(product.price)}</span>
          <a href="#acheter" className="btn btn-accent btn-lg">
            {T.finalCta}
          </a>
        </div>
      </div>
    </section>
  );
}
