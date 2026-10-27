# Haven & Hue — Home Decor Amazon Affiliate Website

A complete, production-ready home decor inspiration & product-discovery website with a secure admin dashboard, database-backed product and blog management, Pinterest-ready features, and Amazon Associates compliance.

**Live demo accounts (sandbox):** see [Sandbox demo credentials](#sandbox-demo-credentials) below.

---

## 1. What's included

### Public website
| Page | Route |
|---|---|
| Homepage (hero, featured categories, featured products, blog, Pinterest, newsletter) | `/` |
| Shop All Products (search, category filters, sorting, pagination) | `/shop` |
| Product details (gallery, features, pros/cons, affiliate CTA, share buttons) | `/product/[slug]` |
| All categories | `/categories` |
| Single category | `/category/[slug]` |
| Blog (tag filters, pagination) | `/blog` |
| Blog article (table of contents, related posts, share) | `/blog/[slug]` |
| About · Contact · Privacy Policy · Affiliate Disclosure · Terms · Cookie Policy | `/about`, `/contact`, … |
| Custom 404 | any unknown route |
| XML sitemap (published content only) | `/sitemap.xml` |
| robots.txt (admin & API excluded) | `/robots.txt` |

### Admin dashboard (`/admin`)
- **Dashboard overview** — counts for published/draft products & posts, categories, unread messages, recent activity, quick actions.
- **Products** — create, edit, duplicate, publish/unpublish, delete, search, feature toggle, Pinterest image, SEO fields, ASIN, optional reference price.
- **Categories** — full CRUD with images, featured toggle, sort order.
- **Blog Posts** — Markdown editor with toolbar + live preview, drafts, featured/Pinterest images, tags, author, SEO fields.
- **Media Library** — upload images (5 MB max, type-checked) or paste URLs; copy URL; delete.
- **Inbox** — contact messages (read/unread, delete) + newsletter subscribers.
- **Settings** — site identity, logo, social/Pinterest URLs, homepage hero, SEO defaults, Amazon Associates tracking ID, affiliate `rel` attributes, footer text, newsletter toggle, and **change password**.

### Security
- Passwords hashed with **bcrypt (cost 12)** — never stored or exposed in plain text.
- **Database-backed sessions** (random 48-byte tokens; only SHA-256 hashes stored) delivered in **HttpOnly, SameSite=Lax, Secure-in-production cookies**, expiring after 7 days.
- Every admin page re-validates the session **server-side** on every request (no frontend-only gate).
- Every admin API route requires the session; public visitors cannot create accounts.
- **CSRF protection** via Origin checking on all state-changing requests.
- **Rate limiting**: login (10 attempts/10 min per IP and per email), contact & newsletter (5/hour per IP), honeypot spam fields.
- All input validated/sanitized with **Zod schemas**; blog HTML is sanitized with `sanitize-html`.
- Admin pages are `noindex,nofollow`; drafts return 404 to visitors and are excluded from the sitemap.
- Secrets live in environment variables (`.env`), never in client code.

### Amazon Associates compliance
- Affiliate URLs are stored per product in the database — nothing is scraped or auto-generated.
- If you set a **tracking ID** in Settings → Affiliate, it is appended automatically (`?tag=…`) to any link missing one.
- Link `rel` attributes are configurable (default `sponsored nofollow noopener noreferrer`) and links open in a new tab.
- The disclosure sentence ("As an Amazon Associate I earn from qualifying purchases.") appears near affiliate content, in the footer, and on the dedicated disclosure page.
- No fake prices, ratings, review counts, scarcity or checkout. Prices are omitted unless *you* enter a verified reference price, labeled as such.

---

## 2. Tech stack

- **Next.js 16** (App Router, Server Components, Route Handlers) + **TypeScript**
- **Tailwind CSS 4** + shadcn/ui components (New York style) + Lucide icons
- **Prisma ORM** + **SQLite** (zero-config local database)
- **bcryptjs** password hashing · **marked + sanitize-html** for Markdown · **Zod** validation
- Fonts: Fraunces (display serif) + Inter (body) via `next/font`

**No paid services are required.** Optional paid extras: a custom domain (~$10/yr), and an email service (e.g. Resend free tier — paid only at scale) if you want contact-form emails delivered.

---

## 3. Quick start (local)

```bash
# 1. Install dependencies
bun install        # or: npm install

# 2. Configure environment (see table below) — .env already exists in this workspace
#    DATABASE_URL=file:./db/custom.db

# 3. Create the database tables
bun run db:push

# 4. Seed demo content + first admin (idempotent — safe to re-run)
bun scripts/seed.ts

# 5. Start the dev server
bun run dev        # http://localhost:3000
```

### Sandbox demo credentials
| Setting | Value |
|---|---|
| Admin login URL | `/admin/login` |
| Email | `admin@havenhue.test` |
| Password | set via `.env` (`ADMIN_PASSWORD`) — **never committed to git** |

> ⚠️ These come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and are for the sandbox demo only. **Change the password immediately** in *Admin → Settings → Security*, or set your own values in `.env` before the first seed on a fresh install. If no `ADMIN_PASSWORD` is set, the seed script generates a random one and prints it once.

### Environment variables (`.env`)

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | SQLite file path (e.g. `file:./db/custom.db`) |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | optional | Used **only** by the seed script to create the first admin |
| `NEXT_PUBLIC_SITE_URL` | recommended in production | Canonical/sitemap/Open Graph base URL (e.g. `https://www.yoursite.com`). Can also be set in Admin → Settings → SEO → Site URL |
| `RESEND_API_KEY` | optional | If set, contact-form submissions also trigger an email notification via Resend |
| `RESEND_FROM` | optional | Custom "from" address for Resend emails |

---

## 4. Creating the first administrator (two ways)

1. **One-time setup page (recommended for fresh installs):** visit `/admin/setup` while the database has **zero** admin accounts. Create your account; the page then becomes permanently unavailable (the endpoint refuses once any admin exists).
2. **Seed script:** set `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env` and run `bun scripts/seed.ts`. The script only creates an admin if none exists.

**Changing credentials later:** Admin → Settings → Security → *Change your password* (invalidates all other sessions). To change the admin email, edit the `AdminUser` row with any SQLite client or create a second admin via the setup page on a fresh DB.

---

## 5. Adding your first Amazon product

1. Sign in at `/admin` → **Products → Add product**.
2. Fill in the **title** (slug auto-generates), a short description, and the full description.
3. Paste your affiliate URL from Amazon Associates SiteStripe into **Affiliate URL** (must be an `amazon.*` or `amzn.to` link). Your tracking ID is added automatically at render time.
4. Add images by URL or upload files; the **first image is the card cover**. Vertical 2:3 images work best on Pinterest — there's a dedicated Pinterest image field.
5. Write **features**, **what we like**, and **keep in mind** (one per line). Honest cons build reader trust.
6. Choose a **category**, toggle **Featured** if it should appear on the homepage.
7. Save as **Draft** to preview (`Preview` button, admin-only with a draft banner), or select **Published** and save — it appears on the shop instantly, no redeploy needed.

**Note about the demo products:** the seeded products use plain Amazon *search* URLs as placeholders so every button works out of the box. Replace them with your real affiliate links (or delete the demo products) as you add your own.

## 6. Publishing your first blog post

1. **Blog Posts → New post**. Write in **Markdown** — use the toolbar for headings, lists, links, quotes and images.
2. Link internally to categories (`/category/lighting`) and products to boost SEO and conversions.
3. Add an **excerpt**, **featured image** (+ alt text), a **Pinterest image** (2:3), **tags**, and SEO title/description.
4. **Preview content** renders the Markdown inline; **View live** opens the public page (drafts are admin-only with a banner and `noindex`).
5. Long posts (3+ h2/h3 headings) automatically get a sticky **table of contents**.

## 7. Pinterest workflow

- Every product and post supports a dedicated 2:3 (e.g. 1000×1500) Pinterest image used in share/Pin links.
- Share buttons on product & article pages create pre-filled Pinterest pins (URL + image + description).
- Set your profile URL in **Settings → General → Pinterest profile URL** — the homepage Pinterest section and footer icons appear automatically.
- The site does **not** auto-post pins or scrape Pinterest/Amazon. Pin manually, or connect an official scheduling tool later.

## 8. Image storage

- **Local dev:** uploads go to `public/uploads/` and are recorded in the `Media` table. Works out of the box.
- **Production on serverless hosts (Vercel etc.):** the filesystem is ephemeral, so uploaded files would not persist. Recommended: point uploads at **Vercel Blob**, **Cloudinary**, or **S3** (swap the handler in `src/app/api/admin/upload/route.ts`), or simply paste hosted image URLs — every image field accepts full `https://` URLs, so you can use any image host with zero code changes.
- External URLs (Unsplash, Amazon media, your CDN) all work via `next.config.ts` remote image patterns.

## 9. Deployment

### Recommended: Vercel + managed Postgres
SQLite is perfect locally, but serverless platforms need a network database. The schema is portable:

1. Create a free Postgres database (Neon, Supabase, or Vercel Postgres — all have free tiers).
2. In `prisma/schema.prisma` change `provider = "sqlite"` → `provider = "postgres"`.
3. Set `DATABASE_URL` to your Postgres connection string in the host's env vars.
4. Run `bunx prisma db push` (once, from your machine or CI) and `bun scripts/seed.ts` if you want the demo content.
5. Deploy the repo to Vercel. Set env vars: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, and optionally `ADMIN_*`, `RESEND_API_KEY`.
6. Visit `/admin/setup` on your live domain to create the production admin.

> **Alternative:** deploy to Railway / Render / Fly.io with a persistent volume to keep SQLite (set `DATABASE_URL=file:/data/app.db`). This avoids the database switch entirely.

### Connecting your domain
1. Buy the domain at any registrar (Namecheap, Cloudflare, Porkbun…).
2. In Vercel → Project → **Settings → Domains** → add `yoursite.com`, follow the prompts to add the `A`/`CNAME` records at your registrar. HTTPS is automatic.
3. Set **Settings → SEO → Site URL** (or `NEXT_PUBLIC_SITE_URL`) to `https://yoursite.com` so canonical URLs and the sitemap use the right domain.
4. Update your Pinterest profile link and social URLs in the admin settings.

## 10. Testing checklist (verified in this build)

- ✅ All public pages load; 404 page works for unknown routes
- ✅ Shop category filter, search, sort and pagination work (`?category=`, `?q=`, `?sort=`, `?page=`)
- ✅ "View on Amazon" uses the saved URL + tracking ID (`&tag=yourstore-20`) + `rel="sponsored nofollow noopener noreferrer"`
- ✅ Admin login rejects wrong passwords; `/admin` redirects logged-out visitors; APIs return 401 without a session
- ✅ Cross-origin mutations are blocked (CSRF); login is rate-limited; `/admin/setup` locks after first admin
- ✅ Products: create → publish → visible on site; unpublish → 404 for visitors; duplicate; delete
- ✅ Posts: Markdown editor, drafts, publish, related posts, auto TOC
- ✅ Contact form + newsletter persist to the database and appear in the admin inbox (email notification optional via `RESEND_API_KEY`)
- ✅ Sitemap, robots.txt, canonical URLs, Open Graph metadata, JSON-LD (Article + BreadcrumbList only)
- ✅ Mobile & desktop layouts; keyboard-accessible nav; visible focus states; reduced-motion support

## 11. Project structure

```
prisma/schema.prisma        # Database schema (7 models)
scripts/seed.ts             # Idempotent demo content + first admin
src/lib/                    # auth, admin-guard, validators, settings, markdown, affiliate, rate-limit
src/app/(site)/             # Public pages (route group with shared header/footer)
src/app/admin/(dash)/       # Protected dashboard (session-checked layout)
src/app/admin/login|setup/  # Standalone auth pages
src/app/api/                # Route handlers (public: contact, newsletter · admin: CRUD)
src/components/site/        # Public UI (cards, forms, gallery, SEO helpers)
src/components/admin/       # Dashboard UI (shell, tables, forms)
```

## 12. Useful commands

```bash
bun run dev         # Start dev server (localhost:3000)
bun run lint        # ESLint
bun run db:push     # Sync schema changes to the database
bun scripts/seed.ts # Re-seed missing demo content / first admin (idempotent)
```
