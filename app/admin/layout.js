"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { firebaseEnabled } from "@/lib/firebase";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const { loading, user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!user || !isAdmin) router.replace("/admin/login");
  }, [loading, user, isAdmin, isLoginPage, router]);

  if (isLoginPage) return children;

  if (!firebaseEnabled) {
    return (
      <div className="admin-shell">
        <div className="admin-main" style={{ gridColumn: "1 / -1", maxWidth: 720, margin: "40px auto" }}>
          <div className="banner warning">
            Firebase n'est pas encore configuré. Ajoutez vos variables <code>NEXT_PUBLIC_FIREBASE_*</code> dans{" "}
            <code>.env.local</code> (voir <code>.env.local.example</code>) pour activer l'espace admin.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-main">Chargement…</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">{children}</div>
    </div>
  );
}
