"use server"

import { getAllProductsByPromo, getPromosName } from "@/action/product"
import ProductsLayout from "@/components/product/ProductsLayout"

export default async function Promo({ searchParams }: {
    searchParams: {
        page?: string
        q?: string
        sort?: string
        kategori?: string
        stock?: string
    }
}){
    const { page, q, sort, kategori, stock } = await searchParams as any
    const pageValue = Number(page) || 1
    const promos = await getPromosName()
    const result = await getAllProductsByPromo(pageValue)

    return (
        <div className="main-promo mt-16">
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
                            promos={promos}
                    />}
        </div>
    )
}