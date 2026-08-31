import Link from "next/link";
import Image from "next/image";
import { CameraIcon, CheckIcon } from "./Icons";
import PawPattern from "./PawPattern";
import HeroCameraBackdrop from "./HeroCameraBackdrop";

export default function Hero({ content, images = [] }) {
  const heroImage = content.heroImage?.url;
  const highlights = (content.features || []).slice(0, 3);

  return (
    <section className="hero-v2">
      <PawPattern color={content.heroPatternColor || "#2c5b3d"} />
      <div className="container hero-v2-inner">
        <div className="hero-v2-content">
          <h1>{content.heroTitle}</h1>
          <p>{content.heroSubtitle}</p>

          {highlights.length ? (
            <ul className="hero-v2-highlights">
              {highlights.map((item, i) => (
                <li key={i}>
                  <CheckIcon /> {item.title}
                </li>
              ))}
            </ul>
          ) : null}

          <Link href="/produits" className="btn btn-primary">
            {content.heroButtonText}
          </Link>
        </div>

        <div className="hero-v2-media-wrap">
          {content.heroImageCaption ? (
            <div className="hero-v2-annotation">
              <span>{content.heroImageCaption}</span>
              <svg viewBox="0 0 90 60" fill="none" aria-hidden="true">
                <path d="M82,4 C60,8 34,22 18,48" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M9,38 L18,48 L28,41" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
          <div className="hero-v2-media">
            <HeroCameraBackdrop images={images} />
            {heroImage ? (
              <Image
                src={heroImage}
                alt={content.heroImage?.alt || content.heroTitle}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                priority
              />
            ) : (
              <span className="hero-v2-media-placeholder">
                <CameraIcon />
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
