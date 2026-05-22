"use client"
import Link from "next/link"
import { GiDrumKit, GiGuitar, GiPianoKeys, GiMicrophone, GiSpeaker, GiSoundWaves, GiHeadphones } from "react-icons/gi"
import { IconType } from "react-icons"

const KATEGORI = [
  { label: "Gitar Elektrik", icon: GiGuitar,     href: "/kategori/Gitar Elektrik" },
  { label: "Bass Elektrik",  icon: GiGuitar,  href: "/kategori/Bass Elektrik"  },
  { label: "Drum Elektrik",  icon: GiDrumKit,     href: "/kategori/Drum Elektrik"  },
  { label: "Digital Piano",  icon: GiPianoKeys,   href: "/kategori/Digital Piano"  },
  { label: "Pedal Gitar",    icon: GiSoundWaves,  href: "/kategori/Pedal Gitar"    },
  { label: "Microphone",     icon: GiMicrophone,  href: "/kategori/Microphone"     },
  { label: "Active Speaker", icon: GiSpeaker,     href: "/kategori/Active Speaker" },
  { label: "DJ Controller",  icon: GiHeadphones, href: "/kategori/DJ Controller"  },
]

function KategoriCard({ label, icon: Icon, href }: { label: string, icon: IconType, href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-third/8 hover:border-second hover:bg-second/5 bg-white transition-all duration-200"
    >
      <div className="w-14 h-14 rounded-2xl bg-third/5 flex items-center justify-center transition-all duration-200 group-hover:bg-second/15 group-hover:scale-110">
        <Icon size={28} className="text-third/60 group-hover:text-third transition-colors duration-200" />
      </div>
      <p className="font-poppins text-[12px] font-medium text-third/70 text-center leading-snug group-hover:text-third transition-colors duration-200">
        {label}
      </p>
    </Link>
  )
}

export default function KategoriShowcase() {
  return (
    <section className="py-10">

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="font-poppins text-[11px] font-semibold tracking-[0.18em] uppercase text-third/35 mb-1">
            Kategori
          </p>
          <h2 className="font-poppins text-[22px] font-bold text-third leading-tight">
            Belanja per <em className="font-play italic text-second">Kategori</em>
          </h2>
        </div>
        <Link
          href="/kategori"
          className="font-poppins text-[12px] text-third/45 hover:text-third transition-colors flex items-center gap-1"
        >
          Lihat semua
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KATEGORI.map(k => (
          <KategoriCard key={k.label} {...k} />
        ))}
      </div>

    </section>
  )
}