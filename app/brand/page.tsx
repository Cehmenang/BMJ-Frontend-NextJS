"use client"
import { getBrands } from "@/action/brand"
import { type IBrand } from "@/interface"
import { useEffect, useState, useRef, useCallback } from "react"

const ALPHABET = ["Semua","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

const NO_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

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
    const root = heroRef.current
    if (!gsap || !root) return
    const tl = gsap.timeline()
    tl.fromTo(
      root.querySelector("[data-hero-tag]"),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    )
      .fromTo(
        root.querySelector("[data-hero-title]"),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
        "-=0.25"
      )
      .fromTo(
        root.querySelector("[data-hero-sub]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        root.querySelector("[data-hero-search]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        "-=0.3"
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
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    )
    gsap.fromTo(
      items,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.025, delay: 0.1 }
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

  useEffect(() => {
    document.body.style.overflow = showAlphaModal ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [showAlphaModal])

  useEffect(() => {
    if (!showAlphaModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAlphaModal(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
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

  const displayedLetters =
    activeFilter === "Semua"
      ? availableLetters
      : availableLetters.filter((l) => l === activeFilter)

  const letterBtn = (isActive: boolean, isAvailable: boolean) =>
    isActive
      ? "bg-second text-third"
      : isAvailable
      ? "bg-third/5 text-third/70 hover:bg-third/10 hover:text-third"
      : "cursor-default bg-transparent text-third/20"

  return (
    <div className="min-h-screen bg-bg-site font-sans">
      <div ref={heroRef} className="border-b border-dashed border-third/25 pb-8 pt-[96px] md:pb-10 md:pt-[120px]">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 md:px-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <p
                data-hero-tag
                className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-third/50"
                style={{ opacity: 0 }}
              >
                Partner Resmi
              </p>
              <h1
                data-hero-title
                className="font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold uppercase leading-[1.25] text-third"
                style={{ opacity: 0 }}
              >
                Daftar <em className="not-italic text-second">Brand</em>
              </h1>
              <p
                data-hero-sub
                className="mt-3 max-w-lg text-[13px] leading-relaxed text-third/60 md:text-[14px]"
                style={{ opacity: 0 }}
              >
                Temukan semua brand alat musik yang tersedia di Bandar Musik Jakarta.
              </p>
            </div>

            <div
              data-hero-search
              className="flex w-full items-center gap-3 rounded-sm bg-white px-4 py-3 shadow-sm ring-1 ring-third/10 transition-shadow duration-200 focus-within:ring-third/40 md:max-w-sm"
              style={{ opacity: 0 }}
            >
              <svg className="h-4 w-4 flex-shrink-0 text-third/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setActiveFilter("Semua")
                }}
                placeholder="Cari brand…"
                className="min-w-0 flex-1 border-none bg-transparent font-poppins text-[14px] text-third outline-none placeholder:text-third/35"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Hapus pencarian"
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-third/5 text-third/60 transition-colors hover:bg-third/10 hover:text-third"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[60px] z-30 border-b border-dashed border-third/25 bg-bg-site/90 backdrop-blur-md md:top-[66px]">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-3 sm:px-8 md:px-14">
          <div className={`hidden items-center gap-1 overflow-x-auto md:flex ${NO_SCROLLBAR}`}>
            {ALPHABET.map((letter) => {
              const isAvailable = letter === "Semua" || availableLetters.includes(letter)
              const isActive = activeFilter === letter
              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && scrollTo(letter)}
                  disabled={!isAvailable}
                  className={`h-8 flex-shrink-0 rounded-sm px-2.5 font-poppins text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 ${
                    letter === "Semua" ? "min-w-[64px]" : "min-w-[32px]"
                  } ${letterBtn(isActive, isAvailable)}`}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className={`flex items-center gap-2 overflow-x-auto ${NO_SCROLLBAR}`}>
              {["Semua", ...availableLetters.slice(0, 6)].map((letter) => {
                const isActive = activeFilter === letter
                return (
                  <button
                    key={letter}
                    onClick={() => scrollTo(letter)}
                    className={`h-8 flex-shrink-0 rounded-sm px-3 font-poppins text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 ${letterBtn(isActive, true)}`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowAlphaModal(true)}
              className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-sm bg-third px-3 font-poppins text-[11px] font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-second hover:text-third"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              A–Z
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          showAlphaModal ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAlphaModal(false)} />

        <div
          className={`absolute bottom-0 left-0 right-0 rounded-t-md bg-bg-site shadow-2xl transition-transform duration-300 ${
            showAlphaModal ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-dashed border-third/25 px-5 py-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-third">Pilih Huruf</p>
            <button
              onClick={() => setShowAlphaModal(false)}
              aria-label="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-sm text-third ring-1 ring-third/15 transition-colors hover:bg-third hover:text-white"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
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
                    className={`h-10 rounded-sm font-poppins text-[12px] font-bold uppercase transition-colors duration-150 ${
                      letter === "Semua" ? "col-span-2 text-[11px] tracking-wider" : ""
                    } ${letterBtn(isActive, isAvailable)}`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-8 md:px-14 md:pb-24 md:pt-8">
        {!brands && (
          <div className="animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-dashed border-third/25 py-8 md:gap-10 md:py-10">
                <div className="h-14 w-10 flex-shrink-0 rounded-sm bg-third/10 md:h-20 md:w-20" />
                <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="h-8 rounded-sm bg-third/10" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {brands && displayedLetters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-third/40">
            <svg className="mb-4 h-10 w-10 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-center font-poppins text-[13px]">
              Tidak ada brand untuk &quot;<span className="font-semibold text-third">{search}</span>&quot;
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 rounded-sm bg-third px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-second hover:text-third"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        <div>
          {displayedLetters.map((letter, idx) => {
            const items = [...(grouped[letter] ?? [])].sort((a, b) => a.name.localeCompare(b.name))
            return (
              <div
                key={letter}
                data-letter={letter}
                ref={(el) => {
                  sectionRefs.current[letter] = el
                }}
                className={idx < displayedLetters.length - 1 ? "border-b border-dashed border-third/25" : ""}
              >
                <div className="group flex gap-4 py-8 md:gap-10 md:py-10">
                  <div className="w-10 flex-shrink-0 md:w-24">
                    <div className="md:sticky md:top-[150px]">
                      <span
                        data-big-letter
                        className="block font-boldonse text-[40px] font-bold leading-none text-third/25 transition-colors duration-500 group-hover:text-second md:text-[72px]"
                        style={{ opacity: 0 }}
                      >
                        {letter}
                      </span>
                      <span className="mt-2 hidden text-[10px] font-bold uppercase tracking-wider text-third/40 md:block">
                        {items.length} brand
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {items.map((brand: IBrand, index: number) => (
                        <a
                          key={(brand as any).id ?? index}
                          data-brand-item
                          href={`/brand/${brand.name}`}
                          className="group/item flex items-center justify-between gap-2 border-b border-dashed border-third/20 py-2.5 font-poppins text-[12.5px] font-medium text-third/70 transition-colors duration-200 hover:text-third md:text-[13px]"
                          style={{ opacity: 0 }}
                        >
                          <span className="truncate">{brand.name}</span>
                          <svg
                            className="h-3.5 w-3.5 flex-shrink-0 -translate-x-1 text-third/30 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:text-second group-hover/item:opacity-100"
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
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {brands && (
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-dashed border-third/25 pt-6 md:mt-14">
            <p className="text-[11px] font-bold uppercase tracking-wider text-third/40 md:text-[12px]">
              {brands.length} brand tersedia
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 rounded-sm bg-third px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-second hover:text-third active:scale-[0.98]"
            >
              Kembali ke atas
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}