"use client";

import { IProduct } from "@/interface";
import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({
  related,
}: {
  related: IProduct[];
}) {
  if (related.length === 0) return null;

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-bold mb-4">Produk Terkait</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <Link
            key={product.id}
            href={`/produk/${product.url}`}
            className="group flex flex-col rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
              {product.images?.[0]?.[0] ? (
                <Image
                  src={product.images[0][0]}
                  alt={product.name}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No Image
                </div>
              )}

              {/* Badge promo */}
              {product.namaPromo && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {product.namaPromo}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 p-3">
              <p className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </p>

              {product.onlinePrice ? (
                <p className="text-sm font-bold mt-1">
                  {formatPrice(product.onlinePrice)}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">Hubungi Kami</p>
              )}

              {/* Stock */}
              <p
                className={`text-[11px] font-medium mt-0.5 ${
                  product.stock > 0 ? "text-green-500" : "text-red-400"
                }`}
              >
                {product.stock > 0 ? "Stok Tersedia" : "Stok Habis"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}