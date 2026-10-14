import { getSettings } from "@/lib/settings";
import { getSiteCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/metadata";
import { buildFaqJsonLd } from "@/lib/schema";
import Hero from "@/components/Hero";
import TechPromise from "@/components/TechPromise";
import HomeUsage from "@/components/HomeUsage";
import HomeStory from "@/components/HomeStory";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContentBlocks from "@/components/ContentBlocks";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/Icons";

// Sans ça, Next.js peut figer cette page au moment du build sur Vercel : un produit ou un
// article publié ensuite depuis l'admin n'apparaîtrait qu'après un nouveau déploiement.
export const revalidate = 60;

export async function generateMetadata() {
  const [seo, content] = await Promise.all([getSettings("seo"), getSettings("content")]);
  // Image de partage : celle des réglages SEO, sinon la photo du hero (un lien partagé sur
  // WhatsApp / Facebook / un forum s'affiche alors toujours avec un visuel).
  const shareImage = seo.ogImage || content.heroBackgroundImage?.url || content.heroImage?.url;
  return pageMetadata("/", {
    title: "Caméra de chasse 4G et solaire sans abonnement",
    description:
      "WildTrail, marque française de caméras de chasse 4G, solaires et Wi-Fi testées en forêt. Vision nocturne no-glow, garantie 2 ans, SAV en France.",
    images: shareImage ? [shareImage] : undefined,
  });
}

// "42 rue X 85500 Les Herbiers" → PostalAddress structurée (format attendu par Google).
// Si l'adresse saisie ne contient pas de code postal à 5 chiffres, on la laisse en texte brut.
function toPostalAddress(raw) {
  if (!raw) return undefined;
  const m = String(raw).trim().match(/^(.*?)[,\s]+(\d{5})\s+(.+)$/);
  if (!m) return raw;
  return {
    "@type": "PostalAddress",
    streetAddress: m[1].trim(),
    postalCode: m[2],
    addressLocality: m[3].trim().replace(/\b\p{L}/gu, (c) => c.toUpperCase()),
    addressCountry: "FR",
  };
}

export default async function HomePage() {
  const [content, categories, allProducts, seo, legal] = await Promise.all([
    getSettings("content"),
    getSiteCategories(),
    getPublishedProducts(),
    getSettings("seo"),
    getSettings("legal"),
  ]);

  // Rangées complètes de 4 sur l'accueil (le lien "Voir toute la gamme" mène au reste).
  const allBestSellers = allProducts.filter((p) => p.isBestSeller);
  const bestSellers =
    allBestSellers.length > 4 ? allBestSellers.slice(0, Math.floor(allBestSellers.length / 4) * 4) : allBestSellers;

  // Note globale affichée dans le hero : moyenne pondérée des VRAIS avis de toutes les fiches
  // produit (rien d'inventé — si aucun avis, la ligne n'est pas affichée).
  const reviewTotals = allProducts.reduce(
    (acc, p) => {
      const c = p.rating?.count || 0;
      return { count: acc.count + c, sum: acc.sum + c * (p.rating?.average || 0) };
    },
    { count: 0, sum: 0 }
  );
  const globalRating = reviewTotals.count
    ? { count: reviewTotals.count, average: reviewTotals.sum / reviewTotals.count }
    : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // Version machine-readable des signaux de confiance affichés dans la section "Expertise &
  // Confiance" — uniquement des faits réels (coordonnées saisies dans l'admin, note calculée à
  // partir des vrais avis) : jamais de champ inventé pour remplir le schema.
  // Pas d'aggregateRating ici : Google ne retient pas les notes auto-déclarées par l'entreprise
  // elle-même à ce niveau — seules celles portées par chaque Product (déjà en place) sont valides.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: seo.siteTitle,
    url: siteUrl || undefined,
    // Le vrai logo de marque (Admin → Réglages → Contenu), pas l'image de partage réseaux sociaux :
    // c'est ce champ que Google utilise pour associer un logo à l'entreprise (bandeau de résultats,
    // Knowledge Panel). Repli sur ogImage tant qu'aucun logo n'a été envoyé.
    logo: content.logoImage?.url || seo.ogImage || undefined,
    email: legal.email || undefined,
    telephone: legal.phone || undefined,
    address: toPostalAddress(legal.address),
  };

  // WebSite : aide Google à afficher "WildTrail" comme nom du site au-dessus du lien dans les
  // résultats (au lieu du domaine brut).
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.siteTitle,
    url: siteUrl || undefined,
    inLanguage: "fr-FR",
  };

  // Bloc de texte long en bas de l'accueil : masqué par défaut (Admin → Contenu → « Contenu bas de
  // page d'accueil »). La FAQ structurée n'est publiée que si le texte est visible (règle Google).
  const showHomeBlocks = content.homeBlocksVisible === true;
  const faqJsonLd = showHomeBlocks ? buildFaqJsonLd(content.homeBlocks) : null;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <Hero content={content} rating={globalRating} />

      <TechPromise items={content.homeFeatures?.length ? content.homeFeatures : content.features} />

      <div className="container">
        <section className="section">
          <div className="section-head-row">
            <div>
              {content.homeBestEyebrow ? <p className="eyebrow">{content.homeBestEyebrow}</p> : null}
              <h2 className="section-title">{content.homeBestTitle || content.bestSellersTitle}</h2>
            </div>
            <Link href="/produits" className="section-link">
              Voir toute la gamme <ChevronRightIcon />
            </Link>
          </div>
          {bestSellers.length ? (
            <ProductGrid products={bestSellers} />
          ) : (
            <p style={{ color: "var(--ink-soft)" }}>Aucun produit en vedette pour le moment.</p>
          )}
        </section>
      </div>

      <HomeUsage content={content} categories={categories} />

      <HomeStory content={content} fallbackImage={content.heroBackgroundImage} />

      <TestimonialsSection
        title={content.testimonialsTitle}
        rating={content.testimonialsRating}
        testimonials={content.testimonials}
      />

      <TrustBadges items={content.trustBadges} />

      {showHomeBlocks ? (
        <div className="container">
          <ContentBlocks blocks={content.homeBlocks} />
        </div>
      ) : null}
    </main>
  );
}
