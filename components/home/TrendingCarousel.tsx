"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IProduct } from "@/interface";
import TrendingCard from "./TrendingCard";

interface TrendingCarouselProps {
  products: IProduct[];
}

const DESKTOP_COUNT = 5;

function useVisibleCount() {
  const [count, setCount] = useState(DESKTOP_COUNT);

  useEffect(() => {
    const queries = [
      { mq: window.matchMedia("(min-width: 1024px)"), n: DESKTOP_COUNT },
      { mq: window.matchMedia("(min-width: 768px)"), n: 3 },
      { mq: window.matchMedia("(min-width: 480px)"), n: 2 },
    ];

    const update = () => {
      const hit = queries.find((q) => q.mq.matches);
      setCount(hit ? hit.n : 1);
    };

    update();
    queries.forEach((q) => q.mq.addEventListener("change", update));
    return () =>
      queries.forEach((q) => q.mq.removeEventListener("change", update));
  }, []);

  return count;
}

export default function TrendingCarousel({ products }: TrendingCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleCount = useVisibleCount();

  const canSlide = products.length > visibleCount;
  const maxStartIndex = Math.max(0, products.length - visibleCount);
  const safeStart = Math.min(startIndex, maxStartIndex);

  const visibleProducts = products.slice(safeStart, safeStart + visibleCount);
  const isDesktopLayout = visibleCount === DESKTOP_COUNT;

  // Klik arrow: langsung ganti, TANPA animasi fade/slide.
  const handlePrev = () => setStartIndex(Math.max(0, safeStart - 1));
  const handleNext = () =>
    setStartIndex(Math.min(maxStartIndex, safeStart + 1));

  // Animasi cuma jalan saat section ini masuk / keluar viewport pas discroll.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        } else {
          gsap.to(el, {
            opacity: 0,
            y: 24,
            duration: 0.4,
            ease: "power2.in",
          });
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {canSlide && (
        <button
          onClick={handlePrev}
          disabled={safeStart === 0}
          aria-label="Produk sebelumnya"
          className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-third shadow-md transition-opacity hover:brightness-95 disabled:opacity-30 sm:-translate-x-5"
        >
          <ArrowIcon direction="left" />
        </button>
      )}

      <div
        className="grid items-center gap-x-4 px-2 sm:px-4 xl:gap-x-6"
        style={{
          gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
        }}
      >
        {visibleProducts.map((product, i) => (
          <TrendingCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {canSlide && (
        <button
          onClick={handleNext}
          disabled={safeStart >= maxStartIndex}
          aria-label="Produk selanjutnya"
          className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full bg-primary text-third shadow-md transition-opacity hover:brightness-95 disabled:opacity-30 sm:translate-x-5"
        >
          <ArrowIcon direction="right" />
        </button>
      )}
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: direction === "right" ? "rotate(180deg)" : undefined,
      }}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}