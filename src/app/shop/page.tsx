// app/shop/page.tsx (server component)
import { getAllProductsForShopPage } from "@/lib/shopify";
import { ProductCardType } from "@/lib/shopify/types";
import ShopPageClient from "./client"; // <--- Rename file lama kamu

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  let initialProducts: ProductCardType[] = [];

  try {
    initialProducts = await getAllProductsForShopPage(20); // fetch dari Shopify
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
  }

  return (
    <ShopPageClient initialProducts={initialProducts} />
  );
}
