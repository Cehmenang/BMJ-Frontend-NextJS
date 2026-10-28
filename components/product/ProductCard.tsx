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
      <div className="bg-third/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-sm">
        <InfoIcon className="w-3.5 h-3.5 text-second flex-shrink-0" />
        {toast.msg}
      </div>
    </div>
  );

  const priceNode = (align: "center" | "left") => (
    <div
      className={`flex flex-col gap-1.5 ${
        align === "center" ? "items-center" : "items-start"
      }`}
    >
      {promoPrice ? (
        <>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="font-display text-base font-bold text-second leading-none">
              {formatPrice(promoPrice)}
            </span>
            {promoDiscount && (
              <span className="text-[10px] bg-second/15 text-second px-2 py-[3px] rounded-full font-bold leading-none">
                -{promoDiscount}%
              </span>
            )}
          </div>
          {promoBasePrice && (
            <span className="text-[11px] text-third/40 line-through leading-none">
              {formatPrice(promoBasePrice)}
            </span>
          )}
          {product.namaPromo && (
            <span className="text-[10px] text-second font-semibold leading-none">
              {product.namaPromo}
            </span>
          )}
        </>
      ) : (
        <>
          {offlinePrice && (
            <span className="font-display text-base font-bold text-third leading-none">
              {formatPrice(offlinePrice)}
            </span>
          )}
          {pricelist && (
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {discount && (
                <span className="text-[10px] bg-second/15 text-second px-2 py-[3px] rounded-full font-bold leading-none">
                  -{discount}%
                </span>
              )}
              <span className="text-[11px] text-third/40 line-through leading-none">
                {formatPrice(pricelist)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (listView) {
    return (
      <Link
        href={`/produk/${product.url}`}
        className="group relative flex gap-4 p-3 rounded-3xl bg-white ring-1 ring-third/5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-third/10"
      >
        <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50">
          {isNew && (
            <img src="/BadgeBaru.webp" alt="Badge Baru" width={44} height={44} className="absolute top-2 left-2 z-20" />
          )}
          {product.promo && (
            <span className="absolute top-2 right-2 z-20 bg-second text-third text-[9px] font-bold px-2 py-[3px] rounded-full shadow-sm">
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

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="line-clamp-2 text-left font-display text-base font-bold lg:text-sm xl:text-base text-third">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-left text-xs leading-relaxed text-third/60">
              {product.kategoriId} • <span className={`font-semibold ${stockColor}`}>{stockLabel}</span>
            </p>
          </div>

          <div className="flex items-end justify-between mt-3 gap-2">
            {priceNode("left")}

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={copyLink}
                className="w-9 h-9 rounded-full bg-third/5 flex items-center justify-center text-third/60 hover:bg-third/10 hover:text-third transition-colors duration-150 cursor-pointer"
                title="Salin tautan produk"
              >
                <Navigation className="w-4 h-4" />
              </button>
              <button
                onClick={addToCart}
                className="w-9 h-9 rounded-full bg-third flex items-center justify-center text-white hover:bg-second hover:text-third transition-colors duration-150 cursor-pointer"
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
      className="group relative flex flex-shrink-0 w-auto md:w-[200px] flex-col rounded-3xl bg-white p-3 ring-1 ring-third/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-third/10"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
        {isNew && (
          <img src="/BadgeBaru.webp" alt="Badge Baru" width={50} height={50} className="absolute top-2 left-2 z-20" />
        )}

        {product.promo && (
          <span className="absolute top-2.5 right-2.5 z-20 bg-second text-third text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
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

        <button
          onClick={copyLink}
          className="absolute bottom-2.5 right-2.5 z-20 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-third/60 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:text-third group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
          title="Salin tautan produk"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {toastNode}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
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

        <button
          onClick={addToCart}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-third py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-second hover:text-third active:scale-[0.98] cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Tambah Keranjang
        </button>
      </div>
    </Link>
  );
}