// src/context/CartContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type CartContextType = {
  total: number;
  addToCart: (price: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [total, setTotal] = useState(0);

  const addToCart = (price: number) => {
    setTotal((prev) => prev + price);
  };

  return (
    <CartContext.Provider value={{ total, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
