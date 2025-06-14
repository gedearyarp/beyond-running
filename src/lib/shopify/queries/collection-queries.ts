import { gql } from 'graphql-request';

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
            images(first: 1) {
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
                }
              }
            }
          }
        }
      }
    }
  }
`;
