"use client"

import { getProductByBrand } from "@/action/product";
import ProductsLayout from "@/components/product/ProductsLayout";
import { IProduct } from "@/interface";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BrandPage(){
    const { brand } = useParams()
    const [ products, setProducts ] = useState<IProduct[] | null>(null)
    const [ pagination, setPagination ] = useState<number>(1)

    useEffect(()=>{
        (async()=>{
            const data = await getProductByBrand(brand as string, pagination)
            return setProducts(data)
        })()
    }, [pagination])

    if(!products) return <h1>loading</h1>

    return (
        <div className="brand-section">
            <ProductsLayout products={products} setPagination={setPagination}/>
        </div>
    )
}