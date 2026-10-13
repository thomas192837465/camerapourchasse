"use client";

import { useState } from "react";

export default function ContactForm({ subjects = [], successText, fallbackEmail }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "L'envoi a échoué.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-success" role="status">
        <strong>Message envoyé</strong>
        <p>{successText}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-row">
        <div className="form-field">
          <label htmlFor="c-name">Nom</label>
          <input id="c-name" name="name" required autoComplete="name" />
        </div>
        <div className="form-field">
          <label htmlFor="c-email">E-mail</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="contact-row">
        {subjects.length ? (
          <div className="form-field">
            <label htmlFor="c-subject">Sujet</label>
            <select id="c-subject" name="subject" defaultValue={subjects[0]}>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="form-field">
          <label htmlFor="c-order">
            N° de commande <span className="contact-optional">(facultatif)</span>
          </label>
          <input id="c-order" name="order" />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows={6} required minLength={5} />
      </div>
      {/* Champ piège anti-robots : invisible pour les visiteurs. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="contact-hp" aria-hidden="true" />
      {error ? (
        <p className="contact-error" role="alert">
          {error}
          {fallbackEmail ? (
            <>
              {" "}
              <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>
            </>
          ) : null}
        </p>
      ) : null}
      <button type="submit" className="btn btn-accent btn-lg" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Envoyer mon message"}
      </button>
    </form>
  );
}
