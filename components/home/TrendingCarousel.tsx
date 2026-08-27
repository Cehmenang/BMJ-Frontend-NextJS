"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import ProductCard from "../product/ProductCard";
import TrendingCard from "./TrendingCard";
import { IProduct } from "@/interface";

interface TrendingCarouselProps {
  products: IProduct[];
}

const VISIBLE_COUNT = 3;

export default function TrendingCarousel({ products }: TrendingCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const canSlide = products.length > VISIBLE_COUNT;
  const maxStartIndex = Math.max(0, products.length - VISIBLE_COUNT);

  const visibleProducts = products.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  const animateSlide = (direction: "next" | "prev") => {
    if (isAnimating.current || !trackRef.current) return;
    isAnimating.current = true;

    const offset = direction === "next" ? -32 : 32;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(trackRef.current, {
      x: offset,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    }).set(trackRef.current, { x: -offset }).to(trackRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handlePrev = () => {
    if (startIndex === 0) return;
    animateSlide("prev");
    setStartIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    if (startIndex >= maxStartIndex) return;
    animateSlide("next");
    setStartIndex((i) => Math.min(maxStartIndex, i + 1));
  };

  return (
    <div className="relative">
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

      <div
        ref={trackRef}
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 items-center px-2 sm:px-4"
      >
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