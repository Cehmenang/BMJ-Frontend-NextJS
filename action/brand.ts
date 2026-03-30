'use server'

export async function getBrands(){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/brand`, { 
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            next: { revalidate: 300 }
         })
        if(response.ok) return await response.json().then(res=>res.brands)
    }catch(err){ console.log(err) }
}