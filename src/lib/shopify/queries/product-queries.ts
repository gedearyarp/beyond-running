import { gql } from 'graphql-request';

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
    images(first: 1) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 250) {
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
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 250) {
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
          image {
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

export const GET_PRODUCT_DETAIL_BY_HANDLE_QUERY = gql`
  ${PRODUCT_DETAIL_FRAGMENT}
  query getProductDetailByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductDetailFragment
    }
  }
`;

export const GET_ALL_PRODUCT_HANDLES_QUERY = gql`
  query getAllProductHandles {
    products(first: 250) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;