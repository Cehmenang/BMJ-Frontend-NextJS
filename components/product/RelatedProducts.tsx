"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProduct } from "@/interface";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function parsePrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return null;
  const str = String(value).trim();
  const num = parseInt(str.includes(" ") ? str.split(" ")[0].trim() : str);
  return isNaN(num) ? null : num;
}

function getImage(product: any): string | null {
  const first = product?.images?.[0];
  if (Array.isArray(first)) return first[0] ?? null;
  return first ?? null;
}

export default function RelatedProducts({ related }: { related: IProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
  }, [related]);

  const slide = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({
      left: dir === "next" ? el.clientWidth + gap : -(el.clientWidth + gap),
      behavior: "smooth",
    });
  };

  if (!related || related.length === 0) return null;

  const arrowClass =
    "flex h-9 w-9 items-center justify-center rounded-sm bg-white text-third shadow-sm ring-1 ring-third/10 transition-all duration-150 hover:bg-third hover:text-white disabled:cursor-default disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-third";

  return (
    <section className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-third/50">
            Rekomendasi
          </p>
          <h2 className="font-boldonse text-[clamp(18px,2.4vw,30px)] font-bold uppercase leading-[1.3] text-third">
            Lihat <em className="not-italic text-second">Produk Lain</em>
          </h2>
        </div>
        <Link
          href="/produk"
          className="flex-shrink-0 text-[12px] font-semibold text-third underline underline-offset-4 transition-colors hover:text-second md:text-[13px]"
        >
          Lihat Semua
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
      >
        {related.map((product: any, index: number) => {
          const img = getImage(product);
          const offline = parsePrice(product.offlinePrice);
          const pricelist = parsePrice(product.pricelist);
          const online = parsePrice(product.onlinePrice);
          const promo = parsePrice(product.promo);

          const basePrice = offline ?? online ?? pricelist;
          const mainPrice = promo ?? basePrice;
          const strikePrice = promo
            ? basePrice
            : offline && pricelist && pricelist > offline
            ? pricelist
            : null;
          const discount =
            mainPrice && strikePrice && strikePrice > mainPrice
              ? Math.round(((strikePrice - mainPrice) / strikePrice) * 100)
              : null;

          return (
            <Link
              key={`${product.id}-${index}`}
              href={`/produk/${product.url}`}
              className="group flex w-[calc((100%-12px)/2)] flex-shrink-0 snap-start flex-col md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)] xl:w-[calc((100%-80px)/5)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-50 ring-1 ring-third/5">
                {img ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${img}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] text-third/30">
                    No Image
                  </div>
                )}

                {discount && (
                  <span className="absolute left-2 top-2 z-10 rounded-sm border border-amber-600 bg-amber-100 px-1.5 py-[2px] text-[10px] font-bold leading-tight text-third shadow-sm">
                    -{discount}%
                  </span>
                )}

                {product.namaPromo && (
                  <span className="absolute right-2 top-2 z-10 max-w-[70%] truncate rounded-sm bg-amber-600 px-2 py-[2px] text-[10px] font-bold leading-tight text-white shadow-sm">
                    {product.namaPromo}
                  </span>
                )}

                <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-second transition-transform duration-300 group-hover:scale-x-100" />
              </div>

              <div className="flex flex-1 flex-col pt-3">
                <p className="mb-1 text-[11px] font-medium text-third/50">
                  {product.kategoriId}
                </p>
                <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-[13px] font-bold leading-snug text-third md:text-[14px]">
                  {product.name}
                </h3>

                <div className="mt-2 flex min-h-[2.75rem] flex-col gap-1">
                  {mainPrice && (
                    <span
                      className={`text-[15px] font-black leading-none md:text-[16px] ${
                        promo ? "text-amber-700" : "text-third"
                      }`}
                    >
                      {formatPrice(mainPrice)}
                    </span>
                  )}
                  {strikePrice && (
                    <span className="text-[11px] font-semibold leading-none text-red-500 line-through">
                      {formatPrice(strikePrice)}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-2 text-[11px] font-semibold ${
                    product.stock > 0 ? "text-third/60" : "text-red-500"
                  }`}
                >
                  {product.stock > 0 ? "Stok Tersedia" : "Stok Habis"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          onClick={() => slide("prev")}
          disabled={atStart}
          aria-label="Produk sebelumnya"
          className={arrowClass}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => slide("next")}
          disabled={atEnd}
          aria-label="Produk selanjutnya"
          className={arrowClass}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}