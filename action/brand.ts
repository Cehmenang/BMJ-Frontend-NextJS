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

export async function uploadBrand(formData: FormData){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/tambah/brand`,{
            method: 'POST', headers: { "Accept": 'application/json' },
            body: formData
        })
        const data = await response.json()
        if(response.ok) return data
    }catch(err){ console.log(err) }
}

export async function getBrandByName(name: string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/brand/${name}`,{
            method: 'GET', headers: { "Accept": 'application/json' },
        })
        const data = await response.json()
        if(response.ok) return data
    }catch(err){ console.log(err) }
}

export async function getSelectedBrands(title: string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/selected/brand/${title}`,{
            method: 'GET',
            headers: { 'Content-Type': "application/json" },
        })
        console.log(response.status, response.statusText, 'STATUS')
        console.log(response, 'RESPONSE FETCH!')
        const brands = await response.json()
        if(response.ok){ return brands }
    }catch(err){ console.log(err) }
}