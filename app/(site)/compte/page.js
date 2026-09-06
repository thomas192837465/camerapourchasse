"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import AccountAuthForms from "@/components/AccountAuthForms";
import AccountDashboard from "@/components/AccountDashboard";

export default function ComptePage() {
  const { loading, user } = useAuth();

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <span className="current">Mon compte</span>
      </nav>

      <h1 className="listing-title">Mon compte</h1>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Chargement…</p>
      ) : user ? (
        <AccountDashboard user={user} />
      ) : (
        <AccountAuthForms />
      )}
    </main>
  );
}
