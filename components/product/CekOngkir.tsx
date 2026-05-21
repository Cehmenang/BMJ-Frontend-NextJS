"use client"

export default function cekOngkir(){

    async function handleDestinationOption(e: any){
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const location = form.get('destination') as string
        if (location?.trim()) {
            const response = await fetch(`/api/ongkir?location=${location}`, { method: 'GET' })
            const data = await response.json()
            console.log(data, 'DATANYAAA')
        }
    }

    return (
        <div className="bg-ongkir-overlay fixed flex justify-center items-center top-0 left-0 w-[100%] h-dvh bg-third/50">
            <div className="form-ongkir bg-primary">
                <form onSubmit={handleDestinationOption}>
                    <input type="text" name="destination" placeholder="Kota/Kecamatan Tujuan"/>
                    <button type="submit">Cari Lokasi</button>
                </form>
            </div>
        </div>
    )
}