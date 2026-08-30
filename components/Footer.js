import Link from "next/link";
import { LogoMarkIcon } from "./Icons";

export default function Footer({ content }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-mark" style={{ background: "rgba(255,255,255,0.1)" }}>
              <LogoMarkIcon />
            </span>
            <span className="logo-text">
              <span className="line1" style={{ color: "#fff" }}>{content.logoLine1}</span>
              <span className="line2" style={{ color: "#9fc79a" }}>{content.logoLine2}</span>
            </span>
          </div>
          <p>{content.footerDescription}</p>
        </div>
        <div>
          <h4>Boutique</h4>
          <ul>
            <li><Link href="/produits?categorie=cameras-4g">Caméras 4G</Link></li>
            <li><Link href="/produits?categorie=vision-nocturne">Vision Nocturne</Link></li>
            <li><Link href="/produits?categorie=accessoires">Accessoires</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link href="#">Livraison</Link></li>
            <li><Link href="#">Garantie</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Entreprise</h4>
          <ul>
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">À propos</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {content.logoLine1} {content.logoLine2}. Tous droits réservés.</div>
    </footer>
  );
}
