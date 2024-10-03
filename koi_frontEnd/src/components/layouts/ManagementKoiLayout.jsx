import React from "react";
import HeaderManage from "../ui/HeaderManage";
import { Outlet } from "react-router-dom";
import Footer from "../ui/Footer";

const ManagementKoiLayout = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <HeaderManage className="mt-[100px]" />
        <div className="flex-1 sm:w-[90%] w-[90%] mx-auto md:w-[90%] iphone-6:mx-auto iphone-6-plus:mx-auto iphone-6:w-[90%] iphone-6-plus:w-[90%]">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManagementKoiLayout;
