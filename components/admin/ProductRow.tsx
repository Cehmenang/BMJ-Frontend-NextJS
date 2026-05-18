"use client"
import { IProduct } from "@/interface"
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

export default function ProductRow({ product, onSave }: { product: IProduct, onSave: (product: IProduct) => void }) {
  const [row, setRow] = useState<IProduct>(product)
  const [promoOn, setPromoOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setRow(product)
  }, [product])

  const update = (field: string, value: any) => {
    setRow(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    console.log(row, 'baris diubah')
    await onSave(row)
    setLoading(false)
    setSaved(true)
    setIsDirty(false)
  }

  const handleReset = () => {
    setRow(product)
    setPromoOn(false)
    setIsDirty(false)
    setSaved(false)
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
        </div>
      </td>

    </tr>
  )
}