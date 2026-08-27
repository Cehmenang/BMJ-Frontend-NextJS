"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IProduct } from "@/interface";
import TrendingCard from "./TrendingCard";

interface TrendingCarouselProps {
  products: IProduct[];
}

const VISIBLE_COUNT = 3;

export default function TrendingCarousel({ products }: TrendingCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const canSlide = products.length > VISIBLE_COUNT;
  const maxStartIndex = Math.max(0, products.length - VISIBLE_COUNT);

  const visibleProducts = products.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  // Klik arrow: langsung ganti, TANPA animasi fade/slide.
  const handlePrev = () => setStartIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setStartIndex((i) => Math.min(maxStartIndex, i + 1));

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
          disabled={startIndex === 0}
          aria-label="Produk sebelumnya"
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-2 sm:-translate-x-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-third shadow-md transition-opacity disabled:opacity-30 hover:brightness-95"
        >
          <ArrowIcon direction="left" />
        </button>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 items-center px-2 sm:px-4">
        {visibleProducts.map((product, i) => (
          <TrendingCard
            key={product.id}
            product={product}
            variant={i === 1 && visibleProducts.length === 3 ? "highlight" : "normal"}
          />
        ))}
      </div>

      {canSlide && (
        <button
          onClick={handleNext}
          disabled={startIndex >= maxStartIndex}
          aria-label="Produk selanjutnya"
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-2 sm:translate-x-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-third shadow-md transition-opacity disabled:opacity-30 hover:brightness-95"
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
      style={{ transform: direction === "right" ? "rotate(180deg)" : undefined }}
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