"use client"
import { getCategories } from "@/action/kategori"
import { type ICategory } from "@/interface"
import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"

export default function Category() {
  const [categories, setCategories] = useState<ICategory[] | null>(null)
  const [activeParent, setActiveParent] = useState<string | null>(null)
  const gsapRef = useRef<any>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const animatedCards = useRef<Set<number>>(new Set())

  useEffect(() => {
    (async function () {
      const result = await getCategories()
      console.log(result)
      setCategories(result)
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
      heroRef.current.querySelector("[data-hero-deco]"),
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power1.out" },
      "-=1"
    )
  }

  const animateCard = useCallback((id: number, el: HTMLElement) => {
    const gsap = gsapRef.current
    if (!gsap || animatedCards.current.has(id)) return
    animatedCards.current.add(id)
    gsap.fromTo(
      el,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
    )
  }, [])

  useEffect(() => {
    if (!categories) return
    animatedCards.current.clear()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number((entry.target as HTMLElement).dataset.cardId)
            animateCard(id, entry.target as HTMLElement)
          }
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll("[data-card-id]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [categories, activeParent, animateCard])

  // Grouping
  const parents = categories?.filter((c) => c.parent === null) ?? []
  const getChildren = (parentTitle: string) =>
    categories?.filter((c) => c.parent === parentTitle) ?? []

  // Default active = parent pertama
  useEffect(() => {
    if (categories && !activeParent) {
      const first = categories.find((c) => c.parent === null)
      if (first) setActiveParent(first.title)
    }
  }, [categories, activeParent])

  const activeChildren = activeParent ? getChildren(activeParent) : []
  const activeParentData = parents.find((p) => p.title === activeParent)

  return (
    <div className="min-h-screen bg-bg-site">

      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden bg-third pt-32 pb-16 px-6 md:px-20">
        <span
          data-hero-deco
          className="pointer-events-none select-none absolute -right-4 -top-6 text-[clamp(80px,16vw,200px)] font-black text-white/5 leading-none font-play"
          style={{ opacity: 0 }}
        >
          KATEGORI
        </span>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <p data-hero-tag className="text-second text-[11px] font-poppins font-semibold tracking-[0.2em] uppercase mb-3" style={{ opacity: 0 }}>
            Jelajahi
          </p>
          <h1 data-hero-title className="font-play text-[clamp(32px,5vw,64px)] font-bold text-primary leading-tight mb-4" style={{ opacity: 0 }}>
            Semua <em className="text-second not-italic">Kategori</em>
          </h1>
          <p data-hero-sub className="font-poppins text-primary/60 text-[13px] md:text-[14px] max-w-lg leading-relaxed" style={{ opacity: 0 }}>
            Temukan alat musik impianmu — dari gitar, drum, keyboard, hingga aksesori studio recording.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-20 py-10 md:py-14">

        {/* Loading skeleton */}
        {!categories && (
          <div className="animate-pulse space-y-8">
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-28 bg-third/10 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-third/10 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {categories && (
          <>
            {/* ── Parent tab pills ── */}
            <div className="overflow-x-auto pb-1 mb-8 md:mb-10">
              <div className="flex gap-2 md:gap-3 min-w-max">
                {parents.map((parent, index: number) => {
                  const isActive = activeParent === parent.title
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        animatedCards.current.clear()
                        setActiveParent(parent.title)
                      }}
                      className={`
                        relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[12.5px] font-poppins font-medium
                        transition-all duration-200 flex-shrink-0 overflow-hidden group
                        ${isActive
                          ? "bg-third text-primary border-third shadow-md"
                          : "bg-white text-third/65 border-third/12 hover:border-third/25 hover:text-third hover:bg-third/4"
                        }
                      `}
                    >
                      {/* Thumbnail mini */}
                      {parent.image && (
                        <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${parent.image}`}
                            alt={parent.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {parent.title}
                      {/* Sub count badge */}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive ? "bg-second text-third" : "bg-third/8 text-third/50"
                      }`}>
                        {getChildren(parent.subparent!).length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Active parent banner ── */}
            {activeParentData && (
              <div
                data-card-id={activeParentData.id * 1000}
                className="relative w-full rounded-2xl overflow-hidden mb-6 md:mb-8 group cursor-pointer"
                style={{ opacity: 0 }}
              >
                <Link href={`/kategori/${activeParentData.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="relative h-[140px] sm:h-[180px] md:h-[200px] overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${activeParentData.image}`}
                      alt={activeParentData.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-third/80 via-third/40 to-third/10" />
                    <div className="absolute inset-0 flex items-center px-6 md:px-10 justify-between">
                      <div>
                        <span className="text-[9px] font-poppins font-semibold tracking-[0.18em] uppercase text-second">
                          Kategori Utama
                        </span>
                        <h2 className="font-play text-[clamp(20px,3vw,36px)] font-bold text-primary mt-1">
                          {activeParentData.title}
                        </h2>
                        {activeParentData.brands && activeParentData.brands.length > 0 && (
                          <p className="font-poppins text-[11px] text-primary/50 mt-1 hidden sm:block">
                            {activeParentData.brands.slice(0, 4).join(" · ")}
                            {activeParentData.brands.length > 4 && ` +${activeParentData.brands.length - 4}`}
                          </p>
                        )}
                      </div>
                      <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-second flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(249,173,82,0.5)]">
                        <svg className="w-4 h-4 text-third" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* ── Sub-category label ── */}
            {activeChildren.length > 0 && (
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <p className="font-poppins text-[11px] font-semibold tracking-[0.15em] uppercase text-third/40">
                  Sub-kategori · {activeChildren.length} item
                </p>
              </div>
            )}

            {/* ── Sub-category card grid ── */}
            {activeChildren.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {activeChildren.map((sub) => (
                  <div
                    key={sub.id}
                    data-card-id={sub.id}
                    className="group cursor-pointer"
                    style={{ opacity: 0 }}
                  >
                    <Link href={`/kategori/${sub.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      {/* Image box */}
                      <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-third/5 border border-third/8 group-hover:border-second/40 transition-colors duration-300">
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${sub.image}`}
                          alt={sub.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-third/70 via-transparent to-transparent" />
                        {/* Hover tint */}
                        <div className="absolute inset-0 bg-second/0 group-hover:bg-second/6 transition-colors duration-300" />

                        {/* Brand count badge */}
                        {sub.brands && sub.brands.length > 0 && (
                          <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[9px] font-poppins font-semibold px-1.5 py-0.5 rounded-full">
                            {sub.brands.length} brand
                          </div>
                        )}
                      </div>

                      {/* Label below image */}
                      <div className="mt-2.5 px-0.5">
                        <p className="font-poppins text-[12px] md:text-[13px] font-semibold text-third/80 group-hover:text-second transition-colors duration-200 leading-snug">
                          {sub.title}
                        </p>
                        {sub.brands && sub.brands.length > 0 && (
                          <p className="font-poppins text-[10px] text-third/40 mt-0.5 truncate hidden md:block">
                            {sub.brands.slice(0, 2).join(", ")}
                            {sub.brands.length > 2 && ` +${sub.brands.length - 2}`}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* Parent punya langsung produk, no sub */
              <div className="flex flex-col items-center justify-center py-16 text-third/35">
                <svg className="w-10 h-10 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <p className="font-poppins text-[13px]">Tidak ada sub-kategori</p>
                <Link
                  href={`/kategori/${activeParent?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="mt-3 text-[12px] font-poppins text-second hover:underline"
                >
                  Lihat produk langsung →
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="mt-14 pt-6 border-t border-third/8 flex items-center justify-between">
              <p className="font-poppins text-[11px] md:text-[12px] text-third/35">
                {parents.length} kategori · {categories.filter((c) => c.parent !== null).length} sub-kategori
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
          </>
        )}
      </div>
    </div>
  )
}