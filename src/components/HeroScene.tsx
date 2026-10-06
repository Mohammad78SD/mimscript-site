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
  explode: number; // 0 = intact logo, 1 = full network
  tint: number; // 0 = dark cubes (light bg), 1 = mint-ish cubes (dark bg)
  zoom: number; // camera push-in 0..1
  px: number; // pointer -1..1
  py: number;
};

const ROWS = 34;
const LAYERS = 2;
const LOGO_H = 5; // world units
const CAM_Z = 11;
const PACKETS = 28;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function buildData() {
  const vox = rasterizeMim(ROWS);
  const s = LOGO_H / vox.rows;
  const rnd = mulberry32(7);
  const n = vox.cells.length * LAYERS;
  const home = new Float32Array(n * 3);
  const target = new Float32Array(n * 3);
  const arc = new Float32Array(n * 3);
  const rot = new Float32Array(n * 3);
  const delay = new Float32Array(n);
  const nodeScale = new Float32Array(n);
  const base = new Float32Array(n * 3); // base colour
  const dark = new THREE.Color("#0F1414");
  const green = new THREE.Color("#1B4441");
  const mint = new THREE.Color("#A8D5C8");

  // special mint cube: front-layer cell closest to (65%, 25%) of the glyph
  let mintIdx = 0;
  let best = Infinity;
  let i = 0;
  for (const [c, r] of vox.cells) {
    for (let l = 0; l < LAYERS; l++) {
      const d =
        Math.hypot(c / vox.cols - 0.65, r / vox.rows - 0.25) + (l === 0 ? 0.2 : 0);
      if (d < best) {
        best = d;
        mintIdx = i;
      }
      home[i * 3] = (c - vox.cols / 2 + 0.5) * s;
      home[i * 3 + 1] = (vox.rows / 2 - r - 0.5) * s;
      home[i * 3 + 2] = (l - (LAYERS - 1) / 2) * s;
      i++;
    }
  }
  for (let k = 0; k < n; k++) {
    target[k * 3] = (rnd() - 0.5) * 22;
    target[k * 3 + 1] = (rnd() - 0.5) * 12;
    target[k * 3 + 2] = -16 + rnd() * 19;
    arc[k * 3] = (rnd() - 0.5) * 4;
    arc[k * 3 + 1] = (rnd() - 0.5) * 4;
    arc[k * 3 + 2] = rnd() * 3;
    rot[k * 3] = (rnd() - 0.5) * 6;
    rot[k * 3 + 1] = (rnd() - 0.5) * 6;
    rot[k * 3 + 2] = (rnd() - 0.5) * 4;
    delay[k] = rnd();
    nodeScale[k] = 1.4 + rnd() * 2.2;
    const col = k === mintIdx ? mint : rnd() < 0.7 ? dark : green;
    base[k * 3] = col.r;
    base[k * 3 + 1] = col.g;
    base[k * 3 + 2] = col.b;
  }
  nodeScale[mintIdx] = 5;

  // edges: connect every node to its 3 nearest nodes (by network position)
  const edgeSet = new Set<number>();
  const edges: [number, number][] = [];
  for (let a = 0; a < n; a++) {
    const ds: [number, number][] = [];
    for (let b = 0; b < n; b++) {
      if (a === b) continue;
      const dx = target[a * 3] - target[b * 3];
      const dy = target[a * 3 + 1] - target[b * 3 + 1];
      const dz = target[a * 3 + 2] - target[b * 3 + 2];
      ds.push([dx * dx + dy * dy + dz * dz, b]);
    }
    ds.sort((p, q) => p[0] - q[0]);
    for (let k = 0; k < 3; k++) {
      const b = ds[k][1];
      const key = Math.min(a, b) * n + Math.max(a, b);
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([a, b]);
      }
    }
  }
  const packets = Array.from({ length: PACKETS }, () => ({
    edge: Math.floor(rnd() * edges.length),
    speed: 0.12 + rnd() * 0.25,
    offset: rnd(),
  }));

  return { n, s, home, target, arc, rot, delay, nodeScale, base, edges, packets, mintIdx };
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(15,20,20,0.42)");
  grad.addColorStop(1, "rgba(15,20,20,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

function Scene({ state, animated }: { state: HeroState; animated: boolean }) {
  const d = useMemo(() => buildData(), []);
  const shadowTex = useMemo(() => shadowTexture(), []);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const cubes = useRef<THREE.InstancedMesh>(null);
  const pk = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);

  const tmp = useMemo(
    () => ({
      o: new THREE.Object3D(),
      c: new THREE.Color(),
      light: new THREE.Color("#8fc4b5"),
      cur: new Float32Array(d.n * 3),
      lineColA: new THREE.Color("#1B4441"),
      lineColB: new THREE.Color("#A8D5C8"),
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
    const { o, c, cur } = tmp;
    const cube = cubes.current;
    if (!cube) return;

    for (let i = 0; i < d.n; i++) {
      const e = easeInOut(clamp01(E * 1.5 - d.delay[i] * 0.5));
      const arcK = Math.sin(Math.PI * e);
      const fl = e > 0.99 ? Math.sin(t * 0.6 + i) * 0.09 : 0;
      const x = d.home[i * 3] + (d.target[i * 3] - d.home[i * 3]) * e + d.arc[i * 3] * arcK;
      const y =
        d.home[i * 3 + 1] +
        (d.target[i * 3 + 1] - d.home[i * 3 + 1]) * e +
        d.arc[i * 3 + 1] * arcK +
        fl;
      const z =
        d.home[i * 3 + 2] +
        (d.target[i * 3 + 2] - d.home[i * 3 + 2]) * e +
        d.arc[i * 3 + 2] * arcK;
      cur[i * 3] = x;
      cur[i * 3 + 1] = y;
      cur[i * 3 + 2] = z;
      o.position.set(x, y, z);
      o.rotation.set(d.rot[i * 3] * e, d.rot[i * 3 + 1] * e, d.rot[i * 3 + 2] * e);
      const sc = d.s * 0.92 * (1 + (d.nodeScale[i] - 1) * e);
      o.scale.setScalar(sc);
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
        if (i !== d.mintIdx) c.lerp(tmp.light, tint * 0.7);
        cube.setColorAt(i, c);
      }
      if (cube.instanceColor) cube.instanceColor.needsUpdate = true;
      const lm = lines.current?.material as THREE.LineBasicMaterial | undefined;
      lm?.color.lerpColors(tmp.lineColA, tmp.lineColB, tint);
    }

    // network lines follow the nodes
    const lm = lines.current?.material as THREE.LineBasicMaterial | undefined;
    const net = clamp01((E - 0.5) / 0.5);
    if (lm) {
      lm.opacity = net * 0.55;
      if (lines.current) lines.current.visible = net > 0.001;
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

    // packets travelling along edges
    const p = pk.current;
    if (p) {
      p.visible = net > 0.05;
      if (p.visible) {
        for (let k = 0; k < d.packets.length; k++) {
          const pa = d.packets[k];
          const [a, b] = d.edges[pa.edge];
          const f = (t * pa.speed + pa.offset) % 1;
          o.position.set(
            cur[a * 3] + (cur[b * 3] - cur[a * 3]) * f,
            cur[a * 3 + 1] + (cur[b * 3 + 1] - cur[a * 3 + 1]) * f,
            cur[a * 3 + 2] + (cur[b * 3 + 2] - cur[a * 3 + 2]) * f,
          );
          o.rotation.set(0, 0, 0);
          o.scale.setScalar(0.17 * net);
          o.updateMatrix();
          p.setMatrixAt(k, o.matrix);
        }
        p.instanceMatrix.needsUpdate = true;
      }
    }

    // group: layout offset, idle sway, pointer tilt
    const wide = viewport.aspect > 1.1;
    const keep = 1 - clamp01(E * 1.2);
    if (outer.current) {
      outer.current.position.x = wide ? viewport.width * 0.2 * keep : 0;
      outer.current.position.y = wide ? 0 : -viewport.height * 0.1 * keep;
      const k = wide ? 1 : Math.min(1, viewport.width / 5.2);
      outer.current.scale.setScalar(k + (1 - k) * (1 - keep));
    }
    if (inner.current) {
      const damp = 1 - Math.exp(-delta * 4);
      const idle = Math.sin(t * 0.4) * 0.35;
      tmp.rotY += (idle + state.px * 0.35 - tmp.rotY) * damp;
      tmp.rotX += (-state.py * 0.18 - tmp.rotX) * damp;
      const calm = 1 - 0.8 * clamp01(E);
      inner.current.rotation.y = tmp.rotY * calm + (animated ? t * 0.04 * E : 0);
      inner.current.rotation.x = tmp.rotX * calm;
    }
    if (shadow.current) {
      (shadow.current.material as THREE.MeshBasicMaterial).opacity = clamp01(1 - E * 2.5);
    }

    // camera push-in
    const z = state.zoom;
    camera.position.z = CAM_Z - z * z * 20;
  });

  const half = LOGO_H / 2;

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={2.4} />
      <directionalLight position={[-6, -2, 4]} intensity={0.7} color="#a8d5c8" />
      <group ref={outer}>
        <mesh
          ref={shadow}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -half - 0.35, 0]}
        >
          <planeGeometry args={[5, 3]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
        <group ref={inner}>
          <instancedMesh
            ref={cubes}
            args={[undefined, undefined, d.n]}
            frustumCulled={false}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.55} metalness={0.05} />
          </instancedMesh>
          <lineSegments ref={lines} geometry={lineGeo} frustumCulled={false} visible={false}>
            <lineBasicMaterial color="#1B4441" transparent opacity={0} depthWrite={false} />
          </lineSegments>
          <instancedMesh
            ref={pk}
            args={[undefined, undefined, PACKETS]}
            frustumCulled={false}
            visible={false}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#A8D5C8" toneMapped={false} />
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
}: {
  state: HeroState;
  frameloop: "always" | "demand" | "never";
  animated: boolean;
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ position: [0, 0, CAM_Z], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Scene state={state} animated={animated} />
    </Canvas>
  );
}
