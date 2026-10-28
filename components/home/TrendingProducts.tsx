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
        <div className="flex items-center gap-x-4">
          <h2 className="text-lg md:text-4xl font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold text-third leading-6">
            ALAT <em className="text-second not-italic">PALING DICARI</em>
          </h2>
          <span className="px-3 w-[200px] md:w-auto md:px-5 py-1 rotate-2 border-2 border-third bg-second text-third text-[8px] md:text-lg font-boldonse rounded-tr-2xl">MINGGU INI</span>
        </div>
      </div>

      <div>
        <TrendingCarousel products={products} />
      </div>
    </section>
  );
}