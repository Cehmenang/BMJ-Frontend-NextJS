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
    }
 }){
    const { title } = await params
    const { page, q, sort, kategori, stock } = await searchParams
    const pageValue = Number(page) || 1
    const result = await getProductByCategory(title, pageValue)
    const brandIds = [...new Set(result.data.map((p: IProduct) => p.brandId))] as string[]
    const brands = await getSelectedBrands(brandIds)
    console.log(brands)

    return (
        <div className="main-category">
            <h1>You talk to her</h1>
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
            />}
        </div>
    )
}