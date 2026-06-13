"use client"
import { ICategory, IProduct } from "@/interface"
import Image from "next/image"
import { useEffect, useState } from "react"

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
        className="font-poppins text-[12px] font-medium w-full border border-third/10 rounded-lg px-2 py-1.5 bg-third/4 text-third outline-none focus:border-second focus:bg-white transition-colors"
      />
    </div>
  )
}

export default function ProductRow({ product, onSave, onDelete, kategori }: { product: IProduct, onSave: (product: IProduct) => void, onDelete: (url: string) => void, kategori: ICategory[] }) {
  const [row, setRow] = useState<IProduct>(product)
  const [promoOn, setPromoOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [katSearch, setKatSearch] = useState("")
  const [katOpen, setKatOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setRow(product)
  }, [product])

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
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
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
      ? { label: "Habis", cls: "bg-red-50 text-red-700" }
      : (row.stock ?? 0) < 10
      ? { label: "Menipis", cls: "bg-amber-50 text-amber-700" }
      : { label: "Aman", cls: "bg-green-50 text-green-700" }

  return (
    <tr className={`border-b border-third/8 align-top transition-colors ${isDirty ? "bg-second/5" : "hover:bg-third/[0.02]"}`}>

      {/* Produk */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="image-parent-table">
            {product.images?.[0]?.[0] && (
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0][0]}`}
                alt={product.name}
                width={36}
                height={36}
                className="rounded-lg object-cover flex-shrink-0"
              />
            )}
          </div>
          <div>
            <p className="font-poppins text-[10px] text-third/40 uppercase tracking-wider mb-0.5">
              {product.brandId}
            </p>
            <p className="font-poppins text-[12px] font-medium text-third leading-snug">
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
          className="font-poppins text-[12px] w-14 text-center border border-third/10 rounded-lg px-2 py-1.5 bg-third/4 text-third outline-none focus:border-second transition-colors"
        />
        <span className={`mt-1.5 block text-[10px] px-2 py-0.5 rounded-full text-center font-medium ${stokBadge.cls}`}>
          {stokBadge.label}
        </span>
      </td>

      {/* Harga pricelist */}
      <td className="px-3 py-3 bg-purple-50/30">
        <PriceInput value={row.pricelist} onChange={(raw) => update("pricelist", raw)} />
      </td>

      {/* Harga offline */}
      <td className="px-3 py-3 bg-teal-50/30">
        <PriceInput value={row.offlinePrice} onChange={(raw) => update("offlinePrice", raw)} />
      </td>

      {/* Harga online */}
      <td className="px-3 py-3 bg-blue-50/30">
        <PriceInput value={row.onlinePrice} onChange={(raw) => update("onlinePrice", raw)} />
      </td>

      {/* Harga promo */}
      <td className="px-3 py-3 bg-amber-50/30">
        <PriceInput value={row.promo} onChange={(raw) => update("promo", raw)} />
        {promoOn && promoDisc > 0 && (
          <span className="mt-1.5 block text-[10px] px-2 py-0.5 rounded-full text-center font-medium bg-amber-50 text-amber-700 w-fit">
            -{promoDisc}%
          </span>
        )}
      </td>

      {/* Set promo */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-2.5">
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
              <div className={`w-8 h-4 rounded-full transition-colors ${promoOn ? "bg-green-500" : "bg-third/15"}`} />
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${promoOn ? "translate-x-4" : ""}`} />
            </div>
            <span className="font-poppins text-[11px] text-third/55">
              {promoOn ? "Aktif" : "Nonaktif"}
            </span>
          </label>

          {promoOn && (
            <select
              value={row.namaPromo ?? ""}
              onChange={(e) => update("namaPromo", e.target.value)}
              className="font-poppins text-[11px] border border-third/10 rounded-lg px-2 py-1.5 bg-white text-third outline-none focus:border-second transition-colors w-full"
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
      <td className="px-3 py-3 bg-green-50/30">
        <div className="relative">
          <button
            onClick={() => { setKatOpen(v => !v); setKatSearch("") }}
            className="w-full text-left font-poppins text-[11px] border border-third/10 rounded-lg px-2 py-1.5 bg-third/4 text-third outline-none hover:border-second transition-colors flex items-center justify-between gap-1"
          >
            <span className={selectedKat ? "text-third" : "text-third/30"}>
              {selectedKat?.title || "Pilih kategori"}
            </span>
            <svg className={`w-3 h-3 text-third/30 flex-shrink-0 transition-transform ${katOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {katOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-48 bg-white border border-third/10 rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 border-b border-third/8">
                <input
                  type="text"
                  value={katSearch}
                  onChange={(e) => setKatSearch(e.target.value)}
                  placeholder="Cari kategori..."
                  autoFocus
                  className="w-full font-poppins text-[11px] px-2 py-1.5 rounded-lg border border-third/10 bg-third/4 text-third outline-none focus:border-second transition-colors placeholder:text-third/30"
                />
              </div>

              <div className="max-h-48 overflow-y-auto">
                <button
                  onClick={() => { update("kategoriId", ""); setKatOpen(false); setKatSearch("") }}
                  className="w-full text-left px-3 py-2 font-poppins text-[11px] text-third/35 hover:bg-third/4 transition-colors italic"
                >
                  Tanpa kategori
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
                    {k.title}
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
          <span className="mt-1.5 block font-poppins text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-center truncate">
            {selectedKat.title}
          </span>
        )}
      </td>

      {/* Aksi */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleSave}
            disabled={!isDirty || loading}
            className={`font-poppins text-[11px] px-3 py-1.5 rounded-lg transition-colors w-full font-medium
              ${isDirty && !loading
                ? "bg-green-500 text-white hover:bg-green-600"
                : saved
                ? "bg-green-50 text-green-700"
                : "bg-third/5 text-third/25 cursor-not-allowed"
              }`}
          >
            {loading ? "Menyimpan..." : saved ? "✓ Tersimpan" : "Simpan"}
          </button>

          {isDirty && (
            <button
              onClick={handleReset}
              className="font-poppins text-[11px] px-3 py-1.5 rounded-lg border border-third/10 text-third/40 hover:text-third/70 transition-colors w-full"
            >
              Reset
            </button>
          )}

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="font-poppins text-[11px] px-3 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors w-full"
            >
              Hapus
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="font-poppins text-[10px] text-red-500 text-center leading-tight">
                Yakin hapus produk ini?
              </p>
              <div className="flex gap-1">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 font-poppins text-[11px] px-2 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium disabled:opacity-60"
                >
                  {deleting ? "..." : "Ya"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 font-poppins text-[11px] px-2 py-1.5 rounded-lg border border-third/10 text-third/50 hover:text-third/70 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </td>

    </tr>
  )
}