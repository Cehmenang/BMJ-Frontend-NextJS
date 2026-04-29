"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import { LucideIcon, Toolbox } from "lucide-react";
import {
  Package, Tag, Ruler, ImagePlus, X, Upload,
  ChevronDown, Percent, Truck, Wrench, Receipt,
  CheckCircle2, AlertCircle, Star,
} from "lucide-react";
import { FormValues, IBrand, ICategory, IOption } from "@/interface";
import { uploadProduct } from "@/action/product";
import { useRouter } from "next/navigation";
import VariantOptions from "./VariantOption";

interface ImageItem {
  url: string;
  name: string;
  file: File;
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const formatRupiah = (val: string): string => {
  if (!val) return "";
  return Number(String(val).replace(/\D/g, "")).toLocaleString("id-ID");
};
const rawNumber = (val: string): string =>
  String(val).replace(/\./g, "").replace(/\D/g, "");

// ─── BASE INPUT CLASSES ────────────────────────────────────────────────────────
const inputCls = (hasError?: boolean): string =>
  `w-full bg-[#141414] border ${
    hasError ? "border-red-500/60" : "border-[#3e3f20]/60"
  } rounded-xl px-3.5 py-2.5 text-sm text-[#eeeeee] placeholder-[#eeeeee]/20 outline-none focus:border-[#f9ad52]/70 focus:ring-2 focus:ring-[#f9ad52]/10 transition-all duration-200`;

// ─── SECTION CARD ──────────────────────────────────────────────────────────────
interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
}
const SectionCard = ({ icon: Icon, title, subtitle, children }: SectionCardProps) => (
  <div className="rounded-2xl bg-primary overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-third/10">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#f9ad52]/15 text-[#f9ad52] shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="font-bold text-sm text-third">{title}</p>
        {subtitle && <p className="text-xs text-third/50 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── FIELD WRAPPER ─────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: FieldError;
  children: ReactNode;
  className?: string;
}
const Field = ({ label, required, hint, error, children, className = "" }: FieldProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-[#eeeeee]/70 flex items-center gap-1">
      {label}
      {required && <span className="text-[#f9ad52]">*</span>}
    </label>
    {children}
    {hint && !error && <span className="text-[10px] text-[#eeeeee]/30">{hint}</span>}
    {error && (
      <span className="flex items-center gap-1 text-[10px] text-red-400">
        <AlertCircle size={10} /> {error.message}
      </span>
    )}
  </div>
);

// ─── SELECT FIELD ──────────────────────────────────────────────────────────────
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder: string;
  error?: FieldError;
}
const SelectField = ({ options, placeholder, error, ...props }: SelectFieldProps) => (
  <div className="relative">
    <select
      {...props}
      className={`${inputCls(!!error)} appearance-none pr-9 cursor-pointer`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#1c1c1c]">{o}</option>
      ))}
    </select>
    <ChevronDown
      size={14}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#eeeeee]/30 pointer-events-none"
    />
  </div>
);

// ─── PRICE INPUT ───────────────────────────────────────────────────────────────
interface PriceInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: FieldError;
}
const PriceInput = ({ value, onChange, placeholder, error }: PriceInputProps) => (
  <div className="relative">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#f9ad52]/70 select-none">
      Rp
    </span>
    <input
      type="text"
      value={formatRupiah(value)}
      onChange={(e) => onChange(rawNumber(e.target.value))}
      placeholder={placeholder}
      className={`${inputCls(!!error)} pl-10`}
    />
  </div>
);

const DiscInput = ({ value, onChange, placeholder, error }: PriceInputProps) => (
  <div className="relative">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#f9ad52]/70 select-none">
      Disc
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(rawNumber(e.target.value))}
      placeholder={placeholder}
      className={`${inputCls(!!error)} pl-10`}
    />
  </div>
);

// ─── UNIT INPUT ────────────────────────────────────────────────────────────────
interface UnitInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unit: string;
  error?: FieldError;
}
const UnitInput = ({ unit, error, ...props }: UnitInputProps) => (
  <div className="relative">
    <input
      type="number"
      min="0"
      className={`${inputCls(!!error)} pr-12`}
      {...props}
    />
    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#eeeeee]/30 select-none">
      {unit}
    </span>
  </div>
);

// ─── TOGGLE ────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}
const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${
      checked ? "bg-[#f9ad52]" : "bg-[#3e3f20]"
    }`}
  >
    <span
      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

// ─── IMAGE UPLOADER ────────────────────────────────────────────────────────────
interface ImageUploaderProps {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  error?: string;
}
const ImageUploader = ({ images, setImages, error }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const readers = valid.map(
        (file) =>
          new Promise<ImageItem>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({ url: e.target?.result as string, name: file.name, file });
            reader.readAsDataURL(file);
          })
      );
      Promise.all(readers).then((imgs) =>
        setImages((prev) => [...prev, ...imgs].slice(0, 10))
      );
    },
    [setImages]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const remove = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-4">
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-[#f9ad52] bg-[#f9ad52]/5"
            : error
            ? "border-red-500/40 bg-red-500/5"
            : "border-[#3e3f20]/60 bg-[#141414] hover:border-[#f9ad52]/40 hover:bg-[#f9ad52]/5"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-2 transition-colors ${
            dragging ? "text-[#f9ad52]" : "text-[#eeeeee]/30"
          }`}
        >
          <Upload size={28} />
          <p className="text-sm font-semibold text-[#eeeeee]/60">
            Drag & drop foto produk di sini
          </p>
          <p className="text-xs text-[#eeeeee]/30">
            atau{" "}
            <span className="text-[#f9ad52] font-semibold">klik untuk pilih</span>
            &nbsp;·&nbsp; Maks. 10 foto &nbsp;·&nbsp; JPG, PNG, WEBP
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <span className="flex items-center gap-1 text-[10px] text-red-400">
          <AlertCircle size={10} /> {error}
        </span>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden aspect-square bg-[#141414] group"
            >
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-[#f9ad52] text-[#3e3f20] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                  <Star size={8} fill="currentColor" /> UTAMA
                </div>
              )}
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/80"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <div
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-[#3e3f20]/60 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer text-[#eeeeee]/20 hover:border-[#f9ad52]/40 hover:text-[#f9ad52]/40 transition-all duration-200"
            >
              <ImagePlus size={18} />
              <span className="text-[10px]">Tambah</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── SERVICE ROW ───────────────────────────────────────────────────────────────
interface ServiceRowProps {
  icon: LucideIcon;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}
const ServiceRow = ({ icon: Icon, label, desc, checked, onChange }: ServiceRowProps) => (
  <div
    className={`flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
      checked
        ? "border-[#f9ad52]/40 bg-[#f9ad52]/5"
        : "border-[#3e3f20]/40 bg-[#141414]"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          checked
            ? "bg-[#f9ad52]/20 text-[#f9ad52]"
            : "bg-[#3e3f20]/30 text-[#eeeeee]/30"
        }`}
      >
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#eeeeee]/80">{label}</p>
        <p className="text-[10px] text-[#eeeeee]/30 mt-0.5">{desc}</p>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

// ─── SUCCESS SCREEN ────────────────────────────────────────────────────────────
const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
    <div className="bg-[#1c1c1c] border border-[#3e3f20]/40 rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-[#f9ad52]/15 flex items-center justify-center mx-auto mb-5 text-[#f9ad52]">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-xl font-extrabold text-[#eeeeee] mb-2">
        Produk Berhasil Diterbitkan!
      </h2>
      <p className="text-sm text-[#eeeeee]/40 mb-7">
        Produk kamu sudah tersimpan dan siap ditampilkan ke pembeli.
      </p>
      <button
        onClick={onReset}
        className="w-full bg-[#f9ad52] hover:bg-[#f9ad52]/90 text-[#3e3f20] font-bold text-sm rounded-xl py-3 transition-all duration-200"
      >
        + Tambah Produk Lagi
      </button>
    </div>
  </div>
);

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function UploadForm({ brands, categories }: { brands: IBrand[], categories: ICategory[] }) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageError, setImageError] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [addVariant, setAddVariant] = useState(false)
  const [options, setOptions] = useState<[]|IOption[]>([])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      pricelist: "",
      offlinePrice: "",
      onlinePrice: "",
      namaPromo: "",
      promo: "",
      brandId: "",
      kategoriId: "",
      stock: "",
      url: "",
      panjang: "",
      lebar: "",
      tinggi: "",
      berat: "",
      pajak: false,
      kirim: false,
      pasang: false,
      variant: "",
      options: [],
      discount: ""
    },
  });

  const router = useRouter()

  function countDiscount(pricelist: number, disc: number){
    const hargaDiskon = Math.round(pricelist - (pricelist * disc / 100)) as number
    return <h1>{hargaDiskon}</h1>
  }

  const onSubmit = async (data: FormValues) => {
   
    if (images.length === 0) {
      setImageError("Minimal 1 foto produk wajib diupload");
      return;
    }
    setImageError("");
    const url = watch("name").toLocaleLowerCase().split(' ').join('-').trim().replace(/[^a-zA-Z0-9-]/g, "")
    // Simulate API call — replace with your actual fetch/axios here
    const formData = new FormData()
    
    formData.append("name", data.name)
    formData.append("url", url)
    formData.append("brand", data.brandId)
    formData.append("kategori", data.kategoriId)
    formData.append("pricelist", data.pricelist.trim() !== "" ? data.pricelist : "")
    formData.append("offlinePrice", data.offlinePrice)
    formData.append("onlinePrice", data.onlinePrice.trim() !== "" ? data.onlinePrice : "")
    formData.append("description", data.description)
    formData.append("stock", data.stock)
    formData.append("pasang", String(data.pasang ? 1 : 0))
    formData.append("pajak", String(data.pajak ? 1 : 0))
    formData.append("kirim", String(data.kirim ? 1 : 0))
    formData.append("promo", data.promo ? data.promo : "")
    formData.append("namaPromo", data.namaPromo ? data.namaPromo : "")
    formData.append("berat", data.berat)
    formData.append("panjang", data.panjang)
    formData.append("lebar", data.lebar)
    formData.append("tinggi", data.tinggi)
    
    images.forEach(img=>{
      formData.append("images[]", img.file)
    })

    if(addVariant && data.variant.trim() !== "" && options.length > 0){
      formData.append("variant", data.variant)
      options.forEach((option, index) => {
        formData.append(`options[${index}][name]`, option.name);
        formData.append(`options[${index}][harga]`, option.harga);
    
        if (option.image) {
          formData.append(`options[${index}][image]`, option.image);
        }
      });
    }

    console.log(data.discount)

    // const response = await uploadProduct(formData)
    // setSubmitted(true);
    // router.refresh()
  };

  const handleReset = () => {
    reset();
    setImages([]);
    setImageError("");
    setSubmitted(false);
  };

  if (submitted) return <SuccessScreen onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-primary">

      {/* ── BODY ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5 pt-24">

          {/* ── FOTO ── */}
          <SectionCard icon={ImagePlus} title="Foto Produk" subtitle="Foto pertama akan jadi foto utama produk">
            <ImageUploader images={images} setImages={setImages} error={imageError} />
          </SectionCard>

          {/* ── INFO ── */}
          <SectionCard icon={Package} title="Informasi Produk" subtitle="Lengkapi info dasar produk">
            <div className="flex flex-col gap-4 px-5 py-5">

              <Field label="Nama Produk" required error={errors.name}>
                <input
                  {...register("name", {
                    required: { value: true, message: "Nama produk wajib diisi" },
                  })}
                  placeholder="Contoh: Schecter Avenger Standard Electric Guitar"
                  className={inputCls(!!errors.name)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Brand" error={errors.brandId}>
                  <SelectField
                    options={brands.map((brand)=>brand.name)}
                    placeholder="Pilih Brand"
                    error={errors.brandId}
                    {...register("brandId")}
                  />
                </Field>
                <Field label="Kategori" error={errors.kategoriId}>
                  <SelectField
                    options={categories.map((category)=>category.title)}
                    placeholder="Pilih Kategori"
                    error={errors.kategoriId}
                    {...register("kategoriId")}
                  />
                </Field>
              </div>

              <Field
                label="Deskripsi Produk"
                hint="Jelaskan fitur, spesifikasi, dan keunggulan produk"
              >
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Deskripsikan produk secara detail..."
                  className={`${inputCls(false)} resize-y leading-relaxed`}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Stok" required error={errors.stock}>
                  <UnitInput
                    unit="pcs"
                    error={errors.stock}
                    placeholder="0"
                    {...register("stock", {
                      required: { value: true, message: "Stok wajib diisi" },
                    })}
                  />
                </Field>
                <Field label="URL / SKU">
                  <input
                    {...register("url")}
                    placeholder="contoh-nama-produk"
                    className={inputCls(false)}
                    value={watch("name").toLocaleLowerCase().split(' ').join('-').trim().replace(/[^a-zA-Z0-9-]/g, "")}
                    disabled
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* ── HARGA ── */}
          <SectionCard icon={Tag} title="Harga" subtitle="Atur harga pricelist, offline, dan online">
            <div className="flex flex-col gap-4">

              <div className="pricelist-zone grid grid-cols-[3fr_1fr_3fr] gap-x-3">
              <Field
                label="Harga Pricelist"
                hint="Harga resmi / MSRP dari brand"
                error={errors.pricelist}
              >
                <Controller
                  name="pricelist"
                  control={control}
                  render={({ field }) => (
                    <PriceInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="0"
                      error={errors.pricelist}
                    />
                  )}
                />
              </Field>

              <Field
                label="Diskon Pricelist"
                hint="Besar diskon dari harga pricelist"
                error={errors.pricelist}
              >
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => (
                    <PriceInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="0"
                      error={errors.pricelist}
                    />
                  )}
                />
              </Field>

              {watch('discount') && watch('discount').trim() !== "" && 
                  <Field label="Harga Diskon">
                    <p>{countDiscount(parseInt(watch('pricelist')), parseInt(watch('discount')))}</p>
                  </Field>
              }
              </div>
              

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Harga Offline">
                  <Controller
                    name="offlinePrice"
                    control={control}
                    render={({ field }) => (
                      <PriceInput value={field.value} onChange={field.onChange} placeholder="0" />
                    )}
                  />
                </Field>
                <Field label="Harga Online" error={errors.onlinePrice}>
                  <Controller
                    name="onlinePrice"
                    control={control}
                    render={({ field }) => (
                      <PriceInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0"
                        error={errors.onlinePrice}
                      />
                    )}
                  />
                </Field>
              </div>

              {/* Promo Block */}
              <div className="rounded-xl border border-[#f9ad52]/20 bg-[#f9ad52]/5 p-4 flex flex-col gap-3">
                <p className="flex items-center gap-2 text-xs font-bold text-[#f9ad52]">
                  <Percent size={13} />
                  Harga Promo
                  <span className="font-normal text-[#eeeeee]/30">(Opsional)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Nama Promo">
                    <input
                      {...register("namaPromo")}
                      placeholder="Harbolnas, Flash Sale, dll"
                      className={inputCls(false)}
                    />
                  </Field>
                  <Field label="Harga Promo">
                    <Controller
                      name="promo"
                      control={control}
                      render={({ field }) => (
                        <PriceInput value={field.value} onChange={field.onChange} placeholder="0" />
                      )}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </SectionCard>

                    <Controller
                name="variant"
                control={control}
                render={({ field }) => (
                  <ServiceRow
                    icon={Toolbox}
                    label="Gunakan Varian"
                    desc="Produk bisa dikirim ke lokasi pembeli"
                    checked={addVariant}
                    onChange={()=>{
                      addVariant ? setAddVariant(false) : setAddVariant(true)
                    }}
                  />
                )}
              />
          
          {/* VARIANT SECTION */}
          {addVariant && 
          <div>
          <SectionCard  icon={Toolbox} title="Varian" subtitle="Variasi berupa warna, ukuran, dsb">
              <Field label="Nama Produk" required error={errors.name}>
                <input
                  {...register("variant")}
                  placeholder="Tipe Varian : Warna, Ukuran, dsb"
                  className={inputCls(!!errors.name)}
                />
              </Field>
          </SectionCard>
          {watch("variant") !== "" && 
             <VariantOptions options={options} setOptions={setOptions}/>
          }
          </div>}

          {/* ── DIMENSI ── */}
          <SectionCard icon={Ruler} title="Dimensi & Berat" subtitle="Untuk kalkulasi ongkir yang akurat">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Berat" error={errors.berat}>
                <UnitInput
                  unit="gram"
                  error={errors.berat}
                  placeholder="0"
                  {...register("berat")}
                />
              </Field>
              <Field label="Panjang">
                <UnitInput unit="cm" placeholder="0" {...register("panjang")} />
              </Field>
              <Field label="Lebar">
                <UnitInput unit="cm" placeholder="0" {...register("lebar")} />
              </Field>
              <Field label="Tinggi">
                <UnitInput unit="cm" placeholder="0" {...register("tinggi")} />
              </Field>
            </div>
          </SectionCard>

          {/* ── LAYANAN ── */}
          <SectionCard
            icon={Package}
            title="Layanan Tambahan"
            subtitle="Aktifkan layanan yang tersedia untuk produk ini"
          >
            <div className="flex flex-col gap-2.5">
              <Controller
                name="pajak"
                control={control}
                render={({ field }) => (
                  <ServiceRow
                    icon={Receipt}
                    label="Produk kena pajak (PPN)"
                    desc="Harga akan ditambah PPN sesuai regulasi"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="kirim"
                control={control}
                render={({ field }) => (
                  <ServiceRow
                    icon={Truck}
                    label="Layanan pengiriman tersedia"
                    desc="Produk bisa dikirim ke lokasi pembeli"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="pasang"
                control={control}
                render={({ field }) => (
                  <ServiceRow
                    icon={Wrench}
                    label="Layanan pemasangan tersedia"
                    desc="Tersedia teknisi untuk instalasi produk"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* ── BOTTOM CTA ── */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
            <button
              type="button"
              className="order-2 sm:order-1 px-6 py-3 border border-[#3e3f20]/60 rounded-xl text-[#eeeeee]/50 text-sm font-semibold hover:border-[#f9ad52]/40 hover:text-[#eeeeee] transition-all"
            >
              Simpan Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="order-1 sm:order-2 px-8 py-3 bg-[#f9ad52] hover:bg-[#f9ad52]/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-[#3e3f20] font-extrabold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-[#f9ad52]/20"
            >
              {isSubmitting ? "⏳ Menyimpan..." : "🚀 Terbitkan Produk"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}