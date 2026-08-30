"use client";

import Link from "next/link";
import { LogoMarkIcon, CartIcon, UserIcon, ChevronDownIcon } from "./Icons";
import { useCart } from "@/lib/cart-context";

export default function Header({ content }) {
  const { count } = useCart();

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <LogoMarkIcon />
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
              <Link href="/produits?categorie=cameras-4g">Caméras 4G</Link>
              <Link href="/produits?categorie=vision-nocturne">Vision Nocturne</Link>
              <Link href="/produits?categorie=haute-resolution">Haute Résolution</Link>
              <Link href="/produits">Toutes les caméras</Link>
            </div>
          </div>
          <Link href="/produits?categorie=accessoires">Accessoires</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Support</Link>
        </nav>

        <div className="header-actions">
          <Link href="/panier" className="icon-btn" aria-label="Panier">
            <CartIcon />
            <span className="cart-badge" style={{ display: count > 0 ? "flex" : "none" }}>
              {count}
            </span>
          </Link>
          <Link href="/admin" className="icon-btn" aria-label="Compte">
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}
