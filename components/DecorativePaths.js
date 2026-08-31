/**
 * Décor de fond en lignes organiques fluides (façon "sentier"), inspiré d'un style vu ailleurs
 * mais redessiné avec les couleurs du thème du site (via variables CSS, donc suit le thème admin).
 * Purement décoratif : aria-hidden, ne doit jamais contenir de contenu informatif.
 */
export default function DecorativePaths({ className = "" }) {
  return (
    <svg
      className={`decorative-paths ${className}`}
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dp-fade-a" x1="1200" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--green-500)" stopOpacity="0" />
          <stop offset="0.3" stopColor="var(--green-500)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--green-500)" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="dp-fade-b" x1="400" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--gold)" stopOpacity="0.05" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M1220 -40C1120 60 1180 180 1040 260C880 352 760 300 660 420C560 540 640 640 560 740C495 823 400 800 320 860"
        stroke="url(#dp-fade-a)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M1260 160C1100 200 1040 140 900 220C760 300 800 420 660 480C540 532 460 480 380 560C310 630 340 700 260 760"
        stroke="url(#dp-fade-b)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M1180 460C1080 500 1060 580 940 600C820 620 800 700 680 720"
        stroke="var(--green-600)"
        strokeOpacity="0.12"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
