"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
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

  useEffect(() => {
    (async function () {
      const produk = await getLatestProducts();
      setProducts(produk);
    })();
  }, []);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const isDragging   = useRef(false);
  const startX       = useRef(0);
  const scrollLeft   = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current  = true;
    startX.current      = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current  = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x    = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-10 sm:py-16 mx-28">

      {/* Header */}
      <div className="px-4 sm:px-8 md:px-14 mb-6 sm:mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-third-light mb-2">
            Baru Masuk
          </p>
          <h2 className="font-display text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-[1.1]">
            Produk <em className="text-second not-italic">Terbaru</em>
          </h2>
        </div>
        <Link
          href="/produk"
          className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-third/60 hover:text-third transition-colors duration-200 mb-1"
        >
          Lihat semua
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex gap-3 sm:gap-5 overflow-x-auto px-4 sm:px-8 md:px-14 pb-4 cursor-grab select-none scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        {products.length > 0 &&
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        {/* End spacer */}
        <div className="flex-shrink-0 w-4 sm:w-8" />
      </div>
    </section>
  );
}