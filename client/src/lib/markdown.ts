const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");

const inlineMarkdown = (value: string) => {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  return html;
};

/** Renders the small, predictable markdown subset used by Technical Information posts. */
export function renderMarkdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];
  let quote: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => { if (paragraph.length) { output.push(`<p>${inlineMarkdown(paragraph.join(" ").trim())}</p>`); paragraph = []; } };
  const flushList = () => { if (!listType || !listItems.length) return; output.push(`<${listType}>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${listType}>`); listType = null; listItems = []; };
  const flushQuote = () => { if (quote.length) { output.push(`<blockquote>${quote.map((line) => `<p>${inlineMarkdown(line)}</p>`).join("")}</blockquote>`); quote = []; } };
  const flushCode = () => { if (code) { output.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`); code = null; } };

  for (const line of lines) {
    if (line.trim().startsWith("```")) { flushParagraph(); flushList(); flushQuote(); if (code) flushCode(); else code = []; continue; }
    if (code) { code.push(line); continue; }
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); flushQuote(); continue; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); flushQuote(); const level = heading[1].length + 1; output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
    if (trimmed.startsWith("> ")) { flushParagraph(); flushList(); quote.push(trimmed.slice(2)); continue; }
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) { flushParagraph(); flushQuote(); const nextType = unordered ? "ul" : "ol"; if (listType && listType !== nextType) flushList(); listType = nextType; listItems.push((unordered ?? ordered)![1]); continue; }
    if (/^---+$/.test(trimmed)) { flushParagraph(); flushList(); flushQuote(); output.push("<hr />"); continue; }
    flushList(); flushQuote(); paragraph.push(trimmed);
  }
  flushParagraph(); flushList(); flushQuote(); flushCode();
  return output.join("\n");
}

const sanitizeLegacyHtml = (html: string) => html
  .replace(/<\/?(script|style|iframe|object|embed|form|input|button|textarea|select)[^>]*>/gi, "")
  .replace(/<([a-z][^>]*)>/gi, (_match, rawTag: string) => {
    const nameMatch = rawTag.match(/^\/?\s*([a-z0-9]+)/i);
    const name = nameMatch?.[1]?.toLowerCase() ?? "";
    const allowed = new Set(["p", "br", "strong", "b", "em", "i", "u", "h2", "h3", "ul", "ol", "li", "blockquote", "pre", "code", "hr", "a"]);
    if (!allowed.has(name)) return "";
    if (rawTag.startsWith("/")) return `</${name}>`;
    if (name !== "a") return `<${name}>`;
    const href = rawTag.match(/href\s*=\s*([\"'])(.*?)\1/i)?.[2] ?? "";
    if (!/^(https?:\/\/|mailto:)/i.test(href)) return "<a>";
    return `<a href=\"${escapeHtml(href)}\" rel=\"noopener noreferrer\">`;
  })
  .replace(/javascript:/gi, "");

export function renderKnowledgeBody(body: string) {
  const trimmed = body.trim();
  if (trimmed.startsWith("<") && /<\/(p|h2|h3|ul|ol|blockquote)>/i.test(trimmed)) return sanitizeLegacyHtml(trimmed);
  return renderMarkdownToHtml(body);
}

export function slugify(value: string) {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}

export function getKnowledgeMeta(post: { title: string; excerpt: string; seoTitle?: string | null; seoDescription?: string | null }) {
  return { title: post.seoTitle?.trim() || post.title, description: post.seoDescription?.trim() || post.excerpt };
}

export { escapeHtml };
