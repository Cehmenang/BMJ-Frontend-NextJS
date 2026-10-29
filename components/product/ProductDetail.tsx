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
  Truck,
  ShieldCheck,
  PiggyBank,
  Eye,
  Share2,
  Maximize2,
  ListChecks,
  FileText,
  TriangleAlert,
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

type DrawerType = "features" | "specifications";
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
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-black/90"
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
  const [drawer, setDrawer] = useState<DrawerType | null>(null);
  const [drawerType, setDrawerType] = useState<DrawerType>("features");
  const [descOpen, setDescOpen] = useState(false);
  const [fsOpen, setFsOpen] = useState(false);
  const [showingVideo, setShowingVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [formattedPrice, setFormattedPrice] = useState("");
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, VariantOption>>({});
  const [activeImgSrc, setActiveImgSrc] = useState<string | null>(null);
  const [related, setRelated] = useState<IProduct[] | []>([]);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const drawerOpen = drawer !== null;

  const openDrawer = (type: DrawerType) => {
    setDrawerType(type);
    setDrawer(type);
  };

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
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(null);
    };
    window.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen]);

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

  const stepImg = (dir: number) => {
    const total = imageList.length;
    if (total === 0) return;
    switchImg((activeImg + dir + total) % total);
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

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast({ show: true, message: "Tautan produk berhasil disalin!" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return null;

  const isVideo = showingVideo && !!videoId;

  const offlineNum = parsePrice(product.offlinePrice);
  const pricelistNum = parsePrice(product.pricelist);
  const hasVariantPrice = Object.values(selectedOptions).some((o) => o?.harga);
  const showMainPrice = !!offlineNum || hasVariantPrice;
  const displayNum = showMainPrice ? Number(activePrice) : pricelistNum;
  const mainPriceText = showMainPrice
    ? formattedPrice || formatPrice(Number(activePrice))
    : pricelistNum
    ? formatPrice(pricelistNum)
    : null;
  const strikePrice = showMainPrice ? pricelistNum : null;
  const discount =
    strikePrice && displayNum && strikePrice > displayNum
      ? Math.round(((strikePrice - displayNum) / strikePrice) * 100)
      : null;

  const longDesc = (product.description ?? "").length > 220;

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

  const sideBtn =
    "flex h-10 w-10 items-center justify-center rounded-sm bg-white text-third ring-1 ring-third/10 transition-colors duration-200 hover:bg-third hover:text-white";

  const thumbBase =
    "h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-white transition-all duration-200 md:h-[72px] md:w-[72px]";
  const thumbActive = "ring-2 ring-third";
  const thumbIdle = "opacity-60 ring-1 ring-third/10 hover:opacity-100";

  const dashed = "border-t border-dashed border-third/25";

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <>
      {toast.show && (
        <div
          ref={toastRef}
          className="fixed right-4 top-20 z-[80] flex max-w-sm items-center gap-3 rounded-sm bg-third px-4 py-3 text-white shadow-xl will-change-transform"
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

      <div
        onClick={() => setDrawer(null)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
  aria-hidden={!drawerOpen}
  className={`fixed inset-y-0 right-0 z-[65] flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
    drawerOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="flex items-stretch justify-between border-b border-dashed border-third/25 pl-2 pr-4 md:pl-3 md:pr-5">
    <div className="flex">
      {(
        [
          { key: "features", label: "Fitur", Icon: ListChecks },
          { key: "specifications", label: "Spesifikasi", Icon: FileText },
        ] as { key: DrawerType; label: string; Icon: typeof ListChecks }[]
      ).map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => setDrawerType(key)}
          className={`relative flex items-center gap-2 px-4 py-4 text-[12px] font-bold uppercase tracking-wider transition-colors duration-150 md:text-[13px] ${
            drawerType === key ? "text-third" : "text-third/40 hover:text-third/70"
          }`}
        >
          <Icon size={15} />
          {label}
          <span
            className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-second transition-transform duration-300 ${
              drawerType === key ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </button>
      ))}
    </div>
    <button
      onClick={() => setDrawer(null)}
      aria-label="Tutup"
      className="my-2.5 flex h-9 w-9 items-center justify-center rounded-sm text-third ring-1 ring-third/15 transition-colors hover:bg-third hover:text-white"
    >
      <X size={16} />
    </button>
  </div>

  <div key={drawerType} className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
    {drawerType === "features" && (
      <ul className="flex list-none flex-col">
        {product.fitur && product.fitur.length > 0 ? (
          product.fitur.map((f: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-3 border-b border-dashed border-third/20 py-3 text-[13px] leading-relaxed text-third/80 last:border-b-0"
            >
              <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 bg-second" />
              {f}
            </li>
          ))
        ) : (
          <p className="text-sm italic text-third/40">Tidak ada informasi fitur.</p>
        )}
      </ul>
    )}

    {drawerType === "specifications" && (
      <div className="flex flex-col gap-7">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-third/45">
            Informasi Produk
          </p>
          <div className="flex flex-col">
            {metaItems.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between gap-4 border-b border-dashed border-third/20 py-2.5 last:border-b-0"
              >
                <span className="text-[12px] text-third/55">{m.label}</span>
                <span className="text-right text-[13px] font-semibold text-third">
                  {m.value || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-third/45">
            Spesifikasi
          </p>
          {product.spesifikasi && product.spesifikasi.length > 0 ? (
            <ul className="flex list-none flex-col">
              {product.spesifikasi.map((s: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b border-dashed border-third/20 py-2.5 text-[13px] leading-relaxed text-third/80 last:border-b-0"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 bg-second" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-third/40">Tidak ada informasi spesifikasi.</p>
          )}
        </div>
      </div>
    )}
  </div>
</aside>

      <div className="min-h-screen bg-bg-site font-sans">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-8 md:px-14 md:pb-24">
          <nav
            className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 pt-5 text-[11px] text-third/50 md:pt-8 md:text-[12px]"
            style={{ scrollbarWidth: "none" }}
          >
            <Link href="/" className="flex-shrink-0 transition-colors hover:text-third">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link
              href={`/kategori/${product.kategoriId}`}
              className="flex-shrink-0 transition-colors hover:text-third"
            >
              {product.kategoriId}
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link
              href={`/brand/${product.brandId}`}
              className="flex-shrink-0 transition-colors hover:text-third"
            >
              {product.brandId}
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="truncate font-semibold text-third">{product.name}</span>
          </nav>

          <div className="mt-5 grid items-start gap-8 md:mt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
            <div className="flex flex-col gap-3 lg:sticky lg:top-24">
              <div className="flex gap-3">
                <div
                  className="relative min-w-0 flex-1 cursor-zoom-in overflow-hidden rounded-sm bg-white ring-1 ring-third/5"
                  onClick={() => {
                    if (isVideo) {
                      if (!videoPlaying) setVideoPlaying(true);
                    } else {
                      setFsOpen(true);
                    }
                  }}
                >
                  <div ref={imgWrapRef} className="aspect-square w-full p-4 md:p-8">
                    {isVideo ? (
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
                            src={getYoutubeThumbnail(videoId as string)}
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
                        width="400"
                        height="400"
                        alt={product.name}
                        productRef={mainImgRef}
                      />
                    )}
                  </div>

                  <button
                    onClick={stop(handleShare)}
                    aria-label="Bagikan produk"
                    className={`${sideBtn} absolute right-2 top-2 h-9 w-9 md:hidden`}
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    onClick={stop(() => stepImg(-1))}
                    aria-label="Gambar sebelumnya"
                    className={`${sideBtn} absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 md:hidden`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={stop(() => stepImg(1))}
                    aria-label="Gambar selanjutnya"
                    className={`${sideBtn} absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 md:hidden`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="hidden flex-col justify-between md:flex">
                  <div className="flex flex-col gap-3">
                    <button onClick={handleShare} aria-label="Bagikan produk" className={sideBtn}>
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => setFsOpen(true)}
                      aria-label="Perbesar gambar"
                      className={sideBtn}
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => stepImg(-1)}
                      aria-label="Gambar sebelumnya"
                      className={sideBtn}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => stepImg(1)}
                      aria-label="Gambar selanjutnya"
                      className={sideBtn}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
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
                      !isVideo && !activeImgSrc && i === activeImg ? thumbActive : thumbIdle
                    }`}
                  >
                    <Image
                      width={200}
                      height={200}
                      loading="lazy"
                      sizes="80px"
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${src}`}
                      alt={`${src}`}
                      className="h-full w-full object-contain p-1.5"
                    />
                  </button>
                ))}

                {videoId && (
                  <button
                    onClick={openVideo}
                    className={`${thumbBase} relative ${isVideo ? thumbActive : thumbIdle}`}
                  >
                    <img
                      src={getYoutubeThumbnail(videoId)}
                      alt="Video produk"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-third/85">
                        <Play className="ml-0.5 h-3 w-3 text-second" fill="#f9ad52" />
                      </div>
                    </div>
                  </button>
                )}

                {variants
                  .flatMap((v) => v.options)
                  .filter((o) => o.image)
                  .map((option) => {
                    const isActiveVariantImg = !isVideo && activeImgSrc === option.image;
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
                          sizes="80px"
                          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${option.image}`}
                          alt={option.name}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:pt-1">
              <div>
                <Link
                  href={`/brand/${product.brandId}`}
                  className="text-[12px] font-medium text-third/55 transition-colors hover:text-third md:text-[13px]"
                >
                  {product.brandId}
                </Link>
                <h1 className="mt-1.5 font-poppins text-[clamp(20px,2.2vw,30px)] font-black uppercase leading-tight text-third">
                    {product.name}
                </h1>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {strikePrice && (
                      <span className="text-[14px] font-semibold text-red-500 line-through md:text-[15px]">
                        {formatPrice(strikePrice)}
                      </span>
                    )}
                    {mainPriceText && (
                      <span className="text-[26px] font-black leading-none text-third md:text-[30px]">
                        {mainPriceText}
                      </span>
                    )}
                    {discount && (
                      <span className="self-center rounded-sm border border-amber-600 bg-amber-100 px-1.5 py-[3px] text-[11px] font-bold leading-none text-third">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-third/55">
                    <Eye className="h-4 w-4" />
                    <span className="font-semibold text-third">{product.views_count ?? 0}</span>
                    <span>dilihat</span>
                  </div>
                </div>

                {waUrl && (
                  <Link
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    suppressHydrationWarning
                    className="text-[12px] text-third/60"
                  >
                    Special Price: <span className="font-bold text-red-500">Rp.XXXXXXX</span>{" "}
                    <span className="underline underline-offset-2 transition-colors hover:text-third">
                      Tanya via WhatsApp
                    </span>
                  </Link>
                )}
              </div>

              <div className={dashed} />

              {product.description && (
                <div>
                  <h2 className="text-[15px] font-bold text-third">Deskripsi:</h2>
                  <p
                    className={`mt-2 whitespace-pre-line text-[13px] leading-relaxed text-third/70 ${
                      descOpen ? "" : "line-clamp-4"
                    }`}
                  >
                    {product.description}
                  </p>
                  {longDesc && (
                    <button
                      onClick={() => setDescOpen((o) => !o)}
                      className="mt-1.5 text-[13px] font-bold text-third underline-offset-2 hover:underline"
                    >
                      {descOpen ? "Tutup" : "Lihat Selengkapnya"}
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => openDrawer("features")}
                  className="flex items-center justify-between gap-3 rounded-sm border border-third/20 bg-white px-4 py-3 text-[13px] font-bold text-third transition-colors duration-200 hover:border-third hover:bg-third hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <ListChecks size={17} />
                    Fitur Produk
                  </span>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => openDrawer("specifications")}
                  className="flex items-center justify-between gap-3 rounded-sm border border-third/20 bg-white px-4 py-3 text-[13px] font-bold text-third transition-colors duration-200 hover:border-third hover:bg-third hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText size={17} />
                    Spesifikasi
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {variants.length > 0 && (
                <div className="flex flex-col gap-5">
                  {variants.map((variant) => (
                    <div key={variant.id}>
                      <p className="mb-3 text-[14px] text-third/55">
                        {variant.type}:{" "}
                        {selectedOptions[variant.id] && (
                          <span className="font-bold text-third">
                            {selectedOptions[variant.id].name}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {variant.options.map((option) => {
                          const isSelected = selectedOptions[variant.id]?.id === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleOption(variant.id, option)}
                              className={`min-w-[56px] rounded-sm border px-4 py-2.5 text-[13px] font-bold leading-none transition-colors duration-200 ${
                                isSelected
                                  ? "border-third bg-third/10 text-third"
                                  : "border-third/15 bg-white text-third/70 hover:border-third/40"
                              }`}
                            >
                              {option.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {!allVariantsSelected && (
                    <p className="text-[12px] italic text-third/50">
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

              <div className="flex flex-col gap-3">
                <div className="flex items-stretch gap-3">
                  <div className="flex items-center overflow-hidden rounded-sm border border-third/20 bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Kurangi jumlah"
                      className="flex h-12 w-9 items-center justify-center text-third transition-colors hover:bg-third/5"
                    >
                      <ChevronDown size={16} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-[15px] font-bold text-third">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Tambah jumlah"
                      className="flex h-12 w-9 items-center justify-center text-third transition-colors hover:bg-third/5"
                    >
                      <ChevronUp size={16} strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    disabled={!allVariantsSelected}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-third px-4 text-[14px] font-bold text-white transition-all duration-200 hover:bg-second hover:text-third active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-third/40 disabled:hover:bg-slate-200 disabled:hover:text-third/40"
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
                    <ShoppingCart strokeWidth={2.5} className="h-[18px] w-[18px]" />
                    <span>{product.stock < 0 ? "Pre-Order" : "Tambah ke Keranjang"}</span>
                  </button>
                </div>

                <div className="flex items-stretch gap-3">
  {waUrl && (
    <Link
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-sm border border-third bg-transparent px-4 text-[14px] font-bold text-third transition-colors duration-200 hover:bg-third hover:text-white"
    >
      <FaWhatsapp size={20} className="flex-shrink-0" />
      Tanya Stok via WhatsApp
    </Link>
  )}
  <Link
    href={`${product.tautan || "https://www.tokopedia.com/bandarmusikjakarta"}`}
    target="_blank"
    suppressHydrationWarning
    aria-label="Beli di Tokopedia"
    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm border border-third/20 bg-white transition-colors duration-200 hover:border-third"
  >
    <Image
      src={"/tokped.webp"}
      alt="Tokopedia - Bandar Musik Jakarta"
      width={26}
      height={26}
    />
  </Link>
</div>

<div
  role="alert"
  className="flex items-start gap-2.5 rounded-sm border border-amber-500/50 bg-amber-50 px-3.5 py-3 text-amber-900"
>
  <TriangleAlert size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
  <p className="text-[12px] font-semibold leading-snug md:text-[13px]">
    Harap Tanya Ketersediaan Barang Melalui Whatsapp Sebelum Melakukan Pemesanan.
  </p>
</div>
              </div>

              <div className={`${dashed} pt-5`}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
                  {trustItems.map(({ Icon, title, sub }, i) => (
                    <div
                      key={title}
                      className={`flex items-start gap-2.5 sm:px-4 ${
                        i === 0 ? "sm:pl-0" : "sm:border-l sm:border-dashed sm:border-third/25"
                      }`}
                    >
                      <Icon size={22} strokeWidth={1.75} className="mt-0.5 flex-shrink-0 text-third" />
                      <div>
                        <p className="text-[12px] font-bold leading-tight text-third md:text-[13px]">
                          {title}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-third/60 md:text-[12px]">
                          {sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-12 pt-10 md:mt-16 md:pt-14 ${dashed}`}>
            <ProductFaq />
          </div>

          {related && related.length > 0 && (
            <div className={`mt-12 pt-10 md:mt-16 md:pt-14 ${dashed}`}>
              <RelatedProducts related={related} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}