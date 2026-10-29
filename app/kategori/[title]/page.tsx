import Link from "next/link"
import { getSelectedBrands } from "@/action/brand"
import { getProductByCategory } from "@/action/product"
import ProductsLayout from "@/components/product/ProductsLayout"

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default async function CategoryDetail({
  params,
  searchParams,
}: {
  params: Promise<{ title: string }>
  searchParams: Promise<{
    page?: string
    q?: string
    sort?: string
    kategori?: string
    stock?: string
    brand?: string
  }>
}) {
  const { title } = await params
  const { page, q, sort, kategori, stock, brand } = await searchParams

  const pageValue = Number(page) || 1
  const result = await getProductByCategory(title, pageValue, { brand })
  const brands = await getSelectedBrands(title)

  const displayTitle = safeDecode(title)
  const initial = displayTitle.trim().charAt(0).toUpperCase()

  return (
    <div className="mt-[60px] min-h-screen bg-bg-site font-sans md:mt-[66px]">
      <div className="border-b border-dashed border-third/25 pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 md:px-14">
          <nav className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 pt-5 text-[11px] text-third/50 md:pt-8 md:text-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="flex-shrink-0 transition-colors hover:text-third">
              Beranda
            </Link>
            <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/kategori" className="flex-shrink-0 transition-colors hover:text-third">
              Kategori
            </Link>
            <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="truncate font-semibold text-third">{displayTitle}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-center md:gap-10">
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-third/10 md:h-32 md:w-32">
              <span className="font-boldonse text-[44px] font-bold leading-none text-second md:text-[60px]">
                {initial}
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-second" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-third/50">
                Kategori
              </p>
              <h1 className="font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold uppercase leading-[1.25] text-third">
                {displayTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-third/60 md:text-[14px]">
                Semua produk {displayTitle} yang tersedia di Bandar Musik Jakarta.
              </p>
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

      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8 md:px-14 md:py-10">
        {result ? (
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
            brands={brands}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-third/40">
            <p className="text-center font-poppins text-[13px]">
              Produk untuk kategori{" "}
              <span className="font-semibold text-third">{displayTitle}</span> tidak ditemukan.
            </p>
            <Link
              href="/kategori"
              className="mt-4 rounded-sm bg-third px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-second hover:text-third"
            >
              Lihat Semua Kategori
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}