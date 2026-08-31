import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public", "hero-pattern.svg");

// Sert le motif de fond du hero (fichier fourni par l'admin, potentiellement volumineux) en
// remplaçant sa couleur de trace d'origine par la couleur choisie dans Admin > Contenu, calculé
// côté serveur pour ne jamais charger ce SVG dans le bundle JavaScript du site.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const color = searchParams.get("color") || "#2c5b3d";
  if (!/^#[0-9a-fA-F]{3,8}$/.test(color)) {
    return new Response("Invalid color", { status: 400 });
  }

  let svg;
  try {
    svg = fs.readFileSync(FILE_PATH, "utf-8");
  } catch {
    return new Response("Not found", { status: 404 });
  }

  // Remplace toute couleur de trace "placeholder" (blanc cassé / jaune vif utilisés par l'outil
  // de vectorisation) par la couleur choisie — couvre les variantes rencontrées d'un export à l'autre.
  svg = svg.replace(/fill="#(FEFEFE|FFFF0[0-9A-Fa-f])"/gi, `fill="${color}"`);
  // Le contour magenta laissé par l'outil de vectorisation ne doit jamais être visible.
  svg = svg.replace(/stroke="#FF00FF"/gi, `stroke="${color}"`);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}
