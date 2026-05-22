"use client"
import Link from "next/link"
import { GiDrumKit, GiGuitar, GiPianoKeys, GiMicrophone, GiSpeaker, GiSoundWaves, GiHeadphones } from "react-icons/gi"
import { IconType } from "react-icons"
import { useRef } from "react"

const KATEGORI = [
  { label: "Gitar", icon: GiGuitar,     href: "/kategori/Gitar Elektrik" },
  { label: "Bass",  icon: GiGuitar,      href: "/kategori/Bass Elektrik"  },
  { label: "Drum & Perkusi",  icon: GiDrumKit,     href: "/kategori/Drum Elektrik"  },
  { label: "Piano & Keyboard",  icon: GiPianoKeys,   href: "/kategori/Digital Piano"  },
  { label: "Efek Gitar",    icon: GiSoundWaves,  href: "/kategori/Pedal Gitar"    },
  { label: "Mikrofon",     icon: GiMicrophone,  href: "/kategori/Microphone"     },
  { label: "Speaker", icon: GiSpeaker,     href: "/kategori/Active Speaker" },
  { label: "DJ Gear",  icon: GiHeadphones,  href: "/kategori/DJ Controller"  },
]

function KategoriCard({ label, icon: Icon, href }: { label: string, icon: IconType, href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 min-w-[100px] md:min-w-[120px] flex-shrink-0"
    >
      <Icon
        size={64}
        className="text-third/70 group-hover:text-third transition-colors duration-200"
      />
      <p className="font-poppins text-[12px] md:text-[13px] text-third/65 text-center leading-snug group-hover:text-third transition-colors duration-200">
        {label}
      </p>
    </Link>
  )
}

export default function KategoriShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" })
  }

  return (
    <section className="py-8 mb-20">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 md:mx-20">
        <h2 className="font-poppins text-[15px] md:text-[36px] font-bold text-third whitespace-nowrap">
          Berdasarkan Kategori
        </h2>
        <div className="w-px h-5 bg-third/20 flex-shrink-0" />
        <Link
          href="/kategori"
          className="font-poppins text-[13px] text-third/55 hover:text-third transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          Lihat Semua Kategori
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Divider atas */}
      <div className="w-full h-px bg-third/8 mb-6" />

      {/* Scroll row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide pb-2 md:mx-20"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {KATEGORI.map(k => (
            <KategoriCard key={k.label} {...k} />
          ))}
        </div>

        {/* Arrow kanan */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-third/10 flex items-center justify-center shadow-sm hover:border-third/25 transition-all"
        >
          <svg className="w-4 h-4 text-third/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Divider bawah */}
      <div className="w-full h-px bg-third/8 mt-6" />

    </section>
  )
}