"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Play,
  Phone,
} from "lucide-react";
import ZoomImage from "./ZoomImage";

type Tab = "description" | "features" | "specifications";
type Lens = { x: number; y: number; show: boolean };

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// ── Fullscreen Viewer ──────────────────────────────────────────────────────
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
      if (e.key === "ArrowLeft")  nav(-1);
      if (e.key === "Escape")     onClose();
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
      <img
        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${images[idx]}`}
        alt=""
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
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
              alt=""
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

// ── Main Component ─────────────────────────────────────────────────────────
export default function ProductDetail({ product }: { product?: any }) {
  const [activeImg, setActiveImg]           = useState(0);
  const [qty, setQty]                       = useState(1);
  const [tab, setTab]                       = useState<Tab>("description");
  const [fsOpen, setFsOpen]                 = useState(false);
  const [videoOpen, setVideoOpen]           = useState(false);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [lens, setLens]                     = useState<Lens>({ x: 0, y: 0, show: false });

  const imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images

  // refs
  const galleryRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);

  // Fix hydration
  useEffect(() => {
    setFormattedPrice(formatPrice(product?.offlinePrice ?? 0));
  }, [product?.offlinePrice]);

  const switchImg = (idx: number) => {
    if (mainImgRef.current) mainImgRef.current.style.opacity = "0";
    setTimeout(() => {
      setActiveImg(idx);
      if (mainImgRef.current) mainImgRef.current.style.opacity = "1";
    }, 160);
  };

  // Lens: track mouse position as percentage inside gallery container
  const onLensMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = galleryRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setLens({ x, y, show: true });
  };

  const ZOOM    = 3;    // zoom multiplier
  const LENS_PX = 160;  // lens box size in px

  // Position lens box, clamped so it never overflows the container
  const lensLeft = (containerW: number) => {
    const raw = (lens.x / 100) * containerW - LENS_PX / 2;
    return Math.max(0, Math.min(containerW - LENS_PX, raw));
  };
  const lensTop = (containerH: number) => {
    const raw = (lens.y / 100) * containerH - LENS_PX / 2;
    return Math.max(0, Math.min(containerH - LENS_PX, raw));
  };

  // Position the zoomed image inside the lens box
  // The zoomed image is ZOOM× the container size.
  // We translate it so the point under the cursor is centered in the lens.
  const imgLeft = (containerW: number) => {
    const center = (lens.x / 100) * containerW * ZOOM;
    return LENS_PX / 2 - center;
  };
  const imgTop = (containerH: number) => {
    const center = (lens.y / 100) * containerH * ZOOM;
    return LENS_PX / 2 - center;
  };

  const waMessage = encodeURIComponent(
    `Halo, saya ingin menanyakan ketersediaan produk: ${product?.name} (${product?.sku})`
  );
  const waUrl = `https://wa.me/${product?.whatsappNumber}?text=${waMessage}`;

  if (!product) return null;

  const containerW = galleryRef.current?.offsetWidth  ?? 0;
  const containerH = galleryRef.current?.offsetHeight ?? 0;

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
        <div className="px-14 pt-8 pb-2 flex items-center gap-2 text-[12px] text-third/45">
          <Link href="/" className="hover:text-third transition-colors">Beranda</Link>
          <span>/</span>
          <Link href={`/category/${product.kategoriId}`} className="hover:text-third transition-colors">
            {product.kategoriId}
          </Link>
          <span>/</span>
          <span className="text-third/70 line-clamp-1">{product.name}</span>
        </div>

        <div className="px-14 py-8">
          {/* ── Top: Gallery + Info ── */}
          <div className="grid grid-cols-[2fr_3fr] gap-14 items-start mb-14">

            {/* ── Gallery col ── */}
            <div className="flex flex-col gap-3">

                {/* Product image */}
                <div className="w-full h-full object-contain p-8 duration-200 overflow-hidden border border-slate-300 rounded-4xl hover:bg-white transition">
                  <ZoomImage src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[activeImg]}`} width="200" height="200" alt={product.name} productRef={mainImgRef}/>
                </div>
                   
              {/* Thumbnails — outside main image, flex-start so they don't stretch */}
              <div className="flex gap-3">
                {imageList.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => switchImg(i)}
                    className={`w-[80px] h-[80px] rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white transition-all duration-150 ${
                      i === activeImg
                        ? "border-second"
                        : "border-transparent opacity-50 hover:opacity-80 hover:border-third/15"
                    }`}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
                      alt=""
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Info col ── */}
            <div className="flex flex-col gap-5">
              {/* Badges + name */}
              <div>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-third/8 text-third border border-third/15">
                    {product.brandId}
                  </span>
                  <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-second/12 text-[#854F0B] border border-second/30">
                    {product.kategoriId}
                  </span>
                  <span className={`text-[11px] font-medium px-3 py-1 rounded-full border ${
                    product.stock > 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}>
                    {product.stock > 0 ? "On-Stock" : "Out-Stock"}
                  </span>
                </div>
                <h1 className="font-display text-[26px] font-bold text-third leading-snug">
                  {product.name}
                </h1>
              </div>

              <div className="h-px bg-third/8" />

              {/* Price */}
              <div>
                <p className="text-[11px] text-third/45 mb-1">Harga</p>
                <p
                  suppressHydrationWarning
                  className="font-display text-[32px] font-bold text-red-500 leading-none"
                >
                  {formattedPrice || `Rp ${product.offlinePrice?.toLocaleString()}`}
                </p>
              </div>

              <div className="h-px bg-third/8" />

              {/* Qty + Cart + WA */}
              <div className="flex items-center gap-2.5">
                {/* Qty pill */}
                <div className="flex items-center border border-third/20 rounded-full overflow-hidden bg-white flex-shrink-0">
                  <div className="w-9 h-9 rounded-full border border-third/20 bg-white flex items-center justify-center font-semibold text-[14px] text-third -m-px flex-shrink-0">
                    {qty}
                  </div>
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
                <button className="flex-1 h-10 bg-second hover:bg-[#e89d42] text-white rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors duration-150 shadow-[0_4px_16px_rgba(249,173,82,0.3)]">
                  <ShoppingCart className="w-4 h-4" />
                  Keranjang
                </button>

                {/* WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fba59] flex items-center justify-center flex-shrink-0 transition-colors duration-150 shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
                  title="Tanya ketersediaan via WhatsApp"
                >
                  <Phone className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom: Full width ── */}
          <div className="border-t border-third/8 pt-10 flex flex-col gap-10">

            {/* Tabs */}
            <div>
              <div className="flex border-b border-third/8 mb-6">
                {(["description", "features", "specifications"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-[13px] font-medium px-5 py-2.5 border-b-2 -mb-px transition-all duration-150 ${
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
                  <div className="grid grid-cols-2 gap-x-12 gap-y-0 max-w-xl">
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
              <div className="flex gap-10 flex-wrap">
                {[
                  { label: "Berat",   value: product.weight },
                  { label: "SKU",     value: product.sku },
                  { label: "Garansi", value: product.warranty },
                  { label: "Stok",    value: `${product.stock} unit` },
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