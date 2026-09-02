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

export function renderRichText(raw) {
  if (!raw) return "";
  let html = escapeHtml(raw);

  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, (match, label, url) => {
    const external = url.startsWith("http");
    return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n/g, "<br/>");

  return html;
}
