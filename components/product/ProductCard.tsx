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

export default function ProductCard({
  product,
  listView = false,
}: {
  product: IProduct;
  listView?: boolean;
}) {
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({
    msg: "",
    show: false,
  });

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 2500);
  };

  const createDate = new Date(product.created_at);
  const nowadays = new Date();
  const weekDays = 7 * 24 * 60 * 60 * 1000;
  createDate.setHours(0, 0, 0, 0);
  nowadays.setHours(0, 0, 0, 0);
  const diff = nowadays.getTime() - createDate.getTime();
  const isNew = diff >= 0 && diff <= weekDays;

  const offlinePrice = product.offlinePrice
    ? parseInt(product.offlinePrice.includes(" ") ? product.offlinePrice.split(" ")[0].trim() : product.offlinePrice.trim())
    : null;

  const pricelist = product.pricelist
    ? parseInt(product.pricelist.includes(" ") ? product.pricelist.split(" ")[0].trim() : product.pricelist.trim())
    : null;

  const discount =
    offlinePrice && pricelist && pricelist > offlinePrice
      ? Math.round(((pricelist - offlinePrice) / pricelist) * 100)
      : null;

  // ── LIST VIEW ──────────────────────────────────────────────
  if (listView) {
    return (
      <Link
        href={`/produk/${product.url}`}
        className="group flex gap-4 p-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-gray-50 transition-all duration-200 relative"
      >
        {/* Image */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          {isNew && (
            <span className="absolute bg-red-600 text-white z-[15] top-2 left-2 text-[10px] font-bold px-2 py-[2px] rounded-sm">
              Baru
            </span>
          )}
          <Image
            width={200}
            height={200}
            alt={product.name}
            src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`}
            className={`w-full h-full object-cover translate-y-0 opacity-100 ${
              product.images.length > 1 && "group-hover:opacity-0"
            } transition duration-500`}
            loading="lazy"
          />
          {product.images.length > 1 && (
            <Image
              width={200}
              height={200}
              alt={product.name}
              src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[1]}`}
              className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500 absolute inset-0"
              loading="lazy"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            {/* Category + stock */}
            <div className="flex items-center justify-between mb-1">
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
            <p className="text-[13px] md:text-[15px] font-extrabold text-third leading-snug line-clamp-2 font-inter">
              {product.name.toUpperCase()}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mt-2 gap-2">
            <div className="flex flex-col gap-1">
              {offlinePrice && (
                <span className="font-bold text-[15px] md:text-[17px] text-red-500 leading-none">
                  {formatPrice(offlinePrice)}
                </span>
              )}
              {pricelist && (
                <div className="flex gap-1.5 items-center flex-wrap">
                  {discount && (
                    <span className="text-[11px] bg-amber-100 border border-amber-600 text-third px-2 py-[2px] rounded-sm font-bold">
                      -{discount}%
                    </span>
                  )}
                  <span className="font-semibold text-[10px] text-third/50 italic tracking-tighter leading-none">
                    Pricelist: {formatPrice(pricelist)}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons — always visible on list view */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/produk/${product.url}`
                  );
                  showToast("Berhasil disalin!");
                }}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-third transition-colors duration-150 cursor-pointer"
                title="Salin tautan produk"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Masuk dikeranjang!");
                }}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-second transition-colors duration-150 cursor-pointer"
                title="Tambah ke keranjang"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Promo */}
        {product.promo && <div className="product-promo">
          <h1>HAITAYO</h1>
            {/* <h1>{product.namaPromo}</h1> */}
            {/* <h1>{formatPrice(parseInt(product.promo))}</h1> */}
        </div>}

        {/* Toast */}
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 whitespace-nowrap ${
            toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-amber-800/60 text-white text-[11px] font-medium px-2 py-1 rounded-full shadow-lg flex items-center gap-2 italic">
            <InfoIcon className="w-3.5 h-3.5 text-second flex-shrink-0" />
            {toast.msg}
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW (original) ───────────────────────────────────
  return (
    <Link href={`/produk/${product.url}`} className="flex flex-shrink-0 w-auto md:w-[260px] group flex-col gap-y-4 relative">
      {isNew && (
        <span className="absolute bg-red-600 text-white z-[15] top-[10px] left-[10px] text-[11px] font-bold px-3 py-[2px] rounded-sm">
          Baru
        </span>
      )}
      <div className="md:w-[100%] transition group relative overflow-hidden rounded-2xl border-1 border-slate-200 hover:border-slate-300 hover:bg-gray-200 transition">
        <Image
          width={500}
          height={500}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`}
          className={`translate-y-0 opacity-100 ${product.images.length > 1 && "group-hover:translate-y-[280px] group-hover:opacity-0"} transition duration-700`}
          loading="lazy"
        />
        <Image
          width={500}
          height={500}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={
            product.images.length > 1
              ? `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[1]}`
              : `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`
          }
          loading="lazy"
          className={`translate-y-[-280px] opacity-0 ${product.images.length > 1 && "group-hover:translate-y-0 group-hover:opacity-100"} transition duration-700 absolute top-0`}
        />

        {/* Toast popup */}
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 whitespace-nowrap ${
            toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
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

        <p className="text-[14px] font-extrabold text-third leading-snug mb-3 line-clamp-2 min-h-[40px] font-inter">
          {product.name.toUpperCase()}
        </p>

        <div className="bott-card-product flex justify-between">
          <div className="flex flex-col gap-y-2">
            <span className="font-bold text-[15px] text-red-500 leading-none">
              {offlinePrice && formatPrice(offlinePrice)}
            </span>
            {pricelist && (
              <div className="font-semibold text-[10px] text-third/50 italic tracking-tighter leading-none flex gap-x-1 items-center">
                {discount && (
                  <span className="text-[11px] bg-amber-100 border border-amber-600 text-third px-2 py-[2px] rounded-sm font-bold">
                    -{discount}%
                  </span>
                )}
                <span>Pricelist: {formatPrice(pricelist)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}