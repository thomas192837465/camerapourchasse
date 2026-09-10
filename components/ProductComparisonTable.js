// Tableau comparatif de la gamme WildTrail — données saisies à la main (prix vérifiés en direct
// avant publication) plutôt que via le système de blocs générique, qui ne gère que des paires
// label/valeur et pas un tableau à plusieurs colonnes. À mettre à jour si la gamme évolue.
const ROWS = [
  { model: "H20", connectivity: "Aucune (carte SD)", energy: "Solaire", night: "No-glow", price: "79,69 €" },
  { model: "H40", connectivity: "4G", energy: "Batterie", night: "No-glow", price: "87,99 €" },
  { model: "H80", connectivity: "4G + GPS", energy: "Solaire", night: "No-glow", price: "89,99 €" },
  { model: "C20", connectivity: "Wi-Fi + Bluetooth", energy: "Batterie", night: "No-glow", price: "86,63 €" },
  { model: "C40", connectivity: "4G, vue en direct", energy: "Batterie", night: "Couleur basse lumière", price: "89,32 €" },
];

export default function ProductComparisonTable() {
  return (
    <div className="content-blocks-table-wrap">
      <h2 className="reco-title content-blocks-heading">Comparatif de la gamme WildTrail</h2>
      <div className="compare-table-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Modèle</th>
              <th>Connectivité</th>
              <th>Énergie</th>
              <th>Vision nocturne</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.model}>
                <th>{row.model}</th>
                <td>{row.connectivity}</td>
                <td>{row.energy}</td>
                <td>{row.night}</td>
                <td>{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
