// Mini-syntaxe texte enrichi pour les paragraphes de contenu catégorie : **gras** et [texte](lien).
// On échappe tout le HTML d'abord, puis on n'introduit QUE ces deux balises — jamais de HTML brut
// injecté depuis l'admin, et seuls les liens http(s) ou relatifs (/...) sont acceptés comme href.
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Accepte http(s)://, un chemin relatif (/...), ou un domaine nu (ex: x.com, www.exemple.fr/page)
// auquel on ajoute https:// automatiquement. Tout le reste (javascript:, data:, texte non reconnu...)
// n'est pas transformé en lien, laissé tel quel en texte échappé.
const BARE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s)]*)?$/i;

export function renderRichText(raw) {
  if (!raw) return "";
  let html = escapeHtml(raw);

  html = html.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (match, label, rawUrl) => {
    let url = rawUrl;
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      if (BARE_DOMAIN.test(url)) {
        url = `https://${url}`;
      } else {
        return match;
      }
    }
    const external = url.startsWith("http");
    return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n/g, "<br/>");

  return html;
}
