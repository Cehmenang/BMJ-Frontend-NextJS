"use client"
import { ICategory, IProduct } from "@/interface"
import { Package, Boxes, Tag, Percent, FolderTree, Video, Settings2 } from "lucide-react"
import ProductRow from "./ProductRow"

export default function ProductTable({
  products, onSave, onDelete, kategori
}: {
  products: IProduct[],
  onSave: (product: IProduct) => void,
  onDelete: (url: string) => void,
  kategori: ICategory[]
}) {
  return (
    <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8">
      {/* keyframes untuk animasi row & dropdown, dipakai juga oleh ProductRow */}
      <style>{`
        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="bg-primary rounded-2xl border border-third/10 shadow-[0_2px_16px_rgba(62,63,32,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse table-fixed min-w-[1280px]">
            <thead>
              <tr className="text-[10.5px] text-third/45 uppercase tracking-wider">
                <th rowSpan={2} className="sticky left-0 z-20 bg-bg-site text-left px-4 py-3 w-[220px] border-b border-third/10 shadow-[4px_0_6px_-4px_rgba(0,0,0,0.06)]">
                  <span className="flex items-center gap-1.5"><Package size={12} /> Produk</span>
                </th>
                <th rowSpan={2} className="bg-bg-site text-left px-3 py-3 w-[100px] border-b border-third/10">
                  <span className="flex items-center gap-1.5"><Boxes size={12} /> Stok</span>
                </th>
                <th colSpan={4} className="bg-second/[0.06] px-3 py-2 border-b border-second/15 border-x border-second/10">
                  <span className="flex items-center justify-center gap-1.5 text-second/80"><Tag size={12} /> Harga</span>
                </th>
                <th rowSpan={2} className="bg-bg-site px-3 py-3 w-[190px] border-b border-third/10">
                  <span className="flex items-center justify-center gap-1.5"><Percent size={12} /> Set Promo</span>
                </th>
                <th rowSpan={2} className="bg-bg-site px-3 py-3 w-[170px] border-b border-third/10">
                  <span className="flex items-center justify-center gap-1.5"><FolderTree size={12} /> Kategori</span>
                </th>
                <th rowSpan={2} className="bg-bg-site px-3 py-3 w-[190px] border-b border-third/10">
                  <span className="flex items-center justify-center gap-1.5"><Video size={12} /> Video</span>
                </th>
                <th rowSpan={2} className="bg-bg-site px-3 py-3 w-[110px] border-b border-third/10">
                  <span className="flex items-center justify-center gap-1.5"><Settings2 size={12} /> Aksi</span>
                </th>
              </tr>
              <tr className="text-[10.5px] text-third/45 uppercase tracking-wider">
                <th className="bg-second/[0.06] px-3 py-2 w-[130px] border-b border-second/15 border-l border-second/10 font-medium">Pricelist</th>
                <th className="bg-second/[0.06] px-3 py-2 w-[130px] border-b border-second/15 font-medium">Offline</th>
                <th className="bg-second/[0.06] px-3 py-2 w-[130px] border-b border-second/15 font-medium">Online</th>
                <th className="bg-second/[0.06] px-3 py-2 w-[130px] border-b border-second/15 border-r border-second/10 font-medium">Promo</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <ProductRow
                  key={p.id}
                  index={i}
                  product={p}
                  onSave={onSave}
                  onDelete={onDelete}
                  kategori={kategori}
                />
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-third/30">
            <Package size={28} strokeWidth={1.5} />
            <p className="font-poppins text-[12px]">Belum ada produk</p>
          </div>
        )}
      </div>

      <p className="font-poppins text-[10.5px] text-third/30 mt-2.5 md:hidden">
        ← Geser tabel untuk lihat kolom lainnya
      </p>
    </div>
  )
}