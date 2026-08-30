import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({ children }) {
  const [content, navigation, categories] = await Promise.all([
    getSettings("content"),
    getSettings("navigation"),
    getCategories(),
  ]);
  const navCategories = categories.filter((c) => c.showInNav !== false);

  return (
    <>
      <Header content={content} categories={navCategories} navItems={navigation.items} />
      {children}
      <Footer content={content} />
    </>
  );
}
