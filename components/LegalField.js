export default function LegalField({ value, placeholder }) {
  if (value) return value;
  return <span className="legal-missing">[{placeholder} — à compléter dans Admin → Réglages → Mentions légales & CGV]</span>;
}
