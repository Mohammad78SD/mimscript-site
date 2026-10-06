"use client";

import { useEffect, useState } from "react";
import { rasterizeMim } from "@/lib/voxels";

const KEY = "mim-loader-seen";

/** ~1.2s intro: the «م» assembled from cubes, one of them blue. */
export function Loader() {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");
  const [grid, setGrid] = useState<ReturnType<typeof rasterizeMim> | null>(null);

  /* sessionStorage / matchMedia exist only in the browser, so decide after mount. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("done");
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setGrid(rasterizeMim(22));
    const t1 = setTimeout(() => setPhase("fade"), 1200);
    const t2 = setTimeout(() => setPhase("done"), 1650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  const special = grid ? Math.floor(grid.cells.length * 0.22) : -1;

  return (
    <div
      aria-hidden="true"
      className="loader fixed inset-0 z-[100] flex items-center justify-center bg-paper transition-opacity duration-500"
      style={{ opacity: phase === "fade" ? 0 : 1 }}
    >
      <noscript>
        <style>{`.loader{display:none!important}`}</style>
      </noscript>
      {grid && (
        <div
          className="relative"
          style={{ width: grid.cols * 7, height: grid.rows * 7 }}
        >
          {grid.cells.map(([c, r], i) => (
            <span
              key={i}
              className="absolute block"
              style={{
                left: c * 7,
                top: r * 7,
                width: 6,
                height: 6,
                background: i === special ? "#1F3A93" : i % 3 ? "#0E1220" : "#2a3350",
                animation: `cube-pop 380ms cubic-bezier(.2,.8,.2,1) ${
                  ((c + r) % 22) * 22
                }ms both`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
