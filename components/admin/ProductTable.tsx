"use client"

import { SetStateAction, useState } from "react"
import ProductCard from "../product/ProductCard"
import { IProduct } from "@/interface"
import ProductRow from "./ProductRow"

export default function ProductTable({ products, onSave }: { products: IProduct[], onSave: SetStateAction<any> }) {
  const [rows, setRows] = useState(products)

  const update = (id: string, field: string, value: string) =>
    setRows(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

  return (
    <div className="overflow-x-auto">
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
          </tr>
        </thead>
        <tbody>
            <div className="md:hidden">
                {rows.map(p => <ProductRow key={p.id} product={p} onUpdate={update} />)}
            </div>
        </tbody>
      </table>

      <div className="flex justify-end gap-2 p-3 border-t border-third/8">
        <button onClick={() => setRows(products)} className="...">Reset</button>
        <button onClick={() => onSave(rows)} className="...">Simpan semua</button>
      </div>
    </div>
  )
}