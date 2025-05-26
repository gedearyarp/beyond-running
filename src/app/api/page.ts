import type { NextApiRequest, NextApiResponse } from "next";
import { fetchShopify } from "@/lib/shopify/shopify";
import { QUERY_GET_PRODUCTS } from "@/lib/shopify/product"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await fetchShopify(QUERY_GET_PRODUCTS, { first: 1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
