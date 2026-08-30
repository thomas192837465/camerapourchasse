import Link from "next/link";
import { getOrderById } from "@/lib/orders";
import { CheckIcon } from "@/components/Icons";

export const metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: true },
};

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
            Total : <strong>€{Number(order.total).toFixed(2).replace(".", ",")}</strong> — un e-mail de confirmation
            vous sera envoyé à {order.customer?.email}.
          </p>
        ) : null}
        <Link href="/produits" className="btn btn-primary">
          Continuer mes achats
        </Link>
      </div>
    </main>
  );
}
