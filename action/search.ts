"use server"

export async function liveSearching(keyword: string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/search/${keyword}`, {
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            cache: 'no-store'
        })
        const data = await response.json()
        if(response.ok) return { products: data.products, brands: data.brands, categories: data.categories }
    }catch(err){ console.log(err) }
}

export async function countDatas(){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/count`, {
            method: 'GET',
            headers: { "Content-Type": "application/json", "Accept": "application/json" }
        })
        const data = await response.json()
        if(response.ok) return data
    }catch(err){ console.log(err) }
}

export async function cekOngkir(location: string){
    try{
        const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${location}&limit=10`, {
            method: 'GET',
            headers: { 'key': process.env.SHIPPING! }
        }) as any
        const data = await response.json()
        if(response.ok){ return data }
    }catch(err){ console.log(err) }
}