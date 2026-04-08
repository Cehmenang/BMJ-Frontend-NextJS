"use server"

import { getProductByUrl } from "@/action/product";
import ProductDetail from "@/components/product/ProductDetail";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { url: string } }): Promise<Metadata | any>{
  try{
    const { url } = await params
    const result = await getProductByUrl(url)
    return {
      title: result.produk.name,
      description: result.produk.description,
      openGraph: { 
        images: [{
          url: `${process.env.METADATA_API}/storage/${JSON.parse(result.produk.images)[0][0]}`,
          width: 400,
          height: 400
        }]
      }
    }
  }catch(err){ console.log(err) }
}

export default async function ProductPage({ params }: { params: { url: string } }) {
    const { url } = await params
    const response = await getProductByUrl(url)
    const product = response.produk

    if(!product) return <h1>loading</h1>

  return (
    <>
      <main className="pt-[66px]">
        {product && <ProductDetail product={product}/>}
      </main>
    </>
  );
}