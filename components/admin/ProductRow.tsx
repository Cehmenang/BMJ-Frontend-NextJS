"use client"

import { IProduct } from "@/interface";
import Image from "next/image";
import { SetStateAction } from "react";

export default function ProductRow({ product, onUpdate } : { product: IProduct, onUpdate: SetStateAction<any> }){
    return (
        <tr>
            <td>
                <Image src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${product.images[0][0]}`} alt={product.name}/>
            </td>
            <td>
                <p>{product.name}</p>
                <p>{product.brandId}</p>
            </td>
        </tr>
    )
}