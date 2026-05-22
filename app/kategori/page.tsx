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

  const ITEMS_PER_PAGE = 6
  const gridRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

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

  // animasi tag pills masuk
  useEffect(() => {
    if (!tagsRef.current) return
    const pills = tagsRef.current.querySelectorAll("button")
    gsap.fromTo(pills,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: "power2.out" }
    )
  }, [allTags])

  // filter by tag
  useEffect(() => {
    if (!selectedTag) return
    const result = categories.filter(c => (c.tag ?? []).includes(selectedTag))
    setFiltered(result)
    setPage(0)
  }, [selectedTag, categories])

  // animasi grid tiap ganti page / tag
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".cat-card")
    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "power2.out" }
    )
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const currentItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  const prev = () => {
    if (page === 0) return
    animateOut("right", () => setPage(p => p - 1))
  }

  const next = () => {
    if (page >= totalPages - 1) return
    animateOut("left", () => setPage(p => p + 1))
  }

  const animateOut = (direction: "left" | "right", cb: () => void) => {
    if (!gridRef.current) return cb()
    const cards = gridRef.current.querySelectorAll(".cat-card")
    gsap.to(cards, {
      opacity: 0,
      x: direction === "left" ? -30 : 30,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(cards, { x: 0 })
        cb()
      }
    })
  }

  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) return
    if (!gridRef.current) return setSelectedTag(tag)
    const cards = gridRef.current.querySelectorAll(".cat-card")
    gsap.to(cards, {
      opacity: 0,
      y: -10,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setSelectedTag(tag)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 md:mt-20 py-10">

      {/* Tag filter */}
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

        {/* Arrow kiri */}
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

        {/* Grid kategori */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden">
          {currentItems.length > 0 ? currentItems.map(cat => (
            <Link
              href={`/kategori/${cat.title}`}
              key={cat.id}
              className="cat-card group flex flex-col gap-0 rounded-2xl border border-third/8 hover:border-third/20 overflow-hidden transition-colors"
            >
              {/* Banner 3:2 */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/2" }}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${cat.image}`}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Label */}
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

        {/* Arrow kanan */}
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

      {/* Info */}
      <p className="text-center font-poppins text-[11px] text-third/25 mt-3">
        {filtered.length} kategori · halaman {page + 1} dari {totalPages}
      </p>

    </div>
  )
}