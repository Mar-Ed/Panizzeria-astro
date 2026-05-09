import { useStore } from '@nanostores/react';
import { $cart, $isCartOpen, removeProductFromCart, updateQuantity } from '../../store/cartStore';
import { X, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import '../../css/CartSidebar.css';

export default function CartSidebar({ onCheckout }) {
  const cart = useStore($cart);
  const isOpen = useStore($isCartOpen);

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleClose = () => $isCartOpen.set(false);

  return (
    <div className={`cart-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className={`cart-sidebar`} onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>
            <ShoppingCart size={28} /> Mi Carrito
          </h2>
          <button className="close-cart" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag className="empty-cart-icon" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item" key={`${item.nombre}-${index}`}>
                <img src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <div>
                    <h3>{item.nombre}</h3>
                    <p>{item.tamaño}</p>
                  </div>
                  <div className="cart-item-footer">
                    <span className="cart-item-price">S/. {(item.precio * item.cantidad).toFixed(2)}</span>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(index, item.cantidad - 1)}>−</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => updateQuantity(index, item.cantidad + 1)}>+</button>
                      <Trash2 
                        size={18} 
                        className="remove-item" 
                        onClick={() => removeProductFromCart(index)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>S/. {total.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button" 
              onClick={() => {
                handleClose();
                onCheckout();
              }}
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
