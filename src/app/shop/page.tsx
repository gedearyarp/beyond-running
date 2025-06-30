// app/shop/page.tsx (server component)
import { getAllProductsForShopPage, getAllCollections } from "@/lib/shopify";
import { ProductCardType, Collection } from "@/lib/shopify/types";
import ShopPageClient from "./client"; // <--- Rename file lama kamu
import { sortProductsByCategory } from "@/lib/utils/product-sorting";
import ProductCard from "@/components/ui/ProductCard";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
    let initialProducts: ProductCardType[] = [];
    let collections: Collection[] = [];

    try {
        [initialProducts, collections] = await Promise.all([
            getAllProductsForShopPage(20),
            getAllCollections(),
        ]);
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
    }

    const sortedProducts = sortProductsByCategory(initialProducts);

    return <ShopPageClient initialProducts={sortedProducts} collections={collections} />;
}
