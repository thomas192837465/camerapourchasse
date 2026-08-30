import FaIcon from "./FaIcon";

export default function TrustBadges({ items }) {
  if (!items?.length) return null;

  return (
    <section className="trust-badges">
      <div className="container trust-badges-grid">
        {items.map((item, i) => (
          <div className="trust-badge" key={i}>
            <span className="trust-badge-icon">
              <FaIcon name={item.icon} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
