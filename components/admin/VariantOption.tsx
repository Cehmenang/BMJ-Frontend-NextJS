"use client"

import { useEffect, useRef } from "react"
import { X, Plus, ImageIcon, Upload, GripVertical } from "lucide-react"
import { IOption } from "@/interface"

const formatRupiah = (val: string) => {
  const num = val.replace(/\D/g, "")
  if (!num) return ""
  return new Intl.NumberFormat("id-ID").format(Number(num))
}

const parseRupiah = (val: string) => val.replace(/\D/g, "")

function OptionRow({
  option,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  option: IOption
  index: number
  onChange: (id: number, field: keyof IOption, value: any) => void
  onRemove: (id: number) => void
  canRemove: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (file: File) => {
    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) return
    onChange(option.id, "image", file)
    onChange(option.id, "imagePreview", URL.createObjectURL(file))
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-third/10 hover:border-third/18 transition-colors group">

      {/* Drag handle */}
      <div className="flex-shrink-0 text-third/20 group-hover:text-third/40 cursor-grab transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Index */}
      <div className="w-5 flex-shrink-0 text-center font-poppins text-[11px] text-third/30 font-medium">
        {index + 1}
      </div>

      {/* Image upload */}
      <div className="flex-shrink-0">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImage(file)
          }}
        />
        {option.imagePreview ? (
          <div
            className="relative w-12 h-12 rounded-lg overflow-hidden border border-third/12 bg-third/3 cursor-pointer group/img flex-shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            <img
              src={option.imagePreview}
              alt="variant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-third/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-12 h-12 rounded-lg border-2 border-dashed border-third/15 bg-third/2 hover:border-third/30 hover:bg-third/5 flex items-center justify-center transition-all duration-200 flex-shrink-0 group/img"
          >
            <ImageIcon className="w-4 h-4 text-third/25 group-hover/img:text-third/50 transition-colors" />
          </button>
        )}
      </div>

      {/* Value */}
      <input
        type="text"
        value={option.name}
        onChange={(e) => onChange(option.id, "name", e.target.value)}
        placeholder="Nama varian, misal: Merah, XL, 64GB…"
        className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-third/10 bg-bg-site font-poppins text-[12.5px] text-third placeholder:text-third/25 outline-none focus:border-third/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(62,63,32,0.04)] transition-all"
      />

      {/* Price */}
      <div className="relative flex-shrink-0 w-36">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-poppins text-[11px] text-third/35 pointer-events-none">
          Rp
        </span>
        <input
          type="text"
          value={option.harga}
          onChange={(e) => {
            const raw = parseRupiah(e.target.value)
            onChange(option.id, "harga", raw ? formatRupiah(raw) : "")
          }}
          placeholder="0"
          className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-third/10 bg-bg-site font-poppins text-[12.5px] text-third placeholder:text-third/25 outline-none focus:border-third/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(62,63,32,0.04)] transition-all text-right"
        />
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(option.id)}
        disabled={!canRemove}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-third/25 hover:text-red-400 hover:bg-red-50 disabled:opacity-0 disabled:pointer-events-none transition-all flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function VariantOptions({ options, setOptions }: { options: IOption[], setOptions: React.SetStateAction<any> }) {
    
  const addOption = () => {
    setOptions((prev: IOption[]) => [
       ...prev,
      { id: prev.length + 1, image: null, imagePreview: null, name: "", harga: "" },
    ])
  }

  const removeOption = (id: number) => {
    setOptions((prev:IOption[]) => prev.filter(o => o.id !== id))
  }

  const handleChange = (id: number, field: keyof IOption, value: any) => {
    setOptions((prev:IOption[]) =>{
      return prev.map(o => o.id === id ? { ...o, [field]: value } : o)
    })
  }

  return (
    <div className="space-y-2">

      {/* Column headers */}
      <div className="flex items-center gap-3 px-3 pb-1">
        <div className="w-4 flex-shrink-0" />
        <div className="w-5 flex-shrink-0" />
        <div className="w-12 flex-shrink-0">
          <span className="font-poppins text-[10px] font-semibold uppercase tracking-[0.1em] text-third/35">Foto</span>
        </div>
        <div className="flex-1">
          <span className="font-poppins text-[10px] font-semibold uppercase tracking-[0.1em] text-third/35">Nama Varian</span>
        </div>
        <div className="w-36 flex-shrink-0">
          <span className="font-poppins text-[10px] font-semibold uppercase tracking-[0.1em] text-third/35">Harga</span>
        </div>
        <div className="w-7 flex-shrink-0" />
      </div>

      {/* Option rows */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <OptionRow
            key={option.id}
            option={option}
            index={index}
            onChange={handleChange}
            onRemove={removeOption}
            canRemove={options.length > 1}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addOption}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-third/15 text-third/45 hover:text-third/70 hover:border-third/25 hover:bg-third/3 font-poppins text-[12px] font-medium transition-all duration-200 mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        Tambah Opsi
      </button>

      {/* Summary */}
      {options.some(o => o.name || o.harga) && (
        <div className="mt-4 p-3 rounded-xl bg-third/3 border border-third/8">
          <p className="font-poppins text-[10.5px] font-semibold uppercase tracking-[0.1em] text-third/40 mb-2">
            Ringkasan · {options.filter(o => o.name).length} varian
          </p>
          <div className="flex flex-wrap gap-2">
            {options.filter(o => o.name).map((o, index) => (
              <div key={index} className="flex items-center gap-1.5 bg-white border border-third/10 rounded-lg px-2.5 py-1">
                {o.imagePreview && (
                  <img src={o.imagePreview} alt="" className="w-4 h-4 rounded object-cover" />
                )}
                <span className="font-poppins text-[11.5px] text-third/70">{o.name}</span>
                {o.harga && (
                  <>
                    <span className="text-third/20">·</span>
                    <span className="font-poppins text-[11.5px] font-semibold text-third">Rp {o.harga}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}