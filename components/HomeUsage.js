import Link from "next/link";
import Image from "next/image";
import FaIcon from "./FaIcon";
import { ChevronRightIcon } from "./Icons";

/**
 * Guide de choix par usage (accueil) : 3 situations de terrain → les modèles adaptés.
 * La photo de fond de chaque carte reprend celle de la catégorie vers laquelle elle pointe.
 */
export default function HomeUsage({ content, categories = [] }) {
  const items = (content.homeUsageItems || []).filter((i) => i.title);
  if (!items.length) return null;

  const imageFor = (href = "") => {
    const slug = href.split("/").filter(Boolean).pop();
    return categories.find((c) => c.slug === slug)?.image;
  };

  return (
    <section className="section home-usage" id="choisir">
      <div className="container">
        <div className="section-intro">
          {content.homeUsageEyebrow ? <p className="eyebrow">{content.homeUsageEyebrow}</p> : null}
          <h2 className="section-title">{content.homeUsageTitle}</h2>
          {content.homeUsageSubtitle ? <p className="section-sub">{content.homeUsageSubtitle}</p> : null}
        </div>

        <div className="usage-grid">
          {items.map((item, i) => {
            const img = imageFor(item.href);
            return (
              <Link key={i} href={item.href || "/produits"} className="usage-card">
                {img?.url ? (
                  <Image
                    className="usage-card-bg"
                    src={img.url}
                    alt=""
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                  />
                ) : null}
                <span className="usage-card-shade" aria-hidden="true" />
                <span className="usage-card-top">
                  <span className="usage-card-icon">
                    <FaIcon name={item.icon} />
                  </span>
                  {item.tag ? <span className="usage-card-tag">{item.tag}</span> : null}
                </span>
                <span className="usage-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.models ? <span className="usage-card-models">{item.models}</span> : null}
                  <span className="usage-card-cta">
                    Voir les modèles <ChevronRightIcon />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {content.homeUsageAccessoriesText ? (
          <p className="usage-more">
            <Link href={content.homeUsageAccessoriesHref || "/produits"} className="section-link">
              {content.homeUsageAccessoriesText} <ChevronRightIcon />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
