"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Terbaru", href: "/terbaru" },
  { label: "Promo", href: "/promo" },
  {
    label: "Kategori",
    href: "#",
    dropdown: [
      { label: "Gitar & Bass", href: "/kategori/gitar-bass" },
      { label: "Drum & Perkusi", href: "/kategori/drum" },
      { label: "Keyboard & Piano", href: "/kategori/keyboard" },
      { label: "Brass & Woodwind", href: "/kategori/brass" },
      { label: "Studio & Recording", href: "/kategori/studio" },
      { label: "Aksesori", href: "/kategori/aksesori" },
    ],
  },
  {
    label: "Brand",
    href: "#",
    dropdown: [
      { label: "Fender", href: "/brand/fender" },
      { label: "Gibson", href: "/brand/gibson" },
      { label: "Yamaha", href: "/brand/yamaha" },
      { label: "Roland", href: "/brand/roland" },
      { label: "Pearl", href: "/brand/pearl" },
      { label: "Lihat Semua →", href: "/brand" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
];

type NavState = "at-top" | "scrolled";

export default function MainNav() {
  const [navState, setNavState] = useState<NavState>("at-top");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount] = useState(3);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      setNavState(window.scrollY < 10 ? "at-top" : "scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const wrap = document.getElementById("search-wrap");
      if (wrap && !wrap.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const atTop = navState === "at-top";

  // Dynamic classes based on scroll state
  const navBg = atTop
    ? "bg-primary border-b border-third/10 shadow-sm"
    : "bg-third/55 backdrop-blur-xl border-b border-second/15 shadow-lg";

  const logoNameColor = atTop ? "text-third" : "text-primary";
  const logoSubColor  = atTop ? "text-third-light" : "text-second";

  const linkColor = atTop
    ? "text-third/75 hover:text-third hover:bg-third/6"
    : "text-primary/78 hover:text-primary hover:bg-white/8";

  const activeLinkColor = atTop ? "text-third-light font-medium" : "text-second font-medium";

  const iconBtnBase = atTop
    ? "bg-third/7 border-third/15 text-third hover:bg-third/12 hover:border-third/25"
    : "bg-white/7 border-white/13 text-primary hover:bg-second/12 hover:border-second/35";

  const dropdownBg  = atTop ? "bg-white border-third/10" : "bg-third-dark border-second/18";
  const dropdownLink = atTop
    ? "text-third/75 hover:text-third hover:bg-third/6"
    : "text-primary/72 hover:text-second hover:bg-second/10";
  const dropdownDivider = atTop ? "bg-third/10" : "bg-white/8";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${navBg}`}>

      {/* Main nav */}
      <div className="flex items-center justify-between px-14 h-[66px]">
        {/* Logo */}
        <Link href="/" className="flex gap-x-2 cursor-pointer">
          <img
            src={"/bmjletter.webp"}
            width={90}
            className="p-2"
          />
          <img
            src={'/BMJLogo.webp'}
            width={136}
          />
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-0.5 list-none">
          {NAV_LINKS.map((item) =>
            item.dropdown ? (
              <li key={item.label} className="relative group">
                <button
                  className={`flex items-center gap-1 text-[13px] px-[11px] py-1.5 rounded-md tracking-[0.02em] transition-colors duration-200 whitespace-nowrap ${linkColor}`}
                >
                  {item.label}
                  <svg
                    className="w-2.5 h-2.5 opacity-60 group-hover:rotate-180 transition-transform duration-200"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                  >
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute top-[calc(100%+10px)] left-0 min-w-[170px] rounded-xl p-1.5 border opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-[-8px] group-hover:translate-y-0 transition-all duration-200 z-50 shadow-2xl ${dropdownBg}`}
                >
                  {item.dropdown.map((sub, i) => (
                    <div key={sub.label}>
                      {i === item.dropdown!.length - 1 && (
                        <div className={`h-px mx-2 my-1 ${dropdownDivider}`} />
                      )}
                      <Link
                        href={sub.href}
                        className={`block px-3 py-2 text-[12.5px] rounded-md transition-colors duration-150 ${dropdownLink}`}
                      >
                        {sub.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block text-[13px] px-[11px] py-1.5 rounded-md tracking-[0.02em] transition-colors duration-200 whitespace-nowrap ${
                    item.href === "/" ? activeLinkColor : linkColor
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Search */}
          <div id="search-wrap" className="flex items-center relative">
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari alat musik…"
                className={`font-sans text-[13px] bg-transparent border-none outline-none transition-all duration-350 pointer-events-none
                  ${atTop ? "text-third placeholder:text-third/40" : "text-primary placeholder:text-primary/45"}
                  ${searchOpen ? "w-44 pr-2 opacity-100 pointer-events-auto" : "w-0 opacity-0"}
                `}
              />
              {/* underline */}
              <span
                className={`absolute bottom-0 left-0 h-px bg-second transition-transform duration-300 origin-left ${
                  searchOpen ? "scale-x-100 w-44" : "scale-x-0 w-44"
                }`}
              />
            </div>
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center border transition-colors duration-200 flex-shrink-0 ${iconBtnBase}`}
              title="Cari"
            >
              <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* Cart */}
          <div className="relative">
            <button
              className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center border transition-colors duration-200 ${iconBtnBase}`}
              title="Keranjang"
            >
              <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Auth */}
          {!isLoggedIn ? (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="font-sans text-[12.5px] font-medium px-[18px] py-2 rounded-lg bg-second text-third border-none cursor-pointer tracking-[0.02em] whitespace-nowrap transition-all duration-200 hover:bg-[#fbbe74] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(249,173,82,0.4)]"
            >
              Masuk
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border cursor-pointer transition-colors duration-200 ${
                  atTop
                    ? "bg-third/7 border-third/15 hover:bg-third/12"
                    : "bg-white/7 border-white/13 hover:bg-white/12"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-second text-third text-[10px] font-bold flex items-center justify-center">
                  AR
                </div>
                <span className={`text-[12px] font-medium ${atTop ? "text-third" : "text-primary"}`}>
                  Andi
                </span>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className={`font-sans text-[12.5px] font-medium px-[18px] py-2 rounded-lg cursor-pointer tracking-[0.02em] whitespace-nowrap transition-all duration-200 bg-transparent border ${
                  atTop
                    ? "text-third/75 border-third/25 hover:text-third hover:bg-third/6"
                    : "text-primary/80 border-primary/22 hover:text-primary hover:border-primary/50 hover:bg-white/6"
                }`}
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient border — only at top */}
      <div
        className={`h-px nav-gradient-border transition-opacity duration-300 ${atTop ? "opacity-0" : "opacity-0"}`}
      />
    </nav>
  );
}