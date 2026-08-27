"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { getLatestProducts } from "@/action/product";
import ProductCard from "../product/ProductCard";

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

export default function LatestProducts() {
  const [products, setProducts] = useState<any>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    (async function () {
      const produk = await getLatestProducts();
      setProducts(produk);
    })();
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // Cek posisi scroll biar arrow bisa di-disable di ujung awal/akhir.
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

  // Geser satu card (+gap) tiap klik arrow — smooth scroll, bukan fade.
  const handleSlide = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    const card = firstCardRef.current;
    if (!container) return;

    const gap = 20; // sinkron sama gap-x di container (gap-5 = 20px)
    const step = (card?.offsetWidth ?? container.clientWidth * 0.8) + gap;

    container.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  // Section fade + slide-up pas masuk viewport, ilang lagi pas di-scroll lewat.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
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

  return (
    <section ref={sectionRef} className="py-10 sm:py-16 md:mx-28">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-third-light mb-2">
            Baru Masuk
          </p>
          <h2 className="font-display text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-[1.1]">
            Produk <em className="text-second not-italic">Terbaru</em>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/produk"
            className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-third/60 hover:text-third transition-colors duration-200"
          >
            Lihat semua
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          {/* Arrow nav */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleSlide("prev")}
              disabled={atStart}
              aria-label="Produk sebelumnya"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-third/5 text-third transition-opacity disabled:opacity-30 hover:bg-third/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSlide("next")}
              disabled={atEnd}
              aria-label="Produk selanjutnya"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-third/5 text-third transition-opacity disabled:opacity-30 hover:bg-third/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll container — arrow-driven, drag dimatikan */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 select-none scroll-smooth"
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
        {/* End spacer */}
        <div className="flex-shrink-0 w-4 sm:w-8" />
      </div>
    </section>
  );
}