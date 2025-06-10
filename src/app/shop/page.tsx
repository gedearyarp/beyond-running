// app/shop/page.tsx (server component)
import { getAllProductsForShopPage, getAllCollections } from "@/lib/shopify";
import { ProductCardType, Collection } from "@/lib/shopify/types";
import ShopPageClient from "./client"; // <--- Rename file lama kamu

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  let initialProducts: ProductCardType[] = [];
  let collections: Collection[] = [];

  try {
    [initialProducts, collections] = await Promise.all([
      getAllProductsForShopPage(20),
      getAllCollections()
    ]);
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
  }

  return (
    <ShopPageClient initialProducts={initialProducts} collections={collections} />
  );
}
