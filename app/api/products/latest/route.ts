"use server"

import axiosClient from "@/config/axios";
import { NextResponse } from "next/server";

export async function GET(){
    const response = await axiosClient.get('/api/produk/terbaru')
    if(response.data){
        const products = response.data.produk.slice(0, 10)
        return NextResponse.json(products)
    }
}