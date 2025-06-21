import React from "react";
import { useState } from "react";
import CartShopping from "../svg/CartShopping.astro";

type CartShopProps = {
  costShop: string;
};
export default function CartShop({ costShop }: CartShopProps) {
  const [cost, SetCost] = useState<string>(costShop);
  return (
    <>
      <span>S/</span>
      <span>{cost}</span>
    </>
  );
}
