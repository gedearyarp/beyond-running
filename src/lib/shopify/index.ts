// lib/shopify/index.ts
import { GraphQLClient } from 'graphql-request';
import { GraphQLError } from 'graphql'; // Import GraphQLError untuk penanganan error yang lebih spesifik

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-04'; // Default ke 2024-04

// Validasi variabel lingkungan
if (!domain || !storefrontAccessToken) {
  throw new Error(
    'Missing Shopify API credentials. Make sure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are set in your .env.local file.'
  );
}

const graphqlEndpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

const client = new GraphQLClient(graphqlEndpoint, {
  headers: {
    'Shopify-Storefront-Access-Token': storefrontAccessToken, // ! tidak diperlukan lagi jika validasi sudah dilakukan
    'Content-Type': 'application/json',
  },
});

type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, any>;
  cache?: RequestCache; // For native fetch caching strategies
  // next?: NextFetchRequestConfig; // For Next.js specific caching options like revalidate
};

// Fungsi utama untuk melakukan request GraphQL
export async function shopifyFetch<T = any>({
  query,
  variables,
  cache = 'force-cache', // Default Next.js cache behavior for Server Components
  // next, // Passthrough for Next.js specific fetch options
}: ShopifyFetchParams): Promise<T> {
  try {
    const data = await client.request<T>(query, variables, {
      // Headers khusus per request jika diperlukan
      // 'X-GraphQL-Cost-Include-Fields': 'true',
    });

    // GraphQL-request akan melemparkan error untuk status HTTP non-2xx
    // dan juga untuk error GraphQL (yang ada di 'errors' properti payload)
    return data;
  } catch (error: any) {
    console.error('Shopify API Request Failed:');

    // Menangani error dari graphql-request (yang membungkus error GraphQL dan HTTP)
    if (error.response) {
      const { status, errors } = error.response;
      console.error('  HTTP Status:', status);
      if (errors) {
        console.error('  GraphQL Errors:', JSON.stringify(errors, null, 2));
        // Melempar error dengan detail GraphQL yang lebih spesifik
        throw new Error(`Shopify GraphQL Error (Status: ${status}): ${JSON.stringify(errors)}`);
      }
    } else {
      console.error('  Unknown Error:', error);
    }

    throw new Error('Failed to fetch data from Shopify API.');
  }
}

// Export fungsi-fungsi pembungkus untuk query spesifik (opsional, tapi bagus untuk DX)
// Ini membuat pemanggilan lebih eksplisit dan typed
import { ProductCardType, ProductDetailType, Shop, Connection } from './types';
import * as ShopQueries from './queries/shop-queries';
import * as ProductQueries from './queries/product-queries';

export const getShopInfo = async (): Promise<Shop> => {
  const { shop } = await shopifyFetch<{ shop: Shop }>({ query: ShopQueries.GET_SHOP_INFO_QUERY });
  return shop;
};

// Mengambil produk untuk halaman toko (menggunakan tipe dan query minimal)
export const getAllProductsForShopPage = async (first: number = 20): Promise<ProductCardType[]> => {
  const { products } = await shopifyFetch<{ products: Connection<ProductCardType> }>({
    query: ProductQueries.GET_ALL_PRODUCTS_FOR_SHOP_PAGE,
    variables: { first },
  });
  return products.edges.map((edge) => edge.node);
};

// Mengambil detail produk untuk halaman detail (menggunakan tipe dan query lengkap)
export const getProductDetailByHandle = async (handle: string): Promise<ProductDetailType | null> => {
  const { productByHandle } = await shopifyFetch<{ productByHandle: ProductDetailType }>({
    query: ProductQueries.GET_PRODUCT_DETAIL_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return productByHandle;
};

export const getAllProductHandles = async (): Promise<string[]> => {
  const { products } = await shopifyFetch<{ products: Connection<{ handle: string }> }>({
    query: ProductQueries.GET_ALL_PRODUCT_HANDLES_QUERY,
  });
  const handles = products.edges.map((edge) => edge.node.handle);
  console.log('Fetched Product Handles:', handles); // <-- Tambahkan ini
  return handles;
};


// ... Tambahkan fungsi-fungsi lain untuk koleksi, keranjang, dll.