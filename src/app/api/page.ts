import type { NextApiRequest, NextApiResponse } from "next";
import { shopifyFetch } from "@/lib/shopify";
import { GET_ALL_PRODUCTS_FOR_SHOP_PAGE } from "@/lib/shopify/queries/product-queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await shopifyFetch({
      query: GET_ALL_PRODUCTS_FOR_SHOP_PAGE,
      variables: { first: 1 },
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
