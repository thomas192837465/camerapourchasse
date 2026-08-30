import Link from "next/link";
import Image from "next/image";

export default function Hero({ content }) {
  const heroImage = content.heroImage?.url;

  return (
    <section className="hero-v2">
      <div className="hero-v2-media">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={content.heroImage?.alt || content.heroTitle}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a5c47"></stop>
                <stop offset="100%" stopColor="#1c2a1c"></stop>
              </linearGradient>
              <linearGradient id="fogGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9aa88f" stopOpacity="0.35"></stop>
                <stop offset="100%" stopColor="#9aa88f" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <rect width="1200" height="560" fill="url(#skyGrad)"></rect>
            <g opacity="0.5" fill="#2b3a28">
              <polygon points="0,420 60,270 120,420"></polygon>
              <polygon points="70,430 150,240 230,430"></polygon>
              <polygon points="200,420 260,300 320,420"></polygon>
              <polygon points="900,430 970,250 1040,430"></polygon>
              <polygon points="1000,420 1080,260 1160,420"></polygon>
              <polygon points="1120,430 1180,300 1200,430"></polygon>
            </g>
            <g opacity="0.75" fill="#233420">
              <polygon points="-20,450 70,230 160,450"></polygon>
              <polygon points="140,460 250,210 360,460"></polygon>
              <polygon points="850,460 940,220 1030,460"></polygon>
              <polygon points="980,450 1080,240 1180,450"></polygon>
            </g>
            <rect x="0" y="380" width="1200" height="180" fill="url(#fogGrad)"></rect>
            <rect x="640" y="140" width="46" height="420" fill="#2c2115" rx="6"></rect>
            <rect x="640" y="140" width="46" height="420" fill="#000" opacity="0.15" rx="6"></rect>
            <g fill="none" stroke="#3a2c1c" strokeWidth="3" opacity="0.5">
              <path d="M642 200q23 20 0 40q23 20 0 40q23 20 0 40"></path>
              <path d="M684 260q-23 20 0 40q-23 20 0 40"></path>
            </g>
            <g transform="translate(500,300)">
              <ellipse cx="120" cy="255" rx="90" ry="14" fill="#0e150e" opacity="0.4"></ellipse>
              <path
                d="M60 255 L75 150 Q78 130 100 128 L110 128 Q112 105 130 100 L140 100 Q145 90 155 92 Q158 78 148 70 Q160 68 168 78 Q182 82 178 98 L178 128 Q195 132 196 152 L205 255 Z"
                fill="#161d13"
              ></path>
              <rect x="140" y="118" width="34" height="24" rx="3" fill="#0f1a12" stroke="#3a4a30" strokeWidth="2"></rect>
              <circle cx="157" cy="130" r="6" fill="#4a6b3d"></circle>
            </g>
            <circle cx="960" cy="120" r="70" fill="#cfd9a8" opacity="0.18"></circle>
          </svg>
        )}
        <div className="hero-v2-overlay" aria-hidden="true" />
      </div>

      <div className="container">
        <div className="hero-v2-content">
          <h1>{content.heroTitle}</h1>
          <p>{content.heroSubtitle}</p>
          <Link href="/produits" className="btn btn-primary">
            {content.heroButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
