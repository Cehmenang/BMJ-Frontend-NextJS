"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { Upload, X, ImageIcon, Loader2, CheckCircle2 } from "lucide-react"
import { uploadKategori } from "@/action/kategori"
import { useRouter } from "next/navigation"

type KategoriForm = {
  title: string
}

export default function AddKategori() {
  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KategoriForm>()

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Ukuran gambar maksimal 5MB.")
      return
    }
    setImageError(null)
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const clearImage = () => {
    setPreview(null)
    setImageFile(null)
    setImageError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onSubmit = async (data: KategoriForm) => {
    if (!imageFile) {
      setImageError("Gambar kategori wajib diupload.")
      return
    }

    setIsLoading(true)
    setServerError(null)

    try {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("image", imageFile)
      const result = await uploadKategori(formData)
      if (result) {
        setSuccess(true)
        reset()
        clearImage()
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      }
    } catch (e: any) {
      setServerError(e.response?.data?.error ?? "Terjadi kesalahan, coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-site p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="font-poppins text-[11px] font-semibold tracking-[0.18em] uppercase text-second mb-1">
            Manajemen Kategori
          </p>
          <h1 className="font-play text-[clamp(24px,3vw,36px)] font-bold text-third leading-tight">
            Tambah <em className="text-second not-italic">Kategori</em>
          </h1>
        </div>

        {success && (
          <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <p className="font-poppins text-[12.5px] font-medium">Kategori berhasil ditambahkan!</p>
          </div>
        )}

        {serverError && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            <X className="w-4 h-4 flex-shrink-0" />
            <p className="font-poppins text-[12.5px]">{serverError}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-third/8 shadow-[0_2px_16px_rgba(62,63,32,0.05)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">

            {/* Image upload */}
            <div>
              <label className="font-poppins text-[11.5px] font-semibold text-third/70 uppercase tracking-[0.08em] mb-2 block">
                Gambar Kategori <span className="text-red-400">*</span>
              </label>

              {!preview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-second bg-second/5 scale-[1.01]"
                      : imageError
                        ? "border-red-300 bg-red-50/50"
                        : "border-third/15 bg-third/2 hover:border-third/30 hover:bg-third/4"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? "bg-second/15" : "bg-third/8"}`}>
                    <ImageIcon className={`w-5 h-5 ${isDragging ? "text-second" : "text-third/40"}`} />
                  </div>
                  <div className="text-center px-4">
                    <p className="font-poppins text-[13px] font-medium text-third/60">
                      {isDragging ? "Lepaskan untuk upload" : "Drag & drop atau klik untuk pilih"}
                    </p>
                    <p className="font-poppins text-[11px] text-third/35 mt-0.5">PNG, JPG, WEBP · Maks. 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-third/10 bg-third/3 group">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain p-3" />
                  <div className="absolute inset-0 bg-third/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-third font-poppins text-[12px] font-medium hover:bg-bg-site transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Ganti
                    </button>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white font-poppins text-[12px] font-medium hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileChange(file)
                }}
              />

              {imageError && (
                <p className="font-poppins text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {imageError}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="font-poppins text-[11.5px] font-semibold text-third/70 uppercase tracking-[0.08em] mb-2 block">
                Nama Kategori <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Gitar Elektrik, Drum, Keyboard…"
                {...register("title", {
                  required: "Nama kategori wajib diisi",
                  minLength: { value: 2, message: "Minimal 2 karakter" },
                  maxLength: { value: 100, message: "Maksimal 100 karakter" },
                })}
                className={`w-full px-4 py-3 rounded-xl border font-poppins text-[13px] text-third bg-bg-site placeholder:text-third/25 outline-none transition-all duration-200 focus:bg-white focus:border-third/35 focus:shadow-[0_0_0_3px_rgba(62,63,32,0.05)] ${
                  errors.title ? "border-red-300 bg-red-50/50" : "border-third/12"
                }`}
              />
              {errors.title && (
                <p className="font-poppins text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="h-px bg-third/8" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { reset(); clearImage(); setServerError(null) }}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl border border-third/15 font-poppins text-[13px] font-medium text-third/60 hover:text-third hover:border-third/25 hover:bg-third/3 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-third text-primary font-poppins text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-third-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Tambah Kategori
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}