"use client"
import { countDatas } from "@/action/search"
import { useEffect, useState } from "react"
import { Package, Tag, Layers } from "lucide-react"

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
    color: "bg-second/10 text-second",
    iconBg: "bg-second",
  },
  {
    key: "brands" as keyof CountData,
    label: "Total Brand",
    sublabel: "Brand aktif",
    icon: Tag,
    color: "bg-third/8 text-third",
    iconBg: "bg-third",
  },
  {
    key: "kategori" as keyof CountData,
    label: "Total Kategori",
    sublabel: "Kategori tersedia",
    icon: Layers,
    color: "bg-third-light/10 text-third-light",
    iconBg: "bg-third-light",
  },
]

function StatCard({
  label,
  sublabel,
  value,
  icon: Icon,
  iconBg,
  loading,
}: {
  label: string
  sublabel: string
  value: number
  icon: React.ElementType
  iconBg: string
  loading: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-third/8 p-5 md:p-6 flex items-center gap-4 hover:border-third/15 hover:shadow-[0_4px_20px_rgba(62,63,32,0.06)] transition-all duration-200">

      {/* Icon */}
      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 md:w-5 md:h-5 text-primary" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="font-poppins text-[11px] text-third/45 mb-0.5 truncate">{label}</p>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-6 w-16 bg-third/8 rounded-lg animate-pulse" />
            <div className="h-2.5 w-20 bg-third/6 rounded-full animate-pulse" />
          </div>
        ) : (
          <>
            <p className="font-poppins text-[26px] md:text-[28px] font-extrabold text-third leading-none">
              {value.toLocaleString("id-ID")}
            </p>
            <p className="font-poppins text-[10.5px] text-third/35 mt-0.5">{sublabel}</p>
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
    <div className="min-h-screen bg-bg-site p-4 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-poppins text-[11px] font-semibold tracking-[0.18em] uppercase text-second mb-1">
          Dashboard
        </p>
        <h1 className="font-play text-[clamp(24px,3vw,36px)] font-bold text-third leading-tight">
          Ringkasan <em className="text-second not-italic">Data</em>
        </h1>
        <p className="font-poppins text-[12.5px] text-third/45 mt-1.5">
          Total keseluruhan data yang terdaftar di sistem.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {STATS.map((stat) => (
          <StatCard
            key={stat.key}
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
        <p className="font-poppins text-[11px] text-third/25 mt-5 text-right">
          Data diperbarui secara realtime
        </p>
      )}
    </div>
  )
}