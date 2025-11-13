import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
}

interface StockValidationResult {
    isValid: boolean;
    outOfStockItems: CartItem[];
    lowStockItems: CartItem[];
}

interface CartState {
    items: CartItem[];
    cartId: string | null;
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    setCartId: (cartId: string | null) => void;
    clearCart: () => void;
    toggleCart: () => void;
    closeCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    validateStock: () => Promise<StockValidationResult>;
    checkout: () => Promise<string | null>;
    checkoutWithoutValidation: () => Promise<string | null>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            cartId: null,
            isOpen: false,
            setCartId: (cartId: string | null) => set({ cartId }),
            addItem: (itemToAdd) =>
                set((state: CartState) => {
                    const existingItem = state.items.find((i) => i.id === itemToAdd.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === itemToAdd.id
                                    ? { ...i, quantity: i.quantity + itemToAdd.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, itemToAdd] };
                }),
            removeItem: (itemId) =>
                set((state: CartState) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                })),
            updateQuantity: (itemId, quantity) =>
                set((state: CartState) => ({
                    items: state.items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                })),
            clearCart: () => set({ items: [], cartId: null, isOpen: false }),
            toggleCart: () => set((state: CartState) => ({ isOpen: !state.isOpen })),
            closeCart: () => set({ isOpen: false }),
            getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            getTotalPrice: () =>
                get().items.reduce((total, item) => total + item.price * item.quantity, 0),
            validateStock: async () => {
                const state = get();
                const outOfStockItems: CartItem[] = [];
                const lowStockItems: CartItem[] = [];

                // Check stock for each item in cart
                for (const item of state.items) {
                    try {
                        const response = await fetch("/api/cart/validate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ variantId: item.id, quantity: item.quantity }),
                        });

                        const result = await response.json();

                        if (!result.success) {
                            if (result.error === "OUT_OF_STOCK") {
                                outOfStockItems.push(item);
                            } else if (result.error === "LOW_STOCK") {
                                lowStockItems.push(item);
                            }
                        }
                    } catch (error) {
                        console.error("Error validating stock for item:", item.id, error);
                        // If we can't validate, assume it's out of stock to be safe
                        outOfStockItems.push(item);
                    }
                }

                return {
                    isValid: outOfStockItems.length === 0 && lowStockItems.length === 0,
                    outOfStockItems,
                    lowStockItems,
                };
            },
            checkout: async () => {
                const state = get();
                if (state.items.length === 0) {
                    console.warn("Cannot checkout with an empty cart.");
                    return null;
                }

                try {
                    // Validate stock before checkout
                    const stockValidation = await state.validateStock();

                    if (!stockValidation.isValid) {
                        // Handle out of stock items
                        if (stockValidation.outOfStockItems.length > 0) {
                            // Remove out of stock items from cart
                            stockValidation.outOfStockItems.forEach((item) => {
                                state.removeItem(item.id);
                            });

                            // Show notification about removed items
                            console.warn(
                                "Out of stock items removed from cart:",
                                stockValidation.outOfStockItems
                            );

                            // If no items left, return null
                            if (state.items.length === 0) {
                                return null;
                            }
                        }

                        // For low stock items, we can proceed but show warning
                        if (stockValidation.lowStockItems.length > 0) {
                            console.warn("Low stock items in cart:", stockValidation.lowStockItems);
                        }
                    }

                    // Call API route to create checkout with country context
                    const response = await fetch("/api/checkout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ items: state.items }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to create checkout");
                    }

                    const { checkoutUrl } = await response.json();
                    set({ items: [], cartId: null, isOpen: false });
                    return checkoutUrl;
                } catch (error) {
                    console.error("Checkout failed:", error);
                    return null;
                }
            },
            checkoutWithoutValidation: async () => {
                const state = get();
                if (state.items.length === 0) {
                    console.warn("Cannot checkout with an empty cart.");
                    return null;
                }

                try {
                    // Call API route to create checkout with country context
                    const response = await fetch("/api/checkout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ items: state.items }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to create checkout");
                    }

                    const { checkoutUrl } = await response.json();
                    set({ items: [], cartId: null, isOpen: false });
                    return checkoutUrl;
                } catch (error) {
                    console.error("Checkout failed:", error);
                    return null;
                }
            },
        }),
        {
            name: "cart-storage",
            migrate: (persistedState, version) => {
                if (persistedState && Array.isArray(persistedState.items)) {
                    persistedState.items = persistedState.items.map((item) => ({
                        ...item,
                        price:
                            typeof item.price === "string"
                                ? Number(item.price.replace(/[^0-9.]/g, ""))
                                : item.price,
                    }));
                }
                return persistedState;
            },
        }
    )
);
