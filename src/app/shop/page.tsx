// app/shop/page.tsx (server component)
import { getAllProductsForShopPage, getAllCollections } from "@/lib/shopify";
import { headers } from "next/headers";
import { getExchangeRates } from "@/lib/currency";
import { ProductCardType, Collection } from "@/lib/shopify/types";
import ShopPageClient from "@/app/shop/client";
import { sortProductsByCategory } from "@/lib/utils/product-sorting";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
    // Get country code from headers set by middleware
    const headersList = await headers();
    const countryCode = headersList.get("x-country-code") || "ID";

    let initialProducts: ProductCardType[] = [];
    let collections: Collection[] = [];
    let exchangeRates: { [key: string]: number } = {};

    try {
        [initialProducts, collections, exchangeRates] = await Promise.all([
            getAllProductsForShopPage(100, countryCode),
            getAllCollections(countryCode),
            getExchangeRates(),
        ]);
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
    }

    const sortedProducts = sortProductsByCategory(initialProducts);

    return (
        <ShopPageClient
            initialProducts={sortedProducts}
            collections={collections}
            exchangeRates={exchangeRates}
        />
    );
}
