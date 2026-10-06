import type { ReactNode } from "react";

/**
 * Code-made visuals for each project, drawn in the site palette (ink + blue).
 * One SVG per project on a shared 640x400 canvas; `meet` scaling means the
 * drawing is never cropped, whatever box it is placed in.
 * Content is limited to facts from the repos' READMEs; no real data.
 */

const INK = "#0E1220";
const CARD = "#151A2E";
const LINE = "rgba(255,255,255,0.14)";
const BL = "#7C9BFF";
const B = "#1F3A93";
const PAPER = "#F2F2F0";
const MUTED = "rgba(242,242,240,0.55)";
const MONO = "var(--font-jetbrains), ui-monospace, monospace";

type Props = { slug: string; className?: string; label?: string };

export function ProjectVisual({ slug, className, label }: Props) {
  const Art = visuals[slug];
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-ink ${className ?? ""}`}
      dir="ltr"
      role="img"
      aria-label={label ?? `${slug} illustration`}
    >
      <svg
        viewBox="0 0 640 400"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern id={`g-${slug}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width="640" height="400" fill={`url(#g-${slug})`} />
        {Art ? <Art /> : null}
      </svg>
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Chip({ x, y, children, w = 120 }: { x: number; y: number; children: ReactNode; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height="28" rx="14" fill={CARD} stroke={LINE} />
      <circle cx="16" cy="14" r="4" fill={BL} />
      <text x="28" y="18.5" fontSize="11" fill={PAPER} style={{ fontFamily: MONO }}>
        {children}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = MUTED }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (r: number) => x2 - 8 * Math.cos(a + r);
  const hy = (r: number) => y2 - 8 * Math.sin(a + r);
  return (
    <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M${hx(0.45)} ${hy(0.45)} L${x2} ${y2} L${hx(-0.45)} ${hy(-0.45)}`} />
    </g>
  );
}

function Code({ x, y, lines, size = 11.5, gap = 18 }: { x: number; y: number; lines: ReactNode[]; size?: number; gap?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fill={PAPER} style={{ fontFamily: MONO }}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : gap}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

/* ---------- leads: lifecycle state machine ---------- */

function LeadsArt() {
  const states = [
    { name: "NEW", x: 24 },
    { name: "ASSIGNED", x: 184 },
    { name: "CONTACTED", x: 344 },
    { name: "CONVERTED", x: 504 },
  ];
  const W = 112;
  const Y = 96;
  const H = 46;
  return (
    <g>
      <text x="24" y="52" fontSize="11" fill={MUTED} style={{ fontFamily: MONO, letterSpacing: "0.08em" }}>
        LEAD LIFECYCLE
      </text>
      {/* happy path */}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={states[i].x + W + 4} y1={Y + H / 2} x2={states[i + 1].x - 4} y2={Y + H / 2} />
      ))}
      {["assign", "REACHED attempt", "convert"].map((t, i) => (
        <text
          key={t}
          x={states[i].x + W + 24 + (i === 1 ? -4 : 0)}
          y={Y - 8}
          fontSize="9.5"
          textAnchor="middle"
          fill={MUTED}
          style={{ fontFamily: MONO }}
        >
          {t}
        </text>
      ))}
      {/* close-lost from every open state */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${states[i].x + W / 2} ${Y + H + 2} V${228} H${i === 1 ? 300 : i === 0 ? 270 : 330} `}
          fill="none"
          stroke={MUTED}
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      ))}
      <Arrow x1={300} y1={228} x2={300} y2={252} />
      <text x="400" y="222" fontSize="9.5" fill={MUTED} style={{ fontFamily: MONO }}>
        close-lost (any open status)
      </text>
      {/* boxes */}
      {states.map((s, i) => (
        <g key={s.name}>
          <rect x={s.x} y={Y} width={W} height={H} rx="6" fill={CARD} stroke={LINE} />
          <rect
            className="vis-anim"
            x={s.x}
            y={Y}
            width={W}
            height={H}
            rx="6"
            fill={B}
            stroke={BL}
            opacity="0"
            style={{ animation: `vis-hl 6s linear ${i * 1.5}s infinite` }}
          />
          <text x={s.x + W / 2} y={Y + 28} fontSize="11.5" textAnchor="middle" fill={PAPER} style={{ fontFamily: MONO }}>
            {s.name}
          </text>
        </g>
      ))}
      <rect x="240" y="252" width="120" height={H} rx="6" fill={CARD} stroke={LINE} />
      <text x="300" y="280" fontSize="11.5" textAnchor="middle" fill={PAPER} style={{ fontFamily: MONO }}>
        CLOSED_LOST
      </text>
      <text x="24" y="320" fontSize="9.5" fill={MUTED} style={{ fontFamily: MONO }}>
        invalid transitions are refused (409)
      </text>
      <Chip x={24} y={346} w={132}>
        130 passed
      </Chip>
      <Chip x={168} y={346} w={168}>
        row-locked services
      </Chip>
    </g>
  );
}

/* ---------- mahsa: attendance API + RTL phone ---------- */

function MahsaArt() {
  return (
    <g>
      {/* request card */}
      <rect x="28" y="64" width="360" height="190" rx="8" fill={CARD} stroke={LINE} />
      <circle cx="46" cy="82" r="3.5" fill={MUTED} />
      <circle cx="58" cy="82" r="3.5" fill={MUTED} />
      <circle cx="70" cy="82" r="3.5" fill={MUTED} />
      <line x1="28" y1="98" x2="388" y2="98" stroke={LINE} />
      <Code
        x={44}
        y={124}
        gap={20}
        lines={[
          <>
            <tspan fill={BL}>POST</tspan> /attendance/api/
          </>,
          <tspan key="h" fill={MUTED}>X-Device-Token: ••••••••</tspan>,
          "",
          "{",
          <>
            {"  "}
            <tspan fill={BL}>&quot;rfid&quot;</tspan>: &quot;…&quot;,
          </>,
          <>
            {"  "}
            <tspan fill={BL}>&quot;time&quot;</tspan>: &quot;2025-03-22T08:00:00&quot;
          </>,
          "}",
        ]}
      />
      <text x="44" y="284" fontSize="10" fill={MUTED} style={{ fontFamily: MONO }}>
        RFID reader → JSON API → attendance record
      </text>
      <Chip x={28} y={318} w={110}>
        64 passed
      </Chip>
      <Chip x={150} y={318} w={96}>
        PWA
      </Chip>
      <Chip x={258} y={318} w={130}>
        Jalali dates
      </Chip>

      {/* phone */}
      <g transform="translate(430 40)">
        <rect width="184" height="320" rx="26" fill={CARD} stroke={LINE} strokeWidth="1.5" />
        <rect x="64" y="10" width="56" height="6" rx="3" fill={INK} />
        <rect x="14" y="34" width="156" height="46" rx="10" fill={B} />
        <text
          x="92"
          y="63"
          fontSize="17"
          fontWeight="700"
          fill={PAPER}
          textAnchor="middle"
          lang="fa"
          className="font-fa"
          style={{ fontFamily: "var(--font-vazirmatn), sans-serif" }}
        >
          حضور و غیاب
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(14 ${98 + i * 52})`}>
            <rect width="156" height="42" rx="8" fill={INK} stroke={LINE} />
            <circle cx="136" cy="21" r="8" fill={i === 0 ? BL : "rgba(255,255,255,0.14)"} />
            <rect x="52" y="12" width="64" height="6" rx="3" fill="rgba(255,255,255,0.28)" />
            <rect x="72" y="24" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.14)" />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ---------- event-photos: QR -> upload -> projector wall ---------- */

function EventPhotosArt() {
  const qr: [number, number][] = [];
  // deterministic QR-like pattern
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
      if (corner) continue;
      if ((r * 7 + c * 13 + r * c) % 3 === 0) qr.push([c, r]);
    }
  const tiles = [
    ["#1F3A93", "#7C9BFF"],
    ["#7C9BFF", "#F2F2F0"],
    ["#2b3350", "#1F3A93"],
    ["#F2F2F0", "#7C9BFF"],
    ["#1F3A93", "#2b3350"],
    ["#7C9BFF", "#1F3A93"],
    ["#2b3350", "#7C9BFF"],
    ["#F2F2F0", "#2b3350"],
    ["#1F3A93", "#F2F2F0"],
  ];
  return (
    <g>
      {/* phone with QR */}
      <g transform="translate(26 50)">
        <rect width="150" height="290" rx="22" fill={CARD} stroke={LINE} strokeWidth="1.5" />
        <rect x="52" y="9" width="46" height="5" rx="2.5" fill={INK} />
        <g transform="translate(34 62)">
          <rect width="82" height="82" rx="6" fill={PAPER} />
          <g transform="translate(5 5)" fill={INK}>
            {[[0, 0], [6, 0], [0, 6]].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx * 8} ${cy * 8})`}>
                <rect width="24" height="24" />
                <rect x="4" y="4" width="16" height="16" fill={PAPER} />
                <rect x="8" y="8" width="8" height="8" />
              </g>
            ))}
            {qr.map(([c, r]) => (
              <rect key={`${c}-${r}`} x={c * 8} y={r * 8} width="7" height="7" />
            ))}
          </g>
          <rect
            className="vis-anim"
            x="-6"
            y="4"
            width="94"
            height="3"
            rx="1.5"
            fill={BL}
            style={{ animation: "vis-scan 2.2s ease-in-out infinite alternate" }}
          />
        </g>
        <text x="75" y="176" fontSize="10" fill={MUTED} textAnchor="middle" style={{ fontFamily: MONO }}>
          scan to join
        </text>
        <rect x="26" y="210" width="98" height="30" rx="15" fill={B} />
        <text x="75" y="229" fontSize="10.5" fill={PAPER} textAnchor="middle" style={{ fontFamily: MONO }}>
          upload photos
        </text>
      </g>

      {/* progress */}
      <g transform="translate(206 120)">
        <text x="0" y="-18" fontSize="10" fill={MUTED} style={{ fontFamily: MONO, letterSpacing: "0.08em" }}>
          PER-FILE PROGRESS
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(0 ${i * 38})`}>
            <rect width="120" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
            <rect
              className="vis-anim"
              width="120"
              height="10"
              rx="5"
              fill={BL}
              style={{
                transformOrigin: "left center",
                animation: `vis-bar ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          </g>
        ))}
        <Arrow x1={134} y1={58} x2={168} y2={58} />
      </g>
      <text x="206" y="318" fontSize="9.5" fill={MUTED} style={{ fontFamily: MONO }}>
        moderation → approved
      </text>

      {/* projector wall */}
      <g transform="translate(386 50)">
        <rect width="228" height="170" rx="6" fill={CARD} stroke={LINE} strokeWidth="1.5" />
        {tiles.map(([a, b], i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <g key={i} transform={`translate(${10 + col * 70} ${10 + row * 50})`}>
              <defs>
                <linearGradient id={`t${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={a} />
                  <stop offset="1" stopColor={b} />
                </linearGradient>
              </defs>
              <rect
                className="vis-anim"
                width="64"
                height="44"
                rx="3"
                fill={`url(#t${i})`}
                style={{ animation: `vis-tile 6s ease-in-out ${(i * 0.65) % 6}s infinite` }}
              />
            </g>
          );
        })}
        <rect x="98" y="170" width="32" height="26" fill={CARD} stroke={LINE} />
        <rect x="70" y="196" width="88" height="6" rx="3" fill={CARD} stroke={LINE} />
        <text x="114" y="228" fontSize="10" fill={MUTED} textAnchor="middle" style={{ fontFamily: MONO }}>
          live projector wall
        </text>
      </g>
      <Chip x={386} y={256} w={112}>
        90 passed
      </Chip>
      <Chip x={510} y={256} w={104}>
        Celery ZIP
      </Chip>
    </g>
  );
}

/* ---------- rahorasm-backend: REST auth flow ---------- */

function RahoRasmArt() {
  return (
    <g>
      <text x="28" y="44" fontSize="11" fill={MUTED} style={{ fontFamily: MONO, letterSpacing: "0.08em" }}>
        OTP LOGIN · JWT
      </text>
      <rect x="28" y="62" width="284" height="120" rx="8" fill={CARD} stroke={LINE} />
      <Code
        x={44}
        y={90}
        gap={20}
        lines={[
          <>
            <tspan fill={BL}>POST</tspan> /auth/login/request
          </>,
          <tspan key="b" fill={MUTED}>{"{ … }"}</tspan>,
          <tspan key="r" fill={MUTED}>→ OTP sent by SMS</tspan>,
        ]}
      />
      <Arrow x1={170} y1={188} x2={170} y2={214} />
      <rect x="28" y="220" width="284" height="120" rx="8" fill={CARD} stroke={LINE} />
      <Code
        x={44}
        y={248}
        gap={20}
        lines={[
          <>
            <tspan fill={BL}>POST</tspan> /auth/login/validate
          </>,
          <tspan key="b" fill={MUTED}>{"{ … }"}</tspan>,
          <tspan key="r" fill={PAPER}>→ JWT access + refresh</tspan>,
        ]}
      />
      <Arrow x1={318} y1={280} x2={366} y2={280} />

      {/* authenticated call */}
      <rect x="372" y="220" width="244" height="120" rx="8" fill={CARD} stroke={BL} />
      <Code
        x={388}
        y={248}
        gap={20}
        lines={[
          <>
            <tspan fill={BL}>POST</tspan> /reserve/new/
          </>,
          <tspan key="b" fill={MUTED}>Authorization: Bearer …</tspan>,
          <tspan key="r" fill={MUTED}>flight_time_id, hotel_price_id</tspan>,
        ]}
      />
      <g transform="translate(372 62)">
        <rect width="244" height="120" rx="8" fill={CARD} stroke={LINE} />
        <text x="16" y="28" fontSize="10" fill={MUTED} style={{ fontFamily: MONO, letterSpacing: "0.08em" }}>
          MODULES
        </text>
        {["tours", "hotels", "reserve", "visa", "blog"].map((m, i) => (
          <g key={m} transform={`translate(${16 + (i % 3) * 74} ${44 + Math.floor(i / 3) * 32})`}>
            <rect width="66" height="24" rx="12" fill="none" stroke={LINE} />
            <text x="33" y="16" fontSize="10" textAnchor="middle" fill={PAPER} style={{ fontFamily: MONO }}>
              {m}
            </text>
          </g>
        ))}
      </g>
      <Chip x={28} y={358} w={110}>
        57 passed
      </Chip>
      <Chip x={150} y={358} w={160}>
        backend only
      </Chip>
    </g>
  );
}

/* ---------- mimify: order -> worker -> telegram ---------- */

function MimifyArt() {
  const nodes = [
    { x: 24, t: "WooCommerce", s: "new order" },
    { x: 178, t: "WordPress plugin", s: "X-Relay-Secret" },
    { x: 332, t: "Cloudflare Worker", s: "KV: secret → chat" },
  ];
  return (
    <g>
      {nodes.map((n, i) => (
        <g key={n.t}>
          <rect x={n.x} y="120" width="128" height="80" rx="8" fill={CARD} stroke={i === 2 ? BL : LINE} />
          <text x={n.x + 64} y="154" fontSize="11.5" fontWeight="700" textAnchor="middle" fill={PAPER}>
            {n.t}
          </text>
          <text x={n.x + 64} y="176" fontSize="9.5" textAnchor="middle" fill={MUTED} style={{ fontFamily: MONO }}>
            {n.s}
          </text>
        </g>
      ))}
      <Arrow x1={156} y1={160} x2={176} y2={160} />
      <Arrow x1={310} y1={160} x2={330} y2={160} />
      <Arrow x1={464} y1={160} x2={496} y2={160} />
      <text x="396" y="108" fontSize="9.5" fill={MUTED} textAnchor="middle" style={{ fontFamily: MONO }}>
        sendMessage
      </text>
      {/* packets */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className="vis-anim"
          x={24 + 134 + i * 154 + 6}
          y="156"
          width="8"
          height="8"
          fill={BL}
          style={{ ["--d" as string]: "26px", animation: `vis-slide 2.4s ease-in-out ${i * 0.6}s infinite` }}
        />
      ))}
      {/* telegram group */}
      <g transform="translate(500 84)">
        <rect width="116" height="152" rx="10" fill={CARD} stroke={LINE} />
        <circle cx="22" cy="22" r="8" fill={B} />
        <rect x="38" y="17" width="56" height="6" rx="3" fill="rgba(255,255,255,0.28)" />
        <rect x="12" y="46" width="92" height="46" rx="8" fill={B} />
        <rect x="22" y="58" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.7)" />
        <rect x="22" y="70" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.4)" />
        <text x="58" y="124" fontSize="9.5" textAnchor="middle" fill={MUTED} style={{ fontFamily: MONO }}>
          /link CODE
        </text>
        <text x="58" y="140" fontSize="9.5" textAnchor="middle" fill={MUTED} style={{ fontFamily: MONO }}>
          Telegram group
        </text>
      </g>
      <text x="24" y="262" fontSize="10" fill={MUTED} style={{ fontFamily: MONO }}>
        no bot tokens or chat IDs in WordPress
      </text>
      <Chip x={24} y={292} w={120}>
        Worker tests
      </Chip>
      <Chip x={156} y={292} w={156}>
        CI releases · update server
      </Chip>
    </g>
  );
}

/* ---------- lior-toolkit: modules ---------- */

function LiorArt() {
  const mods = [
    "admin-order-email-link",
    "auto-print-orders",
    "force-product-image-ratio",
    "mobile-show-both-product-images",
  ];
  return (
    <g>
      <text x="28" y="44" fontSize="11" fill={MUTED} style={{ fontFamily: MONO, letterSpacing: "0.08em" }}>
        lior-toolkit.php → modules/
      </text>
      {mods.map((m, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <g key={m} transform={`translate(${28 + col * 296} ${64 + row * 100})`}>
            <rect width="284" height="84" rx="8" fill={CARD} stroke={LINE} />
            <rect x="16" y="16" width="26" height="26" rx="6" fill={i === 1 ? B : "rgba(255,255,255,0.1)"} />
            <text x="54" y="34" fontSize="9" fill={MUTED} style={{ fontFamily: MONO }}>
              module {String(i + 1).padStart(2, "0")}
            </text>
            <text x="16" y="66" fontSize={m.length > 28 ? 10 : 12} fill={PAPER} style={{ fontFamily: MONO }}>
              {m}.php
            </text>
          </g>
        );
      })}
      <g transform="translate(28 264)">
        <rect width="284" height="46" rx="8" fill="none" stroke={LINE} strokeDasharray="5 5" />
        <text x="142" y="28" fontSize="11" textAnchor="middle" fill={MUTED} style={{ fontFamily: MONO }}>
          + drop a file, get a feature
        </text>
      </g>
      <g transform="translate(324 264)">
        <rect width="284" height="46" rx="8" fill={CARD} stroke={BL} />
        <text x="16" y="28" fontSize="11" fill={PAPER} style={{ fontFamily: MONO }}>
          update shown in WP admin
        </text>
      </g>
      <Chip x={28} y={336} w={158}>
        GitHub Releases
      </Chip>
      <Chip x={198} y={336} w={190}>
        key-authed REST queue
      </Chip>
    </g>
  );
}

/* ---------- seataar: live seat map ---------- */

function SeataarArt() {
  const cols = 14;
  const rows = 7;
  // seats that flip to "taken", in a repeating staggered cycle
  const flips = new Map<number, number>([
    [3 * cols + 4, 0],
    [2 * cols + 8, 1.1],
    [4 * cols + 6, 2.2],
    [1 * cols + 10, 3.3],
    [5 * cols + 3, 4.4],
    [3 * cols + 11, 5.5],
  ]);
  const taken = new Set([cols * 0 + 2, cols * 1 + 3, cols * 2 + 5, cols * 4 + 9, cols * 5 + 12, cols * 6 + 7, cols * 3 + 1, cols * 6 + 2]);
  return (
    <g>
      <rect x="140" y="36" width="360" height="14" rx="7" fill="rgba(255,255,255,0.08)" />
      <text x="320" y="47" fontSize="8.5" textAnchor="middle" fill={MUTED} style={{ fontFamily: MONO, letterSpacing: "0.3em" }}>
        STAGE
      </text>
      {Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols);
        const c = k % cols;
        const x = 96 + c * 34 + (c >= 7 ? 16 : 0);
        const y = 84 + r * 34;
        const isTaken = taken.has(k);
        const flip = flips.get(k);
        return (
          <g key={k}>
            <rect
              x={x}
              y={y}
              width="22"
              height="22"
              rx="6"
              fill={isTaken ? "rgba(255,255,255,0.14)" : "none"}
              stroke={isTaken ? "none" : BL}
              strokeOpacity="0.75"
            />
            {flip !== undefined && (
              <rect
                className="vis-anim"
                x={x}
                y={y}
                width="22"
                height="22"
                rx="6"
                fill={B}
                stroke={BL}
                opacity="0"
                style={{ animation: `vis-take 7s ease-in-out ${flip}s infinite` }}
              />
            )}
          </g>
        );
      })}
      <g transform="translate(96 340)">
        <rect width="14" height="14" rx="4" fill="none" stroke={BL} />
        <text x="22" y="11" fontSize="10" fill={MUTED} style={{ fontFamily: MONO }}>
          available
        </text>
        <rect x="100" width="14" height="14" rx="4" fill="rgba(255,255,255,0.14)" />
        <text x="122" y="11" fontSize="10" fill={MUTED} style={{ fontFamily: MONO }}>
          taken
        </text>
        <rect x="190" width="14" height="14" rx="4" fill={B} stroke={BL} />
        <text x="212" y="11" fontSize="10" fill={MUTED} style={{ fontFamily: MONO }}>
          just taken, live
        </text>
      </g>
    </g>
  );
}

const visuals: Record<string, () => ReactNode> = {
  leads: LeadsArt,
  mahsa: MahsaArt,
  "event-photos": EventPhotosArt,
  "rahorasm-backend": RahoRasmArt,
  mimify: MimifyArt,
  "lior-toolkit": LiorArt,
  seataar: SeataarArt,
};
