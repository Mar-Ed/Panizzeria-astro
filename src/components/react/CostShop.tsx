import React from "react";
import { useState } from "react";
import CartShopping from "../svg/CartShopping.astro";

type CartShopProps = {
  costShop: string;
};
export default function CartShop({ costShop }: CartShopProps) {
  return (
    <>
      <span>S/</span>
      <span>{costShop}</span>
    </>
  );
}
