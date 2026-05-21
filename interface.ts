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

export interface IProduct {
  id: string;
  brandId: string;
  kategoriId: string;
  name: string;
  description: string;
  url: string;
  // images sudah dalam bentuk array karena sudah kita transform di Laravel
  images: string[][]; 
  offlinePrice: string; // Di data kamu bentuknya string "8500000"
  onlinePrice: string;
  stock: number;
  berat: number | null;
  lebar: number | null;
  panjang: number | null;
  tinggi: number | null;
  kirim: number;
  pasang: number;
  pajak: number;
  pricelist: string | null;
  promo: string | null;
  namaPromo: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationData {
  current_page: number;
  data: IProduct[]; // Array produk ada di sini
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiResponse {
  success: boolean;
  produk: PaginationData;
}

export interface FormValues {
  name: string;
  description: string;
  pricelist: string;
  offlinePrice: string;
  onlinePrice: string;
  namaPromo: string;
  promo: string;
  brandId: string;
  kategoriId: string;
  stock: string;
  url: string;
  panjang: string;
  lebar: string;
  tinggi: string;
  berat: string;
  pajak: boolean;
  kirim: boolean;
  pasang: boolean;
  variant: string;
  options: [] | {id: number, name: string, image: string, harga: string}[],
  discount: string,
  tautan: string
}

export interface IOption {
  id: number, name: string, image: string | null, imagePreview: string | null, harga: string
}

export interface TikTokOEmbedResponse {
  version: string;
  type: "video" | "rich";
  title: string;
  author_url: string;
  author_name: string;
  width: string;
  height: string;
  html: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  provider_url: string;
  provider_name: string;
}
 
export interface TikTokConfig {
  profileUrl: string;
  videoUrls: string[];
}