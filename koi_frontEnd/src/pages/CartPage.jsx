import React, { useEffect } from "react";
import Cart from "../components/ui/cart/Cart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constant";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const CartPage = () => {
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.manageUser.userLogin);

  useEffect(() => {
    if (!userLogin) {
      navigate(PATH.HOME);
    }
  }, []);

  return (
    <div className="h-full w-[90%] mx-auto">
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Cart" }]}
      />
      <Cart />
    </div>
  );
};

export default CartPage;
