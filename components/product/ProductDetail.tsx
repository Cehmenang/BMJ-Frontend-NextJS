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
  Megaphone,
  Truck,
  ShieldCheck,
  PiggyBank,
  Eye,
} from "lucide-react";
import ZoomImage from "./ZoomImage";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { createWishlist } from "@/action/wishlist";
import ProductFaq from "./ProductFaq";
import { getRelated } from "@/action/product";
import { IProduct } from "@/interface";
import RelatedProducts from "./RelatedProducts";
import { useRouter } from "next/navigation";

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

function parsePrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return null;
  const str = String(value).trim();
  const num = parseInt(str.includes(" ") ? str.split(" ")[0].trim() : str);
  return isNaN(num) ? null : num;
}

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nav(-1);
        }}
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm border border-white/15 bg-white/10 text-white transition-colors hover:bg-second/40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <Image
        width={500}
        height={500}
        loading="lazy"
        sizes="(max-width: 768px) 90vw, 60vw"
        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${images[idx]}`}
        alt={`${images[idx]}`}
        className="max-h-[65vh] max-w-[88vw] rounded-sm bg-white object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className="flex max-w-[90vw] gap-2.5 overflow-x-auto pb-1"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setIdx(i)}
            className={`h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 transition-all sm:h-14 sm:w-14 ${
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
              className="h-full w-full bg-white object-contain p-1"
            />
          </div>
        ))}
      </div>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-white/50">
        {idx + 1} / {images.length}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nav(1);
        }}
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm border border-white/15 bg-white/10 text-white transition-colors hover:bg-second/40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function ProductDetail({ product }: { product?: any }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "" });
  const toastRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("description");
  const [fsOpen, setFsOpen] = useState(false);
  const [showingVideo, setShowingVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, VariantOption>>({});
  const [activeImgSrc, setActiveImgSrc] = useState<string | null>(null);
  const [related, setRelated] = useState<IProduct[] | []>([]);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (product?.id) {
      const getClientCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };

      const token = getClientCookie("access_token");
      const guestId = getClientCookie("guest_id");

      fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/produk/${product.id}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          guest_id: token ? null : guestId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Log View Tracker:", data.message);
        })
        .catch((err) => console.error("Gagal mendaftarkan data view:", err));
    }
  }, [product?.id]);

  useEffect(() => {
    if (tabContentRef.current) {
      import("gsap").then((mod) => {
        const gsap = mod.gsap ?? mod.default;
        gsap.killTweensOf(tabContentRef.current);
        gsap.fromTo(
          tabContentRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      });
    }
  }, [tab]);

  useEffect(() => {
    if (toast.show && toastRef.current) {
      import("gsap").then((mod) => {
        const gsap = mod.gsap ?? mod.default;

        gsap.fromTo(
          toastRef.current,
          { y: -40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.5)" }
        );

        gsap.to(toastRef.current, {
          y: -30,
          opacity: 0,
          scale: 0.95,
          delay: 3,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setToast({ show: false, message: "" }),
        });
      });
    }
  }, [toast.show]);

  const handleCloseToast = () => {
    if (!toastRef.current) return;
    import("gsap").then((mod) => {
      const gsap = mod.gsap ?? mod.default;
      gsap.killTweensOf(toastRef.current);
      gsap.to(toastRef.current, {
        y: -30,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setToast({ show: false, message: "" }),
      });
    });
  };

  const rawImages = product?.images;
  const imageList: string[] =
    typeof rawImages === "string" ? JSON.parse(rawImages) : rawImages ?? [];

  const variants: Variant[] = product?.variants ?? [];
  const allVariantsSelected =
    variants.length === 0 || variants.every((v) => selectedOptions[v.id]);

  const videoId = product?.video ? getYoutubeId(product.video) : null;

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
        `Halo, saya ingin menanyakan ketersediaan :\nNama Produk: ${product?.name}\nHarga Offline: ${formatPrice(product.offlinePrice)}\nTokopedia: ${product.tautan ? product.tautan : "https://www.tokopedia.com/bandarmusikjakarta"}\n\nApakah barangnya tersedia dan harganya sesuai?\nUntuk detailnya ada disini https://bandarmusikjakarta.com/produk/${product.url}. Terimakasih`
      );
      setWaUrl(`https://wa.me/6281929290560?text=${waMessage}`);
    }
  }, [product]);

  const popImage = (callback: () => void) => {
    import("gsap").then((mod) => {
      const gsap = mod.gsap ?? mod.default;
      const target = imgWrapRef.current;
      if (!target) {
        callback();
        return;
      }
      gsap.killTweensOf(target);
      gsap.fromTo(
        target,
        { opacity: 0.7 },
        { opacity: 1, duration: 0.35, ease: "back.out(1.6)" }
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

  const offlineNum = parsePrice(product.offlinePrice);
  const pricelistNum = parsePrice(product.pricelist);
  const discount =
    offlineNum && pricelistNum && pricelistNum > offlineNum
      ? Math.round(((pricelistNum - offlineNum) / pricelistNum) * 100)
      : null;

  const thumbBase =
    "h-[64px] w-[64px] flex-shrink-0 overflow-hidden rounded-sm bg-white transition-all duration-200 md:h-[88px] md:w-[88px]";
  const thumbActive = "ring-2 ring-second";
  const thumbIdle = "opacity-60 ring-1 ring-third/10 hover:opacity-100 hover:ring-third/30";

  const metaItems = [
    { label: "Berat", value: product.weight },
    { label: "SKU", value: product.sku },
    { label: "Garansi", value: product.warranty },
    { label: "Stok", value: `${product.stock} unit` },
  ];

  const trustItems = [
    { Icon: Truck, title: "Pengiriman Cepat", sub: "Pengiriman barang cepat dan aman" },
    { Icon: ShieldCheck, title: "Garansi 1 Year", sub: "Perlindungan sejak tanggal pembelian" },
    { Icon: PiggyBank, title: "Best Price", sub: "Kualitas dengan harga terbaik" },
  ];

  return (
    <>
      {toast.show && (
        <div
          ref={toastRef}
          className="fixed right-4 top-20 z-50 flex max-w-sm items-center gap-3 rounded-sm bg-third px-4 py-3 text-white shadow-xl ring-1 ring-second/30 will-change-transform"
        >
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-second">
            <svg className="h-3.5 w-3.5 text-third" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold leading-tight tracking-wide">Berhasil!</p>
            <p className="mt-0.5 text-[11px] leading-snug text-white/60">{toast.message}</p>
          </div>
          <button
            onClick={handleCloseToast}
            className="ml-2 text-white/50 transition-colors hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {fsOpen && (
        <FullscreenViewer
          images={imageList}
          initialIndex={activeImg}
          onClose={() => setFsOpen(false)}
        />
      )}

      <div className="min-h-screen bg-bg-site font-sans">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-8 md:px-14 md:pb-24">
          <div
            className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 pt-5 text-[11px] text-third/50 md:pt-8 md:text-[13px]"
            style={{ scrollbarWidth: "none" }}
          >
            <Link href="/" className="flex-shrink-0 transition-colors hover:text-third">
              Beranda
            </Link>
            <span>/</span>
            <Link
              href={`/kategori/${product.kategoriId}`}
              className="flex-shrink-0 transition-colors hover:text-third"
            >
              {product.kategoriId}
            </Link>
            <span>/</span>
            <Link
              href={`/brand/${product.brandId}`}
              className="flex-shrink-0 transition-colors hover:text-third"
            >
              {product.brandId}
            </Link>
            <span>/</span>
            <span className="truncate text-third">{product.name.toUpperCase()}</span>
          </div>

          <div className="mt-4 grid items-start gap-6 md:mt-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
            <div className="flex flex-col gap-3 lg:sticky lg:top-24">
              <div
                className="relative cursor-zoom-in overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-third/10"
                onClick={() => {
                  if (showingVideo) {
                    if (!videoPlaying) setVideoPlaying(true);
                  } else {
                    setFsOpen(true);
                  }
                }}
              >
                {!showingVideo && discount && (
                  <span className="absolute right-3 top-3 z-10 rounded-sm border border-amber-600 bg-amber-100 px-2 py-[3px] text-[13px] font-black leading-none tracking-tight text-third shadow-sm md:text-[16px]">
                    -{discount}%
                  </span>
                )}

                <div
                  ref={imgWrapRef}
                  className="aspect-square w-full"
                >
                  {showingVideo && videoId ? (
                    videoPlaying ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        className="h-full w-full rounded-sm"
                        allow="autoplay; encrypted-media; clipboard-write; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="group relative h-full w-full overflow-hidden rounded-sm">
                        <img
                          src={getYoutubeThumbnail(videoId)}
                          alt="Video produk"
                          className="h-full w-full object-cover opacity-70 transition-opacity duration-200 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-third/85 shadow-xl transition-colors duration-200 group-hover:bg-third md:h-16 md:w-16">
                            <Play className="ml-1 h-6 w-6 text-second md:h-7 md:w-7" fill="#f9ad52" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <ZoomImage
                      src={currentSrc}
                      alt={product.name}
                      productRef={mainImgRef}
                    />
                  )}
                </div>
              </div>

              <div
                className="flex gap-2 overflow-x-auto pb-1 md:gap-3"
                style={{ scrollbarWidth: "none" }}
              >
                {imageList.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => switchImg(i)}
                    className={`${thumbBase} ${
                      !showingVideo && !activeImgSrc && i === activeImg ? thumbActive : thumbIdle
                    }`}
                  >
                    <Image
                      width={200}
                      height={200}
                      loading="lazy"
                      sizes="100px"
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
                      alt={`${src}`}
                      className="h-full w-full object-contain p-1.5 md:p-2"
                    />
                  </button>
                ))}

                {videoId && (
                  <button
                    onClick={openVideo}
                    className={`${thumbBase} relative ${showingVideo ? thumbActive : thumbIdle}`}
                  >
                    <img
                      src={getYoutubeThumbnail(videoId)}
                      alt="Video produk"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-third/85 md:h-7 md:w-7">
                        <Play className="ml-0.5 h-3 w-3 text-second md:h-3.5 md:w-3.5" fill="#f9ad52" />
                      </div>
                    </div>
                  </button>
                )}

                {variants
                  .flatMap((v) => v.options)
                  .filter((o) => o.image)
                  .map((option) => {
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
                        className={`${thumbBase} ${isActiveVariantImg ? thumbActive : thumbIdle}`}
                        title={option.name}
                      >
                        <Image
                          width={200}
                          height={200}
                          loading="lazy"
                          sizes="100px"
                          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${option.image}`}
                          alt={option.name}
                          className="h-full w-full object-contain p-1.5 md:p-2"
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow-sm ring-1 ring-third/10 md:gap-6 md:p-7">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-second/15 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-wider text-third md:text-[11px]">
                    {product.kategoriId}
                  </span>
                  <span className="rounded-sm bg-third/5 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-wider text-third/70 md:text-[11px]">
                    {product.brandId}
                  </span>
                </div>
                <h1 className="font-poppins text-[clamp(16px,2vw,26px)] font-extrabold uppercase leading-snug text-third">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-center gap-1.5 text-[12px] text-third/45">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Dilihat {product.views_count ?? 0} kali</span>
                </div>
              </div>

              <div className="h-px bg-third/10" />

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {waUrl && (
                    <Link
                      href={waUrl}
                      suppressHydrationWarning
                      className="group flex flex-col gap-2 rounded-sm bg-bg-site px-4 py-3 ring-1 ring-third/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-third/25"
                    >
                      <p className="text-[11px] font-semibold uppercase leading-none tracking-wider text-third/50">
                        Harga Offline
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[20px] font-black leading-none text-third md:text-[22px]">
                          {formattedPrice || `Rp ${product.offlinePrice?.toLocaleString()}`}
                        </p>
                        {discount && (
                          <span className="rounded-sm border border-amber-600 bg-amber-100 px-1.5 py-[2px] text-[11px] font-bold leading-none text-third">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      {pricelistNum && (
                        <span
                          className={`text-[12px] font-semibold leading-none text-red-500 ${
                            discount ? "line-through" : ""
                          }`}
                        >
                          Pricelist: {formatPrice(pricelistNum)}
                        </span>
                      )}
                    </Link>
                  )}
                  {waUrl && (
                    <Link
                      href={waUrl}
                      suppressHydrationWarning
                      className="group flex flex-col gap-2 rounded-sm bg-second/10 px-4 py-3 ring-1 ring-second/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-second"
                    >
                      <p className="text-[11px] font-semibold uppercase leading-none tracking-wider text-third/50">
                        Special Price
                      </p>
                      <p className="text-[20px] font-black leading-none text-red-500 md:text-[22px]">
                        Rp.XXXXXXX
                      </p>
                      <span className="text-[12px] font-semibold leading-none text-third/60">
                        Tanya via WhatsApp
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              {variants.length > 0 && (
                <>
                  <div className="h-px bg-third/10" />
                  <div className="flex flex-col gap-4 md:gap-5">
                    {variants.map((variant) => (
                      <div key={variant.id}>
                        <div className="mb-2.5 flex items-center gap-2 md:mb-3">
                          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-third/60 md:text-[13px]">
                            Pilih {variant.type} :
                          </p>
                          {selectedOptions[variant.id] && (
                            <span className="text-[12px] font-bold text-third md:text-[13px]">
                              {selectedOptions[variant.id].name}
                            </span>
                          )}
                        </div>
                        <div className="flex w-full flex-wrap gap-2 md:gap-2.5">
                          {variant.options.map((option) => {
                            const isSelected = selectedOptions[variant.id]?.id === option.id;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleOption(variant.id, option)}
                                className={`relative flex items-center gap-2 border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-second bg-second/10 shadow-[0_2px_12px_rgba(249,173,82,0.25)]"
                                    : "border-third/15 hover:border-third/40"
                                }`}
                              >
                                  <span
                                    className={`text-[14px] font-bold leading-tight transition-colors md:text-[15px] ${
                                      isSelected ? "text-third" : "text-third/65"
                                    }`}
                                  >
                                    {option.name}
                                  </span>
                                {isSelected && (
                                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-sm bg-second shadow-sm">
                                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                      <p className="flex items-center gap-1.5 rounded-sm bg-second/10 px-3 py-2 text-[11px] text-third/60">
                        <svg className="h-3.5 w-3.5 flex-shrink-0 text-second" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                </>
              )}

              <div className="h-px bg-third/10" />

              <div className="flex flex-col gap-3">
                <div className="flex items-stretch gap-2.5">
                  <div className="flex items-center overflow-hidden rounded-sm ring-1 ring-third/20">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-11 w-9 items-center justify-center text-third transition-colors hover:bg-third/5"
                    >
                      <ChevronDown size={16} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-[15px] font-bold text-third">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-11 w-9 items-center justify-center text-third transition-colors hover:bg-third/5"
                    >
                      <ChevronUp size={16} strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    disabled={!allVariantsSelected}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-second px-4 text-[14px] font-bold uppercase tracking-wider text-third transition-all duration-200 hover:bg-third hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-third/40 disabled:hover:bg-slate-200 disabled:hover:text-third/40 md:text-[15px]"
                    onClick={async () => {
                      try {
                        await createWishlist(product.id, qty);
                        router.refresh();
                        setToast({
                          show: true,
                          message: "Produk berhasil ditambahkan ke keranjang!",
                        });
                      } catch (err) {
                        console.error("Gagal menambah barang:", err);
                      }
                    }}
                  >
                    <ShoppingCart strokeWidth={2.5} className="h-5 w-5" />
                    <span>{product.stock < 0 ? "Pre-Order" : "Keranjang"}</span>
                  </button>

                  <Link
                    href={`${product.tautan || "https://www.tokopedia.com/bandarmusikjakarta"}`}
                    target="_blank"
                    suppressHydrationWarning
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-sm bg-white ring-1 ring-third/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Image
                      src={"/tokped.webp"}
                      alt="Tokopedia - Bandar Musik Jakarta"
                      width={28}
                      height={28}
                    />
                  </Link>
                </div>

                {waUrl && (
                  <Link
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-center gap-x-3 rounded-sm bg-third px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-third/20"
                  >
                    <FaWhatsapp size={26} className="flex-shrink-0 text-second" />
                    <div>
                      <p className="text-[10px] uppercase leading-none tracking-wider text-white/60">
                        Pembelian Melalui
                      </p>
                      <p className="mt-1 text-[17px] font-extrabold leading-none tracking-tight md:text-[19px]">
                        Whatsapp
                      </p>
                    </div>
                  </Link>
                )}

                <div className="flex items-start gap-x-2 rounded-sm bg-second/10 px-3 py-2.5 text-third">
                  <Megaphone size={15} className="mt-0.5 flex-shrink-0 text-second" />
                  <p className="text-[11px] italic leading-snug md:text-[12px]">
                    Harap Tanya Ketersediaan Barang Melalui Whatsapp Sebelum Melakukan Pemesanan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {trustItems.map(({ Icon, title, sub }) => (
                  <div
                    key={title}
                    className="flex items-start gap-2.5 rounded-sm bg-bg-site px-3 py-3 ring-1 ring-third/5"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-white text-third ring-1 ring-third/10">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold leading-tight text-third">{title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-third/60">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid items-start gap-6 md:mt-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
            <div className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-third/10">
              <div
                className="flex overflow-x-auto border-b border-third/10"
                style={{ scrollbarWidth: "none" }}
              >
                {(["description", "features", "specifications"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative flex-shrink-0 whitespace-nowrap px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider transition-colors duration-150 md:px-6 md:text-[13px] ${
                      tab === t ? "text-third" : "text-third/40 hover:text-third/70"
                    }`}
                  >
                    {t === "description" ? "Deskripsi" : t === "features" ? "Fitur" : "Spesifikasi"}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] w-full bg-second transition-transform duration-300 ${
                        tab === t ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div
                ref={tabContentRef}
                className="p-5 text-[13px] leading-relaxed text-third/75 will-change-transform md:p-7 md:text-[14px]"
              >
                {tab === "description" && (
                  <p className="whitespace-pre-line">{product.description}</p>
                )}

                {tab === "features" && (
                  <ul className="flex list-none flex-col gap-2.5">
                    {product.fitur && product.fitur.length > 0 ? (
                      product.fitur.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-second" />
                          {f}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm italic text-third/40">Tidak ada informasi fitur.</p>
                    )}
                  </ul>
                )}

                {tab === "specifications" && (
                  <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                    {product.spesifikasi && product.spesifikasi.length > 0 ? (
                      product.spesifikasi.map((s: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 border-b border-third/10 py-2.5"
                        >
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-second" />
                          <span className="text-[12px] text-third md:text-[13px]">{s}</span>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-sm italic text-third/40">
                        Tidak ada informasi spesifikasi.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-third/10 lg:sticky lg:top-24">
              <div className="border-b border-third/10 px-5 py-3.5 md:px-6">
                <p className="text-[12px] font-bold uppercase tracking-wider text-third md:text-[13px]">
                  Informasi Produk
                </p>
              </div>
              <div className="flex flex-col">
                {metaItems.map((m, i) => (
                  <div
                    key={m.label}
                    className={`flex items-center justify-between gap-4 px-5 py-3 md:px-6 ${
                      i !== metaItems.length - 1 ? "border-b border-third/10" : ""
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-third/45">
                      {m.label}
                    </span>
                    <span className="text-right text-[13px] font-semibold text-third md:text-[14px]">
                      {m.value || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <ProductFaq />
            {related && related.length > 0 && <RelatedProducts related={related} />}
          </div>
        </div>
      </div>
    </>
  );
}