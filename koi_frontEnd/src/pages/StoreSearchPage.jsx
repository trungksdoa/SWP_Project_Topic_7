import React from "react";
import StoreSearch from "../components/ui/store/StoreSearch";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const StoreSearchPage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name:"Store" , path: "/store"} , { name: "Search" }]}
      />
      <StoreSearch />
    </div>
  );
};

export default StoreSearchPage;
