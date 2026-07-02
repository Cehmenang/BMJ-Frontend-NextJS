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
  Megaphone,
  Truck,
  ShieldCheck,
  PiggyBank,
} from "lucide-react";
import ZoomImage from "./ZoomImage";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { createWishlist } from "@/action/wishlist";
import ProductFaq from "./ProductFaq";
import { getRelated } from "@/action/product";
import { IProduct } from "@/interface";
import RelatedProducts from "./RelatedProducts";
import CekOngkir from "./CekOngkir";

type Tab = "description" | "features" | "specifications";
type VariantOption = {
  id: number;
  variant_id: number;
  name: string;
  image: string;
  harga: string;
  created_at: string;
  updated_at: string;
};
type Variant = {
  id: number;
  produk_id: string;
  type: string;
  options: VariantOption[];
  created_at: string;
  updated_at: string;
};

const bgVariantColor: Record<string, string> = {
  black: "bg-select-black",
  white: "bg-select-white",
  red: "bg-select-red",
  calmblue: "bg-select-calm-blue",
  mellowbeige: "bg-select-mellow-beige",
  hawaiianblue: "bg-select-hawaiian-blue",
  mallardfade: "bg-select-mallard-fade",
  spacefly: "bg-select-space-fly",
  natural: "bg-select-natural",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// ── YouTube helpers ──
function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
        width={500}
        height={500}
        loading="lazy"
        sizes="(max-width: 768px) 90vw, 60vw"
        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${images[idx]}`}
        alt={`${images[idx]}`}
        className="max-w-[88vw] max-h-[65vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className="flex gap-2.5 overflow-x-auto max-w-[90vw] pb-1"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setIdx(i)}
            className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              i === idx
                ? "border-second opacity-100"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              width={500}
              height={500}
              loading="lazy"
              sizes="56px"
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
  const [showingVideo, setShowingVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, VariantOption>>({});
  const [activeImgSrc, setActiveImgSrc] = useState<string | null>(null);
  const [related, setRelated] = useState<IProduct[] | []>([]);
  const [cekOngkir, setCekOngkir] = useState<boolean>(false);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const imageList: string[] =
    typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;

  const variants: Variant[] = product.variants ?? [];
  const allVariantsSelected =
    variants.length === 0 || variants.every((v) => selectedOptions[v.id]);

  // Contoh URL: "https://youtube.com/shorts/m4_e7uKBQRg?si=2GA2bfGYiGKG5BE-"
  const videoId = product.video ? getYoutubeId("https://youtube.com/shorts/m4_e7uKBQRg?si=KQBIk5All2TazR8J") : null;

  const currentSrc = activeImgSrc
    ? `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${activeImgSrc}`
    : `${process.env.NEXT_PUBLIC_SERVER_API}/storage/${imageList[activeImg]}`;

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
      (async () => setRelated(await getRelated(product.kategoriId, product.url)))();
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const waMessage = encodeURIComponent(
        `Halo, saya ingin menanyakan ketersediaan :\nNama Produk: ${product?.name}\nHarga Offline: ${formatPrice(product.offlinePrice)}\nTokopedia: ${product.tautan ? product.tautan : 'https://www.tokopedia.com/bandarmusikjakarta'}\n\nApakah barangnya tersedia dan harganya sesuai?\nUntuk detailnya ada disini https://bandarmusikjakarta.com/produk/${product.url}. Terimakasih`
      );
      setWaUrl(`https://wa.me/6281929290560?text=${waMessage}`);
    }
  }, [product]);

  const popImage = (callback: () => void) => {
    import("gsap").then((mod) => {
      const gsap = mod.gsap ?? mod.default;
      const target = imgWrapRef.current;
      if (!target) { callback(); return; }
      gsap.killTweensOf(target);
      gsap.fromTo(
        target,
        { scale: 0.7, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }
      );
      callback();
    });
  };

  const switchImg = (idx: number) => {
    setActiveImg(idx);
    setActiveImgSrc(null);
    setShowingVideo(false);
    setVideoPlaying(false);
    popImage(() => {});
  };

  const toggleOption = (variantId: number, option: VariantOption) => {
    setSelectedOptions((prev) => {
      if (prev[variantId]?.id === option.id) {
        const next = { ...prev };
        delete next[variantId];
        setShowingVideo(false);
        popImage(() => setActiveImgSrc(null));
        return next;
      }
      setShowingVideo(false);
      popImage(() => setActiveImgSrc(option.image || null));
      return { ...prev, [variantId]: option };
    });
  };

  const openVideo = () => {
    setShowingVideo(true);
    setVideoPlaying(false);
    setActiveImgSrc(null);
    popImage(() => {});
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
      <div className="min-h-screen bg-bg-site font-sans">
        {/* Breadcrumb */}
        <div className="px-4 md:px-28 lg:px-48 pt-5 md:pt-8 flex items-center gap-1.5 text-[11px] md:text-[13px] text-third/45 overflow-x-auto whitespace-nowrap pb-1" style={{ scrollbarWidth: "none" }}>
          <Link href="/" className="hover:text-third transition-colors flex-shrink-0">Beranda</Link>
          <span>/</span>
          <Link href={`/category/${product.kategoriId}`} className="hover:text-third transition-colors flex-shrink-0">{product.kategoriId}</Link>
          <span>/</span>
          <Link href={`/brand/${product.brandId}`} className="hover:text-third transition-colors flex-shrink-0">{product.brandId}</Link>
          <span>/</span>
          <span className="text-third truncate">{product.name.toUpperCase()}</span>
        </div>

        <div className="px-0 md:px-28 lg:px-48 py-4 md:py-8">
          {/* ── Top: Gallery + Info ── */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-0 md:gap-8 mb-8 md:mb-14">
            {/* ── GALLERY ── */}
            <div className="flex flex-col gap-3">
              {/* Main image / video */}
              <div
                className="relative mx-4 md:mx-0 rounded-2xl md:rounded-4xl border border-slate-300 overflow-hidden bg-white cursor-zoom-in"
                onClick={() => {
                  if (showingVideo) {
                    if (!videoPlaying) setVideoPlaying(true);
                  } else {
                    setFsOpen(true);
                  }
                }}
              >
                {/* Discount badge */}
                {!showingVideo && product.offlinePrice && product.pricelist &&
                  product.pricelist.trim() && product.offlinePrice.trim() &&
                  parseInt(product.pricelist) > parseInt(product.offlinePrice) && (
                  <span className="text-[13px] md:text-[18px] absolute top-3 right-3 z-10 bg-red-600 border border-red-900 text-white px-2 py-[2px] rounded-sm font-black tracking-tight">
                    -{Math.round(((parseInt(product.pricelist) - parseInt(product.offlinePrice)) / parseInt(product.pricelist)) * 100)}%
                  </span>
                )}

                <div ref={imgWrapRef} className="w-full aspect-square md:aspect-auto md:h-[480px] p-4 md:p-8">
                  {showingVideo && videoId ? (
                    videoPlaying ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        className="w-full h-full rounded-lg"
                        allow="autoplay; encrypted-media; clipboard-write; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="relative w-full h-full rounded-lg overflow-hidden group">
                        <img
                          src={getYoutubeThumbnail(videoId)}
                          alt="Video produk"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-200"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-third/80 group-hover:bg-third flex items-center justify-center transition-colors duration-200 shadow-xl">
                            <Play className="w-6 h-6 md:w-7 md:h-7 text-second ml-1" fill="#f9ad52" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <ZoomImage
                      src={currentSrc}
                      width="400"
                      height="400"
                      alt={product.name}
                      productRef={mainImgRef}
                    />
                  )}
                </div>
              </div>

              {/* Thumbnails — horizontal scroll */}
              <div
                className="flex gap-2.5 md:gap-3 overflow-x-auto px-4 md:px-0 pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {imageList.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => switchImg(i)}
                    className={`flex-shrink-0 w-[68px] h-[68px] md:w-[100px] md:h-[100px] rounded-xl overflow-hidden border-2 bg-white transition-all duration-150 ${
                      !showingVideo && !activeImgSrc && i === activeImg
                        ? "border-second"
                        : "border-transparent opacity-50 hover:opacity-80 hover:border-third/15"
                    }`}
                  >
                    <Image
                      width={200} height={200}
                      loading="lazy"
                      sizes="100px"
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
                      alt={`${src}`}
                      className="w-full h-full object-contain p-1.5 md:p-2"
                    />
                  </button>
                ))}

                {/* Video thumbnail */}
                {videoId && (
                  <button
                    onClick={openVideo}
                    className={`flex-shrink-0 relative w-[68px] h-[68px] md:w-[100px] md:h-[100px] rounded-xl overflow-hidden border-2 bg-white transition-all duration-150 ${
                      showingVideo
                        ? "border-second"
                        : "border-transparent opacity-50 hover:opacity-80 hover:border-third/15"
                    }`}
                  >
                    <img
                      src={getYoutubeThumbnail(videoId)}
                      alt="Video produk"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-third/85 flex items-center justify-center">
                        <Play className="w-3 h-3 md:w-3.5 md:h-3.5 text-second ml-0.5" fill="#f9ad52" />
                      </div>
                    </div>
                  </button>
                )}

                {variants.flatMap((v) => v.options).filter((o) => o.image).map((option) => {
                  const isActiveVariantImg = !showingVideo && activeImgSrc === option.image;
                  return (
                    <button
                      key={`opt-${option.id}`}
                      onClick={() => {
                        const parentVariant = variants.find((v) =>
                          v.options.some((o) => o.id === option.id)
                        );
                        if (parentVariant) toggleOption(parentVariant.id, option);
                      }}
                      className={`flex-shrink-0 w-[68px] h-[68px] md:w-[100px] md:h-[100px] rounded-xl overflow-hidden border-2 bg-white transition-all duration-150 ${
                        isActiveVariantImg
                          ? "border-second"
                          : "border-transparent opacity-50 hover:opacity-80 hover:border-third/15"
                      }`}
                      title={option.name}
                    >
                      <Image
                        width={200} height={200}
                        loading="lazy"
                        sizes="100px"
                        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${option.image}`}
                        alt={option.name}
                        className="w-full h-full object-contain p-1.5 md:p-2"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── INFO ── */}
            <div className="flex flex-col gap-4 md:gap-5 px-4 md:px-0 pt-2 md:pt-6">
              {/* Name */}
              <div>
                <p className="text-[11px] md:text-[13px] text-third/50 tracking-wide uppercase font-medium mb-1">
                  {product.kategoriId}
                </p>
                <h1 className="font-display text-[22px] md:text-[28px] font-black text-third leading-snug">
                  {product.name.toUpperCase()}
                </h1>
              </div>

              <div className="h-px bg-third/8" />

              {/* Price */}
              <div>
                <div className="grid grid-cols-2 md:flex gap-2.5 md:gap-5">
                  {waUrl && (
                    <Link
                      href={waUrl}
                      suppressHydrationWarning
                      className="font-display leading-none px-3 py-2.5 md:px-5 md:py-2 border rounded-md border-third flex flex-col gap-y-1"
                    >
                      <p className="text-[12px] md:text-[14px] italic opacity-60">Harga Offline</p>
                      <p className="text-[17px] md:text-[20px] font-black text-red-500">
                        {formattedPrice || `Rp ${product.offlinePrice?.toLocaleString()}`}
                      </p>
                    </Link>
                  )}
                  {waUrl && (
                    <Link
                      href={waUrl}
                      suppressHydrationWarning
                      className="font-display leading-none px-3 py-2.5 md:px-5 md:py-2 border rounded-md border-third flex flex-col gap-y-1"
                    >
                      <p className="text-[12px] md:text-[14px] italic opacity-60">Special Price</p>
                      <p className="text-[17px] md:text-[20px] font-black text-red-500">Rp.XXXXXXX</p>
                    </Link>
                  )}
                </div>
                {product.pricelist && (
                  <div className="font-semibold text-[13px] md:text-[15px] text-third/50 italic tracking-tighter leading-none flex gap-x-1 items-center mt-2">
                    <span
                      className={`${
                        product.offlinePrice &&
                        product.pricelist.trim() &&
                        product.offlinePrice.trim() &&
                        parseInt(product.pricelist) > parseInt(product.offlinePrice)
                          ? "line-through"
                          : ""
                      }`}
                    >
                      Pricelist:{" "}
                      {formatPrice(
                        parseInt(
                          product.pricelist.includes(" ")
                            ? product.pricelist.split(" ")[0].trim()
                            : product.pricelist.trim()
                        )
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-third/8" />

              {/* Variants */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-4 md:gap-5">
                  {variants.map((variant) => (
                    <div key={variant.id}>
                      <div className="flex items-center gap-2 mb-2.5 md:mb-3">
                        <p className="font-poppins text-[12px] md:text-[13px] font-semibold text-third/60 uppercase tracking-[0.1em]">
                          Pilih {variant.type} :
                        </p>
                        {selectedOptions[variant.id] && (
                          <span className="font-poppins text-[12px] md:text-[13px] text-third/45">
                            <span className="text-third font-bold">
                              {selectedOptions[variant.id].name}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-2.5 w-full">
                        {variant.options.map((option) => {
                          const isSelected = selectedOptions[variant.id]?.id === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleOption(variant.id, option)}
                              className={`border-2 relative flex items-center gap-2 ${
                                variant.type === "Warna"
                                  ? "w-9 h-9 md:w-10 md:h-10 rounded-full border-third"
                                  : "px-2.5 py-1.5 md:px-3 md:py-2 rounded-sm"
                              } transition-all duration-200 ${
                                isSelected
                                  ? "border-second bg-second/8 shadow-[0_2px_12px_rgba(249,173,82,0.2)]"
                                  : "border-third/12 hover:border-third/25"
                              } ${bgVariantColor[option.name.toLowerCase().split(" ").join("")]}`}
                            >
                              {variant.type !== "Warna" && (
                                <span
                                  className={`font-poppins text-[15px] md:text-[17px] font-bold leading-tight transition-colors ${
                                    isSelected ? "text-third" : "text-third/65"
                                  }`}
                                >
                                  {option.name}
                                </span>
                              )}
                              {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-second flex items-center justify-center shadow-sm">
                                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                  {!allVariantsSelected && (
                    <p className="font-poppins text-[11px] text-third/40 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-second flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Pilih{" "}
                      {variants
                        .filter((v) => !selectedOptions[v.id])
                        .map((v) => v.type)
                        .join(", ")}{" "}
                      terlebih dahulu
                    </p>
                  )}
                </div>
              )}

              {variants.length > 0 && <div className="h-px bg-third/8" />}

              {/* Qty + Cart + WA */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 border-2 border-third rounded-md overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-10 flex items-center justify-center text-third hover:bg-third/8 transition-colors"
                    >
                      <ChevronDown size={18} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center font-semibold text-[16px] text-third">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-10 flex items-center justify-center text-third hover:bg-third/8 transition-colors"
                    >
                      <ChevronUp size={18} strokeWidth={3} />
                    </button>
                  </div>
                  <button
                    disabled={!allVariantsSelected}
                    className="flex-1 py-2.5 px-4 bg-second text-third border-2 border-third rounded-md font-bold text-[16px] md:text-[18px] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed drop-shadow-[4px_4px_0px_rgba(62,63,32,1)] md:drop-shadow-[6px_6px_0px_rgba(62,63,32,1)]"
                    onClick={async () => await createWishlist(product.id, qty)}
                  >
                    <ShoppingCart strokeWidth={3} className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Keranjang</span>
                  </button>
                  <Link href={`${product.tautan || "https://www.tokopedia.com/bandarmusikjakarta"}`}
                    target="_blank"
                    suppressHydrationWarning
                    className="p-1 border-2 border-third rounded-md">
                    <Image src={'/tokped.webp'} alt="Tokopedia - Bandar Musik Jakarta" width={30}/>
                  </Link>
                </div>

                {waUrl && (
                  <Link
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-5 flex gap-x-2.5 items-center justify-center rounded-xl border-2 border-third transition-colors duration-150 hover:bg-third/5"
                  >
                    <FaWhatsapp size={26} className="text-third flex-shrink-0" />
                    <div>
                      <p className="text-[11px] leading-none text-third/60">Pembelian Melalui</p>
                      <p className="text-[18px] md:text-[20px] font-extrabold tracking-tight leading-none">
                        Whatsapp
                      </p>
                    </div>
                  </Link>
                )}

                <div className="flex gap-x-2 items-start text-third/50 mt-1">
                  <Megaphone size={16} className="flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] md:text-[12px] font-light italic leading-snug">
                    Harap Tanya Ketersediaan Barang melalui Whatsapp Sebelum Melakukan Pemesanan.
                  </p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 md:flex md:gap-4 mt-2 md:mt-4 border-t border-third/8 pt-4">
                {[
                  { Icon: Truck, title: "Pengiriman Cepat", sub: "Pengiriman barang cepat dan aman" },
                  { Icon: ShieldCheck, title: "Garansi 1 Tahun", sub: "Perlindungan sejak tanggal pembelian" },
                  { Icon: PiggyBank, title: "Best Price", sub: "Kualitas dengan harga terbaik" },
                ].map(({ Icon, title, sub }) => (
                  <div key={title} className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2 text-center md:text-left md:border-r last:border-r-0 border-third/50 md:pr-4 last:pr-0">
                    <Icon size={24} strokeWidth={2} className="flex-shrink-0 text-third/70" />
                    <div>
                      <p className="font-bold text-[11px] md:text-[13px] leading-tight">{title}</p>
                      <p className="text-[10px] md:text-[12px] font-light text-third/60 leading-snug">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom: Tabs + Meta ── */}
          <div className="border-t border-third/8 pt-8 md:pt-10 flex flex-col gap-8 md:gap-10 px-4 md:px-0">
            {/* Tabs */}
            <div>
              <div className="flex border-b border-third/8 mb-5 md:mb-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {(["description", "features", "specifications"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-[12px] md:text-[13px] font-medium px-4 md:px-5 py-2.5 border-b-2 -mb-px transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
                      tab === t
                        ? "border-second text-third"
                        : "border-transparent text-third/45 hover:text-third/70"
                    }`}
                  >
                    {t === "description" ? "Deskripsi" : t === "features" ? "Fitur" : "Spesifikasi"}
                  </button>
                ))}
              </div>
              <div className="text-[13px] md:text-[14px] leading-relaxed text-third/70 text-justify">
                {tab === "description" && <p>{product.description}</p>}
                {tab === "features" && (
                  <ul className="flex flex-col gap-2 md:gap-2.5 list-none">
                    {product.fitur?.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-second mt-2 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {tab === "specifications" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
                    {product.spesifikasi?.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 py-2 md:py-2.5 border-b border-third/6">
                        <span className="w-1.5 h-1.5 rounded-full bg-second mt-2 flex-shrink-0" />
                        <span className="text-third text-[12px] md:text-[13px]">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Meta info */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-third/40 mb-3 md:mb-4">
                Informasi Produk
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:flex md:gap-10">
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
                    <span className="text-[13px] md:text-[14px] font-medium text-third">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 md:px-0 mt-10">
            <ProductFaq />
            {(related && related.length > 0) && <RelatedProducts related={related}/>}
          </div>
        </div>
      </div>
    </>
  );
}