# 4AM Global Media website

A plain static website: HTML, CSS and JavaScript, with no framework, no build step and no backend. Everything the site serves lives in `public/`.

## Preview locally

```
npx serve public
```

Then open the address it prints. Any static server works, as long as it maps `/services/seo` to `services/seo.html` (`serve` does this by default).

## Deploy

Push to the repository. `vercel.json` tells Vercel to skip the install and build steps and serve the `public/` folder, with clean URLs (`/services/seo`).

## Files

| Path | What it is |
|---|---|
| `public/index.html` | Home page: night-video hero, launch scene (scroll-driven camera from a rocket launch to a results dashboard), then services, marketplaces, numbers, work, process, team, contact |
| `public/services/*.html` | One detailed, SEO page per service (served at `/services/<name>`) |
| `public/404.html` | Page-not-found |
| `public/css/site.css` | All styles (palette: bone `#EBE9DF`, sage `#A9B887`, forest `#2E3D28`) |
| `public/js/main.js` | Menu, hero video, launch scene, drifting card rows (swipe, arrows, keys), sketch reveals, counters, contact form |
| `public/assets/` | Media: `hero/` night video and stills, `launch/` launch-scene photo, `work/` project screenshots, `services/`, `team/`, `press/` |
| `public/sitemap.xml`, `public/robots.txt` | For search engines |

## Common edits

- **Add a project:** copy a `<li>` in the `grid-work` list in `index.html`, change the name and link, and add a 640×400 `.webp` screenshot to `public/assets/work/`.
- **Change contact details:** search the HTML files for `Info@4amglobalmedia.com` and `88264 06545`. The WhatsApp number used by the contact form is `WHATSAPP` at the top of `public/js/main.js`.
- **Add a service page:** copy a file in `public/services/`, edit its text, title, description and structured data, then link it from the home page, the footer of every page, and `sitemap.xml`.

## Contact form

There is no server, so the form does not store anything. When a visitor sends it, their email app (or WhatsApp) opens with the brief already written, addressed to `Info@4amglobalmedia.com` (or `+91 88264 06545`). They press send there.

## Launch scene

The launch scene follows the free Scrollhaus "Zenith" direction; its photo is self-hosted and recoloured to the site's night navy, and the dashboard shows real client results. Scrollhaus licence: free to customise for your own or client websites; do not resell or redistribute the template library.
