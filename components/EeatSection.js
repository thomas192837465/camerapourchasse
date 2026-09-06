import FaIcon from "./FaIcon";

// Section "E-E-A-T" (Expérience, Expertise, Autorité, Confiance) : signaux de confiance
// attendus par Google et les moteurs IA sur une page marchande, réunis en un seul bloc visible
// tôt sur la page d'accueil.
export default function EeatSection({ title, subtitle, points }) {
  if (!points?.length) return null;

  return (
    <section className="section eeat-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="eeat-subtitle">{subtitle}</p> : null}
        <div className="eeat-grid">
          {points.map((item, i) => (
            <div className="eeat-item" key={i}>
              <span className="eeat-item-icon">
                <FaIcon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
