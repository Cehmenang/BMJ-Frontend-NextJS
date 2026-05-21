import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location')
    try{
        const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${location}&limit=10`, {
            method: 'GET',
            headers: { 'key': process.env.SHIPPING! }
        }) as any
        const data = await response.json()
        if(response.ok){ return NextResponse.json({ data }) }
    }catch(err){ console.log(err) }
}