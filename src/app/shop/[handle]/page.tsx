import { getProductsByCollection, getAllCollections } from "@/lib/shopify";
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

    try {
        // Get all collections to find the current one
        const collections = await getAllCollections();
        const currentCollection = collections.find((c) => c.handle === handle);

        if (!currentCollection) {
            notFound();
        }

        // Get products for this collection
        const products = await getProductsByCollection(handle);

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
