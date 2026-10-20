import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, OrderConfirmationData, CustomerDetails, CreateOrderPayload } from '../types/lavida';

interface CartState {
  // Pure lightweight store holding only item_id, name, price, quantity
  items: CartItem[];
  selectedTable: string;
  orderType: 'takeaway' | 'table' | 'lounge' | 'carwash';
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isDownloadModalOpen: boolean;
  isDiagnosticOpen: boolean;
  confirmedOrder: OrderConfirmationData | null;

  // Actions
  addItem: (item: { item_id: string; name: string; price: number; item_type?: string }, quantity?: number) => void;
  removeItem: (item_id: string) => void;
  updateQuantity: (item_id: string, delta: number) => void;
  setQuantity: (item_id: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedTable: (table: string) => void;
  setOrderType: (type: 'takeaway' | 'table' | 'lounge' | 'carwash') => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setDownloadModalOpen: (open: boolean) => void;
  setDiagnosticOpen: (open: boolean) => void;
  setConfirmedOrder: (order: OrderConfirmationData | null) => void;

  // Helpers
  getTotalEstimatedPrice: () => number;
  getItemCount: () => number;

  // Build secure order payload (strictly omitting unit_price or line_total)
  buildOrderPayload: (idempotencyKey: string, customer: CustomerDetails) => CreateOrderPayload;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedTable: 'Table 04',
      orderType: 'takeaway',
      isCartOpen: false,
      isCheckoutOpen: false,
      isDownloadModalOpen: false,
      isDiagnosticOpen: false,
      confirmedOrder: null,

      addItem: (item, quantity = 1) => {
        if (quantity <= 0) return;
        set((state) => {
          const index = state.items.findIndex((i) => i.item_id === item.item_id);
          if (index > -1) {
            const updated = [...state.items];
            updated[index].quantity += quantity;
            return { items: updated, isCartOpen: true };
          }
          return {
            items: [
              ...state.items,
              {
                item_id: item.item_id,
                name: item.name,
                price: item.price,
                quantity,
                item_type: item.item_type || 'menu_item',
              },
            ],
            isCartOpen: true,
          };
        });
      },

      removeItem: (item_id: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.item_id !== item_id),
        }));
      },

      updateQuantity: (item_id: string, delta: number) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.item_id === item_id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: updated };
        });
      },

      setQuantity: (item_id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(item_id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.item_id === item_id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setSelectedTable: (table: string) => {
        set({ selectedTable: table });
      },

      setOrderType: (type) => {
        set({ orderType: type });
      },

      setCartOpen: (open: boolean) => {
        set({ isCartOpen: open });
      },

      setCheckoutOpen: (open: boolean) => {
        set({ isCheckoutOpen: open });
      },

      setDownloadModalOpen: (open: boolean) => {
        set({ isDownloadModalOpen: open });
      },

      setDiagnosticOpen: (open: boolean) => {
        set({ isDiagnosticOpen: open });
      },

      setConfirmedOrder: (order: OrderConfirmationData | null) => {
        set({ confirmedOrder: order });
      },

      getTotalEstimatedPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Strict security: frontend submits ONLY item_type, item_id, quantity
      buildOrderPayload: (idempotencyKey: string, customer: CustomerDetails): CreateOrderPayload => {
        const state = get();
        return {
          action: 'createOrder',
          idempotency_key: idempotencyKey,
          order_type: state.orderType || 'takeaway',
          customer: {
            name: customer.name,
            phone: customer.phone,
            table_number: customer.table_number || state.selectedTable,
            notes: customer.notes,
          },
          items: state.items.map((item) => ({
            item_type: item.item_type || 'menu_item',
            item_id: item.item_id,
            quantity: item.quantity,
          })),
        };
      },
    }),
    {
      name: 'lavida-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        selectedTable: state.selectedTable,
        orderType: state.orderType,
      }),
    }
  )
);
