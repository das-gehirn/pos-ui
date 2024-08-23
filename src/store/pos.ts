import { create } from "zustand";
import useProductStore from "./products";
import { toast } from "sonner";
import { set as setValue } from "lodash";
import { BankPaymentProps, ChequePaymentProps, MOP, MobileMoneyPaymentProps } from "@/interfaces/sales";
import { Discount } from "@/interfaces/invoice";
interface ItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SalesProps {
  customerId: string;
  items: ItemProps[];
  hasDiscount?: boolean;
  discount?: Discount;
  tax: number;
  modeOfPayment?: MOP;
  amountPaid: number;
  mobileMoneyPayment?: MobileMoneyPaymentProps | null;
  bankPayment?: BankPaymentProps | null;
  chequePayment?: ChequePaymentProps | null;
  description?: string;
}

// Define the state type
type State = SalesProps;

// Define the actions type
type Action = {
  addItem: (product: ItemProps) => void;
  updateItem: (id: string, productData: Partial<ItemProps>) => void;
  updateItems: (products: ItemProps[]) => void;
  removeItem: (id: string) => void;
  removeItems: () => void;
  getItemTotalAmount: () => number;
  getTotalItems: () => number;
  incrementItemQuantity: (id: string, quantity: number) => void;
  decrementItemQuantity: (id: string, quantity: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  getState: () => State;
  setState: (newState: Partial<State>) => void;
  resetState: () => void;
};

// Initial state
export const initialState: State = {
  customerId: "",
  items: [],
  tax: 0,
  modeOfPayment: "cash",
  discount: undefined,
  hasDiscount: false,
  amountPaid: 0,
  bankPayment: undefined,
  chequePayment: undefined,
  mobileMoneyPayment: undefined
};

// Create the Zustand store
const usePosStore = create<State & Action>()((set, get) => ({
  ...initialState,
  addItem: (item) => {
    const { decrementProductQuantity, getProductById } = useProductStore.getState();

    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      const product = getProductById(item.id);

      if (product && product.productQuantity) {
        decrementProductQuantity(item.id, item.quantity);
      }

      if (existingItem) {
        // Item already exists, update quantity
        const updatedItems = state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        return { ...state, items: updatedItems };
      } else {
        // Item does not exist, add it to the list
        return { ...state, items: [...state.items, item] };
      }
    });
  },
  updateItem: (id, productData) =>
    set((state) => {
      const updatedItems = state.items.map((p) => (p.id === id ? { ...p, ...productData } : p));
      return { ...state, items: updatedItems };
    }),
  updateItems: (items) => set(() => ({ items })),
  removeItem: (id) => {
    const { incrementProductQuantity } = useProductStore.getState();
    set((state) => {
      const filteredProducts = state.items.filter((p) => p.id !== id);
      const item = state.items.find((i) => i.id === id);
      incrementProductQuantity(id, item?.quantity || 0);
      return { ...state, items: filteredProducts };
    });
  },
  removeItems: () => set(() => ({ items: [] })),
  getItemTotalAmount: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  incrementItemQuantity: (id, amount) => {
    const { decrementProductQuantity } = useProductStore.getState();

    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item
      );
      decrementProductQuantity(id, amount);
      return { ...state, items: updatedItems };
    });
  },
  decrementItemQuantity: (id, amount) => {
    const { incrementProductQuantity } = useProductStore.getState();

    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - amount } : item
      );
      incrementProductQuantity(id, amount);
      return { ...state, items: updatedItems };
    });
  },
  setItemQuantity: (id, quantity) => {
    const { getProductById, decrementProductQuantity, incrementProductQuantity } = useProductStore.getState();

    set((state) => {
      let product = getProductById(id);
      if (quantity > (product?.productQuantity?.availableQuantity || 0)) {
        toast.warning("Quantity", {
          description: "Quantity selected is more than quantity available"
        });
        return state;
      }
      if (isNaN(quantity) || quantity < 1) return state;

      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        const quantityDifference = quantity - existingItem.quantity;
        if (quantityDifference > 0) {
          decrementProductQuantity(id, quantityDifference);
        } else {
          incrementProductQuantity(id, -quantityDifference);
        }
      }

      const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item));
      return { ...state, items: updatedItems };
    });
  },
  setState: (newState) =>
    set((state) => {
      const keys = Object.keys(newState);
      for (const k of keys) {
        setValue(state, k, newState[k as keyof SalesProps]);
      }
      return { ...state };
    }),
  getState() {
    return get();
  },
  resetState() {
    set(() => ({
      ...initialState
    }));
  }
}));

export default usePosStore;
