"use server"

import { getAllProductsByPromo } from "@/action/product"

export default async function Promo(){
    const products = await getAllProductsByPromo()
    console.log(products)

    return (
        <div className="main-promo">
            <h1>HALAMAN PROMO</h1>
        </div>
    )
}