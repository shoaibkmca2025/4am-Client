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
| `public/index.html` | Home page: hero, services, software, reach, marketplaces, method, work, team, contact |
| `public/services/*.html` | One detailed, SEO page per service (served at `/services/<name>`) |
| `public/404.html` | Page-not-found |
| `public/css/site.css` | All styles (palette: platinum `#E5E4E2`, lavender `#E6E0F0`, coffee `#6F4E37`) |
| `public/js/main.js` | Menu, scroll scenes, project carousel, contact form |
| `public/js/globe.js` | The WebGL Earth (loaded only on the home page, after the page is idle) |
| `public/assets/` | Images: `work/` project screenshots, `services/`, `team/`, `press/`, `earth/` textures |
| `public/sitemap.xml`, `public/robots.txt` | For search engines |

## Common edits

- **Add a project:** copy a `<li>` in the `grid-work` list in `index.html`, change the name and link, and add a 640×400 `.webp` screenshot to `public/assets/work/`.
- **Change contact details:** search the HTML files for `Info@4amglobalmedia.com` and `88264 06545`. The WhatsApp number used by the contact form is `WHATSAPP` at the top of `public/js/main.js`.
- **Add a service page:** copy a file in `public/services/`, edit its text, title, description and structured data, then link it from the home page, the footer of every page, and `sitemap.xml`.

## Contact form

There is no server, so the form does not store anything. When a visitor sends it, their email app (or WhatsApp) opens with the brief already written, addressed to `Info@4amglobalmedia.com` (or `+91 88264 06545`). They press send there.

## Earth imagery

The globe uses NASA's Blue Marble and Black Marble imagery (public domain).
