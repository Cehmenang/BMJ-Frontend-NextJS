"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    tag: "LIMITED STOCK",
    title: "Schecter",
    titleEm: "Synyster Gates",
    sub: "Sustain tanpa batas dengan Pickup Sustainiac®️ dan Floyd Rose 1500. Senjata utama untuk shredding maksimal.",
    cta: "Belanja Sekarang",
    href: "/brand/schecter",
    bg: "/BannerSchecter.webp",
    glow: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(249,173,82,0.18) 0%, transparent 70%)",
  },
  {
    id: 2,
    tag: "Pendatang Baru",
    title: "Donner",
    titleEm: "Music",
    sub: "Koleksi dari Donner Music Sudah Bisa Kalian Dapatkan di Bandar Musik Jakarta",
    cta: "Lihat Koleksi",
    href: "/brand/donner",
    bg: "/DonnerBanner.webp",
    glow: "radial-gradient(ellipse 70% 70% at 30% 50%, rgba(249,173,82,0.12) 0%, transparent 70%)",
  },
  {
    id: 3,
    tag: "Metal Era",
    title: "Gitar",
    titleEm: "Solar",
    sub: "Selera Metal Ya Pakai Gitar Solar. Dapatkan Segera!",
    cta: "Lihat Koleksi",
    href: "/brand/solar",
    bg: "/SolarBanner.webp",
    glow: "radial-gradient(ellipse 90% 60% at 60% 40%, rgba(249,173,82,0.2) 0%, transparent 65%)",
  },
  {
    id: 4,
    tag: "All In One Setup",
    title: "Lava",
    titleEm: "Studio",
    sub: "Setup Cepat Tinggal Plug and Play Pake Lava Studio. Setup Masa Depan Anti Ribet.",
    cta: "Beli Sekarang",
    href: "/produk/lava-studio-digital-modelling-guitar-amplifier",
    bg: "/LavaBanner.webp",
  },
  {
    id: 5,
    tag: "Kolaborasi Hebat",
    title: "Sire",
    titleEm: "Marcus Miller",
    sub: "Dapatkan Bass Sire dengan kolaborasi Legenda Bassist Marcus Miller",
    cta: "Beli Sekarang",
    href: "/brand/sire",
    bg: "/SireBanner.webp",
  },
];

const DURATION = 5000;

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const progressRef  = useRef<HTMLDivElement>(null);
  const gsapRef      = useRef<any>(null);
  const currentRef   = useRef(0);
  const animatingRef = useRef(false);
  const contentRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const slideRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const getEls = (idx: number) => {
    const el = contentRefs.current[idx];
    if (!el) return null;
    return {
      tag:   el.querySelector<HTMLElement>("[data-tag]"),
      title: el.querySelector<HTMLElement>("[data-title]"),
      sub:   el.querySelector<HTMLElement>("[data-sub]"),
      cta:   el.querySelector<HTMLElement>("[data-cta]"),
      bg:    slideRefs.current[idx]?.querySelector<HTMLElement>("[data-bg]"),
      wrap:  slideRefs.current[idx],
    };
  };

  const startProgress = useCallback((onComplete: () => void) => {
    const gsap = gsapRef.current;
    if (!gsap || !progressRef.current) return;
    gsap.killTweensOf(progressRef.current);
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      { width: "100%", duration: DURATION / 1000, ease: "none", onComplete }
    );
  }, []);

  const goTo = useCallback((idx: number) => {
    const gsap = gsapRef.current;
    if (!gsap || animatingRef.current || idx === currentRef.current) return;

    animatingRef.current = true;
    const prev = currentRef.current;
    currentRef.current = idx;
    setCurrent(idx);

    const from = getEls(prev);
    const to   = getEls(idx);
    if (!from || !to) { animatingRef.current = false; return; }

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        if (from.wrap) from.wrap.style.zIndex = "0";
        if (to.wrap)   to.wrap.style.zIndex   = "10";
      },
    });

    tl.to(
      [from.tag, from.title, from.sub, from.cta],
      { opacity: 0, y: -10, duration: 0.28, ease: "power2.in", stagger: 0.03 },
      0
    );
    tl.to(from.wrap, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, 0.1);

    if (to.wrap) to.wrap.style.zIndex = "9";
    tl.fromTo(to.wrap, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, 0.1);

    if (to.bg) {
      gsap.killTweensOf(to.bg);
      gsap.fromTo(to.bg, { scale: 1.07 }, { scale: 1, duration: 6, ease: "power1.out" });
    }

    tl.fromTo(to.tag,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }, 0.22);
    tl.fromTo(to.title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.52, ease: "power2.out" }, 0.32);
    tl.fromTo(to.sub,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }, 0.43);
    tl.fromTo(to.cta,   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" }, 0.52);

    startProgress(() => goTo((currentRef.current + 1) % SLIDES.length));
  }, [startProgress]);

  useEffect(() => {
    import("gsap").then((mod) => {
      const gsap = mod.gsap ?? mod.default;
      gsapRef.current = gsap;

      const first = getEls(0);
      if (first) {
        if (first.bg) gsap.fromTo(first.bg, { scale: 1.07 }, { scale: 1, duration: 6, ease: "power1.out" });
        gsap.fromTo(first.tag,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out", delay: 0.2  });
        gsap.fromTo(first.title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6,  ease: "power2.out", delay: 0.35 });
        gsap.fromTo(first.sub,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out", delay: 0.5  });
        gsap.fromTo(first.cta,   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.65 });
      }

      startProgress(() => goTo(1));
    });
  }, [goTo, startProgress]);

  const next = () => goTo((currentRef.current + 1) % SLIDES.length);
  const prev = () => goTo((currentRef.current - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full h-[60vw] min-h-[420px] max-h-screen overflow-hidden">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="absolute top-0 left-0 h-0.5 bg-second z-20 opacity-70"
        style={{ width: "0%" }}
      />

      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          data-slide
          ref={(el) => { slideRefs.current[i] = el; }}
          className="absolute inset-0 flex items-center"
          style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 0 }}
        >
          {/* BG */}
          <div
            data-bg
            className="absolute inset-0"
            style={{ backgroundImage: slide.glow }}
          >
            {slide.bg && (
              <img
                src={slide.bg}
                loading="eager"
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0" />

          {/* Content */}
          <div
            ref={(el) => { contentRefs.current[i] = el; }}
            className="
              relative z-10 w-full max-w-3xl
              px-5 sm:px-10 md:px-16 lg:px-[220px]
              pt-6 sm:pt-8
            "
          >
            {/* Tag */}
            <div
              data-tag
              className="
                inline-block font-semibold tracking-[0.18em] uppercase
                text-second border border-second/40 rounded-full
                bg-second/8 mb-3 sm:mb-5
                text-[11px] sm:text-[13px] md:text-[15px]
                px-2.5 py-1 sm:px-3.5 sm:py-1.5
              "
              style={{ opacity: 0 }}
            >
              {slide.tag}
            </div>

            {/* Title */}
            <h1
              data-title
              className="
                font-poppins font-bold tracking-tighter text-primary
                text-[38px] sm:text-[56px] md:text-[72px] lg:text-[90px]
                leading-none sm:leading-tight
                mb-2 sm:mb-0
              "
              style={{ opacity: 0 }}
            >
              <span>{slide.title}</span>
              <br />
              <em className="text-second italic font-play">{slide.titleEm}</em>
            </h1>

            {/* Subtitle */}
            <p
              data-sub
              className="
                font-light text-primary/72 leading-[1.65]
                max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl
                mt-3 sm:mt-5 mb-5 sm:mb-8
                text-[13px] sm:text-[15px] md:text-[17px] lg:text-[20px]
              "
              style={{ opacity: 0 }}
            >
              {slide.sub}
            </p>

            {/* CTA */}
            <a
              data-cta
              href={slide.href}
              className="
                inline-flex items-center gap-2 font-bold text-third bg-second
                rounded-lg transition-all duration-200
                hover:bg-[#fbbe74] hover:-translate-y-0.5
                hover:shadow-[0_8px_28px_rgba(249,173,82,0.45)]
                text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]
                px-4 py-1.5 sm:px-5 sm:py-2 lg:px-6
              "
              style={{ opacity: 0 }}
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 sm:bottom-9 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-[3px] rounded-sm transition-all duration-300 ${
              i === current
                ? "w-7 sm:w-11 bg-second"
                : "w-5 sm:w-7 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-3 sm:px-6 z-20 pointer-events-none">
        {[
          { fn: prev, Icon: ChevronLeft },
          { fn: next, Icon: ChevronRight },
        ].map(({ fn, Icon }, i) => (
          <button
            key={i}
            onClick={fn}
            className="
              rounded-full bg-white/10 border border-white/20 text-white
              flex items-center justify-center pointer-events-auto
              transition-colors duration-200
              hover:bg-second/25 hover:border-second/50
              w-8 h-8 sm:w-11 sm:h-11
            "
          >
            <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        ))}
      </div>
    </section>
  );
}