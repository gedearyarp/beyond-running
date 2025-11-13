import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/shopify/checkout";
import type { CartItem } from "@/store/cart";

export async function POST(request: NextRequest) {
    try {
        // Get country code from headers set by middleware
        const countryCode = request.headers.get("x-country-code") || "ID";

        // Parse request body
        const body = await request.json();
        const { items }: { items: CartItem[] } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Cart items are required" },
                { status: 400 }
            );
        }

        // Create checkout with country code
        const { checkoutUrl, checkoutId } = await createCheckout(items, countryCode);

        return NextResponse.json({
            checkoutUrl,
            checkoutId,
        });
    } catch (error: any) {
        console.error("Error in checkout API:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create checkout" },
            { status: 500 }
        );
    }
}

