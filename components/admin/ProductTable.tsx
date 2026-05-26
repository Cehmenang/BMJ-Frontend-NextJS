// ProductTable.tsx
"use client"
import { ICategory, IProduct } from "@/interface"
import ProductRow from "./ProductRow"

export default function ProductTable({ products, onSave, kategori }: { products: IProduct[], onSave: (product: IProduct) => void, kategori: ICategory[] }) {
  return (
    <div className="overflow-x-auto px-[200px]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-third/5 text-[11px] text-third/50 uppercase tracking-wider">
            <th className="text-left px-4 py-3 w-[200px]">Produk</th>
            <th className="text-left px-3 py-3 w-[90px]">Stok</th>
            <th className="px-3 py-3 w-[130px] bg-purple-50">Pricelist</th>
            <th className="px-3 py-3 w-[130px] bg-teal-50">Offline</th>
            <th className="px-3 py-3 w-[130px] bg-blue-50">Online</th>
            <th className="px-3 py-3 w-[130px] bg-amber-50">Promo</th>
            <th className="px-3 py-3 w-[180px]">Set promo</th>
            <th className="px-3 py-3 w-[160px] bg-green-50">Kategori</th>
            <th className="px-3 py-3 w-[100px]"></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <ProductRow key={p.id} product={p} onSave={onSave} kategori={kategori} />
          ))}
        </tbody>
      </table>
    </div>
  )
}