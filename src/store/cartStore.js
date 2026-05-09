import { atom } from 'nanostores';

export const $cart = atom([]);
export const $isCartOpen = atom(false);

export function addProductToCart(product) {
  const currentCart = $cart.get();
  const existingItemIndex = currentCart.findIndex(
    (item) => item.nombre === product.nombre && item.tamaño === product.tamaño
  );

  if (existingItemIndex > -1) {
    const newCart = [...currentCart];
    newCart[existingItemIndex] = {
      ...newCart[existingItemIndex],
      cantidad: newCart[existingItemIndex].cantidad + 1,
    };
    $cart.set(newCart);
  } else {
    $cart.set([...currentCart, { ...product, cantidad: 1 }]);
  }
}

export function removeProductFromCart(index) {
  const currentCart = $cart.get();
  const newCart = currentCart.filter((_, i) => i !== index);
  $cart.set(newCart);
}

export function updateQuantity(index, newQuantity) {
  if (newQuantity < 1) return;
  const currentCart = $cart.get();
  const newCart = [...currentCart];
  newCart[index] = { ...newCart[index], cantidad: newQuantity };
  $cart.set(newCart);
}

export function clearCart() {
  $cart.set([]);
}
