import React from "react";
import PackagesComponent from "../components/ui/packages/PackagesComponent";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const PackagesPage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[
          { name: "Home", path: "/" },
          { name: "Packages" },
        ]}
      />
      <PackagesComponent />
    </div>
  );
};

export default PackagesPage;
