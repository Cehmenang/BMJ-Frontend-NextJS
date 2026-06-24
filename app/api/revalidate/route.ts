import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const { secret } = await req.json()
    
    if (secret !== process.env.REVALIDATE_SECRET) {
        return Response.json({ error: 'unauthorized' }, { status: 401 })
    }
    
    revalidateTag('products', 'everything')
    return Response.json({ revalidated: true })
}