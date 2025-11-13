import { getProductsByCollection, getAllCollections } from "@/lib/shopify";
import { headers } from "next/headers";
import { getExchangeRates } from "@/lib/currency";
import ShopPageClient from "@/app/shop/client";
import { notFound } from "next/navigation";
import { sortProductsByCategory } from "@/lib/utils/product-sorting";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
    params: {
        handle: string;
    };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { handle } = params;

    // Get country code from headers set by middleware
    const headersList = await headers();
    const countryCode = headersList.get("x-country-code") || "ID";

    try {
        // Get all collections, products, and exchange rates in parallel
        const [collections, products, exchangeRates] = await Promise.all([
            getAllCollections(countryCode),
            getProductsByCollection(handle, countryCode),
            getExchangeRates(),
        ]);

        const currentCollection = collections.find((c) => c.handle === handle);

        if (!currentCollection) {
            notFound();
        }

        if (!products || products.length === 0) {
            return (
                <div className="container mx-auto py-20 text-center text-gray-500">
                    Tidak ada produk di koleksi ini.
                </div>
            );
        }

        // Sort products by category
        const sortedProducts = sortProductsByCategory(products);

        return (
            <ShopPageClient
                initialProducts={sortedProducts}
                collections={collections}
                collection={currentCollection}
                exchangeRates={exchangeRates}
            />
        );
    } catch (error) {
        console.error("Failed to fetch collection data:", error);
        return (
            <div className="container mx-auto py-20 text-center text-red-500">
                Gagal memuat koleksi.
            </div>
        );
    }
}
