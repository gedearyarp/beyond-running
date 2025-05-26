// app/shop/layout.tsx
// Ini adalah Server Component yang akan fetch data awal untuk Shop Page

import { getAllProductsForShopPage } from '@/lib/shopify';
import { ProductCardType } from '@/lib/shopify/types';
import ShopPageClient from './page'; // Import Client Component page.tsx

export const dynamic = 'force-dynamic'; // Selalu render dinamis di server

export default async function ShopLayout() {
  let initialProducts: ProductCardType[] = [];
  try {
    initialProducts = await getAllProductsForShopPage(20); // Ambil 20 produk awal
  } catch (error) {
    console.error('Failed to fetch initial products for shop page:', error);
    // Anda bisa mengembalikan pesan error atau data fallback di sini
  }

  return (
    <ShopPageClient initialProducts={initialProducts} />
  );
}