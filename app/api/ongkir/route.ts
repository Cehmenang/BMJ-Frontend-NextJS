import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location')
    const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${location}`, {
        method: 'GET',
        headers: { 'key': process.env.SHIPPING! }
    }) as any
    if(response.ok){ return NextResponse.json({
        data: await response.json()
    }) }
}