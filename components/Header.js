"use client";

import Link from "next/link";
import { LogoMarkIcon, CartIcon, UserIcon, ChevronDownIcon } from "./Icons";
import { useCart } from "@/lib/cart-context";

export default function Header({ content, categories = [], navItems = [] }) {
  const { count, openDrawer } = useCart();

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          <span className="logo-mark">
            {content.logoImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.logoImage.url} alt={content.logoImage.alt || ""} />
            ) : (
              <LogoMarkIcon />
            )}
          </span>
          <span className="logo-text">
            <span className="line1">{content.logoLine1}</span>
            <span className="line2">{content.logoLine2}</span>
          </span>
        </Link>

        <nav className="main-nav">
          <div className="nav-dropdown">
            <Link href="/produits">
              Produits <ChevronDownIcon />
            </Link>
            <div className="nav-dropdown-panel">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/produits/${cat.slug}`}>
                  {cat.name}
                </Link>
              ))}
              <Link href="/produits">Toutes les caméras</Link>
            </div>
          </div>
          {navItems.map((item) =>
            item.children?.length ? (
              <div className="nav-dropdown" key={item.id}>
                <Link href={item.href || "#"}>
                  {item.label} <ChevronDownIcon />
                </Link>
                <div className="nav-dropdown-panel">
                  {item.children.map((child) => (
                    <Link key={child.id} href={child.href || "#"}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.id} href={item.href || "#"}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-btn" aria-label="Panier" onClick={openDrawer}>
            <CartIcon />
            <span className="cart-badge" style={{ display: count > 0 ? "flex" : "none" }}>
              {count}
            </span>
          </button>
          <Link href="/compte" className="icon-btn" aria-label="Compte">
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}
