import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Caveat } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getSettings } from "@/lib/settings";
import { CartProvider } from "@/lib/cart-context";

config.autoAddCss = false;

const caveat = Caveat({ subsets: ["latin"], variable: "--font-handwritten", display: "swap" });

// Favicon par défaut (pictogramme caméra sur fond vert) tant qu'aucune image n'est envoyée dans
// Admin → Réglages → SEO — garantit qu'un favicon valide est toujours détectable, y compris par Google.
const DEFAULT_FAVICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#2c5b3d"/><rect x="4" y="8" width="16" height="11" rx="2.5" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="13.5" r="3.2" fill="none" stroke="#fff" stroke-width="1.8"/><rect x="9" y="5" width="4" height="3" rx="0.8" fill="none" stroke="#fff" stroke-width="1.8"/></svg>';
const DEFAULT_FAVICON = `data:image/svg+xml,${encodeURIComponent(DEFAULT_FAVICON_SVG)}`;

export async function generateMetadata() {
  const seo = await getSettings("seo");
  return {
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
  }`;
}

export default async function RootLayout({ children }) {
  const theme = await getSettings("theme");

  return (
    <html lang="fr">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeToCssVars(theme) }} />
      </head>
      <body className={caveat.variable}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
