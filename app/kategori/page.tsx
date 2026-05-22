"use client"
import { getCategories } from "@/action/kategori"
import { TAG_OPTIONS } from "@/config/tag"
import { ICategory } from "@/interface"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function KategoriPage() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [allTags, setAllTags] = useState<string[]>(TAG_OPTIONS)
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [filtered, setFiltered] = useState<ICategory[]>([])
  const [page, setPage] = useState(0)

  const ITEMS_PER_PAGE = 4
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async function () {
      const data = await getCategories()

      // sort abjad
      const sorted: ICategory[] = [...data].sort((a, b) =>
        a.title.localeCompare(b.title, "id")
      )

      // kumpulin semua tag unik
      const tags = Array.from(
        new Set(sorted.flatMap(c => c.tag ?? []))
      ).sort()

      setCategories(sorted)
      setAllTags(tags)
      setSelectedTag(tags[0] ?? "")
    })()
  }, [])

  // filter by tag
  useEffect(() => {
    if (!selectedTag) return
    const result = categories.filter(c => (c.tag ?? []).includes(selectedTag))
    setFiltered(result)
    setPage(0)
  }, [selectedTag, categories])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const currentItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  const prev = () => setPage(p => Math.max(0, p - 1))
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1))

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 md:mt-20 py-10">

      {/* Tag filter */}
      <div className="flex gap-2 flex-wrap mb-8">
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
        <div ref={scrollRef} className="grid grid-cols-4 gap-5 overflow-hidden">
          {currentItems.length > 0 ? currentItems.map(cat => (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-third/8 hover:border-third/20 transition-colors cursor-pointer group"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-third/5 relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${cat.image}`}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="font-poppins text-[13px] font-medium text-third text-center leading-snug">
                {cat.title}
              </p>
            </div>
          )) : (
            <div className="col-span-4 py-16 text-center font-poppins text-[13px] text-third/30">
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
              onClick={() => setPage(i)}
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