'use server'

import { getProductByCategory } from "@/action/product"
import ProductDetail from "@/components/product/ProductDetail"
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
    const brands = result.data.map((produk: IProduct)=>produk.brandId)
    console.log(brands, 'BRAND')

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