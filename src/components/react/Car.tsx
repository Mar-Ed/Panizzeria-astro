import { useState } from 'react';
import EntradasCliente from './EntradasApi';
import CartShop from './CostShop';

export default function TiendaPage() {
  const [precioTotal, setPrecioTotal] = useState(0);

  const handleAgregarPrecio = (precio: number) => {
    setPrecioTotal(prev => prev + precio);
  };

  return (
    <div>
      <CartShop costShop={precioTotal.toFixed(2)} />
      <EntradasCliente onAgregarPrecio={handleAgregarPrecio} />
    </div>
  );
}
