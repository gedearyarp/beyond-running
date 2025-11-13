import { client } from "./index";
import type { CartItem } from "@/store/cart";

export async function createCheckout(cartItems: CartItem[], countryCode: string = "ID") {
    try {
        // Create a new checkout
        const checkout = await client.checkout.create();

        // Prepare line items
        const lineItems = cartItems.map((item) => ({
            variantId: item.id,
            quantity: item.quantity,
        }));

        // Add line items to checkout
        const checkoutWithItems = await client.checkout.addLineItems(checkout.id, lineItems);

        // Append country code to checkout URL to ensure correct pricing
        // Shopify checkout URL accepts country parameter to set the country context
        // When user opens checkout, Shopify will automatically set the country based on this parameter
        const checkoutUrl = new URL(checkoutWithItems.webUrl);
        
        // Add country parameter - Shopify checkout will use this to set the country automatically
        // Format: ?country=GB (Shopify will read this and set country to GB, which triggers currency change)
        if (!checkoutUrl.searchParams.has("country") && !checkoutUrl.searchParams.has("locale")) {
            checkoutUrl.searchParams.set("country", countryCode);
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
