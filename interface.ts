export interface IBrand {
    id: number,
    name: string,
    description: string,
    image: string,
    kategori_id: null | string,
    created_at: string,
    updated_at: string
}

export interface ICategory {
    id: number,
    title: string,
    parent: string | null,
    image: string,
    subparent: string | null,
    brands: string[] | null,
    created_at: string,
    updated_at: string
}