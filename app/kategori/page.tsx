"use client"
import { getCategories } from "@/action/kategori"
import { TAG_OPTIONS } from "@/config/tag"
import { ICategory } from "@/interface"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export default function KategoriPage() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [allTags] = useState<string[]>(TAG_OPTIONS)
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [filtered, setFiltered] = useState<ICategory[]>([])
  const [page, setPage] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    (async function () {
      const data = await getCategories()
      const sorted: ICategory[] = [...data].sort((a, b) =>
        a.title.localeCompare(b.title, "id")
      )
      setCategories(sorted)
      setSelectedTag(TAG_OPTIONS[0] ?? "")
    })()
  }, [])

  // animasi hero
  useEffect(() => {
    if (!heroRef.current) return
    const tl = gsap.timeline()
    tl.fromTo("[data-hero-deco]",
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo("[data-hero-tag]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.7"
    )
    .fromTo("[data-hero-title]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo("[data-hero-sub]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo("[data-hero-tags]",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    )
  }, [allTags])

  // filter by tag
  useEffect(() => {
  if (!selectedTag) return
  console.log("selectedTag:", selectedTag)
  const result = categories.filter(c => (c.tag ?? []).includes(selectedTag))
  console.log("filtered result:", result.length, result.map(c => c.title))
  setFiltered(result)
  setPage(0)
}, [selectedTag, categories])

  // animasi grid masuk tiap ganti page / tag
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".cat-card")
    if (!cards.length) return
    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "power2.out" }
    )
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const currentItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  const animateOut = (direction: "left" | "right", cb: () => void) => {
    const cards = gridRef.current?.querySelectorAll(".cat-card")
    if (!cards || !cards.length) return cb()
    gsap.to(cards, {
      opacity: 0,
      x: direction === "left" ? -30 : 30,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(cards, { x: 0, opacity: 1 })
        cb()
      }
    })
  }

  const prev = () => {
    if (page === 0) return
    animateOut("right", () => setPage(p => p - 1))
  }

  const next = () => {
    if (page >= totalPages - 1) return
    animateOut("left", () => setPage(p => p + 1))
  }

  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) return

    const cards = gridRef.current?.querySelectorAll(".cat-card")

    if (!cards || !cards.length) {
      setSelectedTag(tag)
      return
    }

    gsap.to(cards, {
      opacity: 0,
      y: -10,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(cards, { opacity: 1, y: 0 })
        setSelectedTag(tag)
      }
    })
  }

  return (
    <>
      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden bg-third pt-32 pb-16 px-6 md:px-20">

        <span
          data-hero-deco
          className="pointer-events-none select-none absolute -right-6 -top-8 text-[clamp(100px,18vw,220px)] font-black text-white/5 leading-none font-play"
          style={{ opacity: 0 }}
        >
          KATEGORI
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
            Jelajahi
          </p>
          <h1 data-hero-title className="font-poppins tracking-tight text-[clamp(32px,5vw,64px)] font-bold text-primary leading-tight mb-4" style={{ opacity: 0 }}>
            Daftar <em className="text-second italic font-play">Kategori</em>
          </h1>
          <p data-hero-sub className="font-poppins text-primary/60 text-[13px] md:text-[14px] max-w-lg leading-relaxed" style={{ opacity: 0 }}>
            Temukan produk berdasarkan kategori yang tersedia di Bandar Musik Jakarta.
          </p>

          <div data-hero-tags className="mt-8 flex flex-wrap gap-2" style={{ opacity: 0 }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`font-poppins text-[12px] px-3.5 py-1.5 rounded-full border transition-colors
                  ${selectedTag === tag
                    ? "bg-second text-third border-second font-medium"
                    : "bg-white/8 text-primary/60 border-white/12 hover:bg-white/15 hover:text-primary/90"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-24 md:mt-10 py-10">

        {/* Tag filter duplikat di bawah */}
        <div ref={tagsRef} className="flex gap-2 flex-wrap mb-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`font-poppins text-[12px] px-3.5 py-1.5 rounded-full border transition-colors
                ${selectedTag === tag
                  ? "bg-third text-primary border-third font-medium"
                  : "bg-transparent text-third/45 border-third/15 hover:border-third/30 hover:text-third/70"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid + navigasi */}
        <div className="relative">

          <button
            onClick={prev}
            disabled={page === 0}
            className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-third/10 bg-white flex items-center justify-center transition-all
              ${page === 0 ? "opacity-25 cursor-not-allowed" : "hover:border-third/25 hover:shadow-sm"}`}
          >
            <svg className="w-4 h-4 text-third" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden">
            {currentItems.length > 0 ? currentItems.map(cat => (
              <Link
                href={`/kategori/${cat.title}`}
                key={cat.id}
                className="cat-card group flex flex-col rounded-2xl border border-third/8 hover:border-third/20 overflow-hidden transition-colors"
              >
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${cat.image}`}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="font-poppins text-[13px] font-medium text-third leading-snug">
                    {cat.title}
                  </p>
                  {(cat.tag ?? []).length > 0 && (
                    <p className="font-poppins text-[11px] text-third/35 mt-0.5">
                      {(cat.tag ?? []).join(", ")}
                    </p>
                  )}
                </div>
              </Link>
            )) : (
              <div className="col-span-3 py-16 text-center font-poppins text-[13px] text-third/30">
                Tidak ada kategori untuk tag ini
              </div>
            )}
          </div>

          <button
            onClick={next}
            disabled={page >= totalPages - 1}
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-third/10 bg-white flex items-center justify-center transition-all
              ${page >= totalPages - 1 ? "opacity-25 cursor-not-allowed" : "hover:border-third/25 hover:shadow-sm"}`}
          >
            <svg className="w-4 h-4 text-third" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Indicator dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const dir = i > page ? "left" : "right"
                  animateOut(dir, () => setPage(i))
                }}
                className={`rounded-full transition-all ${i === page ? "w-5 h-1.5 bg-third" : "w-1.5 h-1.5 bg-third/20"}`}
              />
            ))}
          </div>
        )}

        <p className="text-center font-poppins text-[11px] text-third/25 mt-3">
          {filtered.length} kategori · halaman {page + 1} dari {totalPages}
        </p>

      </div>
    </>
  )
}