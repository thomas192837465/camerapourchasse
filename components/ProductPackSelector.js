import FaIcon from "./FaIcon";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

function formatPrice(value) {
  return `${Number(value).toFixed(2).replace(".", ",")}€`;
}

// Sélecteur "formule" pour les produits Shopify vendus avec un pack (ex : "Caméra seule" / "Pack
// Prêt à filmer" avec carte SD) — chaque carte affiche son propre prix, son économie réelle et sa
// liste d'articles inclus. Un <label> (pas un <button>) enveloppe chaque carte pour pouvoir
// contenir un contrôle interactif (ex : le choix de la capacité de la carte SD via `extra`) sans
// imbrication invalide.
export default function ProductPackSelector({ variants, selectedId, onSelect }) {
  return (
    <div className="pack-selector" role="radiogroup">
      {variants.map((v) => {
        const selected = v.id === selectedId;
        const savings = v.compareAtPrice > v.price ? v.compareAtPrice - v.price : 0;

        return (
          <label
            key={v.id}
            className={`pack-option${selected ? " selected" : ""}${!v.availableForSale ? " disabled" : ""}`}
          >
            <input
              type="radio"
              name="pack-option"
              className="pack-option-input"
              checked={selected}
              disabled={!v.availableForSale}
              onChange={() => onSelect(v.id)}
            />

            {v.badge ? <span className="pack-option-badge">{v.badge}</span> : null}

            <span className={`pack-option-radio${selected ? " checked" : ""}`} aria-hidden="true" />

            <span className="pack-option-body">
              <strong className="pack-option-title">{v.title}</strong>
              {v.subtitle ? <span className="pack-option-subtitle">{v.subtitle}</span> : null}
              {v.items?.length ? (
                <span className="pack-option-items">
                  {v.items.map((item, i) => (
                    <span className="pack-option-item" key={i}>
                      {item.image?.url ? (
                        <img
                          className="pack-option-item-img"
                          src={cloudinaryTransform(item.image.url, "w_60,h_60,c_fill,q_auto,f_auto")}
                          alt={item.image.alt || ""}
                        />
                      ) : (
                        <FaIcon name={item.icon} />
                      )}
                      {item.label}
                    </span>
                  ))}
                </span>
              ) : null}
              {v.extra ? <span className="pack-option-extra">{v.extra}</span> : null}
            </span>

            <span className="pack-option-price">
              {v.compareAtPrice > v.price ? (
                <span className="compare">{formatPrice(v.compareAtPrice)}</span>
              ) : null}
              <strong>{formatPrice(v.price)}</strong>
              {savings > 0 ? <span className="pack-option-savings">Économie réelle : {formatPrice(savings)}</span> : null}
              <span className="pack-option-stock">{v.availableForSale ? "Disponible" : "Rupture de stock"}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
