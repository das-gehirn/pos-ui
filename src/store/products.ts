import { create } from "zustand";
import { ProductProps } from "@/interfaces/products";

// Define the state type
type State = {
  products: ProductProps[];
};

// Define the actions type
type Action = {
  addProduct: (product: ProductProps) => void;
  updateProduct: (id: string, productData: Partial<ProductProps>) => void;
  setProducts: (products: ProductProps[]) => void;
  updateProducts: (products: ProductProps[]) => void;
  removeProduct: (id: string) => void;
  removeProducts: () => void;
  getProductById: (id: string) => ProductProps | undefined;
  incrementProductQuantity: (id: string, quantity: number) => void;
  decrementProductQuantity: (id: string, quantity: number) => void;
};

// Initial state
const initialState: State = {
  products: []
};

// Create the Zustand store
const useProductStore = create<State & Action>()((set, get) => ({
  ...initialState,
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product]
    })),
  updateProduct: (id, productData) =>
    set((state) => {
      const updatedProducts = state.products.map((p) => (p.id === id ? { ...p, ...productData } : p));
      return { ...state, products: updatedProducts };
    }),
  setProducts: (products) => set(() => ({ products })),
  updateProducts: (products) => set((state) => ({ products: [...state.products, ...products] })),
  removeProduct: (id) =>
    set((state) => {
      const filteredProducts = state.products.filter((p) => p.id !== id);
      return { ...state, products: filteredProducts };
    }),
  removeProducts: () => set(() => ({ products: [] })),
  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },
  incrementProductQuantity: (id, amount) => {
    set((state) => {
      const updatedProducts = state.products.map((p) =>
        p.id === id && p.productQuantity
          ? {
              ...p,
              productQuantity: {
                ...p.productQuantity,
                availableQuantity: p.productQuantity?.availableQuantity + amount
              }
            }
          : p
      );
      return { ...state, products: updatedProducts };
    });
  },
  decrementProductQuantity: (id, amount) => {
    set((state) => {
      const updatedProducts = state.products.map((p) =>
        p.id === id && p.productQuantity
          ? {
              ...p,
              productQuantity: {
                ...p.productQuantity,
                availableQuantity: p.productQuantity?.availableQuantity - amount
              }
            }
          : p
      );
      return { ...state, products: updatedProducts };
    });
  }
}));

export default useProductStore;
