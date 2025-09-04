"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProductsWithModels, Product } from "@/lib/api";
import { Variants } from "@/lib/types";

type State = {
  loading: boolean;
  error: string | null;
  products: Product[];
};

export default function useProducts() {
  const [{ loading, error, products }, setState] = useState<State>({
    loading: true,
    error: null,
    products: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchProductsWithModels(controller.signal)
      .then((data) => {
        setState({ loading: false, error: null, products: data.products });
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Unknown error";
        setState({ loading: false, error: message, products: [] });
      });
    return () => controller.abort();
  }, []);

  const models = useMemo(
    () =>
      products.map((p) => ({
        name: p.name,
        image: p.imageUrls?.[0],
      })),
    [products]
  );

  const variants: Variants[] = useMemo(() => {
    const list: Variants[] = [];
    for (const p of products) {
      for (const c of p.colorOptions || []) {
        if (c.model3dUrl) {
          const proxied = `/api/proxy/model?url=${encodeURIComponent(
            c.model3dUrl
          )}`;
          list.push({ model: p.name, variant: c.name, path: proxied });
        }
      }
    }
    return list;
  }, [products]);

  return { loading, error, products, models, variants };
}
