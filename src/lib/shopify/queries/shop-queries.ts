// lib/shopify/queries/shop-queries.ts
import { gql } from "graphql-request";

export const GET_SHOP_INFO_QUERY = gql`
    query getShopInfo {
        shop {
            name
            description
        }
    }
`;
