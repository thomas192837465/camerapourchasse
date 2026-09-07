import Link from "next/link";

// Remplace une fausse fiche "auteur" : renvoie vers la vraie page Notre histoire du site.
export default function BlogAboutBox({ title, text }) {
  return (
    <div className="blog-sidebar-card blog-about-box">
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
      <Link href="/notre-histoire" className="blog-card-link">
        Découvrir notre histoire →
      </Link>
    </div>
  );
}
