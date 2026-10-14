import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getRecentPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogTeaser from "@/components/BlogTeaser";
import CartDrawer from "@/components/CartDrawer";
import PromoPopup from "@/components/PromoPopup";
import ClarityTag from "@/components/ClarityTag";

export const revalidate = 60;

export default async function SiteLayout({ children }) {
  const [content, navigation, categories, recentPosts] = await Promise.all([
    getSettings("content"),
    getSettings("navigation"),
    getCategories(),
    getRecentPosts(3),
  ]);
  // Une catégorie déjà présente comme lien du menu (ex : Accessoires) n'est pas répétée dans le
  // menu déroulant "Nos caméras".
  const linkedPaths = new Set(
    (navigation.items || []).flatMap((item) => [item.href, ...(item.children || []).map((c) => c.href)]).filter(Boolean)
  );
  const navCategories = categories.filter(
    (c) => c.showInNav !== false && !linkedPaths.has(`/produits/${c.slug}`)
  );

  // Les composants interactifs (header, footer, panier, popup) ne reçoivent que les champs dont
  // ils ont besoin : envoyer tout le contenu de l'accueil au navigateur alourdissait chaque page.
  const shellContent = {
    logoImage: content.logoImage,
    logoImageLight: content.logoImageLight,
    logoLine1: content.logoLine1,
    logoLine2: content.logoLine2,
    announcementText: content.announcementText,
    footerColumns: content.footerColumns,
    footerDescription: content.footerDescription,
    newsletterTitle: content.newsletterTitle,
    cartBannerText: content.cartBannerText,
    freeShippingThreshold: content.freeShippingThreshold,
    promoPopupEnabled: content.promoPopupEnabled,
    promoCodeValue: content.promoCodeValue,
    paymentMethods: content.paymentMethods,
    qtyTiers: content.qtyTiersEnabled !== false ? content.qtyTiers : [],
  };

  return (
    <>
      <Header
        content={shellContent}
        categories={navCategories}
        navItems={navigation.items}
        productsLabel={navigation.productsLabel || "Nos caméras"}
        productsAllLabel={navigation.productsAllLabel || "Toutes les caméras"}
        productsDropdown={navigation.productsDropdown === true}
      />
      {children}
      <BlogTeaser posts={recentPosts} />
      <Footer content={shellContent} />
      <CartDrawer content={shellContent} />
      <PromoPopup content={shellContent} />
      <ClarityTag />
    </>
  );
}
