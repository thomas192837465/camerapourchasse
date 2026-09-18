"use client";

import { useEffect, useState } from "react";
import FaIcon from "./FaIcon";

function formatDate(date) {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

// Calculée côté client uniquement (useEffect) : "aujourd'hui" dépend de l'horloge du visiteur,
// pas du serveur qui a généré la page — l'afficher dès le rendu serveur risquerait un léger
// décalage d'hydratation si la requête tombe pile à minuit.
export default function DeliveryEstimate() {
  const [dates, setDates] = useState(null);

  useEffect(() => {
    const today = new Date();
    const arrival = new Date(today);
    arrival.setDate(arrival.getDate() + 7);
    setDates({ today: formatDate(today), arrival: formatDate(arrival) });
  }, []);

  if (!dates) return null;

  return (
    <p className="pd-delivery-estimate">
      <FaIcon name="truck" /> Commandez aujourd'hui, {dates.today} — reçu dans votre boîte aux lettres le {dates.arrival}
    </p>
  );
}
