"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/orders";
import { firebaseEnabled } from "@/lib/firebase";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "France",
};

export default function CheckoutView() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!items.length) {
    return (
      <main className="container">
        <div className="empty-state">
          <h2>Votre panier est vide</h2>
          <Link href="/produits" className="btn btn-primary">
            Découvrir nos Produits
          </Link>
        </div>
      </main>
    );
  }

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firebaseEnabled) {
      setError(
        "La prise de commande nécessite que Firebase soit configuré (voir .env.local.example). Contactez l'administrateur du site."
      );
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await createOrder({
        customer: form,
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          qty: it.qty,
          price: it.price,
          image: it.image,
          variant: it.variant,
        })),
        total,
      });
      clear();
      router.push(`/commande/confirmation/${orderId}`);
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <h1 className="page-title">Finaliser la commande</h1>

      {!firebaseEnabled ? (
        <div className="banner warning">
          Firebase n'est pas encore configuré : la commande ne pourra pas être enregistrée tant que le site n'est
          pas connecté à votre projet Firebase.
        </div>
      ) : null}

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="form-card">
          <h2>Coordonnées & livraison</h2>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="name">Nom complet</label>
              <input id="name" required value={form.name} onChange={set("name")} />
            </div>
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Téléphone</label>
              <input id="phone" required value={form.phone} onChange={set("phone")} />
            </div>
            <div className="form-field full">
              <label htmlFor="address">Adresse</label>
              <input id="address" required value={form.address} onChange={set("address")} />
            </div>
            <div className="form-field">
              <label htmlFor="city">Ville</label>
              <input id="city" required value={form.city} onChange={set("city")} />
            </div>
            <div className="form-field">
              <label htmlFor="postalCode">Code postal</label>
              <input id="postalCode" required value={form.postalCode} onChange={set("postalCode")} />
            </div>
            <div className="form-field full">
              <label htmlFor="country">Pays</label>
              <input id="country" required value={form.country} onChange={set("country")} />
            </div>
          </div>

          {error ? <div className="banner error">{error}</div> : null}

          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? "Envoi en cours..." : "Confirmer la commande"}
          </button>
          <p className="form-hint" style={{ marginTop: 10 }}>
            Paiement à réception / par virement pour le moment — le règlement en ligne sera ajouté prochainement.
          </p>
        </div>

        <div className="summary-card">
          <h2>Résumé</h2>
          {items.map((it) => (
            <div className="summary-row" key={it.key}>
              <span>
                {it.name} × {it.qty}
              </span>
              <span>€{(it.qty * it.price).toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>€{total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </form>
    </main>
  );
}
