import { IProduct } from "@/interface";
import ProductCard from "./ProductCard";
import { SetStateAction } from "react";

export default function ProductsLayout({ products, setPagination }: { products: IProduct[], setPagination: SetStateAction<any> }){
    return (
        <div>
            <div className="body-products-layout grid grid-cols-[1fr_2fr] gap-x-2 w-full pt-[200px]">
                <div className="sidebar-products w-[200px] border border-red-500 px-20">
                    <h1>sidebar</h1>
                </div>
                <div className="grid-products grid grid-cols-4 px-20">
                    {products.map((product, index)=>{
                        return (
                        <div className="mx-3 mb-10">
                            <ProductCard product={product} key={index}/>
                        </div>
                        )
                    })}
                </div>
                <button onClick={()=>setPagination((prev: number)=>prev+=1)}>Next</button>
            </div>
        </div>
    )
}