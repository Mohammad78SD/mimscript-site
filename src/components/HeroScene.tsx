"use client";

/* The render loop below is imperative three.js code that deliberately mutates
   scene objects every frame, outside React rendering. */
/* eslint-disable react-hooks/immutability */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32, rasterizeMim } from "@/lib/voxels";

/** Mutable animation state, written by GSAP (scroll) and read every frame. */
export type HeroState = {
  explode: number; // 0 = intact logo, 1 = structured network
  tint: number; // 0 = dark cubes (light bg), 1 = lighter blue-grey cubes (ink bg)
  zoom: number; // camera push-in 0..1
  px: number; // pointer -1..1
  py: number;
};

const ROWS = 60;
const LOGO_H = 5.4; // world units
const LOGO_ASPECT = 320 / 610;
const CAM_Z = 11;
const FOV = 35;
const GAP = 0.86; // cube size relative to its grid cell (leaves a gap)
const SLAB = 1.7; // logo cube depth relative to its grid cell

// network: publishers -> edge brokers -> hub -> edge brokers -> subscribers
const LAYERS = [
  { count: 16, x: -5.0 },
  { count: 8, x: -2.5 },
  { count: 1, x: 0 },
  { count: 8, x: 2.5 },
  { count: 16, x: 5.0 },
];
const NET_HALF_W = 5.6; // used to fit the network into narrow viewports
const NODE_SIZE = 0.27;
const HUB_SIZE = 0.5;
const PACKETS = 40;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeIn = (t: number) => t * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

const BASE_COLORS = ["#0E1220", "#121830", "#171e38", "#0E1220", "#1a2240"].map(
  (c) => new THREE.Color(c),
);

function buildData() {
  const vox = rasterizeMim(ROWS);
  const s = LOGO_H / vox.rows;
  const rnd = mulberry32(11);
  const cells = vox.cells;
  const n = cells.length;

  const home = new Float32Array(n * 3);
  const homeX01 = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const [c, r] = cells[i];
    home[i * 3] = (c - vox.cols / 2 + 0.5) * s;
    home[i * 3 + 1] = (vox.rows / 2 - r - 0.5) * s;
    home[i * 3 + 2] = 0;
    homeX01[i] = c / vox.cols;
  }

  // ---- pick which cubes become nodes ------------------------------------
  const used = new Set<number>();
  // hub = the single special cube: filled cell nearest the glyph's visual centre
  let hubCell = 0;
  let best = Infinity;
  for (let i = 0; i < n; i++) {
    const d = Math.hypot(cells[i][0] / vox.cols - 0.5, cells[i][1] / vox.rows - 0.42);
    if (d < best) {
      best = d;
      hubCell = i;
    }
  }
  used.add(hubCell);

  // sort cells by x and take quantile slices for the four outer layers
  const order = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => homeX01[a] - homeX01[b],
  );
  const slices: [number, number][] = [
    [0, 0.25],
    [0.25, 0.5],
    [0, 0], // hub placeholder
    [0.5, 0.75],
    [0.75, 1],
  ];

  type Node = { cell: number; tx: number; ty: number; tz: number; layer: number; size: number };
  const nodes: Node[] = [];
  const layerNodes: number[][] = LAYERS.map(() => []);

  LAYERS.forEach((L, li) => {
    if (li === 2) {
      layerNodes[li].push(nodes.length);
      nodes.push({ cell: hubCell, tx: 0, ty: 0, tz: -0.4, layer: li, size: HUB_SIZE });
      return;
    }
    const [a, b] = slices[li];
    const pool = order
      .slice(Math.floor(a * n), Math.floor(b * n))
      .filter((c) => !used.has(c));
    // deterministic shuffle, take `count`
    for (let k = pool.length - 1; k > 0; k--) {
      const j = Math.floor(rnd() * (k + 1));
      [pool[k], pool[j]] = [pool[j], pool[k]];
    }
    const picked = pool.slice(0, L.count);
    picked.forEach((c) => used.add(c));
    // targets: evenly spaced in y, zig-zag in x. Matching by y keeps paths from crossing.
    const targets = Array.from({ length: L.count }, (_, k) => {
      const t = L.count === 1 ? 0 : k / (L.count - 1) - 0.5;
      const zig = L.count > 8 ? (k % 2 ? 0.45 : -0.45) : (k % 2 ? 0.22 : -0.22);
      return {
        tx: L.x + zig,
        ty: t * (L.count > 8 ? 5.4 : 4.6),
        tz: -0.2 - rnd() * 1.6,
      };
    });
    picked.sort((p, q) => home[q * 3 + 1] - home[p * 3 + 1]); // top -> bottom
    targets.sort((p, q) => q.ty - p.ty);
    picked.forEach((c, k) => {
      layerNodes[li].push(nodes.length);
      nodes.push({ cell: c, ...targets[k], layer: li, size: NODE_SIZE });
    });
  });

  // ---- per-cube arrays ----------------------------------------------------
  const target = new Float32Array(n * 3);
  const arc = new Float32Array(n * 3);
  const delay = new Float32Array(n);
  const nodeScale = new Float32Array(n); // 0 => not a node
  const spin = new Float32Array(n);
  const base = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    delay[i] = homeX01[i] * 0.4 + rnd() * 0.05;
    const col = BASE_COLORS[Math.floor(rnd() * BASE_COLORS.length)];
    base[i * 3] = col.r;
    base[i * 3 + 1] = col.g;
    base[i * 3 + 2] = col.b;
    // non-nodes just drift slightly backwards while they shrink away
    arc[i * 3 + 2] = -0.4 - rnd() * 0.8;
    spin[i] = 0;
  }
  const nodeCell: number[] = [];
  nodes.forEach((nd, k) => {
    const i = nd.cell;
    nodeCell[k] = i;
    target[i * 3] = nd.tx;
    target[i * 3 + 1] = nd.ty;
    target[i * 3 + 2] = nd.tz;
    nodeScale[i] = nd.size;
    arc[i * 3] = 0;
    arc[i * 3 + 1] = (rnd() < 0.5 ? -1 : 1) * (0.35 + rnd() * 0.5); // smooth vertical bow
    arc[i * 3 + 2] = -1.2; // arcs go away from the camera, never toward it
    spin[i] = (rnd() < 0.5 ? -1 : 1) * (rnd() < 0.5 ? Math.PI / 2 : Math.PI);
    delay[i] = homeX01[i] * 0.3;
  });

  // ---- edges + packet routes (node indices, not cell indices) ----------------
  const edgeSet = new Set<number>();
  const edges: [number, number][] = [];
  const addEdge = (a: number, b: number) => {
    const key = Math.min(a, b) * 1000 + Math.max(a, b);
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push([nodeCell[a], nodeCell[b]]);
    }
  };
  const nearestY = (from: number, pool: number[], k: number) =>
    [...pool]
      .sort(
        (p, q) =>
          Math.abs(nodes[p].ty - nodes[from].ty) - Math.abs(nodes[q].ty - nodes[from].ty),
      )
      .slice(0, k);
  const next = new Map<number, number[]>();
  const link = (a: number, b: number) => {
    addEdge(a, b);
    next.set(a, [...(next.get(a) ?? []), b]);
  };
  for (const p of layerNodes[0]) nearestY(p, layerNodes[1], 2).forEach((b) => link(p, b));
  for (const b of layerNodes[1]) link(b, layerNodes[2][0]);
  for (const b of layerNodes[3]) link(layerNodes[2][0], b);
  for (const b of layerNodes[3]) nearestY(b, layerNodes[4], 3).forEach((c) => link(b, c));

  const routes: number[][] = []; // sequences of cell indices
  const packets = Array.from({ length: PACKETS }, (_, k) => {
    const p = layerNodes[0][k % layerNodes[0].length];
    const a = next.get(p)![Math.floor(rnd() * 2)];
    const hub = layerNodes[2][0];
    const bs = layerNodes[3][Math.floor(rnd() * layerNodes[3].length)];
    const cs = next.get(bs) ?? [];
    const sub = cs.length ? cs[Math.floor(rnd() * cs.length)] : bs;
    routes.push([p, a, hub, bs, sub].map((x) => nodeCell[x]));
    return { route: k, speed: 0.07 + rnd() * 0.06, offset: rnd() };
  });

  return {
    n,
    s,
    cols: vox.cols,
    home,
    target,
    arc,
    delay,
    nodeScale,
    spin,
    base,
    edges,
    routes,
    packets,
    hubCell,
  };
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(14,18,32,0.38)");
  grad.addColorStop(1, "rgba(14,18,32,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function Scene({
  state,
  animated,
  mirror,
}: {
  state: HeroState;
  animated: boolean;
  mirror: boolean;
}) {
  const d = useMemo(() => buildData(), []);
  const shadowTex = useMemo(() => shadowTexture(), []);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const cubes = useRef<THREE.InstancedMesh>(null);
  const hub = useRef<THREE.Mesh>(null);
  const pk = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const size = useThree((s) => s.size);

  const tmp = useMemo(
    () => ({
      o: new THREE.Object3D(),
      c: new THREE.Color(),
      light: new THREE.Color("#5566a3"),
      cur: new Float32Array(d.n * 3),
      lineColA: new THREE.Color("#1F3A93"),
      lineColB: new THREE.Color("#7C9BFF"),
      lastTint: -1,
      rotY: 0,
      rotX: 0,
    }),
    [d.n],
  );

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(d.edges.length * 6), 3),
    );
    return g;
  }, [d.edges.length]);

  useFrame(({ clock, camera }, delta) => {
    const t = animated ? clock.elapsedTime : 0;
    const E = state.explode;
    const Z = state.zoom;
    const { o, c, cur } = tmp;
    const cube = cubes.current;
    if (!cube) return;

    const aspect = size.width / size.height;
    const viewH = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);
    const viewW = viewH * aspect;
    const wide = aspect > 1.1;

    // everything shrinks away during the final push-in so nothing clips the camera
    const dissolve = 1 - smooth(clamp01((Z - 0.55) / 0.4));

    for (let i = 0; i < d.n; i++) {
      const isNode = d.nodeScale[i] > 0;
      const e = easeInOut(clamp01((E - d.delay[i]) / 0.6));
      const arcK = Math.sin(Math.PI * e);
      const bob = isNode && e > 0.99 ? Math.sin(t * 0.6 + i) * 0.05 : 0;
      const x = d.home[i * 3] + (d.target[i * 3] - d.home[i * 3]) * (isNode ? e : 0) + d.arc[i * 3] * arcK;
      const y =
        d.home[i * 3 + 1] +
        (d.target[i * 3 + 1] - d.home[i * 3 + 1]) * (isNode ? e : 0) +
        d.arc[i * 3 + 1] * arcK * (isNode ? 1 : 0) +
        bob;
      const z = isNode
        ? d.home[i * 3 + 2] + (d.target[i * 3 + 2] - d.home[i * 3 + 2]) * e + d.arc[i * 3 + 2] * arcK
        : d.arc[i * 3 + 2] * e;
      cur[i * 3] = x;
      cur[i * 3 + 1] = y;
      cur[i * 3 + 2] = z;
      o.position.set(x, y, z);
      o.rotation.set(0, d.spin[i] * e, 0);
      let sx: number;
      let sz: number;
      if (isNode) {
        const hubBoost = i === d.hubCell ? 1.9 : 1; // the blue cube reads at rest
        const u0 = d.s * GAP * hubBoost;
        sx = u0 + (d.nodeScale[i] - u0) * e;
        const z0 = d.s * SLAB * hubBoost * (hubBoost > 1 ? 1.3 : 1);
        sz = z0 + (d.nodeScale[i] - z0) * e;
        sx *= dissolve;
        sz *= dissolve;
      } else {
        // everything that is not a node shrinks away (staggered left -> right)
        const shrink = 1 - easeIn(clamp01((E - d.delay[i] * 0.8) / 0.5));
        sx = d.s * GAP * shrink;
        sz = d.s * SLAB * shrink;
      }
      if (i === d.hubCell) {
        // the single special cube is a separate mesh
        const hm = hub.current;
        if (hm) {
          hm.position.set(x, y, z);
          hm.rotation.set(0, d.spin[i] * e, 0);
          hm.scale.set(sx, sx, sz);
        }
        o.scale.setScalar(0);
      } else {
        o.scale.set(sx, sx, sz);
      }
      o.updateMatrix();
      cube.setMatrixAt(i, o.matrix);
    }
    cube.instanceMatrix.needsUpdate = true;

    // colours only when the tint changes
    const tint = Math.round(state.tint * 100) / 100;
    if (tint !== tmp.lastTint) {
      tmp.lastTint = tint;
      for (let i = 0; i < d.n; i++) {
        c.setRGB(d.base[i * 3], d.base[i * 3 + 1], d.base[i * 3 + 2]);
        c.lerp(tmp.light, tint * 0.85);
        cube.setColorAt(i, c);
      }
      if (cube.instanceColor) cube.instanceColor.needsUpdate = true;
      const lm = lines.current?.material as THREE.LineBasicMaterial | undefined;
      lm?.color.lerpColors(tmp.lineColA, tmp.lineColB, tint);
    }

    // network lines follow the nodes
    const lm = lines.current?.material as THREE.LineBasicMaterial | undefined;
    const net = clamp01((E - 0.7) / 0.3);
    if (lm) {
      lm.opacity = net * 0.6 * dissolve;
      if (lines.current) lines.current.visible = net > 0.001 && dissolve > 0.001;
      if (net > 0.001) {
        const pos = lineGeo.getAttribute("position") as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let k = 0; k < d.edges.length; k++) {
          const [a, b] = d.edges[k];
          arr[k * 6] = cur[a * 3];
          arr[k * 6 + 1] = cur[a * 3 + 1];
          arr[k * 6 + 2] = cur[a * 3 + 2];
          arr[k * 6 + 3] = cur[b * 3];
          arr[k * 6 + 4] = cur[b * 3 + 1];
          arr[k * 6 + 5] = cur[b * 3 + 2];
        }
        pos.needsUpdate = true;
      }
    }

    // packets travel publisher -> broker -> hub -> broker -> subscriber
    const p = pk.current;
    if (p) {
      p.visible = net > 0.05 && dissolve > 0.001;
      if (p.visible) {
        for (let k = 0; k < d.packets.length; k++) {
          const pa = d.packets[k];
          const route = d.routes[pa.route];
          const f = ((t * pa.speed + pa.offset) % 1) * (route.length - 1);
          const seg = Math.min(route.length - 2, Math.floor(f));
          const u = f - seg;
          const a = route[seg];
          const b = route[seg + 1];
          o.position.set(
            cur[a * 3] + (cur[b * 3] - cur[a * 3]) * u,
            cur[a * 3 + 1] + (cur[b * 3 + 1] - cur[a * 3 + 1]) * u,
            cur[a * 3 + 2] + (cur[b * 3 + 2] - cur[a * 3 + 2]) * u,
          );
          o.rotation.set(0, 0, 0);
          o.scale.setScalar(0.11 * net * dissolve);
          o.updateMatrix();
          p.setMatrixAt(k, o.matrix);
        }
        p.instanceMatrix.needsUpdate = true;
      }
    }

    // group: logo lives in the right ~40% of the viewport, network is centred
    const ee = smooth(clamp01(E * 1.4));
    if (outer.current) {
      const logoW = LOGO_H * LOGO_ASPECT;
      const k0 = wide ? Math.min(1, (viewW * 0.34) / logoW, (viewH * 0.74) / LOGO_H) : Math.min(1, (viewW * 0.7) / logoW, 0.9);
      const logoX = wide ? viewW * 0.3 * (mirror ? -1 : 1) : 0; // RTL: logo on the left
      const logoY = wide ? 0 : -viewH * 0.2;
      const netK = Math.min(1, (viewW * 0.92) / (NET_HALF_W * 2));
      outer.current.position.x = logoX * (1 - ee);
      outer.current.position.y = logoY * (1 - ee);
      outer.current.scale.setScalar(k0 + (netK - k0) * ee);
    }
    if (hub.current) {
      hub.current.visible = true;
    }
    if (inner.current) {
      const damp = 1 - Math.exp(-delta * 4);
      const idle = Math.sin(t * 0.4) * 0.22;
      tmp.rotY += (idle + state.px * 0.25 - tmp.rotY) * damp;
      tmp.rotX += (-state.py * 0.12 - tmp.rotX) * damp;
      const calm = 1 - clamp01(E * 1.5);
      inner.current.rotation.y = tmp.rotY * calm;
      inner.current.rotation.x = tmp.rotX * calm;
    }
    if (shadow.current) {
      (shadow.current.material as THREE.MeshBasicMaterial).opacity = clamp01(1 - E * 3);
    }

    // camera push-in (only at the very end, after the network has settled)
    camera.position.z = CAM_Z - Z * Z * 8.5;
  });

  const half = LOGO_H / 2;

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={2.4} />
      <directionalLight position={[-6, -2, 4]} intensity={0.7} color="#7C9BFF" />
      <group ref={outer}>
        <mesh
          ref={shadow}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -half - 0.35, 0]}
        >
          <planeGeometry args={[3.2, 2]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
        <group ref={inner}>
          <instancedMesh
            ref={cubes}
            args={[undefined, undefined, d.n]}
            frustumCulled={false}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.5} metalness={0.1} />
          </instancedMesh>
          {/* the one special cube */}
          <mesh ref={hub} frustumCulled={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#1F3A93"
              emissive="#1F3A93"
              emissiveIntensity={1.1}
              roughness={0.4}
            />
          </mesh>
          <lineSegments ref={lines} geometry={lineGeo} frustumCulled={false} visible={false}>
            <lineBasicMaterial color="#1F3A93" transparent opacity={0} depthWrite={false} />
          </lineSegments>
          <instancedMesh
            ref={pk}
            args={[undefined, undefined, PACKETS]}
            frustumCulled={false}
            visible={false}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#7C9BFF" toneMapped={false} />
          </instancedMesh>
        </group>
      </group>
    </>
  );
}

export default function HeroCanvas({
  state,
  frameloop,
  animated,
  mirror = false,
}: {
  state: HeroState;
  frameloop: "always" | "demand" | "never";
  animated: boolean;
  mirror?: boolean;
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Scene state={state} animated={animated} mirror={mirror} />
    </Canvas>
  );
}
