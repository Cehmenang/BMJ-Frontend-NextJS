"use server"

import { getProducts, getProductsBySearch } from "@/action/product";
import ProductsLayout from "@/components/product/ProductsLayout";

export default async function Products({ searchParams }: { 
    searchParams: {
        page?: string
        q?: string
        sort?: string
        kategori?: string
        stock?: string
    }
}){
    const { page, q, sort, kategori, stock } = await searchParams
    const pageValue = Number(page) || 1
    const result = q && q.trim() !== "" ? await getProductsBySearch(pageValue, q) : await getProducts(pageValue)


    return (
        <div className="products-display mt-16">
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
            />}
        </div>
    )
}