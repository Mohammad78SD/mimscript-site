"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Logo } from "./Logo";
import type { HeroState } from "./HeroScene";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
 * Pinned scroll story. The wrapper is 250vh tall on desktop; the stage inside
 * is `sticky h-screen`. A ScrollTrigger-scrubbed GSAP timeline writes into the
 * shared `state` object (explode / tint / zoom) that the R3F scene reads each
 * frame, and animates the DOM layers (headline, dark overlay, canvas).
 */
export function Hero() {
  const wrapper = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [state] = useState<HeroState>(() => ({
    explode: 0,
    tint: 0,
    zoom: 0,
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
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
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
                if (wrapper.current)
                  wrapper.current.dataset.theme =
                    self.progress > 0.58 ? "dark" : "light";
              },
            },
          });
          // 1. headline slides away while the logo breaks apart
          tl.to(state, { explode: 1, duration: 1.5 }, 0)
            .to(headline.current, { yPercent: -35, opacity: 0, duration: 0.9 }, 0)
            .to(hint.current, { opacity: 0, duration: 0.3 }, 0)
            // 2. paper stays until the network is formed (explode ends at 1.6), then an
            //    ink circle wipes out of the hub in ~15% of the scroll: no blended grey frame
            .fromTo(
              overlay.current,
              { clipPath: "circle(0% at 50% 50%)" },
              { clipPath: "circle(150% at 50% 50%)", duration: 0.5, ease: "power2.in" },
              1.6,
            )
            .to(state, { tint: 1, duration: 0.45 }, 1.7)
            .to(
              grid.current ? Array.from(grid.current.children) : [],
              { borderColor: "rgba(255,255,255,0.14)", duration: 0.4 },
              1.85,
            )
            // 3. camera pushes into the network, the screen ends up ink
            .to(state, { zoom: 1, duration: 0.7, ease: "power1.in" }, 1.8)
            .to(canvasWrap.current, { opacity: 0, duration: 0.3 }, 2.1)
            .to(grid.current, { opacity: 0, duration: 0.3 }, 2.1)
            // trailing pad: the Work section slides up over the (already ink) stage here
            .to({}, { duration: 0.7 }, 2.5);
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
      className="relative bg-paper md:motion-safe:h-[250vh]"
    >
      <div className="relative h-svh min-h-[560px] overflow-hidden md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-screen">
        {/* dark layer that fades in behind the 3D scene */}
        <div
          ref={overlay}
          className="absolute inset-0 bg-ink [clip-path:circle(0%_at_50%_50%)]"
          aria-hidden="true"
        />

        {/* thin grid lines, kott-style */}
        <div
          ref={grid}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto grid max-w-[1600px] grid-cols-4 px-4 sm:px-8"
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-l border-ink/[.12] last:border-r" />
          ))}
        </div>

        {/* headline */}
        <div
          ref={headline}
          className="relative z-10 flex h-full flex-col justify-start px-4 pb-10 pt-28 sm:px-8 md:justify-center md:pt-24"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="label mb-6 text-ink/70">MiM Script — Portfolio 2026</p>
            <h1 className="display text-[clamp(2.6rem,11.5vw,5rem)] md:max-w-[58vw] md:text-[clamp(3rem,7.2vw,8.75rem)]">
              I build
              <br />
              systems that
              <br />
              <span className="inline-block bg-blue px-[0.1em] text-paper">ship</span>.
            </h1>
            <p className="label mt-8 max-w-md text-ink/80">
              Software engineer · Python / Django · end-to-end systems
            </p>
          </div>
        </div>

        {/* SVG fallback while the canvas loads / without WebGL */}
        <div
          className={`pointer-events-none absolute inset-0 z-[5] flex items-center justify-center transition-opacity duration-500 md:left-auto md:w-[40%] ${
            ready && webgl ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={webgl ? true : undefined}
        >
          <Logo
            className="mt-64 h-[30vh] w-auto text-ink md:mt-0 md:h-[70vh]"
            title={webgl === false ? "Logo: the Persian letter Mim" : undefined}
          />
        </div>

        {/* 3D scene */}
        <div
          ref={canvasWrap}
          className="absolute inset-0 z-[6]"
          role="img"
          aria-label="Animated logo built from cubes that turns into a network of nodes"
        >
          {webgl && (
            <div className="h-full w-full">
              <HeroCanvas state={state} frameloop={frameloop} animated={!reduced} />
            </div>
          )}
        </div>

        <div
          ref={hint}
          className="label absolute bottom-6 left-4 z-10 text-ink/60 sm:left-8"
        >
          Scroll ↓
        </div>
      </div>
    </div>
  );
}
