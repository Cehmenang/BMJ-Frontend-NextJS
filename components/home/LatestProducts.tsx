"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Eye, ShoppingCart, InfoIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function ProductCard({ product }: { product: Product | any }) {
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({
    msg: "",
    show: false,
  });

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 2500);
  };

  return (
    <div className="flex flex-shrink-0 w-[260px] group flex-col gap-y-4">
      <div className="md:w-[100%] transition group relative overflow-hidden rounded-2xl border-1 border-slate-200 hover:border-slate-300 hover:bg-gray-200 transition">
        <img
          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`}
          className={`translate-y-0 opacity-100 ${product.images.length > 1 && "group-hover:translate-y-[280px] group-hover:opacity-0"} transition duration-700`}
        />
        <img
          src={
            product.images.length > 1
              ? `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[1]}`
              : `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`
          } loading="eager" 
          className={`translate-y-[-280px] opacity-0 ${product.images.length > 1 && "group-hover:translate-y-0 group-hover:opacity-100"} transition duration-700 absolute top-0`}
        />

        {/* Toast popup */}
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 whitespace-nowrap ${
            toast.show
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-amber-800/60 text-white text-[11px] font-medium px-2 py-1 rounded-full shadow-lg flex items-center gap-2 italic">
            <InfoIcon className="w-3.5 h-3.5 text-second flex-shrink-0" />
            {toast.msg}
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(
                `${window.location.origin}/produk/${product.url}`
              );
              showToast("Berhasil disalin!");
            }}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-third transition-colors duration-150 cursor-pointer"
            title="Salin tautan produk"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              // hubungkan ke cart handler kamu di sini
              showToast("Masuk dikeranjang!");
            }}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-second transition-colors duration-150 cursor-pointer"
            title="Tambah ke keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        {/* Category + stock */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-third/50 font-medium">
            {product.kategoriId}
          </span>
          <span
            className={`text-[10px] font-bold ${
              product.stock == 0 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {product.stock == 0 ? "On-Stock" : "Out-Stock"}
          </span>
        </div>

        {/* Name */}
        <p className="text-[14px] font-extrabold text-third leading-snug mb-3 line-clamp-2 min-h-[40px] font-inter">
          {product.name}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-[15px] text-red-500 leading-none">
            {formatPrice(product.offlinePrice)}
          </span>
          <Link
            href={`/product/${product.url}`}
            className="flex-shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-md border border-third/25 text-third hover:bg-third hover:text-primary hover:border-third transition-all duration-200"
          >
            Lihat
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LatestProducts() {
  const [products, setProducts] = useState<any>([]);

  async function getLatestProducts(setProducts: React.SetStateAction<any>) {
    const { data } = await axios.get("/api/products/latest");
    return setProducts(data);
  }

  useEffect(() => {
    getLatestProducts(setProducts);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
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
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-16">
      {/* Header */}
      <div className="px-14 mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-third-light mb-2">
            Baru Masuk
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold text-third leading-[1.1]">
            Produk <em className="text-second not-italic">Terbaru</em>
          </h2>
        </div>
        <Link
          href="/terbaru"
          className="flex items-center gap-2 text-[13px] font-medium text-third/60 hover:text-third transition-colors duration-200 mb-1"
        >
          Lihat semua
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-14 pb-4 cursor-grab select-none scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        {products.length > 0 &&
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        {/* End spacer */}
        <div className="flex-shrink-0 w-8" />
      </div>
    </section>
  );
}