import { GraphQLClient } from 'graphql-request';
import { ProductCardType, ProductDetailType, Shop, Connection } from './types';
import * as ShopQueries from './queries/shop-queries';
import * as ProductQueries from './queries/product-queries';
import * as CollectionQueries from './queries/collection-queries';
import Client from 'shopify-buy';

// Shopify API Configuration
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01';

// Validate required environment variables
if (!domain || !storefrontAccessToken) {
  throw new Error(
    'Missing Shopify API credentials. Make sure NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_TOKEN are set in your .env.local file.'
  );
}

// Initialize GraphQL client
const graphqlEndpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
const graphqlClient = new GraphQLClient(graphqlEndpoint, {
  headers: {
    'Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
  },
});

// Types
type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, any>;
  cache?: RequestCache;
};

/**
 * Generic function to fetch data from Shopify Storefront API
 */
export async function shopifyFetch<T = any>({
  query,
  variables,
  cache = 'force-cache',
}: ShopifyFetchParams): Promise<T> {
  try {
    const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  } catch (error: any) {
    throw new Error(`Shopify API Request Failed: ${error.message}`);
  }
}

/**
 * Get shop information
 */
export const getShopInfo = async (): Promise<Shop> => {
  const { shop } = await shopifyFetch<{ shop: Shop }>({ 
    query: ShopQueries.GET_SHOP_INFO_QUERY 
  });
  return shop;
};

/**
 * Get all products for shop page
 */
export const getAllProductsForShopPage = async (first: number = 20): Promise<ProductCardType[]> => {
  const { products } = await shopifyFetch<{ products: Connection<ProductCardType> }>({
    query: ProductQueries.GET_ALL_PRODUCTS_FOR_SHOP_PAGE,
    variables: { first },
  });
  return products.edges.map((edge) => edge.node);
};

/**
 * Get product detail by handle
 */
export const getProductDetailByHandle = async (handle: string): Promise<ProductDetailType | null> => {
  const { productByHandle } = await shopifyFetch<{ productByHandle: ProductDetailType }>({
    query: ProductQueries.GET_PRODUCT_DETAIL_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return productByHandle;
};

/**
 * Get all product handles
 */
export const getAllProductHandles = async (): Promise<string[]> => {
  const { products } = await shopifyFetch<{ products: Connection<{ handle: string }> }>({
    query: ProductQueries.GET_ALL_PRODUCT_HANDLES_QUERY,
  });
  return products.edges.map((edge) => edge.node.handle);
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    url: string;
    altText?: string;
  };
};

/**
 * Get all collections
 */
export const getAllCollections = async (): Promise<Collection[]> => {
  const { collections } = await shopifyFetch<{ collections: Connection<Collection> }>({
    query: CollectionQueries.GET_ALL_COLLECTIONS,
  });
  return collections.edges.map((edge) => edge.node);
};

/**
 * Get products by collection handle
 */
export const getProductsByCollection = async (handle: string): Promise<ProductCardType[]> => {
  const { collectionByHandle } = await shopifyFetch<{ collectionByHandle: { products: Connection<ProductCardType> } }>({
    query: CollectionQueries.GET_COLLECTION_PRODUCTS,
    variables: { handle },
  });

  if (!collectionByHandle) {
    throw new Error(`Collection with handle "${handle}" not found`);
  }

  return collectionByHandle.products.edges.map((edge) => edge.node);
};

export const client = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_TOKEN!,
});