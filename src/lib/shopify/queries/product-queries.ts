// lib/shopify/queries/product-queries.ts
import { gql } from 'graphql-request';

// --- FRAGMEN UNTUK KARTU PRODUK (MINIMALIS) ---
export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFragment on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) { # Hanya butuh 1 gambar untuk kartu
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 250) { # Ambil semua varian untuk menghitung jumlah warna/size
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

// --- FRAGMEN UNTUK DETAIL PRODUK (LENGKAP) ---
export const PRODUCT_DETAIL_FRAGMENT = gql`
  fragment ProductDetailFragment on Product {
    id
    title
    handle
    descriptionHtml
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) { # Ambil lebih banyak gambar untuk detail
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 250) { # Ambil semua varian
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image { # Gambar per varian
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

// --- QUERY UNTUK SEMUA PRODUK (UNTUK SHOP PAGE) ---
export const GET_ALL_PRODUCTS_FOR_SHOP_PAGE = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query getAllProductsForShopPage($first: Int = 20) {
    products(first: $first) {
      edges {
        node {
          ...ProductCardFragment
        }
      }
    }
  }
`;

// --- QUERY UNTUK DETAIL PRODUK (UNTUK PRODUCT DETAIL PAGE) ---
export const GET_PRODUCT_DETAIL_BY_HANDLE_QUERY = gql`
  ${PRODUCT_DETAIL_FRAGMENT}
  query getProductDetailByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductDetailFragment
    }
  }
`;

// Query untuk daftar handle produk (berguna untuk generateStaticParams)
export const GET_ALL_PRODUCT_HANDLES_QUERY = gql`
  query getAllProductHandles {
    products(first: 250) { # Sesuaikan limit jika punya banyak produk
      edges {
        node {
          handle
        }
      }
    }
  }
`;