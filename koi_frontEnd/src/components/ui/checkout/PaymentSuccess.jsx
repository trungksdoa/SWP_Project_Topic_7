import React from "react";
import { NavLink } from "react-router-dom";
import { PATH } from "../../../constant";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col items-center justify-center my-[40px]">
        <img
          className="w-[50%]"
          src="../../../../images/payment-success.jpg"
          alt="image success"
        />
        <h2 className="mb-[20px] text-orange-500 text-[40px]">
          {t("Your payment is successful !")}
        </h2>
        <NavLink
          to={PATH.HOME}
          style={{ textDecoration: "underline" }}
          className="hover:text-orange-500 transition-all ease-in-out"
        >
          {t("Back to home")}
        </NavLink>
      </div>
    </div>
  );
};

export default PaymentSuccess;
