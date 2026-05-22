"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getBrands } from "@/action/brand";

export type Brand = {
  id: string;
  name: string;
  image: string;
  slug: string;
};

const PER_PAGE = 24;
const MOBILE_COUNT = 20; // brand yang ditampilkan di marquee mobile

type SlideDir = "left" | "right" | null;

const ANIM = {
  outLeft:  "translate-x-[-40px] opacity-0",
  outRight: "translate-x-[40px] opacity-0",
  inLeft:   "-translate-x-[40px] opacity-0",
  inRight:  "translate-x-[40px] opacity-0",
  active:   "translate-x-0 opacity-100",
};

// ─── Marquee Row ──────────────────────────────────────────────────────────────
function MarqueeRow({
  brands,
  direction = "left",
  speed = 35,
}: {
  brands: any[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate list supaya loop seamless
  const items = [...brands, ...brands, ...brands];

  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex gap-3 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={
          {
            "--marquee-duration": `${speed}s`,
          } as React.CSSProperties
        }
      >
        {items.map((brand, i) => (
          <a
            key={`${brand.id ?? brand.name}-${i}`}
            href={`/brand/${brand.name}`}
            className="flex-shrink-0 w-[72px] h-[56px] rounded-xl border border-third/8 flex items-center justify-center px-2 py-1.5 cursor-pointer group transition-all duration-200 hover:border-third/20 hover:shadow-[0_4px_16px_rgba(62,63,32,0.08)] bg-white"
          >
            <Image
              width={120}
              height={80}
              sizes="72px"
              src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
              alt={brand.name}
              className="w-full h-full object-contain grayscale opacity-50 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop BrandCard ────────────────────────────────────────────────────────
function BrandCard({ brand }: { brand: { name: string; image: string; description: string } }) {
  return (
    <a
      href={`/brand/${brand.name}`}
      className="aspect-square rounded-xl border border-third/8 flex flex-col items-center justify-center gap-1 px-1 py-2 cursor-pointer group transition-all duration-200 hover:border-third/20 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(62,63,32,0.08)]"
    >
      <Image
        width={300}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
        alt={brand.name}
        className="w-full h-full p-2 object-contain grayscale opacity-55 transition-all duration-220 group-hover:grayscale-0 group-hover:opacity-100"
        loading="lazy"
      />
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BrandShowcase() {
  const [brands, setBrands]           = useState<any[]>([]);
  const [page, setPage]               = useState(0);
  const [animClass, setAnimClass]     = useState(ANIM.active);
  const [visibleBrands, setVisibleBrands] = useState<any[]>([]);
  const animating                     = useRef(false);

  const sorted = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    [brands]
  );

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const sortedRef  = useRef<any[]>([]);
  useEffect(() => { sortedRef.current = sorted; }, [sorted]);

  const getPage = useCallback((p: number, data: any[]) => {
    return data.slice(p * PER_PAGE, (p + 1) * PER_PAGE);
  }, []);

  useEffect(() => {
    if (brands.length === 0) return;
    const s = [...brands].sort((a, b) => a.name.localeCompare(b.name));
    setVisibleBrands(getPage(0, s));
    setPage(0);
  }, [brands]);

  const goTo = useCallback(
    (newPage: number, dir: SlideDir) => {
      if (animating.current || newPage === page || newPage < 0 || newPage >= totalPages) return;
      animating.current = true;
      setAnimClass(dir === "left" ? ANIM.outLeft : ANIM.outRight);
      setTimeout(() => {
        setAnimClass(dir === "left" ? ANIM.inLeft : ANIM.inRight);
        setVisibleBrands(getPage(newPage, sortedRef.current));
        setPage(newPage);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimClass(ANIM.active);
            setTimeout(() => { animating.current = false; }, 420);
          });
        });
      }, 280);
    },
    [page, totalPages, getPage]
  );

  const prev = () => goTo(page - 1, "right");
  const next = () => goTo(page + 1, "left");

  useEffect(() => {
    (async () => {
      const data = await getBrands();
      setBrands(data);
    })();
  }, []);

  // 20 brand untuk marquee mobile, split 10-10
  const mobileRow1 = sorted.slice(0, MOBILE_COUNT / 2);          // 10 brand, gerak kiri
  const mobileRow2 = sorted.slice(MOBILE_COUNT / 2, MOBILE_COUNT); // 10 brand, gerak kanan

  return (
    <section className="pb-16 sm:pb-20 mx-28">
      {/* Header */}
      <div className="px-4 sm:px-14 mb-6 sm:mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-third-light mb-2">
            Partner Resmi
          </p>
          <h2 className="font-display text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-[1.1]">
            Brand <em className="text-second not-italic">Pilihan</em>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-y-2">
          <a
            href="/brand"
            className="text-[12px] sm:text-[13px] text-third/40 border border-third/40 px-3 py-1 rounded-md hover:text-third/90 hover:border-third/90 transition"
          >
            Semua Brand
          </a>
          {/* Page info — desktop only */}
          <span className="hidden sm:block text-[13px] text-third/40">
            Halaman {page + 1} dari {totalPages || 1} · {brands.length} brand
          </span>
        </div>
      </div>

      {/* ── MOBILE: Marquee 2 baris ── */}
      <div
        className="flex sm:hidden flex-col gap-3"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {brands.length === 0 ? (
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[72px] h-[56px] rounded-xl bg-third/8 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <MarqueeRow brands={mobileRow1} direction="left"  speed={30} />
            <MarqueeRow brands={mobileRow2} direction="right" speed={30} />
          </>
        )}

        {/* CTA mobile */}
        <div className="flex justify-center mt-4">
          <a
            href="/brand"
            className="text-[13px] font-medium text-third/60 border border-third/30 px-5 py-2 rounded-full hover:text-third hover:border-third/70 transition"
          >
            Lihat semua {brands.length} brand →
          </a>
        </div>
      </div>

      {/* ── DESKTOP: Grid + Pagination ── */}
      <div className="hidden sm:block">
        <div className="relative overflow-hidden">
          <button
            onClick={prev}
            disabled={page === 0 || brands.length === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-third/15 text-third flex items-center justify-center transition-colors duration-150 hover:bg-bg-site disabled:opacity-25 disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-14 overflow-hidden">
            {brands.length === 0 ? (
              <div className="grid grid-cols-8 gap-2">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl border border-third/8 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-third/6 to-third/10 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid grid-cols-8 gap-2 transition-all duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${animClass}`}>
                {visibleBrands.map((brand, i: number) => (
                  <BrandCard key={`${page}-${i}`} brand={brand} />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={next}
            disabled={page === totalPages - 1 || brands.length === 0}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-third/15 text-third flex items-center justify-center transition-colors duration-150 hover:bg-bg-site disabled:opacity-25 disabled:cursor-default"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-16">
          {brands.length === 0 ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className={`h-[3px] rounded-sm bg-third/10 animate-pulse ${i === 0 ? "w-9" : "w-6"}`} />
            ))
          ) : (
            Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > page ? "left" : "right")}
                className={`h-[3px] rounded-sm transition-all duration-300 border-none ${
                  i === page ? "w-9 bg-second" : "w-6 bg-third/20"
                }`}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}