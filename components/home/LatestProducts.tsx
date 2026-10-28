"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
const PROMO_IMAGE = "/litejam.webp";
const PROMO_HREF = "/produk";
const PROMO_TITLE = "LAGI VIRAL";
const PROMO_DESC = "Smart Gitar Litejam, Dengan Fretboard Nyala-Nyala Untuk Belajar Chord dan Scale!";

export default function LatestProducts() {
  const [products, setProducts] = useState<any>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    if (!container) return 0;
    const gap = parseFloat(getComputedStyle(container).columnGap) || 0;
    return container.clientWidth + gap;
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
        scrollToX(0, 1.1);
      } else {
        scrollToX(Math.min(el.scrollLeft + getStep(), max));
      }
    }, AUTO_DELAY);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-x-4">
          <h2 className="font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-tight">
            PRODUK <em className="text-second not-italic">TERBARU</em>
          </h2>
          <span className="px-3 absolute top-[-30px] right-[20px] md:static md:px-5 py-1 rotate-2 border-2 border-third bg-second text-third text-[8px] md:text-lg font-boldonse rounded-tr-2xl">HADIR SAAT INI</span>  
        </div>

        <div className="hidden md:flex items-center gap-2">{arrowButtons}</div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <Link
          href={PROMO_HREF}
          className="group relative block w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:w-1/4 lg:flex-shrink-0 overflow-hidden rounded-tr-2xl border-2 border-third bg-second"
        >
          <Image
            src={PROMO_IMAGE}
            alt={PROMO_TITLE}
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 className="font-boldonse text-white text-lg sm:text-xl leading-snug">
              {PROMO_TITLE}
            </h3>
            <p className="mt-1 text-sm text-white/80">{PROMO_DESC}</p>
          </div>
        </Link>

        <div className="min-w-0 flex-1">
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
              products.map((product: any) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[calc((100%-12px)/2)] sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)] [&>a]:!w-full"
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
            {arrowButtons}
          </div>
        </div>
      </div>
    </section>
  );
}