"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CLARITY_PROJECT_ID, clarityEnabled } from "@/lib/clarity";
import { CONSENT_MODE, CONSENT_DECIDED_EVENT, readStoredConsent } from "@/lib/gtag";

// Clarity n'a pas d'équivalent du "mode consentement" de Google : contrairement à gtag, son script
// commence à enregistrer dès qu'il est chargé. On ne l'injecte donc dans la page qu'une fois le
// consentement "Analyse" accordé (voir ConsentBanner) — jamais avant, jamais si refusé. Si le mode
// consentement est désactivé sur le site (NEXT_PUBLIC_CONSENT_MODE absent), on charge normalement.
export default function ClarityTag() {
  const [allowed, setAllowed] = useState(!CONSENT_MODE);

  useEffect(() => {
    if (!CONSENT_MODE) return undefined;

    function checkConsent() {
      const stored = readStoredConsent();
      if (stored?.analytics) setAllowed(true);
    }

    checkConsent();
    window.addEventListener(CONSENT_DECIDED_EVENT, checkConsent);
    return () => window.removeEventListener(CONSENT_DECIDED_EVENT, checkConsent);
  }, []);

  if (!clarityEnabled || !allowed) return null;

  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
