import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import localFont from "next/font/local";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getSettings } from "@/lib/settings";
import { CartProvider } from "@/lib/cart-context";
import GoogleTag from "@/components/GoogleTag";
import ConsentBanner from "@/components/ConsentBanner";

config.autoAddCss = false;

// Polices auto-hébergées (fichiers servis par le site lui-même, aucun appel à Google Fonts :
// plus rapide au premier affichage et sans transfert d'IP vers Google — conforme RGPD).
const fontBody = localFont({
  src: [
    { path: "../node_modules/@fontsource/barlow/files/barlow-latin-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/barlow/files/barlow-latin-500-normal.woff2", weight: "500" },
    { path: "../node_modules/@fontsource/barlow/files/barlow-latin-600-normal.woff2", weight: "600" },
    { path: "../node_modules/@fontsource/barlow/files/barlow-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

const fontDisplay = localFont({
  src: [
    { path: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2", weight: "600" },
    { path: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", weight: "700" },
    { path: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "system-ui", "sans-serif"],
});

export const revalidate = 60;

// Favicon par défaut (pictogramme caméra sur fond vert) tant qu'aucune image n'est envoyée dans
// Admin → Réglages → SEO — garantit qu'un favicon valide est toujours détectable, y compris par Google.
const DEFAULT_FAVICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#11171c"/><rect x="4" y="8" width="16" height="11" rx="2.5" fill="none" stroke="#9bcb3c" stroke-width="1.8"/><circle cx="12" cy="13.5" r="3.2" fill="none" stroke="#fff" stroke-width="1.8"/><rect x="9" y="5" width="4" height="3" rx="0.8" fill="none" stroke="#fff" stroke-width="1.8"/></svg>';
const DEFAULT_FAVICON = `data:image/svg+xml,${encodeURIComponent(DEFAULT_FAVICON_SVG)}`;

// Sans cette balise, certains navigateurs mobiles (surtout Android) supposent une largeur de bureau
// par défaut et zooment la page pour compenser — d'où un rendu correct sur certains téléphones et
// "trop zoomé" sur d'autres, selon la façon dont chaque navigateur comble cette absence.
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata() {
  const seo = await getSettings("seo");
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.wildtrail.fr"),
    title: {
      default: seo.siteTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultMetaDescription,
    icons: {
      icon: seo.favicon || DEFAULT_FAVICON,
    },
    openGraph: {
      title: seo.siteTitle,
      description: seo.defaultMetaDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
      locale: "fr_FR",
      type: "website",
    },
  };
}

function themeToCssVars(theme) {
  return `:root{
    --green-900:${theme.green900};
    --green-800:${theme.green800};
    --green-700:${theme.green700};
    --green-600:${theme.green600};
    --green-500:${theme.green500};
    --green-100:${theme.green100};
    --green-50:${theme.green50};
    --gold:${theme.gold};
    --ink:${theme.ink};
    --ink-soft:${theme.inkSoft};
    --ink-faint:${theme.inkFaint};
    --bg:${theme.bg};
    --card:${theme.card};
    --border:${theme.border};
    --accent:${theme.accent};
    --accent-hover:${theme.accentHover};
    --accent-ink:${theme.accentInk};
    --forest:${theme.forest};
  }`;
}

export default async function RootLayout({ children }) {
  const theme = await getSettings("themeV2");

  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeToCssVars(theme) }} />
      </head>
      <body className={`${fontBody.variable} ${fontDisplay.variable}`}>
        <CartProvider>{children}</CartProvider>
        <GoogleTag />
        <ConsentBanner />
      </body>
    </html>
  );
}
