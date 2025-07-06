// src/react/HeaderReact.tsx
import CartShopping from "../svg/CartShopping.astro";
import CostShop from "./CostShop";
import { useState } from "react";

export default function HeaderReact() {
  const [cost, setCost] = useState(0);

  // Simular que el costo se actualiza desde otro componente
  // En una app real, esto vendría de contexto global o localStorage

  return (
    <div className="button-shop">
      <CartShopping />
      <CostShop costShop={cost.toFixed(2)} />
    </div>
  );
}
