"use client"

import { ICategory } from "@/interface"

export default function KategoriTable({ categories }: { categories: ICategory[] }){
   return (
    <div className="overflow-x-auto px-[200px]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-third/5 text-[11px] text-third/50 uppercase tracking-wider">
                <th className="text-left px-4 py-3 w-[200px]">Nama</th>
                <th className="text-left px-3 py-3 w-[90px]">Tag</th>
              </tr>
            </thead>
            <tbody>
              {/* {categories.map(p => (
                <ProductRow key={p.id} product={p} onSave={onSave} />
              ))} */}
            </tbody>
          </table>
        </div>
   )
}