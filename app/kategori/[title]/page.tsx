'use server'

import { getSelectedBrands } from "@/action/brand"
import { getProductByCategory } from "@/action/product"
import ProductsLayout from "@/components/product/ProductsLayout"
import { IProduct } from "@/interface"

export default async function CategoryDetail({ params, searchParams }: { 
    params: { title: string },
    searchParams: {
        page?: string
        q?: string
        sort?: string
        kategori?: string
        stock?: string
        brand?: string
    }
 }){
    const { title } = await params
    const { page, q, sort, kategori, stock, brand} = await searchParams
    const pageValue = Number(page) || 1
    const result = await getProductByCategory(title, pageValue, { brand })
    const brands = await getSelectedBrands(title)
    console.log(brands, 'BRANDSSSS')

    return (
        <div className="main-category mt-20">
            {result && <ProductsLayout
                    products={result.data}
                    totalPages={result.last_page}
                    totalProducts={result.total}
                    currentPage={result.current_page}
                    initialSort={sort!}
                    initialKategori={kategori!}
                    initialBrand="Semua"
                    initialQuery={q!}
                    initialStock={stock === "1"}
                    hideBrandFilter
                    brands={brands}
            />}
        </div>
    )
}