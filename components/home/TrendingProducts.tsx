"use server"

import ProductCard from "../product/ProductCard";

async function getTrending() {
  const res = await fetch(`${process.env.SERVER_API}/api/produk/trending`, { 
    cache: 'no-store' // Biar datanya selalu fresh di-update server
  });
  if (!res.ok) return [];
  const result = await res.json();
  return result.data;
}

export default async function TrendingProducts() {
  const products = await getTrending();

  if (products.length === 0) return null;

  return (
    <section className="px-4 md:px-14 py-10 bg-bg-site">
      <h2 className="font-display text-2xl font-black text-third mb-6">
        🔥 PALING BANYAK DICARI MINGGU INI
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}