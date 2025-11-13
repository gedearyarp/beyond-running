import { client } from "./index";
import type { CartItem } from "@/store/cart";

export async function createCheckout(cartItems: CartItem[], countryCode: string = "ID") {
    try {
        // Create a new checkout
        const checkout = await client.checkout.create();

        // Set buyer identity with country code for proper pricing
        // This ensures checkout uses the correct country context from Shopify Markets
        let checkoutWithBuyerIdentity = checkout;
        try {
            checkoutWithBuyerIdentity = await client.checkout.updateAttributes(checkout.id, {
                buyerIdentity: {
                    countryCode: countryCode,
                },
            });
        } catch (updateError) {
            // If update fails, continue with original checkout
            // Some Shopify configurations might not support buyerIdentity update
            console.warn("Failed to update buyer identity, continuing with default:", updateError);
        }

        // Prepare line items
        const lineItems = cartItems.map((item) => ({
            variantId: item.id,
            quantity: item.quantity,
        }));

        // Add line items to checkout
        const checkoutWithItems = await client.checkout.addLineItems(
            checkoutWithBuyerIdentity.id,
            lineItems
        );

        // Append country code to checkout URL to ensure correct pricing
        // Shopify checkout URL can accept locale/country parameters
        const checkoutUrl = new URL(checkoutWithItems.webUrl);
        // Add country parameter if not already present
        if (!checkoutUrl.searchParams.has("locale")) {
            checkoutUrl.searchParams.set("locale", countryCode.toLowerCase());
        }

        return {
            checkoutUrl: checkoutUrl.toString(),
            checkoutId: checkoutWithItems.id,
        };
    } catch (error) {
        console.error("Error creating checkout:", error);
        throw new Error("Failed to create checkout");
    }
}

export async function getCheckout(checkoutId: string) {
    try {
        const checkout = await client.checkout.fetch(checkoutId);
        return checkout;
    } catch (error) {
        console.error("Error fetching checkout:", error);
        throw new Error("Failed to fetch checkout");
    }
}

export async function updateCheckout(
    checkoutId: string,
    lineItems: { variantId: string; quantity: number }[]
) {
    try {
        const checkout = await client.checkout.updateLineItems(checkoutId, lineItems);
        return checkout;
    } catch (error) {
        console.error("Error updating checkout:", error);
        throw new Error("Failed to update checkout");
    }
}
