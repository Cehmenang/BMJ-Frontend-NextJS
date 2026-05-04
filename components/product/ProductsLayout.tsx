"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Navigation, ShoppingCart, InfoIcon,
  Search, SlidersHorizontal, X, ChevronDown
} from "lucide-react";
import { IProduct } from "@/interface";
import ProductCard from "./ProductCard";
import Pagination from "./ProductsPagination";

const SORT_OPTIONS = [
  { label: "Terbaru", value: "latest" },
  { label: "Harga Terendah", value: "price_asc" },
  { label: "Harga Tertinggi", value: "price_desc" },
  { label: "Nama A–Z", value: "name_asc" },
];

const CATEGORIES = ["Semua", "Gitar & Bass", "Drum", "Keyboard", "Studio", "Aksesori"];
const BRANDS = ["Semua", "Fender", "Gibson", "Yamaha", "Roland", "Pearl", "Kawai", "Taylor"];

type Props = {
  products: IProduct[];
  totalPages: number;
  totalProducts: number;
  currentPage: number;
  initialSort: string;
  initialKategori: string;
  initialBrand: string;
  initialQuery: string;
  initialStock: boolean;
  hideBrandFilter?: boolean;
};

export default function ProductsLayout({
  products,
  totalPages,
  totalProducts,
  currentPage,
  initialSort,
  initialKategori,
  initialBrand,
  initialQuery,
  initialStock,
  hideBrandFilter = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState(SORT_OPTIONS.find(o => o.value === initialSort) ?? SORT_OPTIONS[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialKategori || "Semua");
  const [activeBrand, setActiveBrand] = useState(initialBrand || "Semua");
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(initialStock);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    console.log(products, 'barang')
  }, [])

  useEffect(() => {
    setSort(SORT_OPTIONS.find(o => o.value === (searchParams.get("sort") || "latest")) ?? SORT_OPTIONS[0]);
    setActiveCategory(searchParams.get("kategori") || "Semua");
    setActiveBrand(searchParams.get("brand") || "Semua");
    setSearchInput(searchParams.get("q") || "");
    setOnlyInStock(searchParams.get("stock") === "1");
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  // ── semua navigasi URL lewat sini, selalu pakai startTransition ──
  const updateURL = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, val]) => {
      if (val) current.set(key, val);
      else current.delete(key);
    });
    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`);
      router.refresh();
    });
  };

  // ← fix utama: handlePageChange sekarang pakai updateURL → startTransition
  const handlePageChange = (newPage: number) => {
    updateURL({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchInput, 'HASIL PENCARIAN')
    updateURL({ q: searchInput, page: "1" });
  };

  const handleSortChange = (opt: typeof SORT_OPTIONS[0]) => {
    setSort(opt);
    setSortOpen(false);
    updateURL({ sort: opt.value, page: "1" });
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
    updateURL({
      kategori: activeCategory === "Semua" ? "" : activeCategory,
      brand: activeBrand === "Semua" ? "" : activeBrand,
      stock: onlyInStock ? "1" : "",
      page: "1",
    });
  };

  const handleFilterReset = () => {
    setActiveCategory("Semua");
    setActiveBrand("Semua");
    setOnlyInStock(false);
    updateURL({ kategori: "", brand: "", stock: "", page: "1" });
  };

  const activeFiltersCount = [
    activeCategory !== "Semua",
    activeBrand !== "Semua",
    onlyInStock,
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <div>
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-third/8">
          <span className="font-poppins text-[11px] text-third/40">{activeFiltersCount} filter aktif</span>
          <button onClick={handleFilterReset} className="font-poppins text-[11px] text-second hover:text-third transition-colors">
            Reset semua
          </button>
        </div>
      )}

      {/* Availability */}
      <div className="border-b border-third/8">
        <button
          onClick={() => setAvailabilityOpen(v => !v)}
          className="w-full flex items-center justify-between py-3 font-poppins text-[11px] font-semibold tracking-[0.1em] uppercase text-third/55 hover:text-third transition-colors"
        >
          Ketersediaan
          <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${availabilityOpen ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-200 ${availabilityOpen ? "max-h-20 pb-3" : "max-h-0"}`}>
          <label className="flex items-center gap-2.5 cursor-pointer group w-full">
            <div
              onClick={() => setOnlyInStock(v => !v)}
              className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
                onlyInStock ? "bg-third border-third" : "border-third/20 group-hover:border-third/40"
              }`}
            >
              {onlyInStock && (
                <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="font-poppins text-[12px] text-third/60 group-hover:text-third transition-colors">
              Stok tersedia
            </span>
          </label>
        </div>
      </div>

      {/* Category */}
      <div className="border-b border-third/8">
        <button
          onClick={() => setCategoryOpen(v => !v)}
          className="w-full flex items-center justify-between py-3 font-poppins text-[11px] font-semibold tracking-[0.1em] uppercase text-third/55 hover:text-third transition-colors"
        >
          Kategori
          <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-200 ${categoryOpen ? "max-h-72 pb-3" : "max-h-0"}`}>
          <div className="space-y-0.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left font-poppins text-[12px] px-2 py-1.5 rounded-lg transition-colors ${
                  activeCategory === cat
                    ? "text-third font-semibold bg-third/6"
                    : "text-third/50 hover:text-third hover:bg-third/4"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand — hanya tampil kalau hideBrandFilter = false */}
      {!hideBrandFilter && (
        <div className="border-b border-third/8">
          <button
            onClick={() => setBrandOpen(v => !v)}
            className="w-full flex items-center justify-between py-3 font-poppins text-[11px] font-semibold tracking-[0.1em] uppercase text-third/55 hover:text-third transition-colors"
          >
            Brand
            <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${brandOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-200 ${brandOpen ? "max-h-96 pb-3" : "max-h-0"}`}>
            <div className="space-y-0.5">
              {BRANDS.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`w-full text-left font-poppins text-[12px] px-2 py-1.5 rounded-lg transition-colors ${
                    activeBrand === brand
                      ? "text-third font-semibold bg-third/6"
                      : "text-third/50 hover:text-third hover:bg-third/4"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-site pt-[60px] md:pt-[66px]">

      {/* Top bar */}
      <div className="sticky top-[60px] md:top-[66px] z-30 bg-bg-site/90 backdrop-blur-md border-b border-third/8">
        <div className="max-w-7xl mx-auto px-6 md:px-24 h-[50px] flex items-center gap-5">

          {/* Grid toggle */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setGridCols(2)}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${gridCols === 2 ? "bg-third text-primary" : "text-third/35 hover:text-third"}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${gridCols === 3 ? "bg-third text-primary" : "text-third/35 hover:text-third"}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="6" height="6" rx="0.5" /><rect x="9" y="2" width="6" height="6" rx="0.5" /><rect x="16" y="2" width="6" height="6" rx="0.5" />
                <rect x="2" y="9" width="6" height="6" rx="0.5" /><rect x="9" y="9" width="6" height="6" rx="0.5" /><rect x="16" y="9" width="6" height="6" rx="0.5" />
                <rect x="2" y="16" width="6" height="6" rx="0.5" /><rect x="9" y="16" width="6" height="6" rx="0.5" /><rect x="16" y="16" width="6" height="6" rx="0.5" />
              </svg>
            </button>
          </div>

          <div className="w-px h-4 bg-third/10 flex-shrink-0" />

          {/* Mobile filter */}
          <button
            onClick={() => setFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 font-poppins text-[12px] text-third/55 hover:text-third transition-colors flex-shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-second text-third text-[9px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Product count + spinner */}
          <p className="flex-1 text-center font-poppins text-[11.5px] text-third/35 flex items-center justify-center gap-2">
            {isPending && (
              <svg className="w-3 h-3 animate-spin text-second flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {totalProducts} produk
            {searchParams.get("q") && (
              <> · "<span className="text-third/55">{searchParams.get("q")}</span>"</>
            )}
          </p>

          {/* Search desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari produk…"
                className="font-poppins text-[11.5px] text-third placeholder:text-third/25 bg-white border border-third/10 rounded-lg px-3 py-1.5 pr-7 outline-none focus:border-third/25 transition-colors w-40"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); updateURL({ q: "", page: "1" }); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-third/25 hover:text-third/50"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="h-[28px] px-3 rounded-lg bg-third text-primary font-poppins text-[11px] font-medium flex items-center gap-1 hover:bg-third-dark transition-colors flex-shrink-0"
            >
              <Search className="w-3 h-3" />
              Cari
            </button>
          </form>

          <div className="w-px h-4 bg-third/10 flex-shrink-0 hidden md:block" />

          {/* Sort */}
          <div ref={sortRef} className="relative flex-shrink-0">
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-1.5 font-poppins text-[11.5px] text-third/50 hover:text-third transition-colors"
            >
              <span className="hidden sm:inline tracking-[0.06em] uppercase text-[10px]">Urutkan</span>
              <span className="font-medium text-third text-[11.5px]">{sort.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-40 bg-white rounded-xl border border-third/10 shadow-xl py-1.5 z-50">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortChange(opt)}
                    className={`w-full text-left px-4 py-2 font-poppins text-[12px] transition-colors ${
                      sort.value === opt.value
                        ? "text-third font-semibold bg-third/5"
                        : "text-third/55 hover:text-third hover:bg-third/4"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-24 py-8">

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="flex md:hidden gap-2 mb-5">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari produk…"
              className="w-full font-poppins text-[13px] text-third placeholder:text-third/30 bg-white border border-third/10 rounded-xl px-4 py-2.5 pr-8 outline-none focus:border-third/25 transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); updateURL({ q: "", page: "1" }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-third/30 hover:text-third/55"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 rounded-xl bg-third text-primary font-poppins text-[12px] font-medium flex items-center gap-1.5 hover:bg-third-dark transition-colors flex-shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            Cari
          </button>
        </form>

        <div className="flex gap-10">

          {/* Sidebar desktop */}
          <div className="hidden md:block w-52 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0 relative">

            {/* Skeleton overlay */}
            {isPending && (
              <div className="absolute inset-0 z-10">
                <div className={`grid gap-5 ${gridCols === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                  {[...Array(products.length || 36)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2.5">
                      <div className="aspect-square rounded-xl bg-third/8 animate-pulse" />
                      <div className="space-y-2 px-0.5">
                        <div className="h-2.5 w-14 bg-third/8 rounded-full animate-pulse" />
                        <div className="h-3 w-full bg-third/8 rounded-full animate-pulse" />
                        <div className="h-3 w-3/4 bg-third/8 rounded-full animate-pulse" />
                        <div className="flex justify-between items-center mt-1">
                          <div className="h-4 w-20 bg-third/8 rounded-full animate-pulse" />
                          <div className="h-6 w-12 bg-third/8 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products — dim saat pending */}
            <div className={`transition-opacity duration-200 ${isPending ? "opacity-25 pointer-events-none" : "opacity-100"}`}>
              <div className={`grid gap-x-2 gap-y-8 md:gap-5 ${gridCols === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isPending={isPending}
            />

            <p className="text-center font-poppins text-[11px] text-third/25 mt-3">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
        <div className={`absolute bottom-0 left-0 right-0 bg-bg-site rounded-t-2xl transition-transform duration-300 max-h-[85vh] flex flex-col ${filterOpen ? "translate-y-0" : "translate-y-full"}`}>
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-9 h-1 rounded-full bg-third/12" />
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-b border-third/8 flex-shrink-0">
            <div className="flex items-center gap-2">
              <p className="font-poppins text-[13px] font-semibold text-third">Filter</p>
              {activeFiltersCount > 0 && (
                <span className="font-poppins text-[9px] font-bold text-third bg-second px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button onClick={handleFilterReset} className="font-poppins text-[12px] text-second">Reset</button>
              )}
              <button onClick={() => setFilterOpen(false)} className="w-7 h-7 rounded-lg bg-third/7 flex items-center justify-center text-third/55">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-2">
            <FilterSidebar />
          </div>
          <div className="px-5 py-4 border-t border-third/8 flex-shrink-0">
            <button
              onClick={handleFilterApply}
              className="w-full py-3 rounded-xl bg-third text-primary font-poppins text-[13px] font-semibold hover:bg-third-dark transition-colors"
            >
              Tampilkan Hasil
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}