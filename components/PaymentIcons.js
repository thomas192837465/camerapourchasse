// Logos de moyens de paiement en couleur (dessins simplifiés, inline : aucun fichier externe).
// N'afficher que les moyens réellement proposés au paiement Shopify.
function Visa() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="Visa">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#d9dde3" />
      <text x="24" y="20" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="900" fontStyle="italic" fill="#1a1f71" letterSpacing="0.5">VISA</text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="Mastercard">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#d9dde3" />
      <circle cx="20" cy="15" r="8" fill="#eb001b" />
      <circle cx="28" cy="15" r="8" fill="#f79e1b" />
      <path d="M24 8.1a8 8 0 0 1 0 13.8 8 8 0 0 1 0-13.8z" fill="#ff5f00" />
    </svg>
  );
}

function CarteBancaire() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="Carte Bancaire">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#d9dde3" />
      <rect x="6" y="7" width="36" height="16" rx="3" fill="#0b6aa8" />
      <path d="M24 7h15a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H24z" fill="#13a35a" />
      <text x="24" y="19" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fontWeight="800" fill="#fff">CB</text>
    </svg>
  );
}

function PayPal() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="PayPal">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#d9dde3" />
      <text x="24" y="19.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10.5" fontWeight="900" fontStyle="italic">
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}

const ICONS = { cb: CarteBancaire, visa: Visa, mastercard: Mastercard, paypal: PayPal };

export default function PaymentIcons({ methods = ["cb", "visa", "mastercard", "paypal"] }) {
  return (
    <div className="payment-icons">
      {methods.map((m) => {
        const Icon = ICONS[m];
        return Icon ? <Icon key={m} /> : null;
      })}
    </div>
  );
}
