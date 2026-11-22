// Sends Persian-speaking visitors to /fa on their first visit to "/".
// Everything else is served straight from the static export in ./out.
//
// Rules (only for the homepage "/"):
//   1. A saved choice wins: cookie `lang=en|fa` (set by the language switch in Header.tsx).
//   2. Otherwise go to /fa if the IP is in Iran OR the browser's main language is Persian.
//      (Accept-Language matters because many Iranian visitors use a VPN with a foreign IP.)
//   3. Bots are never redirected, so search engines index both versions normally.

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" && !BOT.test(request.headers.get("User-Agent") || "")) {
      const cookie = request.headers.get("Cookie") || "";
      const saved = /(?:^|;\s*)lang=(en|fa)\b/.exec(cookie)?.[1];
      const country = request.cf?.country;
      const mainLang = (request.headers.get("Accept-Language") || "").trim().toLowerCase();

      const wantsFa = saved ? saved === "fa" : country === "IR" || mainLang.startsWith("fa");

      if (wantsFa) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `/fa${url.search}`,
            "Cache-Control": "private, no-store",
            Vary: "Accept-Language, Cookie",
          },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
