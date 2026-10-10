"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Logo } from "./Logo";
import type { HeroState } from "./HeroScene";
import { getDict, isRtl, type Locale } from "@/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);
// the mobile URL bar showing/hiding must not re-measure and jump the pinned story
ScrollTrigger.config({ ignoreMobileResize: true });

/** Timeline position (s) where the hub cube covers the whole viewport. */
const COVER_AT = 2.5;

const HeroCanvas = dynamic(() => import("./HeroScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Pinned scroll story. The wrapper is 280vh tall on desktop; the stage inside
 * is `sticky h-screen`. A ScrollTrigger-scrubbed GSAP timeline writes into the
 * shared `state` object (explode / dive) that the R3F scene reads each
 * frame, and animates the DOM layers (headline, dark overlay, canvas).
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const rtl = isRtl(locale);
  const wrapper = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [state] = useState<HeroState>(() => ({
    explode: 0,
    tint: 0,
    dive: 0,
    px: 0,
    py: 0,
  }));
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  /* Browser-only feature detection: must run after mount, never during SSR. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setWebgl(hasWebGL());
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // finger scrolling must not wobble the logo
      state.px = (e.clientX / window.innerWidth) * 2 - 1;
      state.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    if (wrapper.current) io.observe(wrapper.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, [state]);

  useEffect(() => {
    if (!webgl) return;
    // the canvas mounts after hydration; re-measure pinned/scrubbed triggers once it is in
    const t = setTimeout(() => {
      setReady(true);
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(t);
  }, [webgl]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // on phones the headline sits right above the logo: clear it sooner
          const phone = window.matchMedia("(max-width: 767px)").matches;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: wrapper.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // lets the fixed header know which colour is under it
                // dark once the (ink-coloured) hub fills nearly the whole screen
                if (wrapper.current)
                  wrapper.current.dataset.theme =
                    self.progress * tl.duration() >= COVER_AT - 0.12 ? "dark" : "light";
              },
            },
          });
          // 1. headline slides away while the logo breaks apart
          tl.to(state, { explode: 1, duration: 1.5 }, 0)
            .to(headline.current, { yPercent: -35, opacity: 0, duration: phone ? 0.45 : 0.9 }, 0)
            .to(hint.current, { opacity: 0, duration: 0.3 }, 0)
            // 2. the network stays on paper; the camera dives into the blue hub cube,
            //    which turns ink and fills the screen at COVER_AT
            .to(state, { dive: 1, duration: COVER_AT - 1.6, ease: "power1.in" }, 1.6)
            // 3. hub covers everything: swap in the plain ink layer, then drop the canvas
            .fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.02 }, COVER_AT)
            .to(canvasWrap.current, { opacity: 0, duration: 0.1 }, COVER_AT + 0.02)
            .to(grid.current, { opacity: 0, duration: 0.1 }, COVER_AT + 0.02)
            // trailing pad: the screen is already plain ink before the Work section
            // (which overlaps the stage by 55svh) starts to slide up over it
            .to({}, { duration: 1.5 }, COVER_AT + 0.12);
        },
      );
      return () => mm.revert();
    },
    { scope: wrapper },
  );

  const frameloop = reduced ? "demand" : inView ? "always" : "never";

  return (
    <div
      ref={wrapper}
      data-theme="light"
      className="relative bg-paper motion-safe:h-[280svh]"
    >
      <div className="relative h-svh min-h-[560px] overflow-hidden motion-safe:sticky motion-safe:top-0">
        {/* plain ink layer, switched on once the hub fills the screen, behind the 3D scene */}
        <div
          ref={overlay}
          className="absolute inset-0 bg-ink opacity-0"
          aria-hidden="true"
        />

        {/* thin grid lines, kott-style */}
        <div
          ref={grid}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto grid max-w-[1600px] grid-cols-4 px-4 sm:px-8"
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-s border-ink/[.12] last:border-e" />
          ))}
        </div>

        {/* headline */}
        <div
          ref={headline}
          className="relative z-10 flex h-full flex-col justify-start px-4 pb-10 pt-28 sm:px-8 md:justify-center md:pt-24"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="label mb-6 text-ink/70">{t.hero.eyebrow}</p>
            <h1 className="display text-[clamp(2.6rem,11.5vw,5rem)] md:max-w-[58vw] md:text-[clamp(3rem,7.2vw,8.75rem)] rtl:text-[clamp(2.2rem,9.5vw,4.2rem)] rtl:md:max-w-[56vw] rtl:md:text-[clamp(2.6rem,5.6vw,7rem)]">
              {t.hero.headline.lines.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
              <span className="inline-block bg-blue px-[0.1em] text-paper">
                {t.hero.headline.hl}
              </span>
              {t.hero.headline.after}
            </h1>
            <p className="label mt-8 max-w-md text-ink/80">{t.hero.sub}</p>
          </div>
        </div>

        {/* SVG fallback while the canvas loads / without WebGL */}
        <div
          className={`pointer-events-none absolute inset-0 z-[5] flex items-center justify-center transition-opacity duration-500 ltr:md:left-auto rtl:md:right-auto md:w-[40%] ${
            ready && webgl ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={webgl ? true : undefined}
        >
          <Logo
            className="mt-64 h-[30vh] w-auto text-ink md:mt-0 md:h-[70vh]"
            title={webgl === false ? t.hero.logoTitle : undefined}
          />
        </div>

        {/* 3D scene */}
        <div
          ref={canvasWrap}
          className="absolute inset-0 z-[6]"
          role="img"
          aria-label={t.hero.canvasLabel}
        >
          {webgl && (
            <div className="h-full w-full">
              <HeroCanvas state={state} frameloop={frameloop} animated={!reduced} mirror={rtl} />
            </div>
          )}
        </div>

        <div
          ref={hint}
          className="label absolute bottom-6 start-4 z-10 text-ink/60 sm:start-8"
        >
          {t.hero.scroll}
        </div>
      </div>
    </div>
  );
}
