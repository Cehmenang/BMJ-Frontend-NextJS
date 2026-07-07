"use server"

import ProductCard from "../product/ProductCard";

async function getTrending() {
  const res = await fetch(`${process.env.SERVER_API}/api/produk/trending`, { 
    cache: 'no-store' 
  });
  if (!res.ok) return [];
  const result = await res.json();
  return result.data;
}

export default async function TrendingProducts() {
  const products = await getTrending();
  if (products.length === 0) return null;

  return (
    <section className="px-4 md:px-14 py-10 pt-4 bg-bg-site">
      <h2 className="font-display text-[36px] font-black text-third mb-6">
        Paling Banyak Dicari
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
        {(products && products.length > 0) && products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}