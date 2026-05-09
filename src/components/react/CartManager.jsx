import { useState } from 'react';
import CartSidebar from './CartSidebar';
import OrderModal from './OrderModal';
import { useStore } from '@nanostores/react';
import { $isCartOpen } from '../../store/cartStore';

// Import local data
import bebidasData from '../../data/bebidas.json';
import entradasData from '../../data/entradas.json';

export default function CartManager() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bebidas] = useState(bebidasData);
  const [entradas] = useState(entradasData);

  return (
    <>
      <CartSidebar onCheckout={() => setModalOpen(true)} />
      <OrderModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        bebidas={bebidas}
        entradas={entradas}
      />
    </>
  );
}
