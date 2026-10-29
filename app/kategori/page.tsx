"use client"
import { getCategories } from "@/action/kategori"
import { TAG_OPTIONS } from "@/config/tag"
import { ICategory } from "@/interface"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { gsap } from "gsap"

const ITEMS_PER_PAGE = 6
const NO_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

const normalizeTags = (tag: unknown): string[] => {
  if (Array.isArray(tag)) {
    return tag.map((t) => String(t).trim()).filter(Boolean)
  }
  if (typeof tag === "string") {
    return tag
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

export default function KategoriPage() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string>(TAG_OPTIONS[0] ?? "")
  const [page, setPage] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const animating = useRef(false)

  useEffect(() => {
    ;(async function () {
      const data = await getCategories()
      const sorted: ICategory[] = [...data].sort((a, b) =>
        a.title.localeCompare(b.title, "id")
      )
      setCategories(sorted)
      setLoaded(true)
    })()
  }, [])

  useEffect(() => {
    const root = heroRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          "[data-hero-tag]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        )
        .fromTo(
          "[data-hero-title]",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          "-=0.25"
        )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          "-=0.3"
        )
    }, root)
    return () => ctx.revert()
  }, [])

  const filtered = useMemo(() => {
    const target = selectedTag.trim().toLowerCase()
    if (!target) return []
    return categories.filter((c) =>
      normalizeTags((c as any).tag).some((t) => t.toLowerCase() === target)
    )
  }, [categories, selectedTag])

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    TAG_OPTIONS.forEach((tag) => {
      const target = tag.trim().toLowerCase()
      counts[tag] = categories.filter((c) =>
        normalizeTags((c as any).tag).some((t) => t.toLowerCase() === target)
      ).length
    })
    return counts
  }, [categories])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const currentItems = filtered.slice(
    safePage * ITEMS_PER_PAGE,
    (safePage + 1) * ITEMS_PER_PAGE
  )

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const cards = el.querySelectorAll(".cat-card")
    animating.current = false
    if (!cards.length) return
    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      }
    )
    return () => {
      tween.kill()
      gsap.set(cards, { clearProps: "all" })
    }
  }, [selectedTag, safePage, loaded])

  const changePage = (target: number, dir: "left" | "right") => {
    if (animating.current) return
    if (target === safePage || target < 0 || target >= totalPages) return
    const cards = gridRef.current?.querySelectorAll(".cat-card")
    if (!cards || !cards.length) {
      setPage(target)
      return
    }
    animating.current = true
    gsap.to(cards, {
      opacity: 0,
      x: dir === "left" ? -24 : 24,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setPage(target),
    })
  }

  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) return
    const cards = gridRef.current?.querySelectorAll(".cat-card")
    if (cards && cards.length) gsap.killTweensOf(cards)
    animating.current = false
    setPage(0)
    setSelectedTag(tag)
  }

  const arrowClass =
    "flex h-9 w-9 items-center justify-center rounded-sm bg-white text-third shadow-sm ring-1 ring-third/10 transition-all duration-150 hover:bg-third hover:text-white disabled:cursor-default disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-third"

  return (
    <div className="min-h-screen bg-bg-site font-sans">
      <div
        ref={heroRef}
        className="border-b border-dashed border-third/25 pb-8 pt-[96px] md:pb-10 md:pt-[120px]"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 md:px-14">
          <p
            data-hero-tag
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-third/50"
            style={{ opacity: 0 }}
          >
            Jelajahi
          </p>
          <h1
            data-hero-title
            className="font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold uppercase leading-[1.25] text-third"
            style={{ opacity: 0 }}
          >
            Daftar <em className="not-italic text-second">Kategori</em>
          </h1>
          <p
            data-hero-sub
            className="mt-3 max-w-lg text-[13px] leading-relaxed text-third/60 md:text-[14px]"
            style={{ opacity: 0 }}
          >
            Temukan produk berdasarkan kategori yang tersedia di Bandar Musik Jakarta.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-8 md:px-14 md:pb-24 md:pt-8">
        <div className={`mb-6 flex gap-2 overflow-x-auto md:mb-8 md:flex-wrap ${NO_SCROLLBAR}`}>
          {TAG_OPTIONS.map((tag) => {
            const active = selectedTag === tag
            return (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                aria-pressed={active}
                className={`flex h-9 flex-shrink-0 items-center gap-2 rounded-sm px-3.5 font-poppins text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 md:text-[12px] ${
                  active
                    ? "bg-third text-white"
                    : "bg-white text-third/60 ring-1 ring-third/15 hover:text-third hover:ring-third/40"
                }`}
              >
                {tag}
                <span
                  className={`rounded-sm px-1.5 py-[2px] text-[10px] leading-none tabular-nums ${
                    active ? "bg-second text-third" : "bg-third/5 text-third/50"
                  }`}
                >
                  {tagCounts[tag] ?? 0}
                </span>
              </button>
            )
          })}
        </div>

        <div
          key={`${selectedTag}-${safePage}`}
          ref={gridRef}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
        >
          {!loaded &&
            [...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-md bg-white ring-1 ring-third/10">
                <div className="aspect-[16/10] bg-third/10" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-2/3 rounded-sm bg-third/10" />
                  <div className="h-3 w-1/3 rounded-sm bg-third/10" />
                </div>
              </div>
            ))}

          {loaded &&
            currentItems.map((cat) => {
              const tags = normalizeTags((cat as any).tag)
              return (
                <Link
                  href={`/kategori/${cat.title}`}
                  key={cat.id}
                  className="cat-card group flex flex-col overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-third/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-third/10"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${cat.image}`}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-second transition-transform duration-300 group-hover:scale-x-100" />
                  </div>
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-display text-[14px] font-bold leading-snug text-third md:text-[15px]">
                        {cat.title}
                      </h3>
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-sm bg-third/5 px-2 py-[3px] text-[10px] font-semibold leading-none text-third/60"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 -translate-x-1 text-third/30 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-second group-hover:opacity-100"
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
                  </div>
                </Link>
              )
            })}

          {loaded && currentItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-third/40">
              <p className="text-center font-poppins text-[13px]">
                Tidak ada kategori untuk tag{" "}
                <span className="font-semibold text-third">{selectedTag}</span>
              </p>
            </div>
          )}
        </div>

        {loaded && filtered.length > 0 && (
          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-dashed border-third/25 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-third/40 md:text-[12px]">
              {filtered.length} kategori
              <span className="hidden sm:inline">
                {" "}
                · halaman {safePage + 1} dari {totalPages}
              </span>
            </p>

            <div className="flex justify-center gap-2">
              {totalPages > 1 &&
                Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i, i > safePage ? "left" : "right")}
                    aria-label={`Ke halaman ${i + 1}`}
                    className={`h-[3px] rounded-sm border-none transition-all duration-300 ${
                      i === safePage ? "w-9 bg-second" : "w-6 bg-third/20"
                    }`}
                  />
                ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => changePage(safePage - 1, "right")}
                disabled={safePage === 0}
                aria-label="Halaman sebelumnya"
                className={arrowClass}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => changePage(safePage + 1, "left")}
                disabled={safePage >= totalPages - 1}
                aria-label="Halaman selanjutnya"
                className={arrowClass}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}