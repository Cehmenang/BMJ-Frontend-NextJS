"use server";

import TrendingCarousel from "./TrendingCarousel";

async function getTrending() {
  const res = await fetch(`${process.env.SERVER_API}/api/produk/trending`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const result = await res.json();
  return result.data;
}

export default async function TrendingProducts() {
  const products = await getTrending();
  if (!products || products.length === 0) return null;

  return (
    <section className="px-4 md:px-14 py-10 pt-20 bg-bg-site overflow-hidden">
      <h2 className="font-display text-[36px] text-third mb-6">
        <span className="text-second">Trending</span> Minggu Ini
      </h2>
      <TrendingCarousel products={products} />
    </section>
  );
}