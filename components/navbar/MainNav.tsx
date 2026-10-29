"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { liveSearching } from "@/action/search";
import CartSidebar from "./CartSideBar";
import { useRouter } from "next/navigation";
import { logOut } from "@/action/user";
import Image from "next/image";
import LoginWindow from "./LoginWindow";

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
    title: "Kategori Teratas",
    items: [
      { label: "Gitar Elektrik", href: "/kategori/Gitar Elektrik" },
      { label: "Drum Elektrik", href: "/kategori/Drum Elektrik" },
      { label: "Keyboard", href: "/kategori/Keyboard" },
      { label: "Case and Bag", href: "/kategori/Case and Bag" },
      { label: "Sound System", href: "/kategori/Active Speaker" },
      { label: "Recording", href: "/kategori/Audio Interface" },
    ],
  },
  {
    key: "brand",
    label: "Brand",
    title: "Brand Populer",
    items: [
      { label: "Fender", href: "/brand/fender" },
      { label: "Gibson", href: "/brand/gibson" },
      { label: "Yamaha", href: "/brand/yamaha" },
      { label: "Roland", href: "/brand/roland" },
      { label: "Pearl", href: "/brand/pearl" },
      { label: "Akai", href: "/brand/akai" },
      { label: "Taylor", href: "/brand/taylor" },
      { label: "Zildjian", href: "/brand/zildjian" },
      { label: "Tama", href: "/brand/tama" },
      { label: "Donner", href: "/brand/donner" },
    ],
  },
];

const NO_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

type NavState = "at-top" | "scrolled";

type SearchResult = {
  products: { id: number; name: string; url: string; images: string[]; price: number }[];
  brands: { id: number; name: string; image: string }[];
  categories: { id: number; title: string }[];
} | null;

function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="mb-2 flex items-center justify-between border-b border-dashed border-third/25 pb-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-third/50">{children}</p>
      {typeof count === "number" && (
        <span className="text-[10px] font-bold tabular-nums text-third/40">{count}</span>
      )}
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 flex-shrink-0 transition-all duration-200 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StaticLinks({
  items,
  onPick,
  cols,
}: {
  items: { label: string; href: string }[];
  onPick: () => void;
  cols: string;
}) {
  return (
    <div className={`grid gap-x-6 ${cols}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onPick}
          className="group flex items-center justify-between border-b border-dashed border-third/20 py-2.5 text-[13px] font-poppins font-medium text-third/75 transition-colors duration-200 hover:text-third"
        >
          <span>{item.label}</span>
          <ArrowIcon className="-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:text-second group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}

export default function MainNav({
  token,
  username,
  wishlist,
}: {
  token: string | null;
  username?: string | null;
  wishlist: any | null;
}) {
  const [navState, setNavState] = useState<NavState>("at-top");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("kategori");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();
  const [needLogin, setNeedLogin] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResult(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const debounce = setTimeout(async () => {
      try {
        const response = (await liveSearching(searchQuery)) as any;
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
    else {
      setSearchQuery("");
      setSearchResult(null);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, searchOpen]);

  const atTop = navState === "at-top";
  const hasQuery = searchQuery.trim() !== "";
  const activeTabData = STATIC_TABS.find((t) => t.key === activeTab)!;
  const totalResults = searchResult
    ? (searchResult.products?.length ?? 0) +
      (searchResult.brands?.length ?? 0) +
      (searchResult.categories?.length ?? 0)
    : 0;

  const initials = (username ?? "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const handleLogout = async () => {
    await logOut();
    setMobileMenuOpen(false);
  };

  const closeSearch = () => setSearchOpen(false);

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
      {needLogin && <LoginWindow setNeedLogin={setNeedLogin} setCartOpen={setCartOpen} />}

      <nav className={`fixed left-0 top-0 z-50 w-full transition-all duration-400 ${navBg}`}>
        <div className="flex h-[60px] items-center justify-between px-4 md:h-[66px] md:px-14">
          <Link href="/" className="flex cursor-pointer items-center gap-x-1.5 md:gap-x-2">
            <img
              src="/bmjletter.webp"
              width={70}
              className="p-1.5 md:w-[90px] md:p-2"
              alt="Bandar Musik Jakarta - Toko Alat Musik & Audio Terlengkap di Jakarta"
            />
            <img
              src="/BMJLogo.webp"
              width={110}
              className="md:w-[136px]"
              alt="Bandar Musik Jakarta - Toko Alat Musik & Audio Terlengkap di Jakarta"
            />
          </Link>

          <ul className="hidden list-none items-center gap-0.5 md:flex">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block whitespace-nowrap rounded-sm px-[11px] py-1.5 font-poppins text-[11px] tracking-[0.02em] transition-colors duration-200 md:text-[16px] ${
                    item.href === "/" ? activeLinkColor : linkColor
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-shrink-0 items-center gap-2 md:gap-2.5">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Cari"
              className={`flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-sm border transition-colors duration-200 md:h-[38px] md:w-[38px] ${iconBtnBase} ${
                searchOpen ? "!border-second/40 !bg-second/20" : ""
              }`}
              title="Cari"
            >
              <svg className="h-[16px] w-[16px] md:h-[17px] md:w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className="relative">
              <button
                className={`flex h-[36px] w-[36px] items-center justify-center rounded-sm border transition-colors duration-200 md:h-[38px] md:w-[38px] ${iconBtnBase}`}
                title="Keranjang"
                aria-label="Keranjang"
                onClick={() => setCartOpen(true)}
              >
                <svg className="h-[16px] w-[16px] md:h-[17px] md:w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </button>
              {wishlist && wishlist.length > 0 && (
                <span className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-[17px] w-[17px] items-center justify-center rounded-sm bg-second text-[9px] font-bold text-third">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {!token ? (
                <button
                  onClick={() => router.push("/login")}
                  className="cursor-pointer whitespace-nowrap rounded-sm border-none bg-second px-[18px] py-2 font-poppins text-[12.5px] font-bold uppercase tracking-wider text-third transition-all duration-200 hover:bg-third hover:text-white active:scale-[0.98]"
                >
                  Masuk
                </button>
              ) : (
                <>
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-sm border py-1 pl-1 pr-2.5 transition-colors duration-200 ${
                      atTop
                        ? "border-third/15 bg-third/7 hover:bg-third/12"
                        : "border-white/13 bg-white/7 hover:bg-white/12"
                    }`}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-second text-[10px] font-bold text-third">
                      {initials}
                    </div>
                    <span className={`text-[12px] font-medium capitalize ${atTop ? "text-third" : "text-primary"}`}>
                      {(username ?? "").split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await logOut();
                    }}
                    className={`cursor-pointer whitespace-nowrap rounded-sm border bg-transparent px-[18px] py-2 font-poppins text-[12.5px] font-bold uppercase tracking-wider transition-all duration-200 ${
                      atTop
                        ? "border-third/25 text-third/75 hover:bg-third/6 hover:text-third"
                        : "border-primary/22 text-primary/80 hover:border-primary/50 hover:bg-white/6 hover:text-primary"
                    }`}
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Menu"
              className={`flex h-[36px] w-[36px] items-center justify-center rounded-sm border transition-colors duration-200 md:hidden ${iconBtnBase}`}
              title="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {wishlist && (
          <CartSidebar
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            wishlist={wishlist}
            setNeedLogin={setNeedLogin}
          />
        )}
      </nav>

      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col bg-primary transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-dashed border-third/25 px-5">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5">
            <img src="/bmjletter.webp" width={60} className="p-1" alt="BMJ" />
            <img src="/BMJLogo.webp" width={100} alt="Bandar Musik Jakarta" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup menu"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-third/15 bg-third/7 text-third"
          >
            <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto px-3 py-3 ${NO_SCROLLBAR}`}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-sm px-3 py-2.5 font-poppins text-[13.5px] transition-colors duration-150 ${
                item.href === "/"
                  ? "font-medium text-second"
                  : "text-third/80 hover:bg-third/6 hover:text-third"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex-shrink-0 border-t border-dashed border-third/25 px-4 py-5">
          {!token ? (
            <button
              onClick={() => {
                router.push("/login");
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-sm bg-second py-2.5 font-poppins text-[12px] font-bold uppercase tracking-wider text-third transition-all duration-200 hover:bg-third hover:text-white"
            >
              Masuk
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-second text-[11px] font-bold text-third">
                  {initials}
                </div>
                <div>
                  <p className="font-poppins text-[13px] font-medium text-third">{username}</p>
                  <p className="text-[11px] text-third/50">Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-sm border border-third/20 px-3 py-1.5 text-[12px] text-third/60 transition-colors hover:text-third"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={overlayRef}
        className={`fixed left-0 top-[60px] z-40 w-full transition-all duration-300 md:top-[66px] ${
          searchOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="bg-white shadow-2xl ring-1 ring-third/10">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="flex items-center gap-3 border-b border-dashed border-third/25 px-4 py-3.5 md:px-14 md:py-4">
              {isSearching ? (
                <svg className="h-[18px] w-[18px] flex-shrink-0 animate-spin text-second" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg className="h-[18px] w-[18px] flex-shrink-0 text-third/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk, brand, kategori…"
                className="min-w-0 flex-1 border-none bg-transparent font-poppins text-[15px] font-medium text-third outline-none placeholder:font-normal placeholder:text-third/35 md:text-[17px]"
              />
              {hasQuery && !isSearching && searchResult && (
                <span className="hidden flex-shrink-0 text-[11px] font-bold uppercase tracking-wider text-third/40 md:block">
                  {totalResults} hasil
                </span>
              )}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Hapus pencarian"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm bg-third/5 text-third/60 transition-colors hover:bg-third/10 hover:text-third"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <span className="hidden flex-shrink-0 rounded-sm border border-third/15 px-1.5 py-1 text-[10px] font-bold uppercase leading-none tracking-wider text-third/40 md:block">
                Esc
              </span>
              <button
                onClick={closeSearch}
                aria-label="Tutup pencarian"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm text-third ring-1 ring-third/15 transition-colors hover:bg-third hover:text-white"
              >
                <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={`max-h-[72vh] overflow-y-auto px-4 py-5 md:px-14 md:py-7 ${NO_SCROLLBAR}`}>
              {!hasQuery && (
                <>
                  <div className="md:hidden">
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {STATIC_TABS.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`rounded-sm border py-2.5 text-[12px] font-bold uppercase tracking-wider transition-colors duration-150 ${
                            activeTab === tab.key
                              ? "border-third bg-third text-white"
                              : "border-third/15 text-third/60 hover:border-third/40 hover:text-third"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <SectionLabel>{activeTabData.title}</SectionLabel>
                    <StaticLinks items={activeTabData.items} onPick={closeSearch} cols="grid-cols-2" />
                  </div>

                  <div className="hidden gap-14 md:grid md:grid-cols-2">
                    {STATIC_TABS.map((tab) => (
                      <div key={tab.key}>
                        <SectionLabel>{tab.title}</SectionLabel>
                        <StaticLinks items={tab.items} onPick={closeSearch} cols="grid-cols-2" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {hasQuery && isSearching && (
                <div className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded-sm bg-third/10" />
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 py-1.5">
                        <div className="h-12 w-12 flex-shrink-0 rounded-sm bg-third/10" />
                        <div className="h-3 flex-1 rounded-sm bg-third/10" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-24 rounded-sm bg-third/10" />
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-sm bg-third/10" />
                      ))}
                    </div>
                    <div className="h-3 w-24 rounded-sm bg-third/10" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-7 w-20 rounded-sm bg-third/10" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasQuery && !isSearching && searchResult && (
                <>
                  {totalResults === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-third/40">
                      <svg className="mb-3 h-9 w-9 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <p className="text-center font-poppins text-[13px]">
                        Tidak ada hasil untuk &quot;<span className="font-semibold text-third">{searchQuery}</span>&quot;
                      </p>
                      <p className="mt-1 text-center text-[12px]">Coba kata kunci lain atau periksa ejaannya.</p>
                    </div>
                  ) : (
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
                      <div className="min-w-0">
                        <SectionLabel count={searchResult.products?.length ?? 0}>Produk</SectionLabel>
                        {searchResult.products?.length > 0 ? (
                          <div className={`max-h-[340px] overflow-y-auto ${NO_SCROLLBAR}`}>
                            {searchResult.products.map((product) => (
                              <Link
                                key={product.id}
                                href={`/produk/${product.url}`}
                                onClick={closeSearch}
                                className="group flex items-center gap-3 border-b border-dashed border-third/20 py-2.5 transition-colors duration-200 last:border-b-0 hover:bg-third/[0.03]"
                              >
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-gray-50 ring-1 ring-third/10">
                                  <Image
                                    fill
                                    sizes="48px"
                                    src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0]}`}
                                    alt={product.name}
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <span className="line-clamp-2 min-w-0 flex-1 font-poppins text-[12.5px] font-semibold uppercase leading-snug text-third/80 transition-colors group-hover:text-third md:text-[13px]">
                                  {product.name}
                                </span>
                                <ArrowIcon className="-translate-x-1 text-third/30 opacity-0 group-hover:translate-x-0 group-hover:text-second group-hover:opacity-100" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="py-2 text-[12px] italic text-third/35">Tidak ada produk</p>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col gap-7">
                        <div>
                          <SectionLabel count={searchResult.brands?.length ?? 0}>Brand</SectionLabel>
                          {searchResult.brands?.length > 0 ? (
                            <div className={`grid max-h-[180px] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5 lg:grid-cols-4 ${NO_SCROLLBAR}`}>
                              {searchResult.brands.map((brand) => (
                                <Link
                                  key={brand.id}
                                  href={`/brand/${brand.name}`}
                                  onClick={closeSearch}
                                  title={brand.name}
                                  className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-white p-2 shadow-sm ring-1 ring-third/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-third/10"
                                >
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brand.image}`}
                                    alt={brand.name}
                                    className="h-full w-full object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                                  />
                                  <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-second transition-transform duration-300 group-hover:scale-x-100" />
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="py-2 text-[12px] italic text-third/35">Tidak ada brand</p>
                          )}
                        </div>

                        <div>
                          <SectionLabel count={searchResult.categories?.length ?? 0}>Kategori</SectionLabel>
                          {searchResult.categories?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {searchResult.categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/kategori/${cat.title}`}
                                  onClick={closeSearch}
                                  className="rounded-sm bg-third/5 px-3 py-1.5 font-poppins text-[12px] font-semibold text-third/70 transition-colors duration-200 hover:bg-second hover:text-third"
                                >
                                  {cat.title}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="py-2 text-[12px] italic text-third/35">Tidak ada kategori</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}