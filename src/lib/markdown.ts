import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify } from "@/lib/slug";

marked.use({ gfm: true, breaks: true });

/**
 * Render trusted (admin-authored) Markdown to sanitized HTML.
 * Markdown supports headings, paragraphs, lists, links and images as required
 * by the blog editor. Output is sanitized defensively so no raw HTML can pass through.
 */
export function renderMarkdown(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "h1",
      "h2",
      "del",
      "ins",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: attribs.rel ?? "noopener nofollow" },
      }),
    },
  });
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Build a table of contents from h2/h3 headings and inject anchor ids.
 * Returns the updated HTML plus the collected TOC entries.
 */
export function extractToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const next = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, levelRaw: string, inner: string) => {
    const level = Number(levelRaw) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return _match;
    let id = slugify(text);
    let i = 2;
    while (used.has(id)) id = `${slugify(text)}-${i++}`;
    used.add(id);
    toc.push({ id, text, level });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: next, toc };
}

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
