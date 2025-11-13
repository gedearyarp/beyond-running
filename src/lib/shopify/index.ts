import { ProductCardType, ProductDetailType, Shop, Connection } from "./types";
import * as ShopQueries from "./queries/shop-queries";
import * as ProductQueries from "./queries/product-queries";
import * as CollectionQueries from "./queries/collection-queries";
import Client from "shopify-buy";

// Shopify API Configuration
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2024-01";

// Validate required environment variables
if (!domain || !storefrontAccessToken) {
    throw new Error(
        "Missing Shopify API credentials. Make sure NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_TOKEN are set in your .env.local file."
    );
}

// Types
type ShopifyFetchParams = {
    query: string;
    variables?: Record<string, any>;
    countryCode?: string;
    cache?: RequestCache;
    tags?: string[];
};

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Generic function to fetch data from Shopify Storefront API
 */
export async function shopifyFetch<T = any>({
    query,
    variables = {},
    countryCode = "ID",
    cache = "force-cache",
    tags = ["shopify-products", "shopify-collections"],
}: ShopifyFetchParams): Promise<T> {
    try {
        // Check if query requires countryCode (contains @inContext directive)
        const requiresCountryCode = query.includes("@inContext");
        
        // Only add countryCode if query requires it
        const variablesWithCountry = requiresCountryCode
            ? {
                  ...variables,
                  countryCode,
              }
            : variables;

        const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
            },
            body: JSON.stringify({
                query,
                variables: variablesWithCountry,
            }),
            cache: isDevelopment ? "no-store" : cache, // No cache di development
            next: isDevelopment
                ? undefined
                : {
                      revalidate: 300, // Revalidate setiap 5 menit
                      tags, // Cache tags untuk invalidation
                  },
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
export const getShopInfo = async (countryCode: string = "ID"): Promise<Shop> => {
    const { shop } = await shopifyFetch<{ shop: Shop }>({
        query: ShopQueries.GET_SHOP_INFO_QUERY,
        countryCode,
    });
    return shop;
};

/**
 * Get all products for shop page
 */
export const getAllProductsForShopPage = async (
    first: number = 20,
    countryCode: string = "ID"
): Promise<ProductCardType[]> => {
    const { products } = await shopifyFetch<{ products: Connection<ProductCardType> }>({
        query: ProductQueries.GET_ALL_PRODUCTS_FOR_SHOP_PAGE,
        variables: { first },
        countryCode,
        tags: ["shopify-products"],
    });
    return products.edges.map((edge) => edge.node);
};

/**
 * Get product detail by handle
 */
export const getProductDetailByHandle = async (
    handle: string,
    countryCode: string = "ID"
): Promise<ProductDetailType | null> => {
    const { productByHandle } = await shopifyFetch<{ productByHandle: ProductDetailType }>({
        query: ProductQueries.GET_PRODUCT_DETAIL_BY_HANDLE_QUERY,
        variables: { handle },
        countryCode,
        tags: ["shopify-products"],
    });
    return productByHandle;
};

/**
 * Get all product handles
 */
export const getAllProductHandles = async (countryCode: string = "ID"): Promise<string[]> => {
    const { products } = await shopifyFetch<{ products: Connection<{ handle: string }> }>({
        query: ProductQueries.GET_ALL_PRODUCT_HANDLES_QUERY,
        countryCode,
        tags: ["shopify-products"],
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
export const getAllCollections = async (countryCode: string = "ID"): Promise<Collection[]> => {
    const { collections } = await shopifyFetch<{ collections: Connection<Collection> }>({
        query: CollectionQueries.GET_ALL_COLLECTIONS,
        countryCode,
        tags: ["shopify-collections"],
    });
    return collections.edges.map((edge) => edge.node);
};

/**
 * Get products by collection handle
 */
export const getProductsByCollection = async (
    handle: string,
    countryCode: string = "ID"
): Promise<ProductCardType[]> => {
    const { collectionByHandle } = await shopifyFetch<{
        collectionByHandle: { products: Connection<ProductCardType> };
    }>({
        query: CollectionQueries.GET_COLLECTION_PRODUCTS,
        variables: { handle },
        countryCode,
        tags: ["shopify-products", "shopify-collections"],
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
