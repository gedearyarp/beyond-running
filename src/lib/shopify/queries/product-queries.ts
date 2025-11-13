import { gql } from "graphql-request";

export const PRODUCT_CARD_FRAGMENT = gql`
    fragment ProductCardFragment on Product {
        id
        title
        handle
        description
        productType
        tags
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
        }
        images(first: 20) {
            edges {
                node {
                    url
                    altText
                }
            }
        }
        metafields(
            identifiers: [
                { namespace: "shopify", key: "color-pattern" }
                { namespace: "shopify", key: "size" }
                { namespace: "shopify", key: "target-gender" }
            ]
        ) {
            key
            references(first: 10) {
                nodes {
                    ... on Metaobject {
                        id
                        handle
                        field(key: "name") {
                            value
                        }
                    }
                }
            }
        }
        variants(first: 50) {
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
        description
        descriptionHtml
        productType
        tags
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
        }
        images(first: 10) {
            edges {
                node {
                    url
                    altText
                }
            }
        }
        variants(first: 100) {
            edges {
                node {
                    id
                    title
                    price {
                        amount
                        currencyCode
                    }
                    availableForSale
                    selectedOptions {
                        name
                        value
                    }
                    image {
                        url
                        altText
                    }
                }
            }
        }
    }
`;

export const GET_ALL_PRODUCTS_FOR_SHOP_PAGE = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query getAllProductsForShopPage($first: Int = 20, $countryCode: CountryCode!) @inContext(country: $countryCode) {
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
    query getProductDetailByHandle($handle: String!, $countryCode: CountryCode!) @inContext(country: $countryCode) {
        productByHandle(handle: $handle) {
            ...ProductDetailFragment
        }
    }
`;

export const GET_ALL_PRODUCT_HANDLES_QUERY = gql`
    query getAllProductHandles($countryCode: CountryCode!) @inContext(country: $countryCode) {
        products(first: 250) {
            edges {
                node {
                    handle
                }
            }
        }
    }
`;
