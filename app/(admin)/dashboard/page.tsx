"use client"
import { countDatas } from "@/action/search"
import { useEffect, useState } from "react"
import { Package, Tag, Layers, Plus } from "lucide-react"
import Link from "next/link"

type CountData = {
  produk: number
  categories: number
  brands: number
}

const STATS = [
  {
    key: "produk" as keyof CountData,
    label: "Total Produk",
    sublabel: "Produk terdaftar",
    icon: Package,
    iconBg: "bg-second",
  },
  {
    key: "brands" as keyof CountData,
    label: "Total Brand",
    sublabel: "Brand aktif",
    icon: Tag,
    iconBg: "bg-third",
  },
  {
    key: "categories" as keyof CountData,
    label: "Total Kategori",
    sublabel: "Kategori tersedia",
    icon: Layers,
    iconBg: "bg-third-light",
  },
]

function StatCard({
  statKey,
  label,
  sublabel,
  value,
  icon: Icon,
  iconBg,
  loading,
}: {
  statKey: string
  label: string
  sublabel: string
  value: number
  icon: React.ElementType
  iconBg: string
  loading: boolean
}) {
  return (
    <div className="bg-primary rounded-2xl border border-third/8 p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:border-third/15 hover:shadow-[0_4px_20px_rgba(62,63,32,0.06)] transition-all duration-200">

      {/* Icon */}
      <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-[18px] h-[18px] md:w-5 md:h-5 text-primary" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="font-poppins text-[10.5px] md:text-[11px] text-third/45 mb-0.5 truncate">{label}</p>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-5 w-14 bg-third/8 rounded-lg animate-pulse" />
            <div className="h-2.5 w-16 bg-third/6 rounded-full animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between gap-2">
              <p className="font-poppins text-[22px] md:text-[24px] font-extrabold text-third leading-none">
                {value.toLocaleString("id-ID")}
              </p>
              {statKey === "produk" && (
                <Link
                  href="/upload/product"
                  className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-second hover:text-second/80 transition-colors shrink-0"
                >
                  <Plus size={12} strokeWidth={2.5} />
                  Tambah
                </Link>
              )}
            </div>
            <p className="font-poppins text-[10px] text-third/35 mt-0.5 truncate">{sublabel}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState<CountData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async function () {
      try {
        const result = await countDatas()
        setData(result.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-bg-site px-4 py-5 md:px-6 md:py-8 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-5 md:mb-7">
          <p className="font-poppins text-[10.5px] md:text-[11px] font-semibold tracking-[0.18em] uppercase text-second mb-1">
            Dashboard
          </p>
          <h1 className="font-play text-[clamp(20px,3vw,32px)] font-bold text-third leading-tight">
            Ringkasan <em className="text-second not-italic">Data</em>
          </h1>
          <p className="font-poppins text-[12px] text-third/45 mt-1">
            Total keseluruhan data yang terdaftar di sistem.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <StatCard
              key={stat.key}
              statKey={stat.key}
              label={stat.label}
              sublabel={stat.sublabel}
              value={data?.[stat.key] ?? 0}
              icon={stat.icon}
              iconBg={stat.iconBg}
              loading={loading}
            />
          ))}
        </div>

        {/* Footer note */}
        {!loading && data && (
          <p className="font-poppins text-[10.5px] text-third/25 mt-4 text-right">
            Data diperbarui secara realtime
          </p>
        )}
      </div>
    </div>
  )
}