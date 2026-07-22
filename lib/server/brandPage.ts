// Shared shell for server-rendered pages (verify, blog). Brand tokens are
// inlined from the design system — black base, Inter, #FF6A3D → #FFC56A —
// so these pages are visually native without loading the SPA bundle.

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export const BRAND_CSS = `
*,*::before,*::after{box-sizing:border-box}body{margin:0}
body{background:#000;color:#fff;font-family:Inter,system-ui,-apple-system,"SF Pro Text",sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column}
a{color:inherit}
img{max-width:100%;height:auto;display:block}
.wrap{width:100%;max-width:760px;margin:0 auto;padding:2rem 1.5rem 4rem;flex:1}
.wrap.wide{max-width:1100px}
.top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.25rem 0 2.5rem}
.top img{height:40px;width:auto}
.eyebrow{font-size:10px;font-weight:700;letter-spacing:.35em;text-transform:uppercase;color:rgba(255,255,255,.4)}
.card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);border-radius:1rem;padding:2rem 1.5rem}
@media(min-width:640px){.card{padding:2.5rem}}
.badge{display:inline-flex;align-items:center;gap:.6rem;border-radius:999px;border:1px solid;padding:.5rem .9rem;font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase}
.badge .dot{width:7px;height:7px;border-radius:50%;background:currentColor}
.ok{color:#A3E635;border-color:rgba(163,230,53,.4);background:rgba(163,230,53,.1)}
.bad{color:#f87171;border-color:rgba(248,113,113,.4);background:rgba(248,113,113,.1)}
.unknown{color:rgba(255,255,255,.6);border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.03)}
h1{font-size:clamp(1.9rem,7vw,2.8rem);font-weight:900;text-transform:uppercase;letter-spacing:-.03em;line-height:.98;margin:1.25rem 0 .5rem}
.grad{background:linear-gradient(90deg,#FF6A3D,#FFC56A);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{color:rgba(255,255,255,.55);font-size:.95rem;margin:0 0 2rem}
dl{display:grid;grid-template-columns:1fr;gap:1.4rem;margin:0}
@media(min-width:560px){dl{grid-template-columns:1fr 1fr}}
dt{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.35rem}
dd{margin:0;font-size:1rem;font-weight:500;color:rgba(255,255,255,.9);word-break:break-word}
dd.mono{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.85rem}
.note{margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.45);font-size:.82rem}
.revoked-note{margin-top:1.5rem;border-left:2px solid rgba(248,113,113,.6);padding-left:1rem;color:rgba(248,113,113,.85);font-size:.9rem}
.foot{border-top:1px solid rgba(255,255,255,.07);padding:1.5rem;text-align:center;color:rgba(255,255,255,.25);font-size:10px;font-weight:700;letter-spacing:.25em;text-transform:uppercase}
.cta{display:inline-flex;align-items:center;gap:.6rem;margin-top:1.75rem;padding:.85rem 2rem;border-radius:999px;background:linear-gradient(90deg,#FF6A3D,#FFC56A);color:#000;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;text-decoration:none}
/* blog */
.posts{display:grid;grid-template-columns:1fr;gap:1.25rem;margin-top:2rem}
@media(min-width:720px){.posts{grid-template-columns:1fr 1fr}}
.post-card{display:block;text-decoration:none;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);border-radius:1rem;padding:1.75rem;transition:border-color .3s,background .3s}
.post-card:hover{border-color:rgba(255,106,61,.4);background:rgba(255,255,255,.04)}
.post-card h2{margin:.75rem 0 .5rem;font-size:1.2rem;font-weight:800;letter-spacing:-.01em;text-transform:none;line-height:1.3}
.post-card p{margin:0;color:rgba(255,255,255,.55);font-size:.9rem}
.meta{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.tag{border:1px solid rgba(255,197,106,.25);background:rgba(255,197,106,.06);color:rgba(255,197,106,.85);border-radius:999px;padding:.3rem .75rem;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.article h1{margin-bottom:1rem}
.article-body{color:rgba(255,255,255,.78);font-size:1.02rem;line-height:1.85}
.article-body h2{font-size:1.5rem;font-weight:800;letter-spacing:-.01em;margin:2.5rem 0 .75rem;color:#fff;text-transform:none}
.article-body h3{font-size:1.2rem;font-weight:700;margin:2rem 0 .5rem;color:#fff}
.article-body p{margin:0 0 1.25rem}
.article-body ul{margin:0 0 1.25rem;padding-left:1.25rem}
.article-body li{margin-bottom:.5rem}
.article-body a{color:#FFC56A;text-decoration:underline}
.article-body code{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.88em;background:rgba(255,255,255,.06);padding:.15rem .4rem;border-radius:.3rem}
.article-body strong{color:#fff}
.cover{border-radius:1rem;overflow:hidden;margin:1.5rem 0 2rem;border:1px solid rgba(255,255,255,.08)}
.back{display:inline-block;margin-bottom:1.5rem;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.45);text-decoration:none}
.back:hover{color:#fff}
`;

export interface PageOpts {
  title: string;
  description?: string;
  bodyInner: string;
  wide?: boolean;
  eyebrow?: string;
  /** Extra <head> markup (OG tags, JSON-LD). Must already be escaped. */
  head?: string;
  noindex?: boolean;
}

export const brandPage = (o: PageOpts): string => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.title)} | 4AM Global Media</title>
${o.description ? `<meta name="description" content="${esc(o.description)}">` : ''}
<meta name="theme-color" content="#000000">
<meta name="robots" content="${o.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<link rel="icon" type="image/png" href="/favicon-4am-small.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
${o.head ?? ''}
<style>${BRAND_CSS}</style></head><body>
<div class="wrap${o.wide ? ' wide' : ''}">
  <div class="top">
    <a href="/" aria-label="4AM Global Media home"><img src="/assets/logo-4am-nav.png" alt="4AM Global Media"></a>
    ${o.eyebrow ? `<span class="eyebrow">${esc(o.eyebrow)}</span>` : ''}
  </div>
  ${o.bodyInner}
</div>
<div class="foot">© ${new Date().getFullYear()} 4AM Global Media</div>
</body></html>`;

/**
 * Renders a small, safe Markdown subset. Input is HTML-escaped FIRST, so no
 * author content can inject markup — the transforms below only ever add tags
 * around already-neutralised text.
 */
export const renderMarkdown = (raw: string): string => {
  const safeHref = (url: string): string =>
    /^(https?:\/\/|\/|mailto:)/i.test(url) ? url : '#';

  const inline = (s: string): string =>
    s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, url: string) =>
        `<a href="${safeHref(url)}" rel="noopener">${text}</a>`);

  const blocks = esc(raw).split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return '';
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      const h = lines[0].match(/^(#{2,3})\s+(.*)$/);
      if (h) {
        const tag = h[1].length === 2 ? 'h2' : 'h3';
        const rest = lines.slice(1).join(' ');
        return `<${tag}>${inline(h[2])}</${tag}>${rest ? `<p>${inline(rest)}</p>` : ''}`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');
};
