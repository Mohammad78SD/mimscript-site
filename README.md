# mimscript-site

Portfolio of Mohammad Sabet Daryani (MiM Script). Next.js (App Router) + TypeScript + Tailwind, fully static export.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build      # static site in out/
```

## Structure

- `src/data/projects.ts` — all project content. Unknown facts are `null` and render as a dashed "TODO".
- `src/data/clients.ts` — client websites shown on the home page and `/projects`.
- `src/components/Hero.tsx` + `HeroScene.tsx` — pinned scroll story (GSAP ScrollTrigger drives an R3F scene).
- OG image: TODO, add `public/og.png` and reference it in `src/app/layout.tsx`.

## Adding a project

1. Open `src/data/projects.ts` and copy an existing entry in the `projects` array.
2. Fill the fields:
   - `slug`: URL part (`/projects/<slug>`), unique, lowercase.
   - `title` / `repo`: display name and GitHub repo name (`null` if private).
   - `pitch`: one or two sentences. `categories`: one or more of the `Category` values.
   - `listMeta`: short meta for the list row, e.g. `"Django · 130 tests · CI"` (no repo name; CSS uppercases it).
   - `role`, `stack`, `year` (a string, e.g. `"2026"` or `"In progress"`), `status`, `github` (URL or `null`), `note` (optional).
   - `featured: true` shows it in the "Selected work" list on the home page.
   - `problem`, `built[]`, `highlights[]`, `result` (`null` shows a visible TODO block). Only write facts you can back up.
3. Visual (optional): illustrations are looked up by `slug` in the `visuals` map at the bottom of
   `src/components/ProjectVisual.tsx`. Add a small SVG component and register it under your slug.
   Without one the project shows an empty grid tile. (There is no image-path option yet.)

## Adding a client website

1. Add an entry to `src/data/clients.ts` (`name`, `url`, `industry`, optional `region`, `image`, optional `related` link to a project page). No years or metrics unless confirmed.
2. Take a screenshot of the homepage at about 1440x900 and save it in `public/clients/`, named after the domain (`example-com.webp`).
3. Optimise it before committing (WebP, max 1440px wide, target under 250 KB):

   ```bash
   python3 -c "from PIL import Image; im=Image.open('shot.png').convert('RGB'); im.thumbnail((1440,10000)); im.save('public/clients/example-com.webp','WEBP',quality=80,method=6)"
   ```

   Set `image: null` to show a generated placeholder (name on ink) until a screenshot exists.

## nginx example

```nginx
server {
    listen 80;
    server_name mimscript.com www.mimscript.com;
    root /var/www/mimscript-site/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    error_page 404 /404.html;
}
```
