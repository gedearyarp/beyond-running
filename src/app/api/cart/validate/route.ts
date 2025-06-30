import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { gql } from "graphql-request";

const GET_VARIANT_STOCK_QUERY = gql`
    query getProductVariantStock($id: ID!) {
        node(id: $id) {
            ... on ProductVariant {
                id
                availableForSale
                quantityAvailable
                title
            }
        }
    }
`;

export async function POST(request: NextRequest) {
    try {
        const { variantId, quantity = 1 } = await request.json();

        if (!variantId) {
            return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
        }

        // Check real-time stock availability
        const variantData = await shopifyFetch<{
            node: {
                availableForSale: boolean;
                quantityAvailable: number | null;
                title: string;
            };
        }>({
            query: GET_VARIANT_STOCK_QUERY,
            variables: { id: variantId },
            cache: "no-store",
        });

        if (!variantData.node) {
            return NextResponse.json({ success: false, error: "VARIANT_NOT_FOUND" });
        }

        const { availableForSale, quantityAvailable } = variantData.node;

        // Check if variant is available for sale
        if (!availableForSale) {
            return NextResponse.json({ success: false, error: "OUT_OF_STOCK" });
        }

        // Check if requested quantity is available
        if (quantityAvailable !== null && quantity > quantityAvailable) {
            if (quantityAvailable === 0) {
                return NextResponse.json({ success: false, error: "OUT_OF_STOCK" });
            } else {
                return NextResponse.json({
                    success: false,
                    error: "LOW_STOCK",
                    availableQuantity: quantityAvailable,
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Stock validation error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
