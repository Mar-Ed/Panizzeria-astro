import React from "react";
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
