import Link from "next/link";
import { getOrderById, ORDER_STATUSES } from "@/lib/orders";
import { CheckIcon } from "@/components/Icons";

export const metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: true },
};

function statusLabel(value) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label || value;
}

export default async function ConfirmationPage({ params }) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  return (
    <main className="container">
      <div className="confirmation-box">
        <div className="confirmation-icon">
          <CheckIcon />
        </div>
        <h1 className="page-title">Merci, votre commande est confirmée !</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 8 }}>
          Numéro de commande : <strong>{orderId}</strong>
        </p>
        {order ? (
          <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
            Statut : <strong>{statusLabel(order.status)}</strong> — un e-mail de confirmation vous sera envoyé à{" "}
            {order.customer?.email}.
          </p>
        ) : null}

        {order?.items?.length ? (
          <div className="summary-card" style={{ textAlign: "left", marginBottom: 24 }}>
            {order.items.map((it, i) => (
              <div className="summary-row" key={i}>
                <span>
                  {it.name} × {it.qty}
                </span>
                <span>€{(it.qty * it.price).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
            <div className="summary-row total">
              <span>Total</span>
              <span>€{Number(order.total).toFixed(2).replace(".", ",")}</span>
            </div>
            {order.shipping?.trackingNumber ? (
              <p style={{ marginTop: 14, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                Suivi : {order.shipping.trackingNumber}
                {order.shipping.trackingUrl ? (
                  <>
                    {" "}
                    —{" "}
                    <a href={order.shipping.trackingUrl} target="_blank" rel="noopener noreferrer">
                      suivre le colis
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        ) : null}

        <Link href="/produits" className="btn btn-primary">
          Continuer mes achats
        </Link>
      </div>
    </main>
  );
}
