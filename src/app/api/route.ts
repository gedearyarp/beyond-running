import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { GET_ALL_PRODUCTS_FOR_SHOP_PAGE } from "@/lib/shopify/queries/product-queries";

export async function GET(request: NextRequest) {
    try {
        const data = await shopifyFetch({
            query: GET_ALL_PRODUCTS_FOR_SHOP_PAGE,
            variables: { first: 1 },
            countryCode: "ID", // Default, bisa diambil dari headers jika perlu
        });
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 }
        );
    }
}
