import { IProduct } from "@/interface"
import { SetStateAction, useState } from "react"

function PriceInput({ value, onChange}: { value: any, onChange: SetStateAction<any>  }) {
  const [display, setDisplay] = useState(
    value ? Number(value).toLocaleString("id-ID") : ""
  )

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

export default function ProductRow({ product , onUpdate }: { product: IProduct, onUpdate: SetStateAction<any> }) {
  const [promoOn, setPromoOn] = useState(false)

  const handlePrice = (field: string, raw: string) => {
    const num = parseInt(raw.replace(/\D/g, "")) || 0
    onUpdate(product.id, field, num)
  }

  const handleTogglePromo = (val: boolean) => {
    setPromoOn(val)
    onUpdate(product.id, "promoOn", val)
  }

  const fmtInput = (val: string) =>
    val ? Number(val).toLocaleString("id-ID") : ""

  const promoDisc = parseInt(product.pricelist!) > 0 ? Math.round((1 - parseInt(product.promo!) / parseInt(product.pricelist!)) * 100) : 0

  const stokBadge =
    product.stock === 0
      ? { label: "Habis", cls: "bg-red-50 text-red-700" }
      : product.stock < 10
      ? { label: "Menipis", cls: "bg-amber-50 text-amber-700" }
      : { label: "Aman", cls: "bg-green-50 text-green-700" }

    console.log(product, 'barangggg')

  return (
    <tr className="border-b border-third/8 hover:bg-third/[0.02] align-top">

      {/* Produk */}
      <td className="px-4 py-3">
        <p className="font-poppins text-[10px] text-third/40 uppercase tracking-wider mb-0.5">
          {product.brandId}
        </p>
        <p className="font-poppins text-[12px] font-medium text-third leading-snug">
          {product.name}
        </p>
      </td>

      {/* Stok */}
      <td className="px-3 py-3">
        <input
          type="number"
          min={0}
          defaultValue={product.stock}
          onChange={(e) => onUpdate(product.id, "stok", parseInt(e.target.value) || 0)}
          className="font-poppins text-[12px] w-14 text-center border border-third/10 rounded-lg px-2 py-1.5 bg-third/4 text-third outline-none focus:border-second transition-colors"
        />
        <span className={`mt-1.5 block text-[10px] px-2 py-0.5 rounded-full text-center font-medium ${stokBadge.cls}`}>
          {stokBadge.label}
        </span>
      </td>

      {/* Harga pricelist */}
      <td className="px-3 py-3 bg-purple-50/30">
        <PriceInput
          value={product.pricelist}
          onChange={(raw: string) => handlePrice("pricelist", raw)}
        />
      </td>

      {/* Harga offline */}
      <td className="px-3 py-3 bg-teal-50/30">
        <PriceInput
          value={product.offlinePrice}
          onChange={(raw: string) => handlePrice("offline", raw)}
        />
      </td>

      {/* Harga online */}
      <td className="px-3 py-3 bg-blue-50/30">
        <PriceInput
          value={product.onlinePrice}
          onChange={(raw: string) => handlePrice("online", raw)}
        />
      </td>

      {/* Harga promo */}
      <td className="px-3 py-3 bg-amber-50/30">
        <PriceInput
          value={product.promo}
          onChange={(raw: string) => handlePrice("promo", raw)}
        />
        {promoOn && promoDisc > 0 && (
          <span className="mt-1.5 block text-[10px] px-2 py-0.5 rounded-full text-center font-medium bg-amber-50 text-amber-700 w-fit">
            -{promoDisc}%
          </span>
        )}
      </td>

      {/* Set promo */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-2.5">

          {/* Toggle */}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div className="relative">
              <input
                type="checkbox"
                checked={promoOn}
                onChange={(e) => handleTogglePromo(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-8 h-4 rounded-full transition-colors ${promoOn ? "bg-green-500" : "bg-third/15"}`} />
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${promoOn ? "translate-x-4" : ""}`} />
            </div>
            <span className="font-poppins text-[11px] text-third/55">
              {promoOn ? "Aktif" : "Nonaktif"}
            </span>
          </label>

          {/* Tipe promo — hanya muncul kalau aktif */}
          {promoOn && (
            <select
              defaultValue={product.namaPromo ?? ""}
              onChange={(e) => onUpdate(product.id, "promoType", e.target.value)}
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

    </tr>
  )
}