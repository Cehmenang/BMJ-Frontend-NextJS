import { IProduct } from "@/interface";
import ProductCard from "./ProductCard";
import { SetStateAction } from "react";

export default function ProductsLayout({ products, setPagination }: { products: IProduct[], setPagination: SetStateAction<any> }){
    return (
        <div>
            <div className="body-products-layout grid grid-cols-[1fr_2fr] gap-x-2 w-full">
                <div className="sidebar-products w-[200px] px-20 border border-amber-300">
                    <h1>Halo</h1>
                </div>
                <div className="grid-products grid grid-cols-4 gap-x-4 gap-y-8">
                    {products.map((product, index)=>{
                        return (
                            <ProductCard product={product} key={index}/>
                        )
                    })}
                </div>
                <button onClick={()=>setPagination((prev: number)=>prev+=1)}>Next</button>
            </div>
        </div>
    )
}