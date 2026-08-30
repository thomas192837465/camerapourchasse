import Link from "next/link";
import { CameraIcon, MoonIcon, ImageIcon, CardIcon } from "./Icons";

const ICONS = {
  camera: CameraIcon,
  moon: MoonIcon,
  image: ImageIcon,
  card: CardIcon,
};

export default function CategoryGrid({ categories }) {
  return (
    <div className="categories-grid">
      {categories.map((cat) => {
        const Icon = ICONS[cat.icon] || CameraIcon;
        return (
          <Link key={cat.id} className="category-card" href={`/produits?categorie=${cat.slug}`}>
            <span className="category-icon">
              <Icon />
            </span>
            <h3>{cat.name}</h3>
          </Link>
        );
      })}
    </div>
  );
}
