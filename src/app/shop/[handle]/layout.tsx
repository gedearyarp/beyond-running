// app/shop/[handle]/layout.tsx
// Ini adalah Server Component yang akan fetch data untuk halaman detail produk

import { getProductDetailByHandle, getAllProductHandles, getAllProductsForShopPage } from '@/lib/shopify';
import { ProductDetailType, ProductCardType } from '@/lib/shopify/types';
import ProductDetailPage from './page'; // <-- Import page.tsx sebagai Client Component
import Link from 'next/link'

export const dynamic = 'force-dynamic'; // Pastikan ini dinamis untuk pengembangan

export default async function ProductDetailLayout({ params }: { params: { handle: string } }) {
    console.log("--> PRODUCT DETAIL LAYOUT EXECUTED for handle:", params.handle);
    const { handle } = params;
    let product: ProductDetailType | null = null;
    let relatedProducts: ProductCardType[] = [];

    try {
        product = await getProductDetailByHandle(handle); // Fetch detail produk
        const allProducts = await getAllProductsForShopPage(8); // Fetch produk terkait
        relatedProducts = allProducts.filter(p => p.handle !== handle).slice(0, 4);
        console.log(product)
    } catch (error) {
        console.error("Failed to fetch product or related products:", error);
    }

    if (!product) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <p>Produk tidak ditemukan.</p>
                <Link to="/shop" className="text-blue-600 hover:underline mt-4">Kembali ke daftar produk</Link>
            </div>
        );
    }

    return (
        // Teruskan data yang di-fetch ke Client Component `ProductDetailPage`
        <ProductDetailPage product={product} relatedProducts={relatedProducts} />
    );
}

export async function generateStaticParams() {
    const handles = await getAllProductHandles();
    return handles.map((handle) => ({
        handle: handle,
    }));
}