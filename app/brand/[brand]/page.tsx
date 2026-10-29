import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBrandByName } from "@/action/brand"
import { getSelectedCategories } from "@/action/kategori"
import { getProductByBrand } from "@/action/product"
import ProductsLayout from "@/components/product/ProductsLayout"

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>
  searchParams: Promise<{
    page?: string
    q?: string
    sort?: string
    kategori?: string
    stock?: string
  }>
}) {
  const { brand } = await params
  const { page, q, sort, kategori, stock } = await searchParams

  const pageValue = Number(page) || 1
  const result = await getProductByBrand(brand, pageValue, { kategori })
  const brandResult = await getBrandByName(brand)
  const categories = await getSelectedCategories(brand)

  if (!brandResult?.brand) notFound()

  const brandData = brandResult.brand

  return (
    <div className="mt-[60px] min-h-screen bg-bg-site font-sans md:mt-[66px]">
      <div className="border-b border-dashed border-third/25 pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 md:px-14">
          <nav
            className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 pt-5 text-[11px] text-third/50 md:pt-8 md:text-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Link href="/" className="flex-shrink-0 transition-colors hover:text-third">
              Beranda
            </Link>
            <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/brand" className="flex-shrink-0 transition-colors hover:text-third">
              Brand
            </Link>
            <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="truncate font-semibold capitalize text-third">{brandData.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-center md:gap-10">
            <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-third/10 md:h-32 md:w-56">
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${brandData.image}`}
                alt={`Bandar Musik Jakarta - ${brandData.name}`}
                fill
                sizes="(max-width: 768px) 160px, 224px"
                className="object-contain p-4 md:p-5"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-third/50">
                Brand
              </p>
              <h1 className="font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold uppercase leading-[1.25] text-third">
                {brandData.name}
              </h1>
              {brandData.description && (
                <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-third/60 md:text-[14px]">
                  {brandData.description}
                </p>
              )}
            </div>

            {result && (
              <div className="flex-shrink-0 border-t border-dashed border-third/25 pt-4 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-third/50">
                  Total Produk
                </p>
                <p className="mt-1 font-boldonse text-[24px] font-bold leading-none text-third md:text-[32px]">
                  {result.total}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8 md:px-14 md:py-10">
          <ProductsLayout
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
            categories={categories}
          />
        </div>
      )}
    </div>
  )
}