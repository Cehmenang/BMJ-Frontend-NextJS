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
  isAdmin
}: {
  product: IProduct;
  listView?: boolean;
  isAdmin?: boolean;
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

  const promoPrice = product.promo ? parseInt(product.promo) : null;
  const promoBasePrice = offlinePrice ?? pricelist;
  const promoDiscount =
    promoPrice && promoBasePrice && promoBasePrice > promoPrice
      ? Math.round(((promoBasePrice - promoPrice) / promoBasePrice) * 100)
      : null;

  const badgeValue = promoPrice ? promoDiscount : discount;

  const stockLabel = product.stock == 0 ? "On-Stock" : "Out-Stock";
  const stockColor = product.stock == 0 ? "text-red-500" : "text-third/60";

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(
      `${window.location.origin}/produk/${product.url}`
    );
    showToast("Berhasil disalin!");
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast("Masuk dikeranjang!");
  };

  const imageSrc = (index: number) =>
    `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[index]}`;

  const toastNode = (
    <div
      className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 whitespace-nowrap ${
        toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="bg-third/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-sm shadow-lg flex items-center gap-2 backdrop-blur-sm">
        <InfoIcon className="w-3.5 h-3.5 text-second flex-shrink-0" />
        {toast.msg}
      </div>
    </div>
  );

  const newBadge = isNew && (
    <img
      src="/BadgeBaru.webp"
      alt="Badge Baru"
      width={40}
      height={40}
      className="absolute top-2 left-2 z-20 h-10 w-10"
    />
  );

  const priceNode = (align: "center" | "left") => {
    const itemsAlign = align === "center" ? "items-center" : "items-start";

    if (promoPrice) {
      return (
        <div className={`flex flex-col gap-y-1.5 ${itemsAlign}`}>
          <span className="font-bold text-[15px] text-amber-700 leading-none">
            {formatPrice(promoPrice)}
          </span>
          {promoBasePrice && (
            <span className="text-[11px] text-red-500 line-through leading-none">
              {formatPrice(promoBasePrice)}
            </span>
          )}
          {product.namaPromo && (
            <span className="text-[10px] text-amber-700 font-semibold italic leading-none">
              {product.namaPromo}
            </span>
          )}
        </div>
      );
    }

    if (offlinePrice) {
      return (
        <div className={`flex flex-col gap-y-1.5 ${itemsAlign}`}>
          <span className="font-bold text-[15px] text-third leading-none">
            {formatPrice(offlinePrice)}
          </span>
          {pricelist && (
            <span className="text-[11px] text-red-500 line-through leading-none">
              {formatPrice(pricelist)}
            </span>
          )}
        </div>
      );
    }

    if (pricelist) {
      return (
        <div className={`flex flex-col gap-y-1.5 ${itemsAlign}`}>
          <span className="font-bold text-[15px] text-third leading-none">
            {formatPrice(pricelist)}
          </span>
        </div>
      );
    }

    return null;
  };

  if (listView) {
    return (
      <Link
        href={`/produk/${product.url}`}
        className="group relative flex overflow-hidden rounded-md bg-white ring-1 ring-third/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-third/10"
      >
        <div className="relative min-h-28 w-28 md:w-36 flex-shrink-0 self-stretch overflow-hidden bg-gray-50">
          {newBadge}
          {product.promo && (
            <span className="absolute top-2 right-2 z-20 bg-amber-600 text-white text-[9px] font-bold px-2 py-[3px] rounded-sm shadow-sm">
              PROMO
            </span>
          )}
          <Image
            fill
            sizes="144px"
            alt={product.name}
            src={imageSrc(0)}
            className={`object-cover transition-opacity duration-500 ${
              product.images.length > 1 ? "group-hover:opacity-0" : ""
            }`}
            loading="lazy"
          />
          {product.images.length > 1 && (
            <Image
              fill
              sizes="144px"
              alt={product.name}
              src={imageSrc(1)}
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col justify-between p-3">
          {badgeValue && (
            <span className="absolute right-2 top-2 z-20 whitespace-nowrap rounded-sm border border-amber-600 bg-amber-100 px-1.5 py-[1px] text-[10px] font-bold leading-tight text-third shadow-sm">
              -{badgeValue}%
            </span>
          )}

          <div>
            <h3 className="line-clamp-2 pr-12 text-left font-display text-base font-bold lg:text-sm xl:text-base text-third">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-left text-xs leading-relaxed text-third/60">
              {product.kategoriId} • <span className={`font-semibold ${stockColor}`}>{stockLabel}</span>
            </p>
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>{priceNode("left")}</div>

            <div className="flex flex-shrink-0 gap-2">
              <button
                onClick={copyLink}
                className="w-9 h-9 rounded-sm bg-third/5 flex items-center justify-center text-third/60 hover:bg-third/10 hover:text-third transition-colors duration-150 cursor-pointer"
                title="Salin tautan produk"
              >
                <Navigation className="w-4 h-4" />
              </button>
              <button
                onClick={addToCart}
                className="w-9 h-9 rounded-sm bg-third flex items-center justify-center text-white hover:bg-second hover:text-third transition-colors duration-150 cursor-pointer"
                title="Tambah ke keranjang"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {toastNode}
      </Link>
    );
  }

  return (
    <Link
      href={`/produk/${product.url}`}
      className="group relative flex flex-shrink-0 w-auto md:w-[200px] flex-col overflow-hidden bg-white ring-1 ring-third/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-third/10"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        {newBadge}

        {product.promo && (
          <span className="absolute top-2.5 right-2.5 z-20 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm shadow-md">
            {product.namaPromo ? product.namaPromo : "Promo"}
          </span>
        )}

        <Image
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          alt={product.name}
          src={imageSrc(0)}
          className={`object-cover transition-all duration-700 ${
            product.images.length > 1 ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />
        {product.images.length > 1 && (
          <Image
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            alt={product.name}
            src={imageSrc(1)}
            className="object-cover opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
            loading="lazy"
          />
        )}

        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={copyLink}
            className="w-9 h-9 rounded-sm bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-third transition-colors duration-150 cursor-pointer"
            title="Salin tautan produk"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={addToCart}
            className="w-9 h-9 rounded-sm bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-second transition-colors duration-150 cursor-pointer"
            title="Tambah ke keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {toastNode}
      </div>

      <div className="relative flex flex-1 flex-col px-3 pb-4 pt-5">
        {badgeValue && (
          <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-amber-600 bg-amber-100 px-2 py-[2px] text-[11px] font-bold leading-tight text-third shadow-md">
            -{badgeValue}%
          </span>
        )}

        <h3 className="line-clamp-2 min-h-[2.4rem] text-center font-display text-base font-bold leading-snug lg:text-sm xl:min-h-[2.75rem] xl:text-base text-third">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-center text-xs leading-relaxed text-third/60">
          {product.kategoriId} • <span className={`font-semibold ${stockColor}`}>{stockLabel}</span>
        </p>

        <div className="mt-3 flex flex-1 items-center justify-center">
          {priceNode("center")}
        </div>

        {isAdmin && (
          <p className="mt-2 text-center text-[11px] text-third/40">
            {new Date(product.created_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}