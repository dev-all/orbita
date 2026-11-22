"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface CartItem {
  variantId: string;
  quantity: number;
}
interface CartState {
  items: CartItem[];
  open: boolean;
  add: (variantId: string, max: number) => void;
  setQuantity: (variantId: string, quantity: number, max: number) => void;
  remove: (variantId: string) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
}
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (variantId, max) =>
        set((state) => {
          if (max < 1) return {};
          const existing = state.items.find((i) => i.variantId === variantId);
          return {
            open: true,
            items: existing
              ? state.items.map((i) =>
                  i.variantId === variantId
                    ? { ...i, quantity: Math.min(i.quantity + 1, max, 20) }
                    : i,
                )
              : [...state.items, { variantId, quantity: 1 }],
          };
        }),
      setQuantity: (variantId, quantity, max) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, max, 20)) }
              : i,
          ),
        })),
      remove: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      setOpen: (open) => set({ open }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "orbita-cart-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
