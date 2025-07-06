import { notFound } from "next/navigation";
import { getProductDetailByHandle, getAllProductsForShopPage } from "@/lib/shopify";
import ProductDetailPage from "../../shop/[handle]/[product]/page";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

export default async function ProductPage({ params }: { params: { productName: string } }) {
    try {
        // Fetch product data and related products in parallel
        const [product, allProducts] = await Promise.all([
            getProductDetailByHandle(params.productName),
            getAllProductsForShopPage(),
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
                <ProductDetailPage product={product} relatedProducts={relatedProducts} />
            </Suspense>
        );
    } catch (error) {
        console.error("Error in ProductPage:", error);
        notFound();
    }
} 