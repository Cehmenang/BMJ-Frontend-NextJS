"use server";

import { Eye } from "lucide-react";
import Link from "next/link";
import TrendingCarousel from "./TrendingCarousel";

async function getTrending() {
  const res = await fetch(`${process.env.SERVER_API}/api/produk/trending`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const result = await res.json();
  console.log(result.data, 'JOREK')
  return result.data;
}

export default async function TrendingProducts() {
  const products = await getTrending();
  if (!products || products.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 pt-20 bg-bg-site overflow-hidden px-4 sm:px-8 md:px-14">
      <div className="mb-6 sm:mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-third-light mb-2">
            Lagi panas nih
          </p>
          <h2 className="text-2xl md:text-4xl font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-[1.1] relative">
            ALAT <em className="text-second not-italic">PALING DICARI</em><span className="absolute right-[200px] bottom-2 px-5 py-2 border-2 border-third bg-second text-primary text-md md:text-lg outline-1 outline-third">MINGGU INI</span>
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

      <div>
        <TrendingCarousel products={products} />
      </div>
    </section>
  );
}