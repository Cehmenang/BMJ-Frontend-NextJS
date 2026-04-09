"use client"

import { IProduct } from "@/interface";
import { InfoIcon, Navigation, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product }: { product: IProduct }) {
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({
    msg: "",
    show: false,
  });

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 2500);
  };

  const createDate = new Date(product.created_at)
  const nowadays = new Date()
  const weekDays = 7 * 24 * 60 * 60 * 1000
  createDate.setHours(0,0,0,0)
  nowadays.setHours(0,0,0,0)

  const diff =  nowadays.getTime() - createDate.getTime()

  return (
    <div className="flex flex-shrink-0 w-[260px] group flex-col gap-y-4 relative">
      {diff >= 0 && diff <= weekDays && <span className="absolute h-[30px] w-[30px] bg-red-600 text-white z-40 top-[-8px] left-[-15px] text-[14px] font-bold">Baru</span>}
      <div className="md:w-[100%] transition group relative overflow-hidden rounded-2xl border-1 border-slate-200 hover:border-slate-300 hover:bg-gray-200 transition">
        <Image width={500} height={500} alt={product.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`}
          className={`translate-y-0 opacity-100 ${product.images.length > 1 && "group-hover:translate-y-[280px] group-hover:opacity-0"} transition duration-700`}
          loading="lazy"
          // placeholder="blur"
        />
        <Image width={500} height={500} alt={product.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={
            product.images.length > 1
              ? `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[1]}`
              : `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`
          } loading="lazy" 
          // placeholder="blur"
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
        <div className="bott-card-product flex justify-between">

        <div className="flex flex-col gap-y-1">
          <span className="font-bold text-[15px] text-red-500 leading-none">
            {product.offlinePrice && formatPrice(parseInt(product.offlinePrice.includes(" ") ? product.offlinePrice.split(' ')[0].trim() : product.offlinePrice.trim()))}
          </span>
          {product.pricelist && <span className="font-semibold text-[10px] text-third/50 italic tracking-tighter leading-none">
            Pricelist : { formatPrice(parseInt(product.pricelist.includes(" ") ? product.pricelist.split(' ')[0].trim() : product.pricelist.trim()))}
          </span>}
        </div>
          <Link
            href={`/produk/${product.url}`}
            className="flex-shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-md border border-third/25 text-third hover:bg-third hover:text-primary hover:border-third transition-all duration-200"
          >
            Lihat
          </Link>

        </div>
      </div>
    </div>
  );
}