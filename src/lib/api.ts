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

const SERVER_URL = "https://baobab-vision-project-peox.onrender.com";

export async function fetchProductsWithModels(
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const res = await axios.get<ProductsResponse>(
    `${SERVER_URL}/api/products/models`,
    {
      signal,
      headers: { Accept: "application/json" },
      timeout: 15000,
    }
  );
  return res.data;
}
