import React from "react";
import Checkout from "../components/ui/checkout/Checkout";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const CheckoutPage = () => {
  return (
    <div className="w-[90%] mx-auto">
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Cart", path: "/cart" }, { name: "Check Out" }]}
      />
      <Checkout />
    </div>
  );
};

export default CheckoutPage;
