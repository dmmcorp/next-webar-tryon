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

import axios, { AxiosError } from "axios";

// const SERVER_URL = "https://baobab-vision-project-0234.onrender.com";
const SERVER_URL = "http://localhost:3001";
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds for better reliability

const api = axios.create({
  baseURL: SERVER_URL,
  headers: { Accept: "application/json" },
  timeout: TIMEOUT,
});

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProductsWithModels(
  signal?: AbortSignal
): Promise<ProductsResponse> {
  let lastError: Error;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await api.get<ProductsResponse>("/api/products/models", {
        signal,
      });
      return res.data;
    } catch (error) {
      // Store the error for potential final throw
      lastError = handleApiError(error);

      // Always throw immediately if request was cancelled by user
      if (signal?.aborted) {
        throw lastError;
      }

      // Check if it's an axios error and handle specific cases
      const axiosError = error as AxiosError;
      if (axios.isAxiosError(axiosError)) {
        // Always throw immediately if request was explicitly cancelled
        if (axiosError.message === "canceled") {
          throw lastError;
        }

        // Always throw immediately on 4xx client errors (bad request, unauthorized, etc.)
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          throw lastError;
        }
      }

      // If this isn't the last attempt, silently retry after delay
      if (attempt < MAX_RETRIES - 1) {
        const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        await delay(backoffDelay);
        // Continue to next attempt without showing error
        continue;
      }
    }
  }

  // All retries failed - only now show the error
  throw lastError!;
}

function handleApiError(error: unknown): Error {
  const axiosError = error as AxiosError;

  if (axios.isAxiosError(axiosError)) {
    if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
      return new Error(
        "Request timed out. The server is taking too long to respond. Please check your connection and try again."
      );
    }

    if (axiosError.message === "canceled") {
      return new Error("Request was cancelled.");
    }

    if (axiosError.response) {
      const status = axiosError.response.status;
      const statusText = axiosError.response.statusText;

      switch (status) {
        case 404:
          return new Error(
            "Products not found. The requested resource may have been moved or deleted."
          );
        case 500:
          return new Error("Server error occurred. Please try again later.");
        case 503:
          return new Error(
            "Service temporarily unavailable. Please try again in a few minutes."
          );
        default:
          return new Error(
            `Server error (${status}): ${statusText}. Please try again later.`
          );
      }
    }

    if (axiosError.request) {
      return new Error(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    }
  }

  return new Error(
    "An unexpected error occurred while fetching products. Please try again."
  );
}
