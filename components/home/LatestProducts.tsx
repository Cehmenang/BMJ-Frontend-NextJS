"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getLatestProducts } from "@/action/product";
import ProductCard from "../product/ProductCard";

gsap.registerPlugin(ScrollToPlugin);

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
  images: [string[]];
};

const AUTO_DELAY = 3500;
const SLIDE_DURATION = 0.7; 
const GAP = 20;

export default function LatestProducts() {
  const [products, setProducts] = useState<any>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const lastInteractionRef = useRef(0);

  useEffect(() => {
    (async function () {
      const produk = await getLatestProducts();
      setProducts(produk);
    })();
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products]);

  const scrollToX = (x: number, duration = SLIDE_DURATION) => {
    const el = scrollRef.current;
    if (!el) return;
    gsap.to(el, {
      scrollTo: { x, autoKill: true },
      duration,
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  const getStep = () => {
    const container = scrollRef.current;
    const card = firstCardRef.current;
    if (!container) return 0;
    return (card?.offsetWidth ?? container.clientWidth * 0.8) + GAP;
  };

  const handleSlide = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    lastInteractionRef.current = Date.now();

    const max = container.scrollWidth - container.clientWidth;
    const target =
      container.scrollLeft + (direction === "next" ? getStep() : -getStep());

    scrollToX(Math.max(0, Math.min(target, max)));
  };

  useEffect(() => {
    if (products.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (hoveredRef.current || !visibleRef.current || document.hidden) return;
      if (Date.now() - lastInteractionRef.current < AUTO_DELAY) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return; 

      if (el.scrollLeft >= max - 4) {
        scrollToX(0, 1.1); // balik ke awal
      } else {
        scrollToX(Math.min(el.scrollLeft + getStep(), max));
      }
    }, AUTO_DELAY);

    return () => clearInterval(id);
  }, [products]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        } else {
          gsap.to(el, { opacity: 0, y: 24, duration: 0.4, ease: "power2.in" });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const arrowButtons = (
    <>
      <button
        onClick={() => handleSlide("prev")}
        disabled={atStart}
        aria-label="Produk sebelumnya"
        className="flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-full bg-third/5 text-third transition-opacity disabled:opacity-30 hover:bg-third/10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleSlide("next")}
        disabled={atEnd}
        aria-label="Produk selanjutnya"
        className="flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-full bg-third/5 text-third transition-opacity disabled:opacity-30 hover:bg-third/10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-16 bg-bg-site overflow-hidden px-4 sm:px-8 md:px-14"
    >
      <div className="mb-6 sm:mb-8 flex items-end justify-between">
        <div className="flex items-center gap-x-4 relative">
          <h2 className="text-md md:text-4xl font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-9">
            PRODUK <em className="text-second not-italic">TERBARU</em>
          </h2>
          <span className="px-3 absolute top-[-5px] right-[30px] md:static md:px-5 py-1 rotate-2 border-2 border-third bg-second text-third text-[8px] md:text-lg font-boldonse rounded-tr-2xl">
            HADIR SAAT INI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">{arrowButtons}</div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
        onFocusCapture={() => (hoveredRef.current = true)}
        onBlurCapture={() => (hoveredRef.current = false)}
        onTouchStart={() => (lastInteractionRef.current = Date.now())}
        onTouchEnd={() => (lastInteractionRef.current = Date.now())}
        onWheel={() => (lastInteractionRef.current = Date.now())}
        className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 select-none [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {products.length > 0 &&
          products.map((product: any, i: number) => (
            <div
              key={product.id}
              ref={i === 0 ? firstCardRef : undefined}
              className="flex-shrink-0 [&>a]:!w-[220px] sm:[&>a]:!w-[240px] md:[&>a]:!w-[260px] lg:[&>a]:!w-[280px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        <div className="flex-shrink-0 w-4 sm:w-8" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
        {arrowButtons}
      </div>
    </section>
  );
}