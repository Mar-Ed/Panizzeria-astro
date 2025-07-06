// src/react/TiendaApp.tsx
import EntradasCliente from "./EntradasApi";
import CostShop from "./CostShop";
import { CartProvider } from "../../context/CartContext";

export default function TiendaApp() {
  return (
    <CartProvider>
      <div className="button-shop">
        <CostShop />
      </div>

      <EntradasCliente />
    </CartProvider>
  );
}
