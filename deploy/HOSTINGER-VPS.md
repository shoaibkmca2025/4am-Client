# Deploying 4AM Global Media to a Hostinger VPS

This runs the **entire app** — marketing site, admin panel, certificates,
student portal, blog, careers, and the contact form — on your own VPS. The
database and auth stay on Supabase (unchanged). Nginx handles HTTPS and
forwards to a Node process kept alive by PM2.

```
Browser ──HTTPS──▶ nginx (:443, TLS) ──▶ Node server (127.0.0.1:8080) ──▶ Supabase
                                          serves dist/ + /api + SSR pages
```

You need: the VPS (Ubuntu recommended), your domain, and your Supabase keys
(they're in your local `.env`). Everything below is copy-paste.

---

## 1. Create the VPS
In hPanel → **VPS** → set up a new server. Choose **Ubuntu 22.04** (or 24.04).
Note the server's **IP address** and the **root password** you set.

## 2. Point your domain at the VPS
In your domain's DNS (Hostinger → Domains → DNS/Nameservers), set:

| Type | Name | Value |
|------|------|-------|
| A | `@` | your VPS IP |
| A | `www` | your VPS IP |

If the domain is still pointed at Vercel, changing these A records moves it.
DNS can take up to a few hours to propagate.

## 3. Connect and install the basics
SSH in (from your PC's terminal):
```bash
ssh root@YOUR_VPS_IP
```
Then install Node 20, git, nginx, and PM2:
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
npm install -g pm2
node -v      # should print v20.x
```

## 4. Get the code onto the server
```bash
cd /var/www
git clone https://github.com/shoaibkmca2025/4am-Client.git 4am
cd 4am
npm install          # installs everything incl. tsx (the server runtime)
```

## 5. Create the `.env` file
```bash
cp .env.example .env
nano .env            # paste your real values, then Ctrl+O, Enter, Ctrl+X
```
Fill in **every** value from your local `.env` (Supabase URL + all keys +
`SERVER_HMAC_SECRET`, and the `VITE_SUPABASE_*` pair). Set
`SITE_URL=https://4amglobalmedia.com`. Leave `HOST=127.0.0.1` and `PORT=8080`.

> The `VITE_*` values must be present **before** the build in the next step —
> they get baked into the browser bundle.

## 6. Build and start
```bash
npm run build                                  # produces dist/
mkdir -p logs
pm2 start deploy/ecosystem.config.cjs          # starts the server
pm2 save                                        # remember it across reboots
pm2 startup                                     # run the command it prints, once
```
Check it's alive locally:
```bash
curl http://127.0.0.1:8080/api/health          # → {"ok":true,...}
```

## 7. Put nginx in front (HTTPS)
```bash
cp deploy/nginx.conf /etc/nginx/sites-available/4amglobalmedia.com
ln -s /etc/nginx/sites-available/4amglobalmedia.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```
Then get a free TLS certificate (this also rewrites the config for HTTPS):
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d 4amglobalmedia.com -d www.4amglobalmedia.com
```
Answer the prompts (email, agree, redirect HTTP→HTTPS = yes). Certbot
auto-renews.

## 8. Verify
Open in a browser:
- `https://4amglobalmedia.com` — the site
- `https://4amglobalmedia.com/api/health` — JSON, every env value `true`
- `https://4amglobalmedia.com/admin` — sign in, create a course
- `https://4amglobalmedia.com/blog` and `/careers` — server-rendered pages

Done. 🎉

---

## Updating the site later
```bash
cd /var/www/4am
git pull
npm install          # only if dependencies changed
npm run build
pm2 restart 4am
```

## Handy commands
```bash
pm2 status           # is it running?
pm2 logs 4am         # live logs
pm2 restart 4am      # restart after a change
systemctl reload nginx
```

## Notes
- **Same-origin:** the Node server serves the site AND the API on one domain,
  so there's no CORS and the app's relative `/api/*` calls work as-is.
- **Certificate QR codes** encode `SITE_URL/verify/{serial}`, so keep
  `SITE_URL` matching your real domain.
- **Firewall (if enabled):** allow 80 and 443 — `ufw allow 'Nginx Full'`.
- **Migrations** (only if the schema changes) run from your PC or the VPS with
  `npm run db:migrate` (needs `DATABASE_URL`/`DIRECT_URL` in `.env`).
- The old Vercel deployment can stay as a backup or be deleted once the VPS is
  live — they share the same Supabase database.
