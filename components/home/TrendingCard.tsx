"use client";

import { IProduct } from "@/interface";
import Image from "next/image";
import { useState } from "react";

interface TrendingCardProps {
  product: IProduct;
  variant?: "normal" | "highlight";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function TrendingCard({
  product,
  variant = "normal",
}: TrendingCardProps) {
  const [qty, setQty] = useState(1);

  const name = product.name ?? "Nama Produk";
  const description =
    product.description ??
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
  const price = product.offlinePrice ? parseInt(product.offlinePrice) : 0;
  const image = product.images?.[0]?.[0] ?? "/placeholder-product.png";

  const isHighlight = variant === "highlight";

  const handleAddToCart = () => {
    console.log("add to cart", { id: product.id, qty });
  };

  return (
    <div
      className={[
        "mx-auto flex w-full max-w-[320px] flex-col items-center rounded-3xl px-3 pb-5 pt-6 transition-transform duration-300 xl:px-4",
        isHighlight ? "z-10 bg-second lg:scale-[1.04]" : "bg-white",
      ].join(" ")}
    >
      <div className="relative mb-4 aspect-square w-full max-w-[220px]">
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${image}`}
          alt={name}
          fill
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 200px, 220px"
          className="object-contain drop-shadow-md"
        />
      </div>

      <h3
        className={[
          "line-clamp-2 text-center font-display text-base font-bold lg:text-sm xl:text-base",
          isHighlight ? "text-primary" : "text-third",
        ].join(" ")}
      >
        {name}
      </h3>

      <p
        className={[
          "mt-2 line-clamp-2 text-center text-xs leading-relaxed",
          isHighlight ? "text-primary/80" : "text-third/60",
        ].join(" ")}
      >
        {description}
      </p>

      <p
        className={[
          "mt-3 text-lg font-bold lg:text-base xl:text-xl",
          isHighlight ? "text-primary" : "text-third",
        ].join(" ")}
      >
        {formatPrice(price)}
      </p>

      {/* Selalu ditumpuk vertikal supaya muat di kartu sempit */}
      <div className="mt-4 flex w-full flex-col items-center gap-2">
        <button
          onClick={handleAddToCart}
          className="w-full whitespace-nowrap rounded-full bg-third px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition-transform hover:brightness-105 active:scale-95"
        >
          Tambah Keranjang
        </button>
      </div>
    </div>
  );
}