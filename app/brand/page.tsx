"use client"
import { getBrands } from "@/action/brand"
import { type IBrand } from "@/interface"
import { useEffect, useState, useRef, useCallback } from "react"

const ALPHABET = ["Semua","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

export default function Brands() {
  const [brands, setBrands] = useState<IBrand[] | null>(null)
  const [activeFilter, setActiveFilter] = useState("Semua")
  const [search, setSearch] = useState("")
  const [showAlphaModal, setShowAlphaModal] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const gsapRef = useRef<any>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const animatedSections = useRef<Set<string>>(new Set())

  useEffect(() => {
    (async function () {
      const result = await getBrands()
      setBrands(result)
    })()
  }, [])

  useEffect(() => {
    import("gsap").then((mod) => {
      gsapRef.current = mod.gsap ?? mod.default
      animateHero()
    })
  }, [])

  const animateHero = () => {
    const gsap = gsapRef.current
    if (!gsap || !heroRef.current) return
    const tl = gsap.timeline()
    tl.fromTo(
      heroRef.current.querySelector("[data-hero-tag]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo(
      heroRef.current.querySelector("[data-hero-title]"),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(
      heroRef.current.querySelector("[data-hero-sub]"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(
      heroRef.current.querySelector("[data-hero-search]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      "-=0.25"
    )
    .fromTo(
      heroRef.current.querySelector("[data-hero-deco]"),
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power1.out" },
      "-=1"
    )
  }

  const animateSection = useCallback((letter: string) => {
    const gsap = gsapRef.current
    if (!gsap || animatedSections.current.has(letter)) return
    const el = sectionRefs.current[letter]
    if (!el) return
    animatedSections.current.add(letter)

    const bigLetter = el.querySelector("[data-big-letter]")
    const items = el.querySelectorAll("[data-brand-item]")

    gsap.fromTo(
      bigLetter,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    )
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.03, delay: 0.1 }
    )
  }, [])

  useEffect(() => {
    if (!brands) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const letter = (entry.target as HTMLElement).dataset.letter
            if (letter) animateSection(letter)
          }
        })
      },
      { threshold: 0.1 }
    )
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [brands, animateSection, activeFilter, search])

  useEffect(() => {
    animatedSections.current.clear()
  }, [activeFilter, search])

  // Lock body scroll saat alpha modal mobile terbuka
  useEffect(() => {
    document.body.style.overflow = showAlphaModal ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [showAlphaModal])

  const grouped = (() => {
    if (!brands) return {}
    const filtered = brands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    )
    return filtered.reduce<Record<string, IBrand[]>>((acc, brand) => {
      const letter = brand.name[0].toUpperCase()
      if (!acc[letter]) acc[letter] = []
      acc[letter].push(brand)
      return acc
    }, {})
  })()

  const availableLetters = Object.keys(grouped).sort()

  const scrollTo = (letter: string) => {
    setShowAlphaModal(false)
    if (letter === "Semua") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setActiveFilter("Semua")
      return
    }
    setActiveFilter(letter)
    const el = sectionRefs.current[letter]
    if (el) {
      const offset = 130
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  const displayedLetters = activeFilter === "Semua"
    ? availableLetters
    : availableLetters.filter((l) => l === activeFilter)

  return (
    <div className="min-h-screen bg-bg-site">

      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden bg-third pt-32 pb-16 px-6 md:px-20">
        <span
          data-hero-deco
          className="pointer-events-none select-none absolute -right-6 -top-8 text-[clamp(100px,18vw,220px)] font-black text-white/5 leading-none font-play"
          style={{ opacity: 0 }}
        >
          BRAND
        </span>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <p data-hero-tag className="text-second text-[11px] font-poppins font-semibold tracking-[0.2em] uppercase mb-3" style={{ opacity: 0 }}>
            Bagian
          </p>
          <h1 data-hero-title className="font-poppins tracking-tight text-[clamp(32px,5vw,64px)] font-bold text-primary leading-tight mb-4" style={{ opacity: 0 }}>
            Daftar <em className="text-second italic font-play">Brand</em>
          </h1>
          <p data-hero-sub className="font-poppins text-primary/60 text-[13px] md:text-[14px] max-w-lg leading-relaxed" style={{ opacity: 0 }}>
            Temukan semua brand alat musik yang tersedia di Bandar Musik Jakarta.
          </p>
          <div data-hero-search className="mt-8 flex items-center gap-3 bg-white/8 border border-white/12 rounded-xl px-4 py-3 max-w-md" style={{ opacity: 0 }}>
            <svg className="w-4 h-4 text-primary/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveFilter("Semua") }}
              placeholder="Cari brand…"
              className="flex-1 bg-transparent text-[13px] font-poppins text-primary placeholder:text-primary/35 outline-none border-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-primary/40 hover:text-primary/70 transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky alphabet bar ── */}
      <div className="sticky top-[60px] md:top-[66px] z-30 bg-bg-site/90 backdrop-blur-md border-b border-third/8">
        <div className="max-w-6xl mx-auto px-4 md:px-20 py-3">

          {/* DESKTOP — scroll horizontally */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {ALPHABET.map((letter) => {
              const isAvailable = letter === "Semua" || availableLetters.includes(letter)
              const isActive = activeFilter === letter
              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && scrollTo(letter)}
                  disabled={!isAvailable}
                  className={`
                    min-w-[32px] h-8 px-1.5 rounded-md text-[11px] font-poppins font-semibold transition-all duration-150 flex-shrink-0
                    ${isActive
                      ? "bg-second text-third shadow-sm scale-105"
                      : isAvailable
                        ? "text-third/70 hover:text-third hover:bg-third/8"
                        : "text-third/20 cursor-default"
                    }
                  `}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          {/* MOBILE — active filter chip + trigger button */}
          <div className="flex md:hidden items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {/* Show a few quick-access letters */}
              {["Semua", ...availableLetters.slice(0, 6)].map((letter) => {
                const isActive = activeFilter === letter
                return (
                  <button
                    key={letter}
                    onClick={() => scrollTo(letter)}
                    className={`
                      flex-shrink-0 h-7 px-2.5 rounded-md text-[11px] font-poppins font-semibold transition-all duration-150
                      ${isActive
                        ? "bg-second text-third"
                        : "text-third/60 bg-third/6 hover:bg-third/10"
                      }
                    `}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
            {/* All letters trigger */}
            <button
              onClick={() => setShowAlphaModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-md text-[11px] font-poppins font-semibold text-third/60 bg-third/6 hover:bg-third/10 transition-colors border border-third/10"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              A–Z
            </button>
          </div>

        </div>
      </div>

      {/* Mobile alphabet modal */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          showAlphaModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAlphaModal(false)} />

        {/* Sheet from bottom */}
        <div className={`absolute bottom-0 left-0 right-0 bg-bg-site rounded-t-2xl transition-transform duration-300 ${
          showAlphaModal ? "translate-y-0" : "translate-y-full"
        }`}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-third/20" />
          </div>

          <div className="px-5 pt-3 pb-4 flex items-center justify-between border-b border-third/8">
            <p className="font-poppins text-[13px] font-semibold text-third">Pilih Huruf</p>
            <button
              onClick={() => setShowAlphaModal(false)}
              className="w-7 h-7 rounded-lg bg-third/7 flex items-center justify-center text-third/60"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-5">
            <div className="grid grid-cols-7 gap-2">
              {ALPHABET.map((letter) => {
                const isAvailable = letter === "Semua" || availableLetters.includes(letter)
                const isActive = activeFilter === letter
                return (
                  <button
                    key={letter}
                    onClick={() => isAvailable && scrollTo(letter)}
                    disabled={!isAvailable}
                    className={`
                      h-10 rounded-lg text-[12px] font-poppins font-semibold transition-all duration-150
                      ${letter === "Semua" ? "col-span-2 text-[11px]" : ""}
                      ${isActive
                        ? "bg-second text-third shadow-sm"
                        : isAvailable
                          ? "bg-third/6 text-third/70 hover:bg-third/12 hover:text-third"
                          : "bg-third/3 text-third/18 cursor-default"
                      }
                    `}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Safe area bottom padding */}
          <div className="h-6" />
        </div>
      </div>

      {/* Brand list */}
      <div className="max-w-6xl mx-auto px-4 md:px-20 py-8 md:py-12">

        {/* Loading skeleton */}
        {!brands && (
          <div className="space-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-5 md:gap-10">
                  <div className="w-10 md:w-16 h-14 md:h-16 bg-third/10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 pt-2 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {[...Array(8)].map((_, j) => (
                        <div key={j} className="h-4 bg-third/10 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 h-px bg-third/8" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {brands && displayedLetters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-third/40">
            <svg className="w-10 h-10 mb-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="font-poppins text-[13px] text-center">
              Tidak ada brand untuk "<span className="text-third/60">{search}</span>"
            </p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-0">
          {displayedLetters.map((letter, idx) => {
            const items = grouped[letter] ?? []
            return (
              <div
                key={letter}
                data-letter={letter}
                ref={(el) => { sectionRefs.current[letter] = el }}
              >
                <div className="flex gap-4 md:gap-10 py-8 md:py-10 group">

                  {/* Big letter */}
                  <div className="flex-shrink-0 w-10 md:w-20 flex items-start justify-center pt-1">
                    <span
                      data-big-letter
                      className="font-poppins text-[44px] md:text-[80px] font-black text-third/50 group-hover:text-third leading-none select-none transition duration-500"
                      style={{ opacity: 0 }}
                    >
                      {letter}
                    </span>
                  </div>

                  {/* Brand grid */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-1">
                      {items
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((brand: IBrand, index: number) => (
                          
                         <a key={index}
                            data-brand-item
                            href={`/brand/${brand.name}`}
                            className="group flex items-center gap-1.5 py-1.5 text-[12px] md:text-[13px] font-poppins text-third/50 hover:text-third font-normal hover:font-bold transition-colors duration-150 truncate"
                            style={{ opacity: 0 }}
                          >
                            <span className="truncate">{brand.name}</span>
                          </a>
                        ))}
                    </div>
                  </div>
                </div>

                {idx < displayedLetters.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-third/12 to-transparent" />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {brands && (
          <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-third/8 flex items-center justify-between">
            <p className="font-poppins text-[11px] md:text-[12px] text-third/35">
              {brands.length} brand tersedia
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-poppins text-third/40 hover:text-third/70 transition-colors"
            >
              Kembali ke atas
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}