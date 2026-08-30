import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getSettings } from "@/lib/settings";
import { CartProvider } from "@/lib/cart-context";

config.autoAddCss = false;

export async function generateMetadata() {
  const seo = await getSettings("seo");
  return {
    title: {
      default: seo.siteTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultMetaDescription,
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
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
