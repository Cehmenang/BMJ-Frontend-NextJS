"use server"

import { getBrands } from "@/action/brand";
import { getCategories } from "@/action/kategori";
import UploadForm from "@/components/admin/UploadForm";

export default async function UploadPage(){
    const brands = await getBrands()
    const categories = await getCategories()

    return (
        <UploadForm brands={brands} categories={categories}/>
    )
}