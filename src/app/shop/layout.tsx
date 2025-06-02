import { getAllProductsForShopPage } from '@/lib/shopify';
import { ProductCardType } from '@/lib/shopify/types';
import ShopPageClient from './page';

export const dynamic = 'force-dynamic';

export default async function ShopLayout() {
  let initialProducts: ProductCardType[] = [];
  try {
    initialProducts = await getAllProductsForShopPage(20);
  } catch (error) {
    console.error('Failed to fetch initial products for shop page:', error);
  }

  return (
    <ShopPageClient initialProducts={initialProducts} />
  );
}