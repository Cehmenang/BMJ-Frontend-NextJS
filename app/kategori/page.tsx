import { getCategories } from "@/action/kategori"
import { useEffect } from "react"

export default function Kategori(){
  useEffect(()=>{
    (async function(){
      const data = await getCategories()
      console.log(data)
    })()
  }, [])

  return (
    <div className="kategori">
      <h1>Kategori Page</h1>
    </div>
  )
}