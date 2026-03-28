"use server"

export async function liveSearching(keyword: string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/search/${keyword}`, {
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            next: { revalidate: 300 }
        })
        const data = await response.json()
        if(response.ok) return { products: data.products, brands: data.brands, categories: data.categories }
    }catch(err){ console.log(err) }
}