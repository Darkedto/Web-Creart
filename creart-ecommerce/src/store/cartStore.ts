'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartVariant {
  size?: string;
  color?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: CartVariant;
  customDesignNotes?: string;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, variant: CartVariant) => void;
  update: (productId: string, variant: CartVariant, quantity: number) => void;
  clear: () => void;
  total: () => number;
  subtotal: () => number;
  count: () => number;
}

const itemKey = (productId: string, variant: CartVariant) =>
  `${productId}-${variant.size ?? ''}-${variant.color ?? ''}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (incoming) => {
        set((state) => {
          const key = itemKey(incoming.productId, incoming.variant);
          const exists = state.items.find(
            (i) => itemKey(i.productId, i.variant) === key
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.variant) === key
                  ? { ...i, quantity: i.quantity + incoming.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, incoming] };
        });
      },

      remove: (productId, variant) => {
        const key = itemKey(productId, variant);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.variant) !== key
          ),
        }));
      },

      update: (productId, variant, quantity) => {
        const key = itemKey(productId, variant);
        if (quantity <= 0) {
          get().remove(productId, variant);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.variant) === key ? { ...i, quantity } : i
          ),
        }));
      },

      clear: () => set({ items: [] }),

      subtotal: () => {
        return get().items.reduce((s, i) => s + i.price * i.quantity, 0);
      },

      total: () => get().subtotal(),

      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'creart-cart',
      version: 1,
    }
  )
);
