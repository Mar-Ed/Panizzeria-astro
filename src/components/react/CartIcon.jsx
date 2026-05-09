import { useStore } from '@nanostores/react';
import { $cart, $isCartOpen } from '../../store/cartStore';
import { ShoppingCart } from 'lucide-react';
import '../../css/CartIcon.css';

export default function CartIcon() {
  const cart = useStore($cart);
  const itemCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="cart-trigger-container">
      <div 
        className="cart-trigger-icon" 
        onClick={() => $isCartOpen.set(true)}
        aria-label="Abrir carrito"
      >
        <ShoppingCart size={22} strokeWidth={2.5} />
        {itemCount > 0 && (
          <span className="cart-badge">
            {itemCount}
          </span>
        )}
      </div>
    </div>
  );
}
