import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getProductDetailByHandle, getAllProductsForShopPage } from "@/lib/shopify";
import { getExchangeRates } from "@/lib/currency";
import ProductDetailPage from "../../shop/[handle]/[product]/page";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

export default async function ProductPage({ params }: { params: { productName: string } }) {
    // Get country code from headers set by middleware
    const headersList = await headers();
    const countryCode = headersList.get("x-country-code") || "ID";

    try {
        // Fetch product data, related products, and exchange rates in parallel
        const [product, allProducts, exchangeRates] = await Promise.all([
            getProductDetailByHandle(params.productName, countryCode),
            getAllProductsForShopPage(20, countryCode),
            getExchangeRates(),
        ]);

        if (!product) {
            notFound();
        }

        // Filter out current product and get related products
        const relatedProducts = allProducts.filter((p) => p.handle !== params.productName).slice(0, 4);

        return (
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <Loading text="Loading product..." />
                    </div>
                }
            >
                <ProductDetailPage
                    product={product}
                    relatedProducts={relatedProducts}
                    exchangeRates={exchangeRates}
                />
            </Suspense>
        );
    } catch (error) {
        console.error("Error in ProductPage:", error);
        notFound();
    }
} 