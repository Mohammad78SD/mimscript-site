import { MIM_PATH, MIM_VIEWBOX } from "./mim";

export type Voxels = {
  cols: number;
  rows: number;
  /** filled cells as [col, row] with row 0 at the top */
  cells: [number, number][];
};

const cache = new Map<number, Voxels>();

/**
 * Rasterizes the «م» path onto an offscreen canvas and samples the grid.
 * Browser-only (needs document + Path2D).
 */
export function rasterizeMim(rows: number): Voxels {
  const hit = cache.get(rows);
  if (hit) return hit;

  const cols = Math.round((rows * MIM_VIEWBOX.w) / MIM_VIEWBOX.h);
  const S = 8; // sub-pixels per cell
  const canvas = document.createElement("canvas");
  canvas.width = cols * S;
  canvas.height = rows * S;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const cells: [number, number][] = [];
  if (ctx) {
    const sx = canvas.width / MIM_VIEWBOX.w;
    const sy = canvas.height / MIM_VIEWBOX.h;
    ctx.setTransform(sx, 0, 0, sy, 0, 0);
    ctx.translate(0, MIM_VIEWBOX.h);
    ctx.scale(0.1, -0.1);
    ctx.fillStyle = "#000";
    ctx.fill(new Path2D(MIM_PATH));
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let filled = 0;
        for (let y = 0; y < S; y++) {
          for (let x = 0; x < S; x++) {
            const i = ((r * S + y) * canvas.width + (c * S + x)) * 4 + 3;
            if (data[i] > 127) filled++;
          }
        }
        if (filled / (S * S) >= 0.38) cells.push([c, r]);
      }
    }
  }
  const result = { cols, rows, cells };
  cache.set(rows, result);
  return result;
}

/** small deterministic PRNG so the scene is identical on every load */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
