import React from "react";
import HistoryOrder from "../components/ui/user/HistoryOrder";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const HistoryPage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "History Order" }]}
      />
      <HistoryOrder />
    </div>
  );
};

export default HistoryPage;
