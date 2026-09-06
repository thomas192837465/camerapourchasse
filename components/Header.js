"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMarkIcon, CartIcon, UserIcon, ChevronDownIcon, MenuIcon, CloseIcon } from "./Icons";
import { useCart } from "@/lib/cart-context";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

export default function Header({ content, categories = [], navItems = [] }) {
  const { count, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo" onClick={closeMobile}>
          <span className="logo-mark">
            {content.logoImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cloudinaryTransform(content.logoImage.url, "w_120,q_auto,f_auto")} alt={content.logoImage.alt || ""} />
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
          <Link href="/compte" className="icon-btn" aria-label="Compte" onClick={closeMobile}>
            <UserIcon />
          </Link>
          <button
            type="button"
            className="icon-btn mobile-menu-toggle"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="mobile-nav" aria-label="Menu mobile">
          <details className="mobile-nav-group">
            <summary>
              Produits <ChevronDownIcon />
            </summary>
            <div className="mobile-nav-sublinks">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/produits/${cat.slug}`} onClick={closeMobile}>
                  {cat.name}
                </Link>
              ))}
              <Link href="/produits" onClick={closeMobile}>
                Toutes les caméras
              </Link>
            </div>
          </details>
          {navItems.map((item) =>
            item.children?.length ? (
              <details className="mobile-nav-group" key={item.id}>
                <summary>
                  {item.label} <ChevronDownIcon />
                </summary>
                <div className="mobile-nav-sublinks">
                  {item.children.map((child) => (
                    <Link key={child.id} href={child.href || "#"} onClick={closeMobile}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link key={item.id} className="mobile-nav-link" href={item.href || "#"} onClick={closeMobile}>
                {item.label}
              </Link>
            )
          )}
        </nav>
      ) : null}
    </header>
  );
}
