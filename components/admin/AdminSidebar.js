"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMarkIcon } from "@/components/Icons";
import { logout } from "@/lib/auth";

const LINKS = [
  { group: "Général", items: [{ href: "/admin", label: "Tableau de bord" }] },
  {
    group: "Catalogue",
    items: [
      { href: "/admin/products", label: "Produits" },
      { href: "/admin/shopify-products", label: "Produits Shopify" },
      { href: "/admin/categories", label: "Catégories" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/orders", label: "Commandes" },
    ],
  },
  {
    group: "Réglages",
    items: [
      { href: "/admin/settings/theme", label: "Thème & couleurs" },
      { href: "/admin/settings/content", label: "Contenu (accueil)" },
      { href: "/admin/settings/navigation", label: "Navigation" },
      { href: "/admin/settings/filters", label: "Filtres de recherche" },
      { href: "/admin/settings/seo", label: "SEO" },
      { href: "/admin/settings/general", label: "Photos produits" },
      { href: "/admin/settings/legal", label: "Mentions légales & CGV" },
      { href: "/admin/settings/team", label: "Équipe & administrateurs" },
      { href: "/admin/settings/shopify", label: "Shopify" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="logo">
        <span className="logo-mark">
          <LogoMarkIcon />
        </span>
        <span className="logo-text">
          <span className="line1" style={{ color: "#fff" }}>ADMIN</span>
          <span className="line2" style={{ color: "#9fc79a" }}>CHASSE PRO</span>
        </span>
      </div>

      {LINKS.map((section) => (
        <div key={section.group}>
          <div className="admin-nav-group-label">{section.group}</div>
          {section.items.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <button className="logout-btn" onClick={() => logout()}>
        Se déconnecter
      </button>
    </aside>
  );
}
