"use server"

import { getCategories } from "@/action/kategori"
import KategoriTable from "@/components/admin/kategori/KategoriTable"

export default async function Kategori(){
    const data = await getCategories()

    return (
        <div className="kategori-admin mt-16">
            <KategoriTable categories={data}/>
        </div>
    )
}