"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  ShoppingBag,
} from "lucide-react";
import ZoomImage from "./ZoomImage";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

type Tab = "description" | "features" | "specifications";

type VariantOption = {
  id: number
  variant_id: number
  name: string
  image: string
  harga: string
  created_at: string
  updated_at: string
}

type Variant = {
  id: number
  produk_id: string
  type: string
  options: VariantOption[]
  created_at: string
  updated_at: string
}
const bgVariantColor: Record<string, string> = {
  black: 'bg-select-black',
  white: 'bg-select-white',
  red: 'bg-select-red',
  calmblue: 'bg-select-calm-blue',
  mellowbeige: 'bg-select-mellow-beige',
  hawaiianblue: 'bg-select-hawaiian-blue',
  mallardfade: 'bg-select-mallard-fade',
  spacefly: 'bg-select-space-fly',
  natural: 'bg-select-natural',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// ── Fullscreen Viewer ──
function FullscreenViewer({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const nav = (dir: number) =>
    setIdx((i) => (i + dir + images.length) % images.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center gap-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); nav(-1); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-second/30 border border-white/15 text-white flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <Image
        width={500} height={500}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${images[idx]}`}
        alt={`${images[idx]}`}
        className="max-w-[70vw] max-h-[70vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex gap-2.5" onClick={(e) => e.stopPropagation()}>
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setIdx(i)}
            className={`w-14 h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              i === idx ? "border-second opacity-100" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              width={500} height={500}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={`${src}`}
              src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
              className="w-full h-full object-contain bg-white/5 p-1"
            />
          </div>
        ))}
      </div>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-white/40">
        {idx + 1} / {images.length}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); nav(1); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-second/30 border border-white/15 text-white flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// ── Main Component ──
export default function ProductDetail({ product }: { product?: any }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [fsOpen, setFsOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, VariantOption>>({});

  // ── activeImgSrc: bisa dari imageList atau dari variant option image ──
  const [activeImgSrc, setActiveImgSrc] = useState<string | null>(null);

  const mainImgRef = useRef<HTMLImageElement>(null);

  const imageList: string[] = typeof product.images === "string"
    ? JSON.parse(product.images)
    : product.images;

  const variants: Variant[] = product.variants ?? [];
  const allVariantsSelected = variants.length === 0 ||
    variants.every((v) => selectedOptions[v.id]);

  // Src yang aktif ditampilkan di ZoomImage
  const currentSrc = activeImgSrc
    ? `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${activeImgSrc}`
    : `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${imageList[activeImg]}`;

  // Harga aktif
  const activePrice = (() => {
    const selected = Object.values(selectedOptions);
    if (selected.length === 0) return product?.offlinePrice ?? 0;
    const last = selected.at(-1);
    if (!last?.harga) return product?.offlinePrice ?? 0;
    const num = Number(last.harga.replace(/\./g, "").replace(/,/g, ""));
    return isNaN(num) ? product?.offlinePrice ?? 0 : num;
  })();

  useEffect(() => {
    setFormattedPrice(formatPrice(activePrice));
  }, [activePrice]);

  useEffect(() => {
    if (product) {
      const waMessage = encodeURIComponent(
        `Halo, saya ingin menanyakan ketersediaan produk: ${product?.name} dengan harga ${formatPrice(product.offlinePrice)}. Apakah barangnya tersedia?\n\nUntuk detailnya ada disini https://bandarmusikjakarta.com/produk/${product.url}.`
      );
      setWaUrl(`https://wa.me/6281929290560?text=${waMessage}`);
    }
  }, [product]);

  const switchImg = (idx: number) => {
    if (mainImgRef.current) mainImgRef.current.style.opacity = "0";
    setTimeout(() => {
      setActiveImg(idx);
      setActiveImgSrc(null); // reset ke product image
      if (mainImgRef.current) mainImgRef.current.style.opacity = "1";
    }, 160);
  };

  const toggleOption = (variantId: number, option: VariantOption) => {
    setSelectedOptions(prev => {
      // Kalau sudah dipilih, deselect
      if (prev[variantId]?.id === option.id) {
        const next = { ...prev };
        delete next[variantId];
        // Reset ke gambar produk
        if (mainImgRef.current) mainImgRef.current.style.opacity = "0";
        setTimeout(() => {
          setActiveImgSrc(null);
          if (mainImgRef.current) mainImgRef.current.style.opacity = "1";
        }, 160);
        return next;
      }

      // Pilih option baru
      if (mainImgRef.current) mainImgRef.current.style.opacity = "0";
      setTimeout(() => {
        // Kalau option punya gambar, tampilkan gambar option
        if (option.image) {
          setActiveImgSrc(option.image);
        } else {
          setActiveImgSrc(null);
        }
        if (mainImgRef.current) mainImgRef.current.style.opacity = "1";
      }, 160);

      return { ...prev, [variantId]: option };
    });
  };

  if (!product) return null;

  return (
    <>
      {fsOpen && (
        <FullscreenViewer
          images={imageList}
          initialIndex={activeImg}
          onClose={() => setFsOpen(false)}
        />
      )}

      <div className="min-h-screen bg-bg-site font-sans md:px-48 w-full">
        {/* Breadcrumb */}
        <div className="px-4 md:px-28 pt-8 flex items-center gap-2 text-third/45">
          <Link href="/" className="hover:text-third transition-colors">Beranda</Link>
          <span>/</span>
          <Link href={`/category/${product.kategoriId}`} className="hover:text-third transition-colors">
            {product.kategoriId}
          </Link>
          <span>/</span>
          <Link href={`/brand/${product.brandId}`} className="hover:text-third transition-colors">
            {product.brandId}
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-third">{product.name}</span>
        </div>

        <div className="px-4 md:px-28 py-8">
          {/* ── Top: Gallery + Info ── */}
          <div className="flex justify-center md:grid md:grid-cols-[2fr_2fr] gap-8 md:gap-0 mb-14">

            {/* Gallery */}
            <div className="flex flex-col gap-3">
              <div className="w-[600px] object-contain p-8 duration-200 overflow-hidden border border-slate-300 rounded-4xl hover:bg-white transition relative">
                {/* ← pakai currentSrc yang reaktif */}
                <ZoomImage
                  src={currentSrc}
                  width="400"
                  height="400"
                  alt={product.name}
                  productRef={mainImgRef}
                />
                {((product.offlinePrice && product.pricelist) && ((product.pricelist!.trim() && product.offlinePrice.trim())
                  && (parseInt(product.pricelist!) > parseInt(product.offlinePrice)))) &&
                  <span className="text-[18px] absolute top-3 right-4 bg-red-600 border border-red-900 text-white px-2 py-[2px] rounded-sm font-black tracking-tight">
                    -{Math.round(((parseInt(product.pricelist!) - parseInt(product.offlinePrice)) / parseInt(product.pricelist!)) * 100)}%
                  </span>
                }
              </div>

              {/* Thumbnails — product images */}
              <div className="flex gap-3">
                {imageList.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => switchImg(i)}
                    className={`w-[72px] h-[72px] md:w-[120px] md:h-[120px] rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white transition-all duration-150 ${
                      // Active kalau src ini yang aktif dan bukan dari variant
                      (!activeImgSrc && i === activeImg)
                        ? "border-second"
                        : "border-transparent opacity-50 hover:opacity-80 hover:border-third/15"
                    }`}
                  >
                    <Image
                      width={500} height={500}
                      loading="lazy"
                      sizes="80px"
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
                      alt={`${src}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}

                {/* Variant option thumbnails — tampil di samping product thumbnails */}
                {variants.flatMap(v => v.options).filter(o => o.image).map((option) => {
                  const isActiveVariantImg = activeImgSrc === option.image;
                  return (
                    <button
                      key={`opt-${option.id}`}
                      onClick={() => {
                        // Cari variant yang punya option ini lalu toggle
                        const parentVariant = variants.find(v => v.options.some(o => o.id === option.id));
                        if (parentVariant) toggleOption(parentVariant.id, option);
                      }}
                      className={`w-[72px] h-[72px] md:w-[120px] md:h-[120px] rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white transition-all duration-150 relative ${
                        isActiveVariantImg
                          ? "border-second"
                          : "border-transparent opacity-50 hover:opacity-80 hover:border-third/15"
                      }`}
                      title={option.name}
                    >
                      <Image
                        width={500} height={500}
                        loading="lazy"
                        sizes="80px"
                        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${option.image}`}
                        alt={option.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5  pt-20">

              {/* Name */}
              <div>
                <p className="text-[16px] text-">{product.kategoriId}</p>
                <h1 className="font-display text-[22px] md:text-[28px] font-black text-third leading-snug">
                  {product.name}
                </h1>
              </div>

              <div className="h-px bg-third/8" />

              {/* Price */}
              <div>
                <div className="price-section flex gap-x-5">

                  {(product.onlinePrice && product.onlinePrice.trim() !== "") ?
                  <div suppressHydrationWarning className="font-display leading-none transition-all duration-200 px-5 py-2 border rounded-md border-third flex flex-col gap-y-[2px]">
                    <p className="text-[16px] italic opacity-60">Harga Online</p>
                    <p className="text-[16px] md:text-[20px] font-black text-red-500">{formattedPrice || `Rp ${product.onlinePrice?.toLocaleString()}`}</p>
                  </div> :

                   <Link href={`${product.tautan ? product.tautan : 'https://www.tokopedia.com/bandarmusikjakarta'}`} target="_blank" suppressHydrationWarning className="font-display leading-none transition-all duration-200 px-5 py-2 border rounded-md border-third flex gap-x-3 items-center">
                      <ShoppingBag size={28}/>
                      <div className="flex flex-col gap-y-[2px]">
                        <p className="text-[16px] italic opacity-60">Lihat</p>
                        <p className="text-[16px] md:text-[20px] font-black">Harga Online</p>
                      </div>
                    </Link>
                  }

                  {waUrl && <Link href={waUrl!} suppressHydrationWarning className="font-display leading-none transition-all duration-200 px-5 py-2 border rounded-md border-third flex flex-col gap-y-[2px]">
                    <p className="text-[16px] italic opacity-60">Harga Offline</p>
                    <p className="text-[16px] md:text-[20px] font-black text-red-500">{formattedPrice || `Rp ${product.offlinePrice?.toLocaleString()}`}</p>
                  </Link>}

                  {(product.namaPromo && product.promo) && <div suppressHydrationWarning className="font-display leading-none transition-all duration-200 px-5 py-2 border rounded-md border-third flex flex-col gap-y-[2px]">
                    <p className="text-[16px] italic opacity-60">{product.namaPromo}</p>
                    <p className="text-[16px] md:text-[20px] font-black text-red-500">{`${formatPrice(product.promo!.toLocaleString())}`}</p>
                  </div>}

                </div>
                {product.pricelist && (
                  <div className="font-semibold text-[16px] text-third/50 italic tracking-tighter leading-none flex gap-x-1 items-center mt-2">
                    <span className={`${((product.offlinePrice) && ((product.pricelist!.trim() && product.offlinePrice.trim())
                      && (parseInt(product.pricelist!) > parseInt(product.offlinePrice)))) && 'line-through'}`}>
                      Pricelist: {formatPrice(parseInt(product.pricelist.includes(" ") ? product.pricelist.split(' ')[0].trim() : product.pricelist.trim()))}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-third/8" />

              {/* ── Variants ── */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-5">
                  {variants.map((variant) => (
                    <div key={variant.id}>
                      {/* Type label */}
                      <div className="flex items-center gap-2 mb-3">
                        <p className="font-poppins text-[14px] font-semibold text-third/60 uppercase tracking-[0.1em]">
                          Pilih {variant.type} :
                        </p>
                        {selectedOptions[variant.id] && (
                          <span className={`font-poppins text-[14px] text-third/45`}>
                            <span className="text-third font-bold">{selectedOptions[variant.id].name}</span>
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="flex flex-wrap gap-2.5 w-full">
                        {variant.options.map((option) => {
                          const isSelected = selectedOptions[variant.id]?.id === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleOption(variant.id, option)}
                              className={`
                                border-2 relative flex items-center gap-2.5 
                                ${variant.type == "Warna" ? "w-10 h-10 rounded-full border-third " : "px-3 py-2 rounded-sm"}
                                transition-all duration-200 ${
                                isSelected
                                  ? "border-second bg-second/8 shadow-[0_2px_12px_rgba(249,173,82,0.2)]"
                                  : "border-third/12 hover:border-third/25"
                              } ${bgVariantColor[option.name.toLowerCase().split(' ').join('')]}`}
                            >
                              {/* Option image */}
                              {/* {option.image && (
                                <div className={`overflow-hidden flex-shrink-0 transition-colors ${
                                  isSelected ? "border-second/40" : "border-third/10"
                                }`}>
                                  <Image
                                    width={50}
                                    height={50}
                                    src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${option.image}`}
                                    alt={option.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )} */}

                              {/* Name */}
                              {variant.type !== "Warna" && <div className="flex flex-col items-start">
                                <span className={`font-poppins text-[20px] font-bold leading-tight transition-colors ${
                                  isSelected ? "text-third" : "text-third/65"
                                }`}>
                                  {option.name}
                                </span>
                              </div>}

                              {/* Checkmark */}
                              {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-second flex items-center justify-center shadow-sm">
                                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Peringatan belum pilih */}
                  {!allVariantsSelected && (
                    <p className="font-poppins text-[11px] text-third/40 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-second flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Pilih {variants
                        .filter((v) => !selectedOptions[v.id])
                        .map((v) => v.type)
                        .join(", ")} terlebih dahulu
                    </p>
                  )}
                </div>
              )}

              <div className="h-px bg-third/8" />

              {/* Qty + Cart + WA */}
              <div className="grid grid-cols-[0.5fr_3fr_2fr] gap-x-3">
                {/* Qty */}
                <div className="flex items-center border border-third/20 rounded-full overflow-hidden bg-white flex-shrink-0">
                  <div className="flex flex-col">
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-6 h-[18px] flex items-center justify-center text-third hover:bg-second/15 transition-colors"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-6 h-[18px] flex items-center justify-center text-third hover:bg-second/15 transition-colors"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Cart */}
                <div className="relative">

                  <div className="w-10 h-10 rounded-full border-2 border-third bg-primary flex items-center justify-center font-semibold text-[18px] text-third -m-px absolute top-[-8px] right-[-8px] z-10">
                    {qty}
                  </div>

                <button
                  disabled={!allVariantsSelected}
                  className="py-2 px-10 bg-second text-third border-2 border-third rounded-md font-bold text-[20px] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none drop-shadow-[6px_6px_0px_rgba(62,63,32,1)]"
                >
                  <ShoppingCart strokeWidth={3} className="w-6 h-6"/>
                  <span className="mt-[2px]">Keranjang</span>
                </button>

                </div>
                

                {/* WhatsApp */}
                {waUrl && (
                  <Link
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-5 bg-green-700 items-center justify-center transition-colors duration-150 text-white flex gap-x-2 rounded-sm"
                  >
                    <FaWhatsapp size={30} className="text-white" />
                    <span className="text-[20px] font-semibold">Tanya Barang</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom: Full width ── */}
          <div className="border-t border-third/8 pt-10 flex flex-col gap-10">

            {/* Tabs */}
            <div>
              <div className="flex border-b border-third/8 mb-6 overflow-x-auto">
                {(["description", "features", "specifications"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-[13px] font-medium px-5 py-2.5 border-b-2 -mb-px transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
                      tab === t
                        ? "border-second text-third"
                        : "border-transparent text-third/45 hover:text-third/70"
                    }`}
                  >
                    {t === "description" ? "Deskripsi" : t === "features" ? "Fitur" : "Spesifikasi"}
                  </button>
                ))}
              </div>

              <div className="text-[14px] leading-relaxed text-third/70 text-justify">
                {tab === "description" && <p>{product.description}</p>}
                {tab === "features" && (
                  <ul className="flex flex-col gap-2.5 list-none">
                    {product.features?.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-second mt-2 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {tab === "specifications" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0 max-w-xl">
                    {product.specifications?.map((s: { label: string; value: string }, i: number) => (
                      <div key={i} className="flex justify-between py-2.5 border-b border-third/6">
                        <span className="text-third/45 text-[13px]">{s.label}</span>
                        <span className="text-third font-medium text-[13px]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Meta info */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-third/40 mb-4">
                Informasi Produk
              </p>
              <div className="flex gap-6 md:gap-10 flex-wrap">
                {[
                  { label: "Berat", value: product.weight },
                  { label: "SKU", value: product.sku },
                  { label: "Garansi", value: product.warranty },
                  { label: "Stok", value: `${product.stock} unit` },
                ].map((m) => (
                  <div key={m.label} className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-third/35">
                      {m.label}
                    </span>
                    <span className="text-[14px] font-medium text-third">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            {product.videoUrl && (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-third/40 mb-4">
                  Video Produk
                </p>
                {!videoOpen ? (
                  <div
                    className="relative w-full max-w-2xl aspect-video bg-third/8 rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setVideoOpen(true)}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${imageList[0]}`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-third/80 group-hover:bg-third flex items-center justify-center transition-colors duration-200 shadow-xl">
                        <Play className="w-6 h-6 text-second ml-1" fill="#f9ad52" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-4 text-[11px] text-white/60">
                      Demo — {product.name}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-black">
                    <iframe
                      src={product.videoUrl + "?autoplay=1"}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setVideoOpen(false)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}