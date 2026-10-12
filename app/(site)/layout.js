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
  const navCategories = categories.filter((c) => c.showInNav !== false);

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
      <Header content={shellContent} categories={navCategories} navItems={navigation.items} />
      {children}
      <BlogTeaser posts={recentPosts} />
      <Footer content={shellContent} />
      <CartDrawer content={shellContent} />
      <PromoPopup content={shellContent} />
      <ClarityTag />
    </>
  );
}
