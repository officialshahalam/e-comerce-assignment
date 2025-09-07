import { Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface Store {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
}

export const useCartStore = create<Store>()(
  persist<Store>(
    (set, _get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.cart?.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity: product?.quantity }],
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart?.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: "store-storage",
    }
  )
);
