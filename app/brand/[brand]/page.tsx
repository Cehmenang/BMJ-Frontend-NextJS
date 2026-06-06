"use server"

import { getBrandByName } from "@/action/brand"
import { getProductByBrand } from "@/action/product"
import ProductsLayout from "@/components/product/ProductsLayout"
import Image from "next/image"

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
    const { page, q, sort, kategori, stock } = await searchParams

    const pageValue = Number(page) || 1
    const result = await getProductByBrand(brand, pageValue)
    const brandResult = await getBrandByName(brand)
    console.log(brandResult, 'yee')

  if(brandResult.brand){
    return (
    <div className="mt-[60px] md:mt-[66px]">
      <div className="bg-third py-12 px-6 md:px-24">
        <div className="max-w-7xl mx-auto flex justify-center items-center flex-col">
          <p className="font-poppins text-[11px] font-semibold tracking-[0.2em] uppercase text-second mb-2">
            Brand
          </p>
          <div className="headline flex justify-center items-center gap-x-6">
            <Image src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brandResult.brand.image}`} alt={`Bandar Musik Jakarta - ${brandResult.brand.name}`} className="bg-primary rounded-md px-2 py-1" width={200}/>
            <div className="headline-txt">
              <h1 className="text-[clamp(28px,4vw,48px)] text-[24px] font-extrabold text-primary capitalize">
                {brandResult.brand.name}
              </h1>
              <span className="text-primary/50 italic font-light">{brandResult.brand.description}</span>
            </div>
          </div>
        </div>
      </div>

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
  )}
}