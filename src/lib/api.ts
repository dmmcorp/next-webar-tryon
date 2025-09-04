export type ColorOption = {
  name: string;
  type: string;
  colors: string[];
  swatchUrl?: string;
  imageUrl?: string;
  model3dUrl?: string;
  _id: string;
};

export type LensOption = {
  label: string;
  price: number;
  type: string;
  _id: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  specs: string[];
  stock: number;
  numStars: number;
  sales: number;
  colorOptions: ColorOption[];
  lensOptions: LensOption[];
  colorwayModels?: { name: string; model3dUrl: string }[];
};

export type ProductsResponse = {
  message: string;
  count: number;
  products: Product[];
};

import axios from "axios";

export async function fetchProductsWithModels(signal?: AbortSignal): Promise<ProductsResponse> {
  const res = await axios.get<ProductsResponse>(`/api/products/models`, {
    signal,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
