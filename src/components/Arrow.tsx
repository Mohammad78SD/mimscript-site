/** Directional glyph (→ ← ↗) that mirrors in RTL so it keeps pointing the right way. */
export function Arrow({ children = "→" }: { children?: string }) {
  return (
    <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
      {children}
    </span>
  );
}
