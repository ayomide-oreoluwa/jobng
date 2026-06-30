/**
 * Helpers for handling the raw HTML that the JustJob API returns in job
 * descriptions. The API sends markup like <b>, <i>, <p>, <br>, <span> (often
 * with stray attributes), so we either strip it to plain text for previews or
 * sanitise it to a small allowlist for full rendering.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
};

function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z0-9]+);/g, (match, body: string) => {
    if (body[0] === "#") {
      const isHex = body[1] === "x" || body[1] === "X";
      const code = parseInt(isHex ? body.slice(2) : body.slice(1), isHex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/** Strip all HTML tags and collapse whitespace into a clean plain-text string. */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  const text = html
    .replace(/<\s*(br|\/p|\/div|\/li)\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return decodeEntities(text);
}

const ALLOWED_TAGS = new Set([
  "b", "strong", "i", "em", "u", "br", "p", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "a", "span",
]);

/**
 * Sanitise API HTML to a safe allowlist: keeps basic formatting tags, drops
 * everything else (scripts, inline handlers, style, stray attributes). Only
 * <a> keeps a validated href.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";

  // FIX: Separate removal of dangerous blocks to ensure self-closing instances do not swallow text
  let out = html
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*>/gi, "");

  out = out.replace(/<\s*(\/?)\s*([a-zA-Z0-9]+)([^>]*)>/g, (match, slash: string, tag: string, attrs: string) => {
    const name = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return "";
    if (slash === "/") return `</${name}>`;

    if (name === "a") {
      // FIX: Robust href extraction that safely handles single, double, or omitted attribute quotation configurations
      const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = hrefMatch ? (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "") : "";
      
      // Clean URL parameters validation tracking protocol
      const safe = /^(https?:\/\/|mailto:|\/)/i.test(href.trim()) ? href.trim() : "";
      return safe
        ? `<a href="${safe}" target="_blank" rel="noopener noreferrer">`
        : "<a>";
    }

    return `<${name}>`;
  });

  return out.trim();
}