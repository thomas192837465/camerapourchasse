"use client";

import { useEffect, useState } from "react";
import { addSubscriber } from "@/lib/subscribers";
import { getStoredDiscountCode, storeDiscountCode } from "@/lib/discountCode";

/**
 * Encart "-5 € sur votre commande" sous le bouton d'achat (fiche produit) : le visiteur laisse son
 * e-mail, reçoit le code par e-mail, et le code est mémorisé pour être appliqué automatiquement
 * au paiement Shopify (voir lib/useCheckout.js). Même code que la popup de bienvenue.
 */
export default function PromoInline({ promo }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredDiscountCode();
    if (stored) {
      setCode(stored);
      setState("done");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      await addSubscriber(email, "fiche-produit");
      const res = await fetch("/api/promo-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue, réessayez.");
      if (data.code) {
        storeDiscountCode(data.code);
        setCode(data.code);
      }
      setState("done");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, réessayez.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="promo-inline promo-inline-done">
        <span className="promo-inline-tag">{promo.amountLabel}</span>
        <p>
          {code ? (
            <>
              Code <strong>{code}</strong> activé : il sera appliqué automatiquement au paiement.
            </>
          ) : (
            <>Votre code vous attend dans votre boîte mail.</>
          )}
        </p>
      </div>
    );
  }

  return (
    <form className="promo-inline" onSubmit={handleSubmit}>
      <div className="promo-inline-head">
        <span className="promo-inline-tag">{promo.amountLabel}</span>
        <p>
          <strong>{promo.title}</strong>
          {promo.text ? <small>{promo.text}</small> : null}
        </p>
      </div>
      <div className="promo-inline-row">
        <label htmlFor="promo-inline-email" className="sr-only">
          Votre e-mail
        </label>
        <input
          id="promo-inline-email"
          type="email"
          required
          placeholder="votre@email.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-dark btn-sm" disabled={state === "sending"}>
          {state === "sending" ? "Envoi…" : "Obtenir"}
        </button>
      </div>
      {error ? <p className="promo-inline-error">{error}</p> : null}
    </form>
  );
}
