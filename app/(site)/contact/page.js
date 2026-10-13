import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/metadata";
import ContactForm from "@/components/ContactForm";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata("/contact", {
    title: "Contact et SAV",
    description:
      "Une question sur une caméra de chasse, une commande ou la garantie ? Contactez l'équipe WildTrail, basée en France.",
  });
}

export default async function ContactPage() {
  const [content, legal] = await Promise.all([getSettings("content"), getSettings("legal")]);
  const subjects = (content.contactSubjects || []).map((s) => String(s).trim()).filter(Boolean);
  const phoneHref = legal.phone ? `tel:${legal.phone.replace(/[^\d+]/g, "")}` : "";

  return (
    <main className="container contact-page">
      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <span className="current">Contact</span>
      </nav>

      <h1 className="listing-title">{content.contactTitle || "Contact"}</h1>
      {content.contactIntro ? <p className="contact-intro">{content.contactIntro}</p> : null}

      <div className="contact-grid">
        <section className="contact-card">
          <ContactForm subjects={subjects} successText={content.contactSuccess} fallbackEmail={legal.email} />
        </section>

        <aside className="contact-aside">
          {legal.email || legal.phone ? (
            <div className="contact-info">
              <h2>Nous joindre</h2>
              {legal.email ? (
                <p>
                  <span>E-mail</span>
                  <a href={`mailto:${legal.email}`}>{legal.email}</a>
                </p>
              ) : null}
              {legal.phone ? (
                <p>
                  <span>Téléphone</span>
                  <a href={phoneHref}>{legal.phone}</a>
                </p>
              ) : null}
              {content.contactHours ? <p className="contact-hours">{content.contactHours}</p> : null}
            </div>
          ) : content.contactHours ? (
            <div className="contact-info">
              <p className="contact-hours">{content.contactHours}</p>
            </div>
          ) : null}

          <div className="contact-info">
            <h2>Avant d&apos;écrire</h2>
            <ul className="contact-links">
              <li>
                <Link href="/livraison">Délais et suivi de livraison</Link>
              </li>
              <li>
                <Link href="/cgv">Retours et garantie (CGV)</Link>
              </li>
              <li>
                <Link href="/produits">Comparer nos caméras de chasse</Link>
              </li>
              <li>
                <Link href="/blog">Nos guides sur le blog</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
