"use client";

import { IProduct } from "@/interface";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: IProduct;
  variant?: "normal" | "highlight";
}

export default function TrendingCard({
  product,
  variant = "normal",
}: ProductCardProps) {
  const [qty, setQty] = useState(1);

  const name = product.name ?? product.name ?? "Nama Produk";
  const description =
    product.description ??
    product.description ??
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
  const price = product.offlinePrice ? parseInt(product.offlinePrice) : 0;
  const image = product.images ? product.images[0][0] : "/placeholder-product.png" as string

  const isHighlight = variant === "highlight";

  const handleAddToCart = () => {
    // TODO: sambungkan ke cart context / API kamu
    console.log("add to cart", { id: product.id, qty });
  };

  return (
    <div
      className={[
        "flex flex-col items-center rounded-3xl px-5 pb-6 pt-8 transition-transform duration-300",
        isHighlight
          ? "bg-second shadow-[0_20px_45px_-15px_rgba(62,63,32,0.45)] scale-[1.06] z-10"
          : "bg-transparent",
      ].join(" ")}
    >
      {/* Gambar produk */}
      <div className="relative mb-6 h-[160px] w-[90px] sm:h-[190px] sm:w-[105px]">
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${image}`}
          alt={name}
          fill
          sizes="120px"
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Nama */}
      <h3
        className={[
          "text-center font-display text-lg sm:text-xl font-bold",
          isHighlight ? "text-primary" : "text-third",
        ].join(" ")}
      >
        {name}
      </h3>

      {/* Deskripsi */}
      <p
        className={[
          "mt-2 line-clamp-2 text-center text-xs sm:text-sm leading-relaxed",
          isHighlight ? "text-primary/80" : "text-third/60",
        ].join(" ")}
      >
        {description}
      </p>

      {/* Harga */}
      <p
        className={[
          "mt-4 text-xl sm:text-2xl font-bold",
          isHighlight ? "text-primary" : "text-third",
        ].join(" ")}
      >
        $ {price.toFixed(2)}
      </p>

      {/* Qty + Add to cart */}
      <div className="mt-5 flex w-full items-center justify-between gap-2">
        <div
          className={[
            "flex items-center gap-3 rounded-full px-3 py-1.5 text-sm font-semibold",
            isHighlight
              ? "bg-primary/15 text-primary"
              : "bg-third/5 text-third",
          ].join(" ")}
        >
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Kurangi jumlah"
            className="h-4 w-4 leading-none"
          >
            −
          </button>
          <span className="w-3 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Tambah jumlah"
            className="h-4 w-4 leading-none"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-second transition-transform active:scale-95 hover:brightness-105"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}