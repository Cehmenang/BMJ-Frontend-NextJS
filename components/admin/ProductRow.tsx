"use client"
import { ICategory, IProduct } from "@/interface"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  Save, RotateCcw, Trash2, Check, X, ChevronDown,
  Search, PlayCircle, AlertTriangle, FolderX, ImageOff,
} from "lucide-react"

function PriceInput({ value, onChange }: { value: any, onChange: (raw: string) => void }) {
  const [display, setDisplay] = useState("")
  useEffect(() => {
    setDisplay(value ? Number(value).toLocaleString("id-ID") : "")
  }, [value])
  const handleChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "")
    setDisplay(raw ? Number(raw).toLocaleString("id-ID") : "")
    onChange(raw)
  }
  return (
    <div className="flex items-center gap-1">
      <span className="font-poppins text-[10px] text-third/35 flex-shrink-0">Rp</span>
      <input
        type="text"
        value={display}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        className="font-poppins text-[12px] font-medium w-full border border-third/10 rounded-lg px-2 py-1.5 bg-primary text-third outline-none focus:border-second focus:ring-2 focus:ring-second/15 transition-all"
      />
    </div>
  )
}

export default function ProductRow({
  product, onSave, onDelete, kategori, index = 0,
}: {
  product: IProduct
  onSave: (product: IProduct) => void
  onDelete: (url: string) => void
  kategori: ICategory[]
  index?: number
}) {
  const [row, setRow] = useState<IProduct>(product)
  const [promoOn, setPromoOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [katSearch, setKatSearch] = useState("")
  const [katOpen, setKatOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const katRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRow(product)
  }, [product])

  // tutup dropdown kategori kalau klik di luar
  useEffect(() => {
    if (!katOpen) return
    const handler = (e: MouseEvent) => {
      if (katRef.current && !katRef.current.contains(e.target as Node)) {
        setKatOpen(false)
        setKatSearch("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [katOpen])

  const update = (field: string, value: any) => {
    setRow(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setSaved(false)
  }

  const selectedKat = kategori.find(k => k.title === row.kategoriId)
  const filteredKat = katSearch
    ? kategori.filter(k => k.title.toLowerCase().includes(katSearch.toLowerCase()))
    : kategori

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/update/harga/${row.url}`, {
        method: "POST",
        body: JSON.stringify({
          pricelist:    String(row.pricelist ?? ""),
          offlinePrice: String(row.offlinePrice ?? ""),
          onlinePrice:  String(row.onlinePrice ?? ""),
          promo:        String(row.promo ?? ""),
          stock:        String(row.stock ?? ""),
          namaPromo:    String(row.namaPromo ?? ""),
          kategoriId:   row.kategoriId ?? "",
          video:        row.video ?? "",
        }),
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      })
      const data = await response.text()
      if (!response.ok) console.log(data, "error")
    } catch (err) {
      console.log(err)
    }
    await onSave(row)
    setLoading(false)
    setSaved(true)
    setIsDirty(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/hapus/produk/${row.url}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
        next: { tags: ['products'] }
      })
      if (!response.ok) {
        const data = await response.text()
        console.log(data, "error delete")
        setDeleting(false)
        setConfirmDelete(false)
        return
      }
      onDelete(row.url!)
    } catch (err) {
      console.log(err)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleReset = () => {
    setRow(product)
    setPromoOn(false)
    setIsDirty(false)
    setSaved(false)
    setKatSearch("")
    setKatOpen(false)
  }

  const promoDisc =
    parseInt(row.pricelist!) > 0
      ? Math.round((1 - parseInt(row.promo!) / parseInt(row.pricelist!)) * 100)
      : 0

  const stokBadge =
    (row.stock ?? 0) === 0
      ? { label: "Habis", cls: "bg-red-50 text-red-600" }
      : (row.stock ?? 0) < 10
      ? { label: "Menipis", cls: "bg-amber-50 text-amber-700" }
      : { label: "Aman", cls: "bg-emerald-50 text-emerald-700" }

  return (
    <tr
      style={{ animation: `rowFadeIn 0.35s ease-out backwards`, animationDelay: `${Math.min(index * 25, 300)}ms` }}
      className={`border-b border-third/8 align-top transition-colors duration-200 group ${
        isDirty ? "bg-second/[0.04]" : "hover:bg-third/[0.02]"
      }`}
    >
      {/* Produk (sticky) */}
      <td className={`sticky left-0 z-10 px-4 py-3 shadow-[4px_0_6px_-4px_rgba(0,0,0,0.05)] transition-colors duration-200 ${
        isDirty ? "bg-[#fdf3e8]" : "bg-primary group-hover:bg-[#f7f6f2]"
      }`}>
        <div className="flex items-center gap-2.5">
          {isDirty && <span className="w-1 h-8 rounded-full bg-second flex-shrink-0" />}
          <div className="w-9 h-9 rounded-lg bg-third/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.images?.[0]?.[0] ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0][0]}`}
                alt={product.name}
                width={36}
                height={36}
                className="rounded-lg object-cover"
              />
            ) : (
              <ImageOff size={14} className="text-third/25" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-poppins text-[10px] text-third/40 uppercase tracking-wider mb-0.5 truncate">
              {product.brandId}
            </p>
            <p className="font-poppins text-[12px] font-medium text-third leading-snug line-clamp-2">
              {product.name}
            </p>
          </div>
        </div>
      </td>

      {/* Stok */}
      <td className="px-3 py-3">
        <input
          type="number"
          min={0}
          value={row.stock ?? 0}
          onChange={(e) => update("stock", parseInt(e.target.value) || 0)}
          className="font-poppins text-[12px] w-16 text-center border border-third/10 rounded-lg px-2 py-1.5 bg-primary text-third outline-none focus:border-second focus:ring-2 focus:ring-second/15 transition-all"
        />
        <span className={`mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded-full text-center font-medium transition-colors ${stokBadge.cls}`}>
          {stokBadge.label}
        </span>
      </td>

      {/* Harga pricelist */}
      <td className="px-3 py-3 bg-second/[0.025]">
        <PriceInput value={row.pricelist} onChange={(raw) => update("pricelist", raw)} />
      </td>

      {/* Harga offline */}
      <td className="px-3 py-3 bg-second/[0.025]">
        <PriceInput value={row.offlinePrice} onChange={(raw) => update("offlinePrice", raw)} />
      </td>

      {/* Harga online */}
      <td className="px-3 py-3 bg-second/[0.025]">
        <PriceInput value={row.onlinePrice} onChange={(raw) => update("onlinePrice", raw)} />
      </td>

      {/* Harga promo */}
      <td className="px-3 py-3 bg-second/[0.025]">
        <PriceInput value={row.promo} onChange={(raw) => update("promo", raw)} />
        {promoOn && promoDisc > 0 && (
          <span className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded-full text-center font-medium bg-second/15 text-second w-fit">
            -{promoDisc}%
          </span>
        )}
      </td>

      {/* Set promo */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-2.5 items-center">
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div className="relative">
              <input
                type="checkbox"
                checked={promoOn}
                onChange={(e) => {
                  setPromoOn(e.target.checked)
                  update("promoOn", e.target.checked)
                }}
                className="sr-only"
              />
              <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${promoOn ? "bg-second" : "bg-third/15"}`} />
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${promoOn ? "translate-x-4" : ""}`} />
            </div>
            <span className="font-poppins text-[11px] text-third/55">
              {promoOn ? "Aktif" : "Nonaktif"}
            </span>
          </label>
          {promoOn && (
            <select
              style={{ animation: "popIn 0.15s ease-out" }}
              value={row.namaPromo ?? ""}
              onChange={(e) => update("namaPromo", e.target.value)}
              className="font-poppins text-[11px] border border-third/10 rounded-lg px-2 py-1.5 bg-primary text-third outline-none focus:border-second focus:ring-2 focus:ring-second/15 transition-all w-full"
            >
              <option value="" disabled>Pilih tipe promo</option>
              <option>Flash sale</option>
              <option>Diskon hari raya</option>
              <option>Bundle</option>
              <option>Member</option>
              <option>Clearance</option>
              <option>Voucher</option>
            </select>
          )}
        </div>
      </td>

      {/* Kategori */}
      <td className="px-3 py-3">
        <div className="relative" ref={katRef}>
          <button
            onClick={() => { setKatOpen(v => !v); setKatSearch("") }}
            className={`w-full text-left font-poppins text-[11px] border rounded-lg px-2 py-1.5 bg-primary text-third outline-none transition-all flex items-center justify-between gap-1 ${
              katOpen ? "border-second ring-2 ring-second/15" : "border-third/10 hover:border-second/50"
            }`}
          >
            <span className={selectedKat ? "text-third truncate" : "text-third/30"}>
              {selectedKat?.title || "Pilih kategori"}
            </span>
            <ChevronDown size={12} className={`text-third/30 flex-shrink-0 transition-transform duration-200 ${katOpen ? "rotate-180" : ""}`} />
          </button>

          {katOpen && (
            <div
              style={{ animation: "popIn 0.15s ease-out" }}
              className="absolute top-[calc(100%+4px)] left-0 z-30 w-48 bg-primary border border-third/10 rounded-xl shadow-lg overflow-hidden origin-top"
            >
              <div className="p-2 border-b border-third/8 relative">
                <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-third/30" />
                <input
                  type="text"
                  value={katSearch}
                  onChange={(e) => setKatSearch(e.target.value)}
                  placeholder="Cari kategori..."
                  autoFocus
                  className="w-full font-poppins text-[11px] pl-6 pr-2 py-1.5 rounded-lg border border-third/10 bg-bg-site text-third outline-none focus:border-second transition-colors placeholder:text-third/30"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                <button
                  onClick={() => { update("kategoriId", ""); setKatOpen(false); setKatSearch("") }}
                  className="w-full text-left px-3 py-2 font-poppins text-[11px] text-third/35 hover:bg-third/4 transition-colors italic flex items-center gap-2"
                >
                  <FolderX size={12} /> Tanpa kategori
                </button>
                {filteredKat.length > 0 ? filteredKat.map(k => (
                  <button
                    key={k.id}
                    onClick={() => { update("kategoriId", k.title); setKatOpen(false); setKatSearch("") }}
                    className={`w-full text-left px-3 py-2 font-poppins text-[11px] transition-colors flex items-center gap-2
                      ${row.kategoriId === k.title
                        ? "bg-second/10 text-third font-medium"
                        : "text-third/70 hover:bg-third/4"
                      }`}
                  >
                    {k.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${k.image}`}
                        alt={k.title}
                        width={16}
                        height={16}
                        className="rounded object-cover flex-shrink-0"
                      />
                    )}
                    <span className="truncate">{k.title}</span>
                  </button>
                )) : (
                  <p className="px-3 py-3 font-poppins text-[11px] text-third/30 text-center">
                    Tidak ditemukan
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        {selectedKat && (
          <span className="mt-1.5 inline-block max-w-full font-poppins text-[10px] px-2 py-0.5 rounded-full bg-third/8 text-third/60 text-center truncate">
            {selectedKat.title}
          </span>
        )}
      </td>

      {/* Video */}
      <td className="px-3 py-3">
        <input
          type="text"
          value={row.video ?? ""}
          onChange={(e) => update("video", e.target.value)}
          placeholder="Link YouTube..."
          className="font-poppins text-[11px] w-full border border-third/10 rounded-lg px-2 py-1.5 bg-primary text-third outline-none focus:border-second focus:ring-2 focus:ring-second/15 transition-all"
        />
        {row.video && (
          <a
            href={row.video}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 flex items-center gap-1 font-poppins text-[10px] text-second hover:text-second/80 transition-colors truncate"
          >
            <PlayCircle size={11} /> Lihat video
          </a>
        )}
      </td>

      {/* Aksi */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleSave}
            disabled={!isDirty || loading}
            className={`flex items-center justify-center gap-1.5 font-poppins text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 w-full font-medium active:scale-95
              ${isDirty && !loading
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
                : saved
                ? "bg-emerald-50 text-emerald-700"
                : "bg-third/5 text-third/25 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <Check size={12} />
            ) : (
              <Save size={12} />
            )}
            {loading ? "Menyimpan..." : saved ? "Tersimpan" : "Simpan"}
          </button>

          {isDirty && (
            <button
              onClick={handleReset}
              style={{ animation: "popIn 0.15s ease-out" }}
              className="flex items-center justify-center gap-1.5 font-poppins text-[11px] px-3 py-1.5 rounded-lg border border-third/10 text-third/40 hover:text-third/70 hover:border-third/20 transition-all active:scale-95 w-full"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1.5 font-poppins text-[11px] px-3 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all active:scale-95 w-full"
            >
              <Trash2 size={11} /> Hapus
            </button>
          ) : (
            <div
              style={{ animation: "popIn 0.15s ease-out" }}
              className="flex flex-col gap-1.5 bg-red-50/60 border border-red-100 rounded-lg p-1.5"
            >
              <p className="flex items-center justify-center gap-1 font-poppins text-[10px] text-red-500 text-center leading-tight">
                <AlertTriangle size={11} /> Yakin hapus?
              </p>
              <div className="flex gap-1">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-1 font-poppins text-[11px] px-2 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all font-medium disabled:opacity-60 active:scale-95"
                >
                  {deleting ? (
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check size={11} />
                  )}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center font-poppins text-[11px] px-2 py-1.5 rounded-lg border border-third/10 text-third/50 hover:text-third/70 transition-all active:scale-95"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}