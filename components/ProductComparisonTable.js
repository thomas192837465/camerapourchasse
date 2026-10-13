import { formatPrice } from "@/lib/format";

// Tableau comparatif de la gamme (Admin → Contenu → « Page Nos caméras »). Les lignes sont
// saisies dans l'admin ; le prix est lu en direct sur le produit dont le nom contient le modèle
// (ex : "H80" → "WildTrail H80 : …"), pour ne jamais afficher un prix périmé.
export default function ProductComparisonTable({ title, rows = [], products = [] }) {
  const lines = rows.filter((r) => r?.model);
  if (!lines.length) return null;

  const priceOf = (model) => {
    const needle = new RegExp(`\\b${model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const product = products.find((p) => needle.test(p.name || ""));
    return product ? formatPrice(product.price) : "";
  };
  const hasEnergy = lines.some((r) => r.energy);
  const hasNight = lines.some((r) => r.night);

  return (
    <div className="content-blocks-table-wrap">
      {title ? <h2 className="reco-title content-blocks-heading">{title}</h2> : null}
      <div className="compare-table-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Modèle</th>
              <th>Connexion</th>
              {hasEnergy ? <th>Énergie</th> : null}
              {hasNight ? <th>Vision nocturne</th> : null}
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((row) => (
              <tr key={row.id || row.model}>
                <th>{row.model}</th>
                <td>{row.connectivity || "—"}</td>
                {hasEnergy ? <td>{row.energy || "—"}</td> : null}
                {hasNight ? <td>{row.night || "—"}</td> : null}
                <td>{priceOf(row.model) || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
