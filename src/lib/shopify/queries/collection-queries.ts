import { gql } from "graphql-request";

export const COLLECTION_FRAGMENT = gql`
    fragment CollectionFragment on Collection {
        id
        title
        handle
        description
        image {
            url
            altText
        }
    }
`;

export const GET_ALL_COLLECTIONS = gql`
    ${COLLECTION_FRAGMENT}
    query getAllCollections {
        collections(first: 50) {
            edges {
                node {
                    ...CollectionFragment
                }
            }
        }
    }
`;

export const GET_COLLECTION_PRODUCTS = gql`
    query getCollectionProducts($handle: String!) {
        collectionByHandle(handle: $handle) {
            id
            title
            handle
            description
            image {
                url
                altText
            }
            products(first: 50) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        productType
                        tags
                        images(first: 20) {
                            edges {
                                node {
                                    url
                                    altText
                                }
                            }
                        }
                        priceRange {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        variants(first: 5) {
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
                    }
                }
            }
        }
    }
`;
