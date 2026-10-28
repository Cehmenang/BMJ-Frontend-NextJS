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
const MOBILE_COUNT = 20;

type SlideDir = "left" | "right" | null;

const ANIM = {
  outLeft: "translate-x-[-40px] opacity-0",
  outRight: "translate-x-[40px] opacity-0",
  inLeft: "-translate-x-[40px] opacity-0",
  inRight: "translate-x-[40px] opacity-0",
  active: "translate-x-0 opacity-100",
};

function MarqueeRow({
  brands,
  direction = "left",
  speed = 35,
}: {
  brands: any[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const items = [...brands, ...brands, ...brands];

  return (
    <div className="w-full overflow-hidden py-1">
      <div
        className={`flex w-max ${
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
            className="group relative mr-2 flex h-[72px] w-[96px] flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm bg-white px-2 py-1.5 ring-1 ring-third/10 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-third/10"
          >
            <Image
              width={140}
              height={100}
              sizes="96px"
              src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
              alt={brand.name}
              className="h-full w-full object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              loading="lazy"
            />
            <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-second transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        ))}
      </div>
    </div>
  );
}

function BrandCard({ brand }: { brand: { name: string; image: string } }) {
  return (
    <a
      href={`/brand/${brand.name}`}
      className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md bg-white p-2 ring-1 ring-third/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-third/10"
    >
      <Image
        width={300}
        height={300}
        sizes="(max-width: 1024px) 16vw, 10vw"
        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
        alt={brand.name}
        className="h-full w-full object-contain p-2 opacity-60 grayscale transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
        loading="lazy"
      />
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-second transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  );
}

export default function BrandShowcase() {
  const [brands, setBrands] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [animClass, setAnimClass] = useState(ANIM.active);
  const [visibleBrands, setVisibleBrands] = useState<any[]>([]);
  const animating = useRef(false);

  const sorted = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    [brands]
  );

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const sortedRef = useRef<any[]>([]);
  useEffect(() => {
    sortedRef.current = sorted;
  }, [sorted]);

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
            setTimeout(() => {
              animating.current = false;
            }, 420);
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

  const mobileRow1 = sorted.slice(0, MOBILE_COUNT / 2);
  const mobileRow2 = sorted.slice(MOBILE_COUNT / 2, MOBILE_COUNT);

  return (
    <section className="px-4 pb-16 sm:px-8 sm:pb-20 md:px-14">
      <div className="mb-6 flex items-end justify-between gap-4 px-0 sm:mb-8 sm:px-14">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-third-light">
            Partner Resmi
          </p>
          <h2 className="font-display text-[clamp(22px,3.5vw,42px)] font-bold leading-[1.1] text-third">
            Brand <em className="not-italic text-second">Pilihan</em>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-y-2">
          <a
            href="/brand"
            className="rounded-sm bg-third px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-second hover:text-third active:scale-[0.98] sm:text-xs"
          >
            Semua Brand
          </a>
          <span className="hidden text-[13px] text-third/50 sm:block">
            Halaman {page + 1} dari {totalPages || 1} · {brands.length} brand
          </span>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 sm:hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {brands.length === 0 ? (
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="mr-2 h-[72px] w-[96px] flex-shrink-0 animate-pulse rounded-sm bg-third/10"
              />
            ))}
          </div>
        ) : (
          <>
            <MarqueeRow brands={mobileRow1} direction="left" speed={30} />
            <MarqueeRow brands={mobileRow2} direction="right" speed={30} />
          </>
        )}
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <a
          href="/brand"
          className="flex items-center justify-center rounded-sm bg-third px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-second hover:text-third active:scale-[0.98]"
        >
          Lihat semua {brands.length} brand →
        </a>
      </div>

      <div className="hidden sm:block">
        <div className="relative overflow-hidden">
          <button
            onClick={prev}
            disabled={page === 0 || brands.length === 0}
            aria-label="Halaman sebelumnya"
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm bg-white text-third shadow-md ring-1 ring-third/10 transition-all duration-150 hover:bg-third hover:text-white disabled:cursor-default disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-third"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="overflow-hidden px-14 py-2">
            {brands.length === 0 ? (
              <div className="grid grid-cols-6 gap-2 sm:gap-3 lg:grid-cols-8">
                {[...Array(PER_PAGE)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse overflow-hidden rounded-md bg-third/10"
                  />
                ))}
              </div>
            ) : (
              <div
                className={`grid grid-cols-6 gap-2 transition-all duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] sm:gap-3 lg:grid-cols-8 ${animClass}`}
              >
                {visibleBrands.map((brand, i: number) => (
                  <BrandCard key={`${page}-${i}`} brand={brand} />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={next}
            disabled={page === totalPages - 1 || brands.length === 0}
            aria-label="Halaman selanjutnya"
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm bg-white text-third shadow-md ring-1 ring-third/10 transition-all duration-150 hover:bg-third hover:text-white disabled:cursor-default disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-third"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {brands.length === 0
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] animate-pulse rounded-sm bg-third/10 ${i === 0 ? "w-9" : "w-6"}`}
                />
              ))
            : Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > page ? "left" : "right")}
                  aria-label={`Ke halaman ${i + 1}`}
                  className={`h-[3px] rounded-sm border-none transition-all duration-300 ${
                    i === page ? "w-9 bg-second" : "w-6 bg-third/20"
                  }`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}