import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCheckout } from '@/lib/shopify/checkout';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  checkout: () => Promise<string>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0
        );
      },

      checkout: async () => {
        const state = get();
        try {
          const { checkoutUrl } = await createCheckout(state.items);
          // Clear cart after successful checkout creation
          state.clearCart();
          state.closeCart();
          return checkoutUrl;
        } catch (error) {
          console.error("Checkout error:", error);
          throw new Error("Failed to create checkout");
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