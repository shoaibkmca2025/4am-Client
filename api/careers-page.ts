import type { ApiRequest, ApiResponse } from '../lib/server/http';
import { allowMethods, clientIp } from '../lib/server/http';
import { supabaseAdmin } from '../lib/server/supabaseAdmin';
import { rateLimit } from '../lib/server/ratelimit';
import { env } from '../lib/server/env';
import { brandPage, esc, renderMarkdown } from '../lib/server/brandPage';

// GET /careers and /careers/:slug (rewritten here by vercel.json)
// Server-rendered: roles are indexable, and the apply form works without the
// SPA bundle. JobPosting structured data feeds Google Jobs.

const FORM_JS = `
<script>
(function(){
  var f=document.getElementById('apply-form'); if(!f) return;
  var msg=document.getElementById('apply-msg'), btn=document.getElementById('apply-btn');
  var say=function(t,ok){msg.textContent=t;msg.className='apply-msg '+(ok?'good':'bad');};
  f.addEventListener('submit',function(e){
    e.preventDefault(); btn.disabled=true; btn.textContent='Sending…'; say('',true);
    var fd=new FormData(f);
    var payload={name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),
      portfolio_url:fd.get('portfolio_url')||undefined,cover_note:fd.get('cover_note'),
      opening_id:f.dataset.openingId||undefined};
    var file=fd.get('resume');
    var send=function(){
      fetch('/api/careers/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
        .then(function(r){
          if(r.ok&&r.d&&r.d.ok){f.style.display='none';say('Application received. We will be in touch.',true);}
          else{say((r.d&&r.d.error)||'Something went wrong. Please try again.',false);btn.disabled=false;btn.textContent='Send application';}
        })
        .catch(function(){say('Network error. Please try again.',false);btn.disabled=false;btn.textContent='Send application';});
    };
    if(file&&file.size>0){
      if(file.size>5242880){say('Résumé must be under 5 MB.',false);btn.disabled=false;btn.textContent='Send application';return;}
      var fr=new FileReader();
      fr.onload=function(){payload.resume={filename:file.name,contentType:file.type||'application/pdf',data:String(fr.result).split(',')[1]};send();};
      fr.onerror=function(){say('Could not read that file.',false);btn.disabled=false;btn.textContent='Send application';};
      fr.readAsDataURL(file);
    } else send();
  });
})();
</script>`;

const FORM_CSS = `
.apply{margin-top:2rem}
.apply label{display:block;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:.5rem}
.apply input,.apply textarea{width:100%;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.1);color:#fff;font:inherit;font-size:1rem;padding:.6rem 0 .7rem;margin-bottom:1.5rem;border-radius:0}
.apply input:focus,.apply textarea:focus{outline:none;border-bottom-color:rgba(255,106,61,.6)}
.apply textarea{resize:vertical;min-height:120px}
.apply input[type=file]{border:0;padding:0;font-size:.85rem;color:rgba(255,255,255,.5)}
.apply input[type=file]::file-selector-button{margin-right:.75rem;border:0;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;padding:.5rem 1rem;font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;cursor:pointer}
.apply button{border:0;cursor:pointer;padding:.9rem 2.25rem;border-radius:999px;background:linear-gradient(90deg,#FF6A3D,#FFC56A);color:#000;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
.apply button:disabled{opacity:.5;cursor:not-allowed}
.apply-msg{margin-top:1rem;font-size:.9rem}
.apply-msg.good{color:#A3E635}.apply-msg.bad{color:#f87171}
.role{display:block;text-decoration:none;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);border-radius:1rem;padding:1.75rem;transition:border-color .3s,background .3s;margin-bottom:1rem}
.role:hover{border-color:rgba(255,106,61,.4);background:rgba(255,255,255,.04)}
.role h2{margin:.5rem 0;font-size:1.25rem;font-weight:800;text-transform:none;letter-spacing:-.01em}
`;

const applyForm = (openingId?: string): string => `
<form class="apply" id="apply-form"${openingId ? ` data-opening-id="${esc(openingId)}"` : ''}>
  <label for="ap-name">Full name *</label>
  <input id="ap-name" name="name" required maxlength="160">
  <label for="ap-email">Email *</label>
  <input id="ap-email" name="email" type="email" required maxlength="254">
  <label for="ap-phone">Phone</label>
  <input id="ap-phone" name="phone" maxlength="32">
  <label for="ap-portfolio">Portfolio / LinkedIn</label>
  <input id="ap-portfolio" name="portfolio_url" type="url" maxlength="500" placeholder="https://">
  <label for="ap-resume">Résumé (PDF or Word, max 5 MB)</label>
  <input id="ap-resume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf">
  <label for="ap-note">Why you?</label>
  <textarea id="ap-note" name="cover_note" maxlength="4000"></textarea>
  <button id="apply-btn" type="submit">Send application</button>
  <p class="apply-msg" id="apply-msg"></p>
</form>`;

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (!allowMethods(req, res, ['GET'])) return;

  const html = (code: number, body: string) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=120, stale-while-revalidate=600');
    res.end(body);
  };

  const rl = rateLimit('careers-page', clientIp(req), 120, 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return html(429, brandPage({ title: 'Slow down', noindex: true, bodyInner: '<div class="card"><h1>TOO MANY<br><span class="grad">REQUESTS</span></h1></div>' }));
  }

  const db = supabaseAdmin();
  const slug = typeof req.query.slug === 'string' ? req.query.slug.trim() : '';
  const style = `<style>${FORM_CSS}</style>`;

  // ── single role ──
  if (slug) {
    if (!/^[a-z0-9-]{1,120}$/i.test(slug)) {
      return html(404, brandPage({
        title: 'Role not found', eyebrow: 'Careers', noindex: true,
        bodyInner: `<div class="card"><h1>THIS ROLE<br><span class="grad">ISN'T OPEN</span></h1>
          <p class="sub">It may have been filled or closed.</p><a class="cta" href="/careers">See open roles</a></div>`,
      }));
    }

    const { data: role } = await db
      .from('job_openings')
      .select('id, title, slug, department, location, employment_type, description, requirements, salary_range, created_at')
      .eq('slug', slug).eq('status', 'open').maybeSingle();

    if (!role) {
      return html(404, brandPage({
        title: 'Role not found', eyebrow: 'Careers', noindex: true,
        bodyInner: `<div class="card"><h1>THIS ROLE<br><span class="grad">ISN'T OPEN</span></h1>
          <p class="sub">It may have been filled or closed.</p><a class="cta" href="/careers">See open roles</a></div>`,
      }));
    }

    const reqs = (role.requirements ?? []) as string[];
    const jobLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: role.title,
      description: role.description || role.title,
      datePosted: role.created_at,
      employmentType: role.employment_type.toUpperCase().replace('-', '_'),
      hiringOrganization: { '@type': 'Organization', name: '4AM Global Media', sameAs: env.siteUrl },
      jobLocation: role.location
        ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: role.location } }
        : undefined,
      directApply: true,
    }).replace(/</g, '\\u003c');

    const body = `
      <a class="back" href="/careers">← All roles</a>
      <span class="meta">${esc([role.department, role.location, role.employment_type].filter(Boolean).join(' · '))}</span>
      <h1>${esc(role.title)}</h1>
      ${role.salary_range ? `<p class="sub">${esc(role.salary_range)}</p>` : ''}
      <div class="article-body">${renderMarkdown(role.description ?? '')}</div>
      ${reqs.length ? `<h2 style="font-size:1.3rem;font-weight:800;margin:2rem 0 .75rem;text-transform:none">What we're looking for</h2>
        <ul class="article-body">${reqs.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
      <h2 style="font-size:1.3rem;font-weight:800;margin:2.5rem 0 .5rem;text-transform:none">Apply</h2>
      ${applyForm(role.id)}`;

    return html(200, brandPage({
      title: `${role.title} — Careers`,
      description: (role.description ?? '').slice(0, 200),
      eyebrow: 'Careers',
      head: `<link rel="canonical" href="${esc(`${env.siteUrl}/careers/${role.slug}`)}">${style}
        <script type="application/ld+json">${jobLd}</script>`,
      bodyInner: body,
    }) + FORM_JS);
  }

  // ── index ──
  const { data: roles } = await db
    .from('job_openings')
    .select('title, slug, department, location, employment_type')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  const list = roles ?? [];
  const body = `
    <h1>BUILD WITH<br><span class="grad">4AM GLOBAL MEDIA</span></h1>
    <p class="sub">We're a small, senior team shipping software, marketing and AI work for brands across India and beyond. If that sounds like your kind of work, we'd like to hear from you.</p>
    ${list.length === 0
      ? `<div class="card">
          <p class="sub" style="margin:0 0 1rem">No specific roles are open right now — but we always read speculative applications.</p>
          <h2 style="font-size:1.2rem;font-weight:800;margin:0 0 .5rem;text-transform:none">Introduce yourself</h2>
          ${applyForm()}
        </div>`
      : `${list.map((r) => `
          <a class="role" href="/careers/${esc(r.slug)}">
            <span class="meta">${esc([r.department, r.location, r.employment_type].filter(Boolean).join(' · '))}</span>
            <h2>${esc(r.title)}</h2>
            <span class="meta" style="color:rgba(255,197,106,.8)">View role →</span>
          </a>`).join('')}`}
    <a class="cta" href="/">Back to 4AM Global Media</a>`;

  return html(200, brandPage({
    title: 'Careers',
    description: 'Open roles at 4AM Global Media — software engineering, digital marketing, design and AI.',
    eyebrow: 'Careers',
    head: `<link rel="canonical" href="${esc(`${env.siteUrl}/careers`)}">${style}`,
    bodyInner: body,
  }) + (list.length === 0 ? FORM_JS : ''));
}
