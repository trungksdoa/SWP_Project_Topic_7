import React from "react";
import Header from "../ui/Header";
import { Outlet } from "react-router-dom";
import Footer from "../ui/Footer";
const MainLayout = () => {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    // Add more items based on the current page
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header className="mt-[100px]" />
      <div className="flex-1 w-[80%] mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
// sm:w-[90%] w-[90%] mx-auto md:w-[90%] iphone-6:mx-auto iphone-6-plus:mx-auto iphone-6:w-[90%] iphone-6-plus:w-[90%]