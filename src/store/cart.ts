import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCheckout } from '@/lib/shopify/checkout';

export interface CartItem {
  id: string;
  title: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
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
  checkout: () => Promise<string | null>;
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
                i.id === itemToAdd.id ? { ...i, quantity: i.quantity + itemToAdd.quantity } : i
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
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      checkout: async () => {
        const state = get();
        if (state.items.length === 0) {
          console.warn("Cannot checkout with an empty cart.");
          return null;
        }
        try {
          const { checkoutUrl } = await createCheckout(state.items);
          set({ items: [], cartId: null, isOpen: false });
          return checkoutUrl;
        } catch (error) {
          console.error("Checkout failed:", error);
          return null;
        }
      },
    }),
    {
      name: 'cart-storage',
      migrate: (persistedState, version) => {
        if (persistedState && Array.isArray(persistedState.items)) {
          persistedState.items = persistedState.items.map((item) => ({
            ...item,
            price: typeof item.price === "string"
              ? Number(item.price.replace(/[^0-9.]/g, ""))
              : item.price,
          }))
        }
        return persistedState
      },
    }
  )
); 