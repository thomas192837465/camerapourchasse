import FaIcon from "./FaIcon";

export default function TechPromise({ title, items }) {
  if (!items?.length) return null;

  return (
    <section className="section tech-promise">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="tech-promise-grid">
          {items.map((item, i) => (
            <div className="tech-item" key={i}>
              <span className="tech-item-icon">
                <FaIcon name={item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
