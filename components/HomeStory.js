import Link from "next/link";
import Image from "next/image";
import FaIcon from "./FaIcon";
import { ChevronRightIcon } from "./Icons";

/**
 * Bande "Notre histoire" (accueil) : le fondateur, l'origine de la marque et ses engagements
 * vérifiables. Remplace l'ancien bloc E-E-A-T générique : mêmes signaux de confiance pour
 * Google, mais racontés par une vraie personne.
 */
export default function HomeStory({ content, fallbackImage }) {
  if (!content.homeStoryTitle) return null;
  const image = content.homeStoryImage?.url ? content.homeStoryImage : fallbackImage;
  const points = (content.homeStoryPoints || []).filter((p) => p.title);

  return (
    <section className="home-story">
      <div className="container home-story-inner">
        <div className="home-story-media">
          {image?.url ? (
            <Image src={image.url} alt={image.alt || ""} fill sizes="(max-width: 960px) 100vw, 45vw" />
          ) : null}
        </div>

        <div className="home-story-content">
          {content.homeStoryEyebrow ? <p className="eyebrow">{content.homeStoryEyebrow}</p> : null}
          <h2>{content.homeStoryTitle}</h2>
          <blockquote>
            <p>{content.homeStoryText}</p>
            {content.homeStorySignature ? <footer>— {content.homeStorySignature}</footer> : null}
          </blockquote>

          {points.length ? (
            <ul className="home-story-points">
              {points.map((p, i) => (
                <li key={i}>
                  <span className="home-story-point-icon">
                    <FaIcon name={p.icon} />
                  </span>
                  <span>
                    <strong>{p.title}</strong>
                    <small>{p.description}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {content.homeStoryCta ? (
            <Link href={content.homeStoryHref || "/notre-histoire"} className="btn btn-accent">
              {content.homeStoryCta} <ChevronRightIcon />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
