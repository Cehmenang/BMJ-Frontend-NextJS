"use client"

import { ICategory } from "@/interface"
import KategoriRow from "./KategoriRow"

export default function KategoriTable({ categories }: { categories: ICategory[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-third/5 text-[11px] text-third/50 uppercase tracking-wider">
            <th className="text-left px-4 py-3 w-[180px]">Kategori</th>
            <th className="text-left px-4 py-3">Tag</th>
            <th className="px-3 py-3 w-[100px]"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <KategoriRow key={c.id} category={c} />
          ))}
        </tbody>
      </table>
    </div>
  )
}