import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getRecentPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogTeaser from "@/components/BlogTeaser";
import CartDrawer from "@/components/CartDrawer";

export default async function SiteLayout({ children }) {
  const [content, navigation, categories, recentPosts] = await Promise.all([
    getSettings("content"),
    getSettings("navigation"),
    getCategories(),
    getRecentPosts(3),
  ]);
  const navCategories = categories.filter((c) => c.showInNav !== false);

  return (
    <>
      <Header content={content} categories={navCategories} navItems={navigation.items} />
      {children}
      <BlogTeaser posts={recentPosts} />
      <Footer content={content} />
      <CartDrawer />
    </>
  );
}
