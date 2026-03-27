"use client"

import { getProductByUrl } from "@/action/product";
import ProductDetail from "@/components/product/ProductDetail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
    const { url } = useParams() as { url: string }
    const [ product, setProduct ] = useState<any>(null)
    useEffect(()=>{
        (async function(){
            const response = await getProductByUrl(url)
            return setProduct(response.produk)
        })()
    }, [])

    useEffect(()=>{
        console.log(product)
    }, [product])

    if(!product) return <h1>loading</h1>

  return (
    <>
      <main className="pt-[66px]">
        <ProductDetail product={product && product}/>
      </main>
    </>
  );
}