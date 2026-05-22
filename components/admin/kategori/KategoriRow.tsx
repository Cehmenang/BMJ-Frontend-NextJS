"use client"
import { updateCategory } from "@/action/kategori"
import { ICategory } from "@/interface"
import { useEffect, useState } from "react"

const TAG_OPTIONS = [
  "Accessories", "Aerofon", "Bass", "DJ Gear", "Effect", "Guitars", "Karaoke", "Keyboard", "Percussion", "Recording", "Software", "Sound System", "Strings", "Wireless System"
]

export default function KategoriRow({ category }: { category: ICategory }) {
  const [row, setRow] = useState<ICategory>(category)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setRow(category)
  }, [category])

  const update = (field: string, value: any) => {
    setRow(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setSaved(false)
  }

  const handleTagToggle = (tag: string) => {
    const current = row.tag ?? []
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag]
    update("tag", updated)
  }

  const handleReset = () => {
    setRow(category)
    setIsDirty(false)
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    await updateCategory(row.title, row.tag!)
    setSaved(true)
    setIsDirty(false)
    setLoading(false)
  }

  return (
    <tr className={`border-b border-third/8 align-top transition-colors ${isDirty ? "bg-second/5" : "hover:bg-third/[0.02]"}`}>

      {/* Kategori */}
      <td className="px-4 py-3 w-[180px]">
        <p className="font-poppins text-[10px] text-third/40 uppercase tracking-wider mb-1.5">
          Nama kategori
        </p>
        <input
          type="text"
          value={row.title}
          onChange={(e) => update("title", e.target.value)}
          className="font-poppins text-[12px] font-medium w-full border border-third/10 rounded-lg px-2.5 py-1.5 bg-third/4 text-third outline-none focus:border-second focus:bg-white transition-colors"
        />
      </td>

      {/* Tag */}
      <td className="px-4 py-3">
        <p className="font-poppins text-[10px] text-third/40 uppercase tracking-wider mb-1.5">
          Tag
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TAG_OPTIONS.map(tag => {
            const active = (row.tag ?? []).includes(tag)
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`font-poppins text-[11px] px-2.5 py-1 rounded-lg border transition-colors
                  ${active
                    ? "bg-second text-third border-second font-medium"
                    : "bg-transparent text-third/40 border-third/10 hover:border-third/25 hover:text-third/60"
                  }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
        {(row.tag ?? []).length > 0 && (
          <p className="font-poppins text-[10px] text-third/30 mt-1.5">
            {(row.tag ?? []).length} tag dipilih
          </p>
        )}
      </td>

      {/* Aksi */}
      <td className="px-3 py-3 w-[100px]">
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