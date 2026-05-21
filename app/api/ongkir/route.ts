"use server"

import { NextRequest } from "next/server"

export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location')
    const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${location}&limit=999&offset=999`) as any
    if(response.ok){ return response.data }
}