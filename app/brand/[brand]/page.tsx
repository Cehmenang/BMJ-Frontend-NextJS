"use server"

import { getProductByBrand } from "@/action/product"
import ProductsLayout from "@/components/product/ProductsLayout"

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: { brand: string }
  searchParams: {
    page?: string
    q?: string
    sort?: string
    kategori?: string
    stock?: string
  }
}) {

    const { brand } = await params
    const page = Number(searchParams.page) || 1
    const q = searchParams.q || ""
    const sort = searchParams.sort || "latest"
    const kategori = searchParams.kategori || ""
    const stock = searchParams.stock || ""

    const result = await getProductByBrand(brand, page)

  return (
    <div className="mt-[60px] md:mt-[66px]">
      <div className="bg-third py-12 px-6 md:px-24">
        <div className="max-w-7xl mx-auto flex justify-center items-center flex-col">
          <p className="font-poppins text-[11px] font-semibold tracking-[0.2em] uppercase text-second mb-2">
            Brand
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] text-[24px] font-extrabold text-primary capitalize">
            {brand}
          </h1>
        </div>
      </div>

      {result && <ProductsLayout
        products={result.data}
        totalPages={result.last_page}
        totalProducts={result.total}
        currentPage={result.current_page}
        initialSort={sort}
        initialKategori={kategori}
        initialBrand="Semua"
        initialQuery={q}
        initialStock={stock === "1"}
        hideBrandFilter
      />}
    </div>
  )
}