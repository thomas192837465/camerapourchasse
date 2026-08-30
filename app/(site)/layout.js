import { getSettings } from "@/lib/settings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({ children }) {
  const content = await getSettings("content");

  return (
    <>
      <Header content={content} />
      {children}
      <Footer content={content} />
    </>
  );
}
