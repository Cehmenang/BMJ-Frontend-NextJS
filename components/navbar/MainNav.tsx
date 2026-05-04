"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { liveSearching } from "@/action/search";
import CartSidebar from "./CartSideBar";
import { useRouter } from "next/navigation";
import { logOut } from "@/action/user";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Promo", href: "/promo" },
  { label: "Kategori", href: "/kategori" },
  { label: "Brand", href: "/brand" },
  { label: "Produk", href: "/produk" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
];

const STATIC_TABS = [
  {
    key: "kategori",
    label: "Kategori",
    items: [
      { label: "Gitar & Bass", href: "/kategori/gitar-bass" },
      { label: "Drum & Perkusi", href: "/kategori/drum" },
      { label: "Keyboard & Piano", href: "/kategori/keyboard" },
      { label: "Brass & Woodwind", href: "/kategori/brass" },
      { label: "Studio & Recording", href: "/kategori/studio" },
      { label: "Aksesori", href: "/kategori/aksesori" },
    ],
  },
  {
    key: "brand",
    label: "Brand",
    items: [
      { label: "Fender", href: "/brand/fender" },
      { label: "Gibson", href: "/brand/gibson" },
      { label: "Yamaha", href: "/brand/yamaha" },
      { label: "Roland", href: "/brand/roland" },
      { label: "Pearl", href: "/brand/pearl" },
      { label: "Kawai", href: "/brand/kawai" },
      { label: "Taylor", href: "/brand/taylor" },
      { label: "Zildjian", href: "/brand/zildjian" },
      { label: "Tama", href: "/brand/tama" },
      { label: "Donner", href: "/brand/donner" },
    ],
  },
];

type NavState = "at-top" | "scrolled";

type SearchResult = {
  products: { id: number; name: string; url: string; images: string[]; price: number }[];
  brands: { id: number; name: string; image: string }[];
  categories: { id: number; title: string; }[];
} | null;

export default function MainNav({ token }: { token: string | null }) {
  const [navState, setNavState] = useState<NavState>("at-top");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("kategori");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResult(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const debounce = setTimeout(async () => {
      try {
        const response = await liveSearching(searchQuery) as any
        setSearchResult(response);
      } catch (e) {
        setSearchResult(null);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const onScroll = () => setNavState(window.scrollY < 10 ? "at-top" : "scrolled");
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
    else { setSearchQuery(""); setSearchResult(null); }
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    if (searchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, searchOpen]);

  const atTop = navState === "at-top";
  const hasQuery = searchQuery.trim() !== "";
  const activeTabData = STATIC_TABS.find((t) => t.key === activeTab)!;
  const totalResults = searchResult
    ? (searchResult.products?.length ?? 0) + (searchResult.brands?.length ?? 0) + (searchResult.categories?.length ?? 0)
    : 0;

  const navBg = atTop
    ? "bg-primary border-b border-third/10 shadow-sm"
    : "bg-third/55 backdrop-blur-xl border-b border-second/15 shadow-lg";
  const linkColor = atTop
    ? "text-third/75 hover:text-third hover:bg-third/6"
    : "text-primary/78 hover:text-primary hover:bg-white/8";
  const activeLinkColor = atTop ? "text-third-light font-medium" : "text-second font-medium";
  const iconBtnBase = atTop
    ? "bg-third/7 border-third/15 text-third hover:bg-third/12 hover:border-third/25"
    : "bg-white/7 border-white/13 text-primary hover:bg-second/12 hover:border-second/35";

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${navBg}`}>
        <div className="flex items-center justify-between px-4 md:px-14 h-[60px] md:h-[66px]">

          {/* Logo */}
          <Link href="/" className="flex gap-x-1.5 md:gap-x-2 cursor-pointer items-center">
            <img src="/bmjletter.webp" width={70} className="p-1.5 md:p-2 md:w-[90px]" />
            <img src="/BMJLogo.webp" width={110} className="md:w-[136px]" />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5 list-none">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block text-[11px] md:text-[16px] font-poppins px-[11px] py-1.5 rounded-md tracking-[0.02em] transition-colors duration-200 whitespace-nowrap ${
                    item.href === "/" ? activeLinkColor : linkColor
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-2.5 flex-shrink-0">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className={`w-[36px] h-[36px] md:w-[38px] md:h-[38px] rounded-lg flex items-center justify-center border transition-colors duration-200 flex-shrink-0 ${iconBtnBase} ${searchOpen ? "bg-second/20 border-second/40" : ""}`}
              title="Cari"
            >
              <svg className="w-[16px] h-[16px] md:w-[17px] md:h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className="relative">
              <button className={`w-[36px] h-[36px] md:w-[38px] md:h-[38px] rounded-lg flex items-center justify-center border transition-colors duration-200 ${iconBtnBase}`} title="Keranjang" onClick={() => setCartOpen(true)}>
                <svg className="w-[16px] h-[16px] md:w-[17px] md:h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px] bg-second text-third text-[9px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              {!token ? (
                <button
                  onClick={() => router.push('/login')}
                  className="font-poppins text-[12.5px] font-medium px-[18px] py-2 rounded-lg bg-second text-third border-none cursor-pointer tracking-[0.02em] whitespace-nowrap transition-all duration-200 hover:bg-[#fbbe74] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(249,173,82,0.4)]"
                >
                  Masuk
                </button>
              ) : (
                <>
                  <div className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border cursor-pointer transition-colors duration-200 ${atTop ? "bg-third/7 border-third/15 hover:bg-third/12" : "bg-white/7 border-white/13 hover:bg-white/12"}`}>
                    <div className="w-7 h-7 rounded-full bg-second text-third text-[10px] font-bold flex items-center justify-center">AR</div>
                    <span className={`text-[12px] font-medium ${atTop ? "text-third" : "text-primary"}`}>Andi</span>
                  </div>
                  <button
                    onClick={async() =>{ 
                      const result = await logOut()
                      console.log(result)
                    }}
                    className={`font-poppins text-[12.5px] font-medium px-[18px] py-2 rounded-lg cursor-pointer tracking-[0.02em] whitespace-nowrap transition-all duration-200 bg-transparent border ${atTop ? "text-third/75 border-third/25 hover:text-third hover:bg-third/6" : "text-primary/80 border-primary/22 hover:text-primary hover:border-primary/50 hover:bg-white/6"}`}
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className={`md:hidden w-[36px] h-[36px] rounded-lg flex items-center justify-center border transition-colors duration-200 ${iconBtnBase}`}
              title="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      </nav>

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Mobile drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] z-50 md:hidden bg-primary flex flex-col transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-third/10 flex-shrink-0">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5">
            <img src="/bmjletter.webp" width={60} className="p-1" />
            <img src="/BMJLogo.webp" width={100} />
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg bg-third/7 border border-third/15 flex items-center justify-center text-third">
            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-[13.5px] font-poppins transition-colors duration-150 ${item.href === "/" ? "text-second font-medium" : "text-third/80 hover:text-third hover:bg-third/6"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="px-4 py-5 border-t border-third/10 flex-shrink-0">
          {!token ? (
            <button
              onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-lg bg-second text-third text-[13px] font-poppins font-medium tracking-[0.02em] transition-all duration-200 hover:bg-[#fbbe74]"
            >
              Masuk
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-second text-third text-[11px] font-bold flex items-center justify-center">AR</div>
                <div>
                  <p className="text-[13px] font-medium text-third font-poppins">Andi</p>
                  <p className="text-[11px] text-third/50">Member</p>
                </div>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setMobileMenuOpen(false); }} className="text-[12px] text-third/60 hover:text-third border border-third/20 px-3 py-1.5 rounded-lg transition-colors">
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search backdrop */}
      <div className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

      {/* Search panel */}
      <div
        ref={overlayRef}
        className={`fixed top-[60px] md:top-[66px] left-0 w-full z-40 transition-all duration-300 ${searchOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="bg-white border-b border-gray-100 shadow-2xl">

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 md:px-14 py-3.5 md:py-4 border-b border-gray-100">
            {isSearching ? (
              <svg className="w-[17px] h-[17px] text-second flex-shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg className="w-[17px] h-[17px] text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk, brand, kategori…"
              className="flex-1 text-[14px] font-poppins text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
            />
            {hasQuery && !isSearching && searchResult && (
              <span className="hidden md:block text-[11px] font-poppins text-gray-400 flex-shrink-0">
                {totalResults} hasil
              </span>
            )}
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 ml-1"
            >
              <svg className="w-[15px] h-[15px] text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── MOBILE layout ── */}
          <div className="flex md:hidden flex-col max-h-[75vh] overflow-y-auto">

            {/* Kosong: static tabs */}
            {!hasQuery && (
              <>
                <div className="flex gap-2 px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                  {STATIC_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-poppins font-medium transition-colors duration-150 border ${activeTab === tab.key ? "bg-second text-third border-second" : "text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="px-4 py-3 grid grid-cols-2 gap-1">
                  {activeTabData.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-poppins text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-second/60 group-hover:bg-second flex-shrink-0 transition-colors" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Loading */}
            {hasQuery && isSearching && (
              <div className="px-4 py-4 space-y-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-9 bg-gray-100 rounded-lg" />
                ))}
              </div>
            )}

            {/* Hasil — mobile: stacked tapi compact */}
            {hasQuery && !isSearching && searchResult && (
              <div className="px-4 py-3">
                {totalResults === 0 ? (
                  <div className="flex flex-col items-center py-8 text-gray-400">
                    <svg className="w-8 h-8 mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p className="text-[13px] font-poppins text-center">
                      Tidak ada hasil untuk "<span className="text-gray-600">{searchQuery}</span>"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {/* Products */}
                    {searchResult.products?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-poppins font-semibold tracking-[0.15em] uppercase text-gray-400 mb-2 px-1">
                          Produk · {searchResult.products.length}
                        </p>
                        <div className="space-y-0.5">
                          {searchResult.products.slice(0, 4).map((product) => {
                            return (
                            <Link
                              key={product.id}
                              href={`/produk/${product.url}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                <Image
                                  width={200} height={200}
                                 src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[13px] font-poppins text-gray-700 group-hover:text-gray-900 truncate flex-1">{product.name}</span>
                              <svg className="w-3 h-3 text-gray-300 group-hover:text-second flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                              </svg>
                            </Link>
                          )})}
                        </div>
                      </div>
                    )}

                    {/* Brands — logo image grid */}
                    {searchResult.brands?.length > 0 && (
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] font-poppins font-semibold tracking-[0.15em] uppercase text-gray-400 mb-2 px-1">
                          Brand · {searchResult.brands.length}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {searchResult.brands.slice(0, 5).map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/brand/${brand.name}`}
                              onClick={() => setSearchOpen(false)}
                              className="w-14 h-10 rounded-lg border border-gray-100 bg-white hover:border-second/40 transition-colors flex items-center justify-center p-1.5 group"
                              title={brand.name}
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
                                alt={brand.name}
                                className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    {searchResult.categories?.length > 0 && (
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] font-poppins font-semibold tracking-[0.15em] uppercase text-gray-400 mb-2 px-1">
                          Kategori · {searchResult.categories.length}
                        </p>
                        <div className="flex gap-1.5 flex-wrap">
                          {searchResult.categories.slice(0, 5).map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/kategori/${cat.title}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-poppins bg-gray-50 text-gray-600 hover:bg-second/10 hover:text-third border border-gray-100 hover:border-second/30 transition-colors"
                            >
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── DESKTOP layout ── */}
          <div className="hidden md:block">

            {/* Kosong: static sidebar */}
            {!hasQuery && (
              <div className="flex px-14 py-5 gap-8 max-h-[420px]">
                <div className="flex flex-col gap-1 w-36 flex-shrink-0">
                  {STATIC_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2.5 text-[13px] font-poppins px-3 py-2 rounded-lg text-left transition-colors duration-150 ${activeTab === tab.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                    >
                      {tab.key === "kategori" ? (
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
                        </svg>
                      )}
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="w-px bg-gray-100 flex-shrink-0" />
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-1">
                    {activeTabData.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-poppins text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-second/60 group-hover:bg-second flex-shrink-0 transition-colors" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading */}
            {hasQuery && isSearching && (
              <div className="px-14 py-5 animate-pulse">
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, col) => (
                    <div key={col} className="space-y-2">
                      <div className="h-3 w-20 bg-gray-100 rounded-full" />
                      {[...Array(4)].map((_, row) => (
                        <div key={row} className="h-8 bg-gray-100 rounded-lg" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hasil — desktop: 3 kolom sejajar */}
            {hasQuery && !isSearching && searchResult && (
              <div className="px-14 py-5">
                {totalResults === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <svg className="w-8 h-8 mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p className="text-[13px] font-poppins">
                      Tidak ada hasil untuk "<span className="text-gray-600">{searchQuery}</span>"
                    </p>
                  </div>
                ) : (
                  // 3 kolom sejajar: Products | Brands | Categories
                  <div className="grid grid-cols-3 gap-6 max-h-[360px]">

                    {/* Kolom 1: Products */}
                    <div className="min-w-0">
                      <p className="text-[10px] font-poppins font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">
                        Produk · {searchResult.products?.length ?? 0}
                      </p>
                      {searchResult.products?.length > 0 ? (
                        <div className="space-y-0.5 overflow-y-auto max-h-[300px]">
                          {searchResult.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/produk/${product.url}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                <Image width={200} height={200} src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[12.5px] font-poppins text-gray-700 group-hover:text-gray-900 truncate flex-1 leading-snug">{product.name}</span>
                              <svg className="w-3 h-3 text-gray-300 group-hover:text-second flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] font-poppins text-gray-300 px-2">Tidak ada produk</p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="absolute" />

                    {/* Kolom 2: Brands — logo image */}
                    <div className="min-w-0 border-x border-gray-100 px-6">
                      <p className="text-[10px] font-poppins font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">
                        Brand · {searchResult.brands?.length ?? 0}
                      </p>
                      {searchResult.brands?.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px]">
                          {searchResult.brands.map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/brand/${brand.name}`}
                              onClick={() => setSearchOpen(false)}
                              className="aspect-square rounded-xl border border-gray-100 bg-white hover:border-second/40 hover:shadow-sm transition-all flex items-center justify-center p-2 group"
                              title={brand.name}
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
                                alt={brand.name}
                                className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200"
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] font-poppins text-gray-300">Tidak ada brand</p>
                      )}
                    </div>

                    {/* Kolom 3: Categories */}
                    <div className="min-w-0">
                      <p className="text-[10px] font-poppins font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">
                        Kategori · {searchResult.categories?.length ?? 0}
                      </p>
                      {searchResult.categories?.length > 0 ? (
                        <div className="space-y-0.5 overflow-y-auto max-h-[300px]">
                          {searchResult.categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/kategori/${cat.title}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12.5px] font-poppins text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors group"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-second/60 group-hover:bg-second flex-shrink-0 transition-colors" />
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] font-poppins text-gray-300 px-3">Tidak ada kategori</p>
                      )}
                    </div>

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