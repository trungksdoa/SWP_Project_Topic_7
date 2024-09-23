import React from "react";
import Header from "../ui/Header";
import { Outlet } from "react-router-dom";
import Footer from "../ui/Footer";

const PaymentLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="mt-[100px]" />
      <div className="flex-1 bg-gray-200">
        <Outlet/>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentLayout;
