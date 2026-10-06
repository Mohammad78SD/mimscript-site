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
- `src/components/Hero.tsx` + `HeroScene.tsx` — pinned scroll story (GSAP ScrollTrigger drives an R3F scene).
- OG image: TODO, add `public/og.png` and reference it in `src/app/layout.tsx`.

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
