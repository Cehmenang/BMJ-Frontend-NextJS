"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import axiosClient from "@/config/axios";
import { getBrands } from "@/action/brand";

export type Brand = {
  id: string;
  name: string;
  image: string;
  slug: string;
};

const PER_PAGE = 36;

type SlideDir = "left" | "right" | null;

const ANIM = {
  outLeft:  "translate-x-[-40px] opacity-0",
  outRight: "translate-x-[40px] opacity-0",
  inLeft:   "-translate-x-[40px] opacity-0",
  inRight:  "translate-x-[40px] opacity-0",
  active:   "translate-x-0 opacity-100",
};

export default function BrandShowcase() {
  const [brands, setBrands] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [animClass, setAnimClass] = useState(ANIM.active);
  const [visibleBrands, setVisibleBrands] = useState<any[]>([]);
  const animating = useRef(false);

  // sorted selalu fresh dari brands
  const sorted = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    [brands]
  );

  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  // ref biar goTo selalu baca sorted terbaru tanpa stale closure
  const sortedRef = useRef<any[]>([]);
  useEffect(() => {
    sortedRef.current = sorted;
  }, [sorted]);

    const getPage = useCallback((p: number, data: any[]) => {
        return data.slice(p * PER_PAGE, (p + 1) * PER_PAGE);
    }, []);

  // setiap brands berubah (setelah fetch), tampilkan halaman pertama
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

  return (
    <section className="pb-20">
      {/* Header */}
      <div className="px-14 mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-third-light mb-2">
            Partner Resmi
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold text-third leading-[1.1]">
            Brand <em className="text-second not-italic">Pilihan</em>
          </h2>
        </div>
        <div className="side-brand flex flex-col items-end text-[13px] gap-y-2">

        <a href="/brand" className="text-third/40 border border-third/40 px-3 py-1 rounded-md hover:text-third/90 hover:border-third/90 transition">Semua Brand</a>
        <span className="text-third/40">
          Halaman {page + 1} dari {totalPages || 1} · {brands.length} brand
        </span>

        </div>
      </div>

      {/* Grid + arrows */}
<div className="relative overflow-hidden">
  <button
    onClick={prev}
    disabled={page === 0 || brands.length === 0}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-third/15 text-third flex items-center justify-center transition-colors duration-150 hover:bg-bg-site disabled:opacity-25 disabled:cursor-default"
  >
    <ChevronLeft className="w-4 h-4" />
  </button>

  <div className="px-14 overflow-hidden">
    {/* Skeleton */}
    {brands.length === 0 ? (
      <div className="grid grid-cols-12 gap-3">
        {[...Array(36)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl border border-third/8 flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full bg-gradient-to-br from-third/6 to-third/10 animate-pulse" />
          </div>
        ))}
      </div>
    ) : (
      <div
        className={`grid grid-cols-12 gap-3 transition-all duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${animClass}`}
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
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-third/15 text-third flex items-center justify-center transition-colors duration-150 hover:bg-bg-site disabled:opacity-25 disabled:cursor-default"
  >
    <ChevronRight className="w-4 h-4" />
  </button>
</div>

{/* Dots — skeleton juga */}
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

    </section>
  );
}

function BrandCard({ brand }: { brand: {name: string, image: string, description: string}}) {
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
        className="w-full h-12 object-contain grayscale opacity-55 transition-all duration-220 group-hover:grayscale-0 group-hover:opacity-100"
        loading="lazy"
        // placeholder="blur"
      />
    </a>
  );
}